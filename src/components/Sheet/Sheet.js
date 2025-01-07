import React, { useState, useMemo, useEffect } from 'react';
import { TextField, Menu, MenuItem, Button } from '@mui/material';
import { FixedSizeList as List } from 'react-window';
import RowMenu from './RowMenu';
import { handleEditCell, handleSaveEdit } from './CellEditHelper';
import { handleColumnRename } from './ColumnHelper';
import ResizableColumn from './ResizableColumn';
import {evaluateFormula} from './Formula'
const Sheet = ({ currentSheet, setCurrentSheet, sheets, setSheets }) => {
  const [editing, setEditing] = useState(null); // Track the cell being edited
  const [editedValue, setEditedValue] = useState(''); // Store the edited value
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for the menu
  const [menuRowIndex, setMenuRowIndex] = useState(null); // Track the row index for context menu
  const [menuColIndex, setMenuColIndex] = useState(null); // Track the column index for context menu
  const [highlightedRowIndex, setHighlightedRowIndex] = useState(null); // Track the highlighted row index
  const [highlightedColumnIndex, setHighlightedColumnIndex] = useState(null); // Track the highlighted column index
  const [highlightedCells, setHighlightedCells] = useState([]); // Track cells touched by a formula
  const [numRowsToAdd, setNumRowsToAdd] = useState(1); // Number of rows to add

  // Prepare the data for the table
  const prepareDataForTable = () => {
    if (!currentSheet) return [];
    return currentSheet.rows.map(row =>
      row.map(cell => (cell && cell.startsWith('=') ? evaluateFormula(cell,setHighlightedCells,currentSheet) : cell))
    );
  };

  // Memoize the rows to pass them to react-window
  const rowData = useMemo(() => prepareDataForTable(), [currentSheet.rows]);

  const [totalWidth, setTotalWidth] = useState(0);

  // Calculate total width of columns dynamically
  const calculateTotalWidth = () => {
    const total = currentSheet.columns.reduce((sum, col) => {
      const width = parseInt(col.width.replace('px', ''), 10);
      return sum + width;
    }, 0);
    setTotalWidth(total); // Update state with the new total width
  };

  // Whenever the columns change, recalculate the total width
  useEffect(() => {
    calculateTotalWidth();
  }, [currentSheet.columns]);

  // Open context menu for row actions
  const handleRowContextMenu = (event, rowIndex) => {
    event.preventDefault(); // Prevent default context menu
    setMenuRowIndex(rowIndex); // Store the row index for context menu actions
    setHighlightedRowIndex(rowIndex); // Highlight the right-clicked row
    setAnchorEl(event.currentTarget); // Set the anchor element for the menu (the clicked row element)
  };

  // Open context menu for column actions (Delete, Add Column Left, Add Column Right)
  const handleColumnContextMenu = (event, colIndex) => {
    event.preventDefault(); // Prevent default context menu
    setMenuColIndex(colIndex); // Store the column index
    setAnchorEl(event.currentTarget); // Set the anchor element for the menu
  };

  // Close the context menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Add rows to the sheet
  const handleAddRows = () => {
    const newRows = Array.from({ length: numRowsToAdd }, () => new Array(currentSheet.columns.length).fill(''));
    const updatedRows = [...currentSheet.rows, ...newRows];
    updateSheetData(updatedRows);
  };

  // Update the sheet with new rows or columns and save to localStorage
  const updateSheetData = (updatedData) => {
    const updatedSheet = {
      ...currentSheet,
      rows: updatedData,
      columns: currentSheet.columns,
      lastUpdated: new Date().toISOString(), // Update timestamp
    };
    setCurrentSheet(updatedSheet);
    const updatedSheets = sheets.map(sheet =>
      sheet.id === currentSheet.id ? updatedSheet : sheet
    );
    setSheets(updatedSheets);

    // Save to localStorage
    const savedData = JSON.parse(localStorage.getItem('SheetWonderdata'));
    savedData.sheets = savedData.sheets.map(sheet =>
      sheet.id === currentSheet.id ? updatedSheet : sheet
    );
    localStorage.setItem('SheetWonderdata', JSON.stringify(savedData));
  };

  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    const updateListHeight = () => {
      const vhHeight = window.innerHeight * 0.75;
      setListHeight(vhHeight);
    };

    updateListHeight();
    window.addEventListener('resize', updateListHeight);

    return () => window.removeEventListener('resize', updateListHeight);
  }, []);  

  // Handle clicking a column header to highlight the column
  const handleColumnClick = (colIndex) => {
    if (highlightedColumnIndex !== colIndex) {
      setHighlightedColumnIndex(colIndex); // Highlight the clicked column
      setHighlightedRowIndex(null);
    } else {
      setHighlightedColumnIndex(null); 
    }
  };
useEffect(() => {
  const handleKeyDown = (e) => {
    // Check if the pressed key is an arrow key
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      if (editing) { // Only handle key presses if editing

        // Save the edited value to the current cell before moving
        if (editedValue !== rowData[editing.rowIndex][editing.cellIndex]) {
          const updatedRows = [...currentSheet.rows];
          updatedRows[editing.rowIndex][editing.cellIndex] = editedValue;
          updateSheetData(updatedRows); // Save the data to the sheet
        }

        let newRowIndex = editing.rowIndex;
        let newColIndex = editing.cellIndex;
        
        // Handle arrow key movement
        if (e.key === 'ArrowUp') {
          newRowIndex = Math.max(editing.rowIndex - 1, 0); // Prevent going above the first row
        } else if (e.key === 'ArrowDown') {
          newRowIndex = Math.min(editing.rowIndex + 1, rowData.length - 1); // Prevent going below the last row
        } else if (e.key === 'ArrowLeft') {
          newColIndex = Math.max(editing.cellIndex - 1, 0); // Prevent going left of the first column
        } else if (e.key === 'ArrowRight') {
          newColIndex = Math.min(editing.cellIndex + 1, currentSheet.columns.length - 1); // Prevent going right of the last column
        }

        // Update the edited value for the new cell
        const newCellValue = rowData[newRowIndex][newColIndex] || '';
        setEditedValue(newCellValue);

        // Update the editing state to reflect the new cell
        setEditing({
          rowIndex: newRowIndex,
          cellIndex: newColIndex,
        });
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [editing, editedValue, rowData, currentSheet.rows, currentSheet.columns.length]);





  return (
    <div>
      {/* Render the header (column names) */}
      <div style={{ display: 'flex', borderBottom: '2px solid black' }}>
        <div style={{ border: '1px solid black', minWidth: 50, padding: 8 }}>#</div>
        {currentSheet.columns.map((col, colIndex) => (
          <ResizableColumn
            key={colIndex}
            colIndex={colIndex}
            col={col}
            currentSheet={currentSheet}
            updateSheetData={updateSheetData}
            handleColumnClick={handleColumnClick}
            highlightedColumnIndex={highlightedColumnIndex}
            sheets={sheets}
            setCurrentSheet={setCurrentSheet}
            setSheets={setSheets}
          />
        ))}
      </div>

      {/* Use react-window for virtualized row rendering */}
      <List height={listHeight} itemCount={rowData.length} itemSize={50}>
        {({ index, style }) => {
          const row = rowData[index];
          return (
            <div
              key={index}
              style={{
                ...style,
                display: 'flex',
                backgroundColor: highlightedRowIndex === index ? '#f0f0f0' : 'transparent', // Highlight the row
              }}
              onContextMenu={(event) => handleRowContextMenu(event, index)} // Handle row right-click
            >
              <div
                style={{
                  border: '1px solid black',
                  minWidth: 50,
                  padding: 8,
                  cursor: 'context-menu',
                }}
                onClick={() => setHighlightedRowIndex(highlightedRowIndex === index ? null : index)}
              >
                {index + 1}
              </div>
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  style={{
                    border: '1px solid black',
                    backgroundColor: (highlightedCells.some(
                      (highlighted) => highlighted.row === index && highlighted.col === cellIndex
                    )) ? '#ffff99' : (editing && editing.rowIndex === index && editing.cellIndex === cellIndex ? '#f0f0f0' : 'transparent'),
                    width: currentSheet.columns[cellIndex]?.width || '100px',
                    padding: 8,
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', 
                  }}
                  onClick={() => handleEditCell(index, cellIndex, setEditing, setEditedValue, currentSheet, highlightedColumnIndex, setHighlightedColumnIndex, highlightedRowIndex, setHighlightedRowIndex)}
                >
                  {editing && editing.rowIndex === index && editing.cellIndex === cellIndex ? (
                    <input
                      type="text"
                      value={editedValue}
                      onChange={(e) => setEditedValue(e.target.value)}
                      onBlur={() =>
                        handleSaveEdit(
                          editing,
                          editedValue,
                          currentSheet,
                          setCurrentSheet,
                          setEditing,
                          setEditedValue,
                          sheets,
                          setSheets
                        )
                      }
                      autoFocus
                      style={{
                        width: '100%',
                        border: '1px solid #ccc',
                        padding: '4px',
                        fontSize: 'inherit',
                      }}
                    />
                  ) : (
                    cell || ' '
                  )}
                </div>
              ))}
            </div>
          );
        }}
      </List>

      {/* Add Rows Section */}
      <div style={{ marginTop: 16 }}>
        <TextField
          type="number"
          value={numRowsToAdd}
          onChange={(e) => setNumRowsToAdd(Number(e.target.value))}
          label="Number of Rows"
          variant="outlined"
          style={{ marginRight: 8 }}
          min="1"
        />
        <Button onClick={handleAddRows} variant="contained">Add Rows</Button>
      </div>

      <RowMenu anchorEl={anchorEl} menuRowIndex={menuRowIndex} currentSheet={currentSheet} updateSheetData={updateSheetData}
        handleCloseMenu={handleCloseMenu}
        setCurrentSheet={setCurrentSheet}
        sheets={sheets}
        setSheets={setSheets}
        numRowsToAdd={numRowsToAdd}
      />
    </div>
  );
};

export default Sheet;

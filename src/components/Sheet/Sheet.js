import React, { useState, useMemo, useEffect } from 'react';
import { TextField, Menu, MenuItem, Button } from '@mui/material';
import { FixedSizeList as List } from 'react-window';
import RowMenu from './RowMenu'; 
import { handleEditCell, handleSaveEdit } from './CellEditHelper'; 
import {handleColumnRename} from './ColumnHelper'; 
const Sheet = ({ currentSheet, setCurrentSheet, sheets, setSheets }) => {
  const [editing, setEditing] = useState(null); // Track the cell being edited
  const [editedValue, setEditedValue] = useState(''); // Store the edited value
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for the menu
  const [menuRowIndex, setMenuRowIndex] = useState(null); // Track the row index for context menu
  const [menuColIndex, setMenuColIndex] = useState(null); // Track the column index for context menu
  const [highlightedRowIndex, setHighlightedRowIndex] = useState(null); // Track the highlighted row index
  const [highlightedColumnIndex, setHighlightedColumnIndex] = useState(null); // Track the highlighted column index
  const [numRowsToAdd, setNumRowsToAdd] = useState(1); // Number of rows to add

  // Prepare the data directly from currentSheet.rows and currentSheet.columns
  const prepareDataForTable = () => {
    if (!currentSheet) return [];
    return currentSheet.rows.map(row => row); // Simply return the rows as they are
  };

  
    useEffect(() => {
   console.log(editing);
  }, [editing]);

  // Handle clicking a column header to highlight the column
  const handleColumnClick = (colIndex) => {
    setHighlightedColumnIndex(colIndex); // Highlight the clicked column
  };

  
  // Open context menu for row actions
  const handleRowContextMenu = (event, rowIndex) => {
    event.preventDefault(); // Prevent default context menu
    setMenuRowIndex(rowIndex); // Store the row index
    setAnchorEl(event.currentTarget); // Set the anchor element for the menu
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

// Add column to the left of the selected column
const handleAddColumnLeft = () => {
  const newColumn = { title: 'New Column', width: 100 }; // Create a new empty column
  const updatedColumns = [...currentSheet.columns];
  updatedColumns.splice(menuColIndex, 0, newColumn); // Insert new column

  // Add empty data to each row to reflect the new column
  const updatedRows = currentSheet.rows.map(row => {
    const newRow = [...row];
    newRow.splice(menuColIndex, 0, ''); // Add an empty value at the selected column index
    return newRow;
  });

  updateSheetData(updatedColumns, updatedRows);
};

// Add column to the right of the selected column
const handleAddColumnRight = () => {
  const newColumn = { title: 'New Column', width: 100 }; // Create a new empty column
  const updatedColumns = [...currentSheet.columns];
  updatedColumns.splice(menuColIndex + 1, 0, newColumn); // Insert new column after

  // Add empty data to each row to reflect the new column
  const updatedRows = currentSheet.rows.map(row => {
    const newRow = [...row];
    newRow.splice(menuColIndex + 1, 0, ''); // Add an empty value after the selected column index
    return newRow;
  });

  updateSheetData(updatedColumns, updatedRows);
};

// Delete the selected column
const handleDeleteColumn = () => {
  const updatedColumns = currentSheet.columns.filter((_, index) => index !== menuColIndex);

  // Remove the data in each row for the deleted column
  const updatedRows = currentSheet.rows.map(row => {
    const newRow = [...row];
    newRow.splice(menuColIndex, 1); // Remove the column data from the row
    return newRow;
  });

  updateSheetData(updatedColumns, updatedRows);
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

  // Memoize the rows to pass them to react-window
  const rowData = useMemo(() => prepareDataForTable(), [currentSheet.rows]);

  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    const updateListHeight = () => {
      const vhHeight = window.innerHeight * 0.75;
      setListHeight(vhHeight);
    };

    // Update the height on component mount or window resize
    updateListHeight();
    window.addEventListener('resize', updateListHeight);

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', updateListHeight);
  }, []);

  return (
    <div>
      {/* Render the header (column names) */}
      <div style={{ display: 'flex', borderBottom: '2px solid black' }}>
        <div style={{ border: '1px solid black', minWidth: 50, padding: 8 }}>#</div>
        {currentSheet.columns.map((col, colIndex) => (
          <div
            key={colIndex}
            style={{
              border: '1px solid black',
              width: col.width, // Set the column width from column.width
              padding: 8,
              backgroundColor: highlightedColumnIndex === colIndex ? '#d3d3d3' : 'transparent', // Highlight column
              cursor: 'pointer',
            }}
            onClick={() => handleColumnClick(colIndex)} // Handle column click to highlight
            onContextMenu={(event) => handleColumnContextMenu(event, colIndex)} // Context menu on right-click for column
          >
            {highlightedColumnIndex === colIndex ? (
              <TextField
                value={col.title}
                onChange={(e) => handleColumnRename(currentSheet, setCurrentSheet, sheets, setSheets, colIndex, e.target.value)}
                variant="standard"
                fullWidth
              />
            ) : (
              col.title
            )}
          </div>
        ))}
      </div>

      {/* Use react-window for virtualized row rendering */}
      <List
        height={listHeight} // Set the height of the visible area
        itemCount={rowData.length}  // Total number of rows
        itemSize={50}  // Height of each row (adjust as needed)
        width="100%"  // Full width
      >
        {({ index, style }) => {
          const row = rowData[index];
          return (
            <div
              key={index}
              style={{
                ...style,
                display: 'flex',
                backgroundColor: highlightedRowIndex === index ? '#f0f0f0' : 'transparent',
                cursor: 'pointer',
              }}
              onClick={() => setHighlightedRowIndex(index)} // Highlight on click
              onContextMenu={(event) => handleRowContextMenu(event, index)}  // Context menu on right-click for row
            >
              {/* Render row number */}
              <div
                style={{
                  border: '1px solid black',
                  minWidth: 50,
                  padding: 8,
                }}
              >
                {index + 1}
              </div>

              {/* Render each cell in the row */}
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  style={{
                    border: '1px solid black',
                    width: currentSheet.columns[cellIndex]?.width || '100px', // Use column width for row cell
                    padding: 8,
                    backgroundColor: highlightedColumnIndex === cellIndex ? '#f0f0f0' : 'transparent', // Highlight the column cells
                  }}
                  onClick={() => handleEditCell(index, cellIndex, setEditing, setEditedValue, currentSheet)}
                >
                  {editing && editing.rowIndex === index && editing.cellIndex === cellIndex ? (
                    <TextField
                      value={editedValue}
                      onChange={(e) => setEditedValue(e.target.value)}
                      onBlur={handleSaveEdit(editing, editedValue, currentSheet, setCurrentSheet, setEditing,setEditedValue, sheets, setSheets)}  // Save when the user clicks outside
                      autoFocus
                      fullWidth
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

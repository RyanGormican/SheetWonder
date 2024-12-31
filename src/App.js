import React, { useState, useEffect } from 'react';
import './App.css';
import Feedback from './components/Feedback/Feedback';
import Navigate from './components/Navigate';
import Select from './components/Select/Select';
import { generateColumns, generateRows } from './components/Helper';
import { Icon } from '@iconify/react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material'; // Import Material-UI Table components

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('select');
  const [sheets, setSheets] = useState([]);
  const [currentSheet, setCurrentSheet] = useState(null);
  const [editing, setEditing] = useState(null); // Track the cell being edited
  const [editedValue, setEditedValue] = useState(''); // Store the edited value

  // Load SheetWonder from localStorage or create default if not found
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('SheetWonderdata'));
    const currentDate = new Date().toISOString();
    const currentTimestamp = Date.now();
    if (!savedData) {
      const defaultSheets = {
        sheets: [
          {
            title: 'New Spreadsheet',
            columns: generateColumns(),
            rows: generateRows(),
            id: currentTimestamp,
            dateCreated: currentDate,
            lastUpdated: currentDate,
          }
        ],
        settings: {}
      };
      localStorage.setItem('SheetWonderdata', JSON.stringify(defaultSheets));
      setSheets(defaultSheets.sheets);
    } else {
      setSheets(savedData.sheets);
    }
  }, []);

  // Handle when a grid element is clicked
  const handleGridClick = (id) => {
    const selectedSheet = sheets.find(sheet => sheet.id === id);
    setCurrentSheet(selectedSheet);
    setView('sheet');
  };

  // Prepare the data directly from currentSheet.rows and currentSheet.columns
  const prepareDataForTable = () => {
    if (!currentSheet) return [];
    
    return currentSheet.rows.map(row => row); // Simply return the rows as they are
  };

  // Handle editing a specific cell
  const handleEditCell = (rowIndex, cellIndex) => {
    setEditing({ rowIndex, cellIndex });
    setEditedValue(currentSheet.rows[rowIndex][cellIndex] || '');
  };

  // Handle when the user finishes editing a cell
const handleSaveEdit = () => {
  const updatedRows = [...currentSheet.rows];
  updatedRows[editing.rowIndex][editing.cellIndex] = editedValue;

  // Update the currentSheet with the new rows and the lastUpdated time
  const updatedSheet = {
    ...currentSheet,
    rows: updatedRows,
    lastUpdated: new Date().toISOString(), // Set the lastUpdated time to the current time
  };
  setCurrentSheet(updatedSheet);
    const updatedSheets = sheets.map(sheet =>
    sheet.id === currentSheet.id ? updatedSheet : sheet
  );
  setSheets(updatedSheets);
  // Save the updated sheet data in localStorage
  const savedData = JSON.parse(localStorage.getItem('SheetWonderdata'));
  savedData.sheets = savedData.sheets.map(sheet =>
    sheet.id === currentSheet.id ? updatedSheet : sheet
  );
  localStorage.setItem('SheetWonderdata', JSON.stringify(savedData));

  // Reset editing state
  setEditing(null);
  setEditedValue('');
};


  return (
    <div className="App">
      <Navigate toggleFeedbackModal={() => setIsModalOpen(!isModalOpen)} />
      <div className="title">SheetWonder</div>
      
      {view === 'select' ? (
        <Select sheets={sheets} setSheets={setSheets} handleGridClick={handleGridClick} />
      ) : (
        <div>
          <Icon icon="mingcute:back-line" width="24" height="24" onClick={() => setView('select')} />
          
          {/* Render the data as a table */}
          <TableContainer component={Paper} style={{ marginTop: 16 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* Blank top-left cell */}
                  <TableCell style={{ border: '1px solid black' }}></TableCell>
                  
                  {/* Render the column headers */}
                  {currentSheet.columns.map((col, index) => (
                    <TableCell key={index} style={{ minWidth: 10, border: '1px solid black' }}>
                      {col.title}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Render the rows */}
                {prepareDataForTable().map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {/* Render the row number (e.g. #) */}
                    <TableCell style={{ minWidth: 10, border: '1px solid black' }}>
                      {rowIndex + 1}
                    </TableCell>
                    
                    {/* Render each cell in the row */}
                    {row.map((cell, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        style={{ minWidth: 10, border: '1px solid black' }}
                        onClick={() => handleEditCell(rowIndex, cellIndex)}
                      >
                        {editing && editing.rowIndex === rowIndex && editing.cellIndex === cellIndex ? (
                          <TextField
                            value={editedValue}
                            onChange={(e) => setEditedValue(e.target.value)}
                            onBlur={handleSaveEdit}
                  
                          />
                        ) : (
                          cell || ''
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
      
      {isModalOpen && (
        <Feedback isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  );
}

export default App;

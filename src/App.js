import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import Feedback from './components/Feedback/Feedback';
import Navigate from './components/Navigate';
import DataGrid from 'react-data-grid';
import Select from './components/Select'; 
import { generateColumns, generateRows } from './components/Helper';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('select'); // 'select' or 'sheet'
  const [sheets, setSheets] = useState([]);
  const [currentSheet, setCurrentSheet] = useState(null);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const toggleFeedbackModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Load SheetWonder from localStorage or create default if not found
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('SheetWonderdata'));
        const currentDate = new Date().toISOString();
    if (!savedData) {
      const defaultSheets = {
        sheets: [
          {
            title: 'New Spreadsheet',
            columns: generateColumns(),
            rows: generateRows(),
            id: currentDate,
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
  const handleGridClick = (sheet) => {
    setCurrentSheet(sheet);
    setColumns(sheet.columns);
    setRows(sheet.rows);
    setView('sheet');
  };

  // Memoized columns and rows to prevent unnecessary recalculation
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedRows = useMemo(() => rows, [rows]);

  // Render the sheet view
  const renderSheetView = () => (
    <div className="data-grid-container">
      <DataGrid
        style={{ height: 'auto' }}
        columns={memoizedColumns}
        rows={memoizedRows}
        defaultColumnOptions={{
          resizable: true,
          sortable: true,
          draggable: true,
        }}
        onRowsChange={(newRows) => {
          const updatedSheet = { ...currentSheet, rows: newRows };
          setRows(newRows);
          setCurrentSheet(updatedSheet);
          const updatedSheets = sheets.map(sheet =>
            sheet.title === updatedSheet.title ? updatedSheet : sheet
          );
          localStorage.setItem('SheetWonderdata', JSON.stringify({ sheets: updatedSheets, settings: {} }));
        }}
      />
    </div>
  );

  return (
    <div className="App">
      <Navigate toggleFeedbackModal={toggleFeedbackModal} />
      <div className="title">SheetWonder</div>
      {view === 'select' ? (
        <Select sheets={sheets} setSheets={setSheets} handleGridClick={handleGridClick} />
      ) : renderSheetView()}
      {isModalOpen && (
        <Feedback isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  );
}

export default App;

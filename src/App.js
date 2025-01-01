import React, { useState, useEffect } from 'react';
import './App.css';
import Feedback from './components/Feedback/Feedback';
import Navigate from './components/Navigate';
import Select from './components/Select/Select';
import { generateColumns, generateRows } from './components/Helper';
import { Icon } from '@iconify/react';
import Sheet from './components/Sheet/Sheet';  
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('select');
  const [sheets, setSheets] = useState([]);
  const [currentSheet, setCurrentSheet] = useState(null);

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

  return (
    <div className="App">
      <Navigate toggleFeedbackModal={() => setIsModalOpen(!isModalOpen)} />
      <div className="title">SheetWonder</div>
      
      {view === 'select' ? (
        <Select sheets={sheets} setSheets={setSheets} handleGridClick={handleGridClick} />
      ) : (
        <div>
          <Icon icon="mingcute:back-line" width="24" height="24" onClick={() => setView('select')} />
          
          {currentSheet && (
            <Sheet 
              currentSheet={currentSheet} 
              setCurrentSheet={setCurrentSheet} 
              sheets={sheets} 
              setSheets={setSheets}
            />
          )}
        </div>
      )}
      
      {isModalOpen && (
        <Feedback isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  );
}

export default App;

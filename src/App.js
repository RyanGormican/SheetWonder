import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { Icon } from '@iconify/react';
import Feedback from './components/Feedback/Feedback';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';

// Function to generate column headers from A to Z
const generateColumns = () => {
  const columns = [{ key: 'rowNum', name: '', resizable: true, editable: true }];
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);  // 65 is 'A' in ASCII
    columns.push({
      key: letter,
      name: letter,
    });
  }
  return columns;
};

// Function to generate 1000 rows with default empty values
const generateRows = () => {
  const rows = [];
  for (let i = 0; i < 10; i++) {
    const row = { rowNum: i + 1 };  // Add a row number for the leftmost column
    for (let j = 0; j < 26; j++) {
      const letter = String.fromCharCode(65 + j);
      row[letter] = '';  // Initialize with empty values
    }
    rows.push(row);
  }
  return rows;
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  
  const toggleFeedbackModal = () => {
    setIsModalOpen(!isModalOpen);
  };


  useEffect(() => {
    setRows(generateRows());
    setColumns(generateColumns());
  }, []);

  return (
    <div className="App">
      <span className="links">
        <a href="https://www.linkedin.com/in/ryangormican/">
          <Icon
            icon="mdi:linkedin"
            color="#0e76a8"
            style={{ width: '3.13vw', height: '5.56vh' }}
          />
        </a>
        <a href="https://github.com/RyanGormican/SheetWonder">
          <Icon
            icon="mdi:github"
            color="#e8eaea"
            style={{ width: '3.13vw', height: '5.56vh' }}
          />
        </a>
        <a href="https://ryangormicanportfoliohub.vercel.app/">
          <Icon
            icon="teenyicons:computer-outline"
            color="#199c35"
            style={{ width: '3.13vw', height: '5.56vh' }}
          />
        </a>
        <div className="cursor-pointer" onClick={toggleFeedbackModal}>
          <Icon
            icon="material-symbols:feedback"
            style={{ width: '3.13vw', height: '5.56vh' }}
          />
        </div>
      </span>
      <div className="title">SheetWonder</div>
      <div className="data-grid-container">
        <DataGrid
          style={{ height: 'auto' }}
          columns={columns}
          rows={rows}
          defaultColumnOptions={{
        resizable: true,
        sortable: true,
        draggable: true
      }}
        />
      </div>
      {isModalOpen && (
        <Feedback isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  );
}

export default App;

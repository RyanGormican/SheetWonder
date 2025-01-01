import React, { useState, useEffect } from 'react';

const ResizableColumn = ({ colIndex, col, currentSheet, updateSheetData, sheets, setCurrentSheet, setSheets, handleColumnClick, highlightedColumnIndex }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(70);  // Default starting width of 70px

  // Mouse down to start resizing
  const handleMouseDown = (event) => {
    setIsResizing(true);
    setStartX(event.clientX);
    // Ensure that the starting width is at least 70px if null or undefined
    const initialWidth = col.width !== null && col.width !== undefined ? parseInt(col.width) : 70;
    setStartWidth(initialWidth);  // Set the starting width as a valid number
  };

  // Mouse move to update width while resizing
 const handleMouseMove = (event) => {
  if (isResizing) {
    // Calculate the difference between current and initial mouse position
    const dx = event.clientX - startX;

    // Increment or decrement width by dx, ensuring a minimum of 30px width
    let newWidth = startWidth + dx;

    // Enforce the minimum width of 30px
    if (newWidth < 30) {
      newWidth = 30;
    }

    // Ensure the new width doesn't result in an invalid value like null
    newWidth = Math.max(newWidth, 30);  // To make sure width is always at least 30px

    // Convert the width to a string with 'px'
    const updatedColumns = [...currentSheet.columns];
    updatedColumns[colIndex].width = `${newWidth}px`;  // Update column width as a string

    // Directly update columns and save to localStorage
    const updatedSheet = {
      ...currentSheet,
      columns: updatedColumns,  // Update columns only
      lastUpdated: new Date().toISOString(),  // Update timestamp
    };

    // Update the state with the updated sheet (only columns)
    setCurrentSheet(updatedSheet);

    // Update the columns in the sheets state
    const updatedSheets = sheets.map(sheet =>
      sheet.id === currentSheet.id ? updatedSheet : sheet
    );
    setSheets(updatedSheets);

    // Save to localStorage
    const savedData = JSON.parse(localStorage.getItem('SheetWonderdata'));
    savedData.sheets = savedData.sheets.map(sheet =>
      sheet.id === currentSheet.id ? updatedSheet : sheet
    );
    localStorage.setItem('SheetWonderdata', JSON.stringify(savedData));  // Save the updated sheet
  }
};


  // Mouse up to stop resizing
  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div
      style={{
        border: '1px solid black',
        width: col.width || '70px',  // Default to '70px' if col.width is null or undefined
        padding: 8,
        backgroundColor: highlightedColumnIndex === colIndex ? '#d3d3d3' : 'transparent',
        cursor: 'pointer',
        position: 'relative',
      }}
      onClick={() => handleColumnClick(colIndex)} // Handle column click to highlight
    >
      {col.title}

      {/* Resize handle */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '5px',
          height: '100%',
          cursor: 'col-resize',
        }}
        onMouseDown={handleMouseDown} // Start resizing when mouse down
      />
    </div>
  );
};

export default ResizableColumn;

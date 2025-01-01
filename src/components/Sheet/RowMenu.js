import React from 'react';
import { Menu, MenuItem } from '@mui/material';

const RowMenu = ({
  anchorEl,
  menuRowIndex,
  currentSheet,
  updateSheetData,
  handleCloseMenu,
  setCurrentSheet,
  sheets,
  setSheets,
  numRowsToAdd
}) => {
  // Add a row above the selected row
  const handleAddRowAbove = () => {
    const newRow = new Array(currentSheet.columns.length).fill('');
    const updatedRows = [
      ...currentSheet.rows.slice(0, menuRowIndex),
      newRow,
      ...currentSheet.rows.slice(menuRowIndex),
    ];
    updateSheetData(updatedRows);
  };

  // Add a row below the selected row
  const handleAddRowBelow = () => {
    const newRow = new Array(currentSheet.columns.length).fill('');
    const updatedRows = [
      ...currentSheet.rows.slice(0, menuRowIndex + 1),
      newRow,
      ...currentSheet.rows.slice(menuRowIndex + 1),
    ];
    updateSheetData(updatedRows);
  };

  // Delete the selected row
  const handleDeleteRow = () => {
    const updatedRows = currentSheet.rows.filter((_, index) => index !== menuRowIndex);
    updateSheetData(updatedRows);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleCloseMenu}
    >
      {menuRowIndex !== null && (
        <>
          <MenuItem onClick={handleAddRowAbove}>Add Row Above</MenuItem>
          <MenuItem onClick={handleAddRowBelow}>Add Row Below</MenuItem>
          <MenuItem onClick={handleDeleteRow}>Delete Row</MenuItem>
        </>
      )}
    </Menu>
  );
};

export default RowMenu;

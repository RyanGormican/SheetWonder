export const handleEditCell = (rowIndex, cellIndex, setEditing, setEditedValue, currentSheet) => {
  setEditing({ rowIndex, cellIndex });
  setEditedValue(currentSheet.rows[rowIndex][cellIndex] || '');
};


export const handleSaveEdit = (editing, editedValue, currentSheet, setCurrentSheet, setEditing, setEditedValue, sheets, setSheets) => {
  const updatedRows = [...currentSheet.rows];
  updatedRows[editing.rowIndex][editing.cellIndex] = editedValue;

  const updatedSheet = {
    ...currentSheet,
    rows: updatedRows,
    lastUpdated: new Date().toISOString(),
  };

  setCurrentSheet(updatedSheet);
  const updatedSheets = sheets.map(sheet =>
    sheet.id === currentSheet.id ? updatedSheet : sheet
  );
  setSheets(updatedSheets);

  const savedData = JSON.parse(localStorage.getItem('SheetWonderdata'));
  savedData.sheets = savedData.sheets.map(sheet =>
    sheet.id === currentSheet.id ? updatedSheet : sheet
  );
  localStorage.setItem('SheetWonderdata', JSON.stringify(savedData));

  setEditing(null);
  setEditedValue('');
};
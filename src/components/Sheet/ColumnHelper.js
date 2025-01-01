// Handle renaming a column
 export const handleColumnRename = (currentSheet, setCurrentSheet, sheets, setSheets, colIndex, newTitle) => {
    const updatedColumns = [...currentSheet.columns];
    updatedColumns[colIndex].title = newTitle; // Update the column title
    const updatedSheet = {
      ...currentSheet,
      columns: updatedColumns,
      lastUpdated: new Date().toISOString(),
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
  };

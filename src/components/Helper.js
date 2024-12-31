export const generateColumns = () => {
  const columns = [{ key: 'rowNum', name: '', resizable: true, editable: true }];
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i); // 'A' to 'Z'
    columns.push({
      key: letter,
      name: letter,
    });
  }
  return columns;
};

export const generateRows = () => {
  const rows = [];
  for (let i = 0; i < 10; i++) {
    const row = { rowNum: i + 1 }; // Row numbers on the left
    for (let j = 0; j < 26; j++) {
      const letter = String.fromCharCode(65 + j);
      row[letter] = ''; // Initialize with empty values
    }
    rows.push(row);
  }
  return rows;
};

export const saveSheetToLocalStorage = (updatedSheets) => {
  localStorage.setItem('SheetWonderdata', JSON.stringify({ sheets: updatedSheets, settings: {} }));
};

export const generateColumns = () => {
  const columns = [];
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i); // 'A' to 'Z'
    columns.push({
      title: letter,      
      width: '70px',     
    });
  }
  return columns;
};



export const generateRows = () => {
  const rows = [];
 
  for (let i = 0; i < 10; i++) {
    const row = Array(26).fill(''); 
    rows.push(row);
  }
  return rows;
};

export const saveSheetToLocalStorage = (updatedSheets) => {
  localStorage.setItem('SheetWonderdata', JSON.stringify({ sheets: updatedSheets, settings: {} }));
};

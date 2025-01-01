// Add column to the left of the selected column
const handleAddColumnLeft = () => {
  const newColumn = { title: 'New Column', width: 100 }; // Create a new empty column
  const updatedColumns = [...currentSheet.columns];
  updatedColumns.splice(menuColIndex, 0, newColumn); // Insert new column

  // Add empty data to each row to reflect the new column
  const updatedRows = currentSheet.rows.map(row => {
    const newRow = [...row];
    newRow.splice(menuColIndex, 0, ''); // Add an empty value at the selected column index
    return newRow;
  });

  updateSheetData(updatedColumns, updatedRows);
};

// Add column to the right of the selected column
const handleAddColumnRight = () => {
  const newColumn = { title: 'New Column', width: 100 }; // Create a new empty column
  const updatedColumns = [...currentSheet.columns];
  updatedColumns.splice(menuColIndex + 1, 0, newColumn); // Insert new column after

  // Add empty data to each row to reflect the new column
  const updatedRows = currentSheet.rows.map(row => {
    const newRow = [...row];
    newRow.splice(menuColIndex + 1, 0, ''); // Add an empty value after the selected column index
    return newRow;
  });

  updateSheetData(updatedColumns, updatedRows);
};

// Delete the selected column
const handleDeleteColumn = () => {
  const updatedColumns = currentSheet.columns.filter((_, index) => index !== menuColIndex);

  // Remove the data in each row for the deleted column
  const updatedRows = currentSheet.rows.map(row => {
    const newRow = [...row];
    newRow.splice(menuColIndex, 1); // Remove the column data from the row
    return newRow;
  });

  updateSheetData(updatedColumns, updatedRows);
};

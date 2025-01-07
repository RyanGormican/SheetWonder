import * as FormulaJS from 'formulajs';

export const evaluateFormula = (formula, setHighlightedCells, currentSheet) => {
  // General regex to match the formulas
  const rangeRegex = /([A-Z]+[0-9]+)/g;

  try {
    // Handle SUM formula
    if (formula.startsWith('=SUM')) {
      const match = formula.match(/=SUM\((.*?)\)/);
      if (match && match[1]) {
        const range = match[1];
        const [startCell, endCell] = range.split(':');
        const [startRow, startCol] = parseCell(startCell);
        const [endRow, endCol] = parseCell(endCell);

        const affectedCells = getAffectedCells(startRow, endRow, startCol, endCol);
        setHighlightedCells(affectedCells);

        return currentSheet.rows.slice(startRow, endRow + 1).reduce((acc, row) => acc + (parseFloat(row[startCol]) || 0), 0);
      }
    }

    // Handle MIN formula
    if (formula.startsWith('=MIN')) {
      const match = formula.match(/=MIN\((.*?)\)/);
      if (match && match[1]) {
        const range = match[1];
        const [startCell, endCell] = range.split(':');
        const [startRow, startCol] = parseCell(startCell);
        const [endRow, endCol] = parseCell(endCell);

        const affectedCells = getAffectedCells(startRow, endRow, startCol, endCol);
        setHighlightedCells(affectedCells);

        return Math.min(
          ...currentSheet.rows.slice(startRow, endRow + 1).map(row => parseFloat(row[startCol]) || Infinity)
        );
      }
    }

    // Handle MAX formula
    if (formula.startsWith('=MAX')) {
      const match = formula.match(/=MAX\((.*?)\)/);
      if (match && match[1]) {
        const range = match[1];
        const [startCell, endCell] = range.split(':');
        const [startRow, startCol] = parseCell(startCell);
        const [endRow, endCol] = parseCell(endCell);

        const affectedCells = getAffectedCells(startRow, endRow, startCol, endCol);
        setHighlightedCells(affectedCells);

        return Math.max(
          ...currentSheet.rows.slice(startRow, endRow + 1).map(row => parseFloat(row[startCol]) || -Infinity)
        );
      }
    }

    // Handle AVERAGE formula
    if (formula.startsWith('=AVERAGE')) {
      const match = formula.match(/=AVERAGE\((.*?)\)/);
      if (match && match[1]) {
        const range = match[1];
        const [startCell, endCell] = range.split(':');
        const [startRow, startCol] = parseCell(startCell);
        const [endRow, endCol] = parseCell(endCell);

        const affectedCells = getAffectedCells(startRow, endRow, startCol, endCol);
        setHighlightedCells(affectedCells);

        const values = currentSheet.rows.slice(startRow, endRow + 1).map(row => parseFloat(row[startCol]) || NaN);
        const validValues = values.filter(val => !isNaN(val));
        return validValues.length ? (validValues.reduce((acc, val) => acc + val, 0) / validValues.length) : NaN;
      }
    }

    // Handle COUNTA formula
    if (formula.startsWith('=COUNTA')) {
      const match = formula.match(/=COUNTA\((.*?)\)/);
      if (match && match[1]) {
        const range = match[1];
        const [startCell, endCell] = range.split(':');
        const [startRow, startCol] = parseCell(startCell);
        const [endRow, endCol] = parseCell(endCell);

        const affectedCells = getAffectedCells(startRow, endRow, startCol, endCol);
        setHighlightedCells(affectedCells);

        return currentSheet.rows.slice(startRow, endRow + 1).filter(row => row[startCol] !== '').length;
      }
    }

    // Handle PRODUCT formula
    if (formula.startsWith('=PRODUCT')) {
      const match = formula.match(/=PRODUCT\((.*?)\)/);
      if (match && match[1]) {
        const range = match[1];
        const cells = range.split(',').map(cell => cell.trim());

        const values = cells.map(cell => {
          if (cell.includes(':')) {
            const [startCell, endCell] = cell.split(':');
            const [startRow, startCol] = parseCell(startCell);
            const [endRow, endCol] = parseCell(endCell);
            return currentSheet.rows.slice(startRow, endRow + 1).map(row => parseFloat(row[startCol]) || 1).reduce((acc, val) => acc * val, 1);
          } else {
            const [row, col] = parseCell(cell);
            return parseFloat(currentSheet.rows[row][col]) || 1;
          }
        });

        return values.reduce((acc, val) => acc * val, 1);
      }
    }

    // Handle ROUND formula
    if (formula.startsWith('=ROUND')) {
      const match = formula.match(/=ROUND\((.*?),\s*(\d+)\)/);
      if (match && match[1] && match[2]) {
        const value = match[1].trim();
        const decimals = parseInt(match[2], 10);

        const evaluatedValue = evaluateFormula(value, setHighlightedCells, currentSheet);
        return Math.round(evaluatedValue * Math.pow(10, decimals)) / Math.pow(10, decimals);
      }
    }

    // Handle DIVIDE formula
    if (formula.startsWith('=DIVIDE')) {
      const match = formula.match(/=DIVIDE\((.*?),\s*(.*?)\)/);
      if (match && match[1] && match[2]) {
        const numerator = match[1].trim();
        const denominator = match[2].trim();

        const numeratorValue = evaluateFormula(numerator, setHighlightedCells, currentSheet);
        const denominatorValue = evaluateFormula(denominator, setHighlightedCells, currentSheet);

        return denominatorValue !== 0 ? numeratorValue / denominatorValue : 'DIV/0'; // Prevent division by zero
      }
    }

// Helper function to get the actual value from a cell reference
const getCellValue = (cellRef, setHighlightedCells, currentSheet) => {
  const [row, col] = parseCell(cellRef);
  return parseFloat(currentSheet.rows[row][col]) || 0; // Return cell value or 0 if invalid
};

// Handle SQRT formula
if (formula.startsWith('=SQRT')) {
  const match = formula.match(/=SQRT\((.*?)\)/);
  if (match && match[1]) {
    const value = match[1].trim();
    const evaluatedValue = getCellValue(value, setHighlightedCells, currentSheet);
    return Math.sqrt(evaluatedValue); // Apply SQRT on the value
  }
}

// Handle ABS formula
if (formula.startsWith('=ABS')) {
  const match = formula.match(/=ABS\((.*?)\)/);
  if (match && match[1]) {
    const value = match[1].trim();
    const evaluatedValue = getCellValue(value, setHighlightedCells, currentSheet);
    return Math.abs(evaluatedValue); // Apply ABS on the value
  }
}


    // Handle CONCATENATE formula
    if (formula.startsWith('=CONCATENATE')) {
      const match = formula.match(/=CONCATENATE\((.*?)\)/);
      if (match && match[1]) {
        const values = match[1].split(',').map(val => val.trim());
        return values.map(val => evaluateFormula(val, setHighlightedCells, currentSheet)).join('');
      }
    }

    // Handle LEN formula
    if (formula.startsWith('=LEN')) {
      const match = formula.match(/=LEN\((.*?)\)/);
      if (match && match[1]) {
        const value = match[1].trim();
        const evaluatedValue = evaluateFormula(value, setHighlightedCells, currentSheet);
        return evaluatedValue.length;
      }
    }

  } catch (error) {
    console.error('Error evaluating formula:', error);
    return null; // Return null if there is an error in evaluating the formula
  }

  return formula; // Return the formula as-is if no recognized pattern
};

// Helper function to parse cell notation (e.g., A1, B2)
const parseCell = (cell) => {
  const colMatch = cell.match(/[A-Z]+/);
  const rowMatch = cell.match(/\d+/);
  
  if (!colMatch || !rowMatch) {
    return [null, null]; // Invalid cell reference
  }
  
  const col = colMatch[0].split('').reduce((acc, letter) => acc * 26 + (letter.charCodeAt(0) - 65 + 1), 0) - 1;
  const row = parseInt(rowMatch[0], 10) - 1; // Convert row number to 0-based index
  
  return [row, col];
};

// Helper function to get the affected cells in the given range
const getAffectedCells = (startRow, endRow, startCol, endCol) => {
  const affectedCells = [];
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      affectedCells.push({ row, col });
    }
  }
  return affectedCells;
};

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { formulaList } from './FormulaList';  // Import the formula list

const HelpModal = ({ isOpen, onClose, selectedTab }) => {
  const [activeTab, setActiveTab] = useState(selectedTab ?? 'formulas');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(selectedTab ?? 'formulas'); // Reset active tab when modal is opened
    }
  }, [isOpen, selectedTab]);

  if (!isOpen) return null;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Sort formulaList alphabetically by the 'name' field
  const sortedFormulaList = formulaList.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  return (
    <div className="help-modal">
      <div className="modal-content">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <h2 style={{ textAlign: 'center', width: '100%' }}>Help</h2>
          <button
            type="button"
            style={{
              marginLeft: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            onClick={onClose}
          >
            <Icon icon="mdi:close" color="#aaa" width="24" />
          </button>
        </div>

        {/* Tab buttons */}
        <div style={{ marginBottom: '15px' }}>
          <button
            onClick={() => handleTabChange('formulas')}
            style={{
              padding: '8px 16px',
              marginRight: '10px',
              backgroundColor: activeTab === 'formulas' ? 'lightblue' : '#f1f1f1',
              color: activeTab === 'formulas' ? '#fff' : '#333',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            Formulas
          </button>
        </div>

        {/* Formulas Section */}
        {activeTab === 'formulas' ? (
          <TableContainer component={Paper} className="MuiTableContainer-root">
            <Table sx={{ minWidth: 1500 }} aria-label="formulas table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Formula</strong></TableCell>
                  <TableCell><strong>Usage</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedFormulaList.map((formula, index) => (
                  <TableRow key={index}>
                    <TableCell>{formula.name}</TableCell>
                    <TableCell>{formula.usage}</TableCell>
                    <TableCell>{formula.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div>No content for this tab</div>
        )}
      </div>
    </div>
  );
};

export default HelpModal;

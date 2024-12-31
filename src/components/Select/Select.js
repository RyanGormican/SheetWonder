import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, IconButton, TextField } from '@mui/material';
import { Icon } from '@iconify/react';
import { generateColumns, generateRows, saveSheetToLocalStorage } from '../Helper';
import InfoModal from '../InfoModal/InfoModal';

const Select = ({ sheets, setSheets, handleGridClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTitle, setEditingTitle] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [sortOrder, setSortOrder] = useState({ field: 'name', direction: 'asc' });

  // Filter sheets based on search query
  const filteredSheets = sheets.filter(sheet =>
    sheet.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort sheets based on selected field and direction
  const sortedSheets = [...filteredSheets].sort((a, b) => {
    const { field, direction } = sortOrder;
    if (field === 'name') {
      return direction === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    if (field === 'lastUpdated') {
      return direction === 'asc'
        ? new Date(a.lastUpdated) - new Date(b.lastUpdated)
        : new Date(b.lastUpdated) - new Date(a.lastUpdated);
    }
    if (field === 'dateCreated') {
      return direction === 'asc'
        ? new Date(a.dateCreated) - new Date(b.dateCreated)
        : new Date(b.dateCreated) - new Date(a.dateCreated);
    }
    return 0;
  });

  const handleAddSheet = () => {
    const currentDate = new Date().toISOString();
    const newSheet = {
      title: `New Spreadsheet ${sheets.length + 1}`,
      columns: generateColumns(),
      rows: generateRows(),
      id: currentTimestamp,
      dateCreated: currentDate,
      lastUpdated: currentDate,
    };
    const updatedSheets = [...sheets, newSheet];
    setSheets(updatedSheets);
    saveSheetToLocalStorage(updatedSheets);
  };

  const handleDeleteSheet = (sheetId) => {
    const updatedSheets = sheets.filter(sheet => sheet.id !== sheetId);
    setSheets(updatedSheets);
    saveSheetToLocalStorage(updatedSheets);
  };

  const handleSaveTitle = (sheet) => {
    const updatedSheets = sheets.map(sheetItem =>
      sheetItem.title === sheet.title ? { ...sheetItem, title: newTitle } : sheetItem
    );
    setSheets(updatedSheets);
    setEditingTitle(null);
    saveSheetToLocalStorage(updatedSheets);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleTitleClick = (sheet) => {
    setEditingTitle(sheet.title);
    setNewTitle(sheet.title);
  };

  const handleTitleChange = (event, sheet) => {
    const updatedSheets = sheets.map(s =>
      s.title === sheet.title ? { ...s, title: event.target.value } : s
    );
    setSheets(updatedSheets);
    saveSheetToLocalStorage(updatedSheets);
  };

  const handleInfoClick = (sheet) => {
    setSelectedSheet(sheet);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const changeSortField = (field) => {
    setSortOrder((prev) => ({
      ...prev,
      field,
      direction: 'asc', // Reset direction to ascending when changing the field
    }));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
        <TextField
          label="Search Sheets"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ flexGrow: 1 }}
        />
      <IconButton onClick={() => changeSortField('name')}>
  <Typography style={{ fontWeight: sortOrder.field === 'name' ? 'bold' : 'normal' }}>
    Sort by Name
  </Typography>
  {sortOrder.field === 'name' && <Icon icon="mdi:check" width="16" height="16" style={{ marginLeft: '4px' }} />}
</IconButton>
<IconButton onClick={() => changeSortField('lastUpdated')}>
  <Typography style={{ fontWeight: sortOrder.field === 'lastUpdated' ? 'bold' : 'normal' }}>
    Sort by Last Updated
  </Typography>
  {sortOrder.field === 'lastUpdated' && <Icon icon="mdi:check" width="16" height="16" style={{ marginLeft: '4px' }} />}
</IconButton>
<IconButton onClick={() => changeSortField('dateCreated')}>
  <Typography style={{ fontWeight: sortOrder.field === 'dateCreated' ? 'bold' : 'normal' }}>
    Sort by Creation Date
  </Typography>
  {sortOrder.field === 'dateCreated' && <Icon icon="mdi:check" width="16" height="16" style={{ marginLeft: '4px' }} />}
</IconButton>

        <IconButton onClick={toggleSortOrder}>
        <Icon icon={`mdi:arrow-${sortOrder.direction === 'asc' ? 'down' : 'up'}`} width="24" height="24" />
        </IconButton>
      </div>

      <Grid container spacing={2}>
        {sortedSheets.map((sheet, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card onClick={() => handleGridClick(sheet.id)}>
              <CardContent>
                <div style={{ maxHeight: 75, overflowY: 'auto' }}>
                  {sheet.rows.slice(0, 3).map((row, rowIndex) => (
                    <div key={rowIndex}>
                      {sheet.columns.slice(1).map(col => (
                        <span key={col.key} style={{ marginRight: '10px' }}>
                          {row[col.key] || ''}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {editingTitle === sheet.title ? (
                <TextField
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={() => handleSaveTitle(sheet)}
                  autoFocus
                />
              ) : (
                <Typography
                  variant="h6"
                  onClick={() => handleTitleClick(sheet)}
                  style={{ cursor: 'pointer' }}
                >
                  {sheet.title}
                </Typography>
              )}
              <IconButton onClick={() => handleInfoClick(sheet)}>
                <Icon icon="material-symbols:info" width="24" height="24" />
              </IconButton>
              <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteSheet(sheet.id); }}>
                <Icon icon="mdi:trash" width="24" height="24" />
              </IconButton>
            </div>
          </Grid>
        ))}

        <Grid item xs={12} sm={6} md={4} key="add-sheet">
          <Card onClick={handleAddSheet} style={{ cursor: 'pointer' }}>
            <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 95, maxHeight: 95 }}>
              <Typography variant="h4"><Icon icon="mdi:plus" width="24" height="24" /></Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <InfoModal
        open={Boolean(selectedSheet)}
        sheet={selectedSheet}
        onClose={() => setSelectedSheet(null)}
      />
    </div>
  );
};

export default Select;

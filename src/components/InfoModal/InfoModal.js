import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

const InfoModal = ({ open, sheet, onClose }) => {
  if (!sheet) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sheet Information</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Title: {sheet.title}</Typography>
        <Typography variant="body1">Date Created: {new Date(sheet.dateCreated).toLocaleString()}</Typography>
        <Typography variant="body1">Last Updated: {new Date(sheet.lastUpdated).toLocaleString()}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoModal;

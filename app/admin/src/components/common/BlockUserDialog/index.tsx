'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Alert,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

interface BlockUserDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (blockNote: string) => void;
  userName: string;
  loading?: boolean;
}

const BlockUserDialog: React.FC<BlockUserDialogProps> = ({
  open,
  onClose,
  onConfirm,
  userName,
  loading = false,
}) => {
  const [blockNote, setBlockNote] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    setError('');
    onConfirm(blockNote.trim());
  };

  const handleClose = () => {
    setBlockNote('');
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <WarningIcon sx={{ color: 'warning.main', fontSize: 28 }} />
          <Typography variant="h6" fontWeight={600}>
            Block User
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 0, pb: 2 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Are you sure you want to block <strong>{userName}</strong>? This user will not be able to access the system until unblocked.
          </Typography>
        </Alert>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Reason for blocking (optional)"
          placeholder="Please provide a reason for blocking this user (optional)..."
          value={blockNote}
          onChange={(e) => setBlockNote(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            py: 1,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            py: 1,
            backgroundColor: 'warning.main',
            '&:hover': {
              backgroundColor: 'warning.dark',
            },
          }}
        >
          {loading ? 'Blocking...' : 'Block User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlockUserDialog; 
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
  Grid,
  Chip,
  Card,
  CardMedia,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { SpotData } from '../../interfaces';
import MultiImageUpload from '../common/MultiImageUpload';

interface SpotVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => Promise<void>;
  onReject?: () => Promise<void>;
  spotData: SpotData;
  isLoading: boolean;
  isRejecting?: boolean;
}

const SpotVerificationDialog: React.FC<SpotVerificationDialogProps> = ({
  isOpen,
  onClose,
  onVerify,
  onReject,
  spotData,
  isLoading,
  isRejecting = false,
}) => {
  const [verificationImages, setVerificationImages] = useState<string[]>([]);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'approved' | 'rejected'>('approved');

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Indoor':
        return 'primary';
      case 'Outdoor':
        return 'secondary';
      case 'Garage':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleImageUpload = (images: string[]) => {
    setVerificationImages(images);
  };

  const handleSubmit = async () => {
    try {
      if (verificationStatus === 'approved') {
        await onVerify();
      } else if (verificationStatus === 'rejected' && onReject) {
        await onReject();
      }
      
      // Reset form
      setVerificationImages([]);
      setVerificationNotes('');
      setVerificationStatus('approved');
    } catch (error) {
      console.error('Error processing spot:', error);
    }
  };

  const handleClose = () => {
    // Reset form
    setVerificationImages([]);
    setVerificationNotes('');
    setVerificationStatus('approved');
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          Verify Spot: {spotData.title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={3}>
          {/* Spot Information Summary */}
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Review the spot details below and upload verification images to approve or reject this spot.
              </Typography>
            </Alert>
          </Grid>

          {/* Spot Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Spot Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Title
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {spotData.title}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Type
                </Typography>
                <Chip
                  label={spotData.type}
                  color={getTypeColor(spotData.type)}
                  size="small"
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Host
                </Typography>
                <Typography variant="body1">
                  {spotData.hostName}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon fontSize="small" color="action" />
                  <Typography variant="body1">
                    {spotData.address}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Rate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MoneyIcon fontSize="small" color="action" />
                  <Typography variant="body1" fontWeight="medium">
                    ${spotData.rate}/hour
                  </Typography>
                </Box>
              </Box>

              {spotData.startTime && spotData.endTime && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Operating Hours
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimeIcon fontSize="small" color="action" />
                    <Typography variant="body1">
                      {formatTime(spotData.startTime)} - {formatTime(spotData.endTime)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Original Images */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Original Images
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
              {spotData.images && spotData.images.length > 0 ? (
                spotData.images.map((image, index) => (
                  <Card key={index} sx={{ minWidth: 150, flexShrink: 0 }}>
                    <CardMedia
                      component="img"
                      height="120"
                      image={image}
                      alt={`Original image ${index + 1}`}
                      sx={{ objectFit: 'cover' }}
                    />
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No original images available
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Verification Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Verification
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Verification Status</InputLabel>
                  <Select
                    value={verificationStatus}
                    label="Verification Status"
                    onChange={(e) => setVerificationStatus(e.target.value as 'approved' | 'rejected')}
                  >
                    <MenuItem value="approved">Approve</MenuItem>
                    <MenuItem value="rejected">Reject</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Verification Notes (Optional)"
                  placeholder="Add any notes about the verification process..."
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Upload Verification Images *
                </Typography>
                <MultiImageUpload
                  onImagesUploaded={handleImageUpload}
                  maxImages={5}
                  acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                  maxFileSize={5 * 1024 * 1024} // 5MB
                />
                {verificationImages.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {verificationImages.length} image(s) uploaded
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Grid>

          {/* Features and Rules */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {spotData.features && spotData.features.length > 0 ? (
                spotData.features.map((feature, index) => (
                  <Chip
                    key={index}
                    label={feature}
                    size="small"
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No features listed
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Rules
            </Typography>
            <Typography variant="body1">
              {spotData.rules || 'No rules specified'}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleClose} variant="outlined" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading || isRejecting}
          startIcon={isLoading || isRejecting ? <CircularProgress size={20} /> : null}
        >
          {isLoading || isRejecting ? 'Processing...' : `Mark as ${verificationStatus === 'approved' ? 'Verified' : 'Rejected'}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SpotVerificationDialog; 
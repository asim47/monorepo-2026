'use client';

import React from 'react';
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
  Avatar,
  Divider,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { SpotDetailData } from '../../interfaces';

interface SpotDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  spotData: SpotDetailData;
}

const SpotDetailDialog: React.FC<SpotDetailDialogProps> = ({
  isOpen,
  onClose,
  spotData,
}) => {
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getCancellationPolicyColor = (policy: string) => {
    switch (policy) {
      case 'Flexible':
        return 'success';
      case 'Moderate':
        return 'warning';
      case 'Strict':
        return 'error';
      default:
        return 'default';
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'pending':
        return 'warning';
      case 'not_verified':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending';
      case 'not_verified':
        return 'Not Verified';
      default:
        return status;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            Spot Details
          </Typography>
          <Chip
            label={getStatusLabel(spotData.verification_status)}
            color={getStatusColor(spotData.verification_status)}
            size="small"
          />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={3}>
          {/* Images Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Images
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
              {spotData.images && spotData.images.length > 0 ? (
                spotData.images.map((image, index) => (
                  <Card key={index} sx={{ minWidth: 200, flexShrink: 0 }}>
                    <CardMedia
                      component="img"
                      height="150"
                      image={image}
                      alt={`Spot image ${index + 1}`}
                      sx={{ objectFit: 'cover' }}
                    />
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No images available
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Basic Information
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
                  Number of Cars
                </Typography>
                <Typography variant="body1">
                  {spotData.numberOfCars} cars
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {spotData.description}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Location & Pricing */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Location & Pricing
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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

              {spotData.lateFee && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Late Fee
                  </Typography>
                  <Typography variant="body1">
                    ${spotData.lateFee}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Cancellation Policy
                </Typography>
                <Chip
                  label={spotData.cancellationPolicy}
                  color={getCancellationPolicyColor(spotData.cancellationPolicy)}
                  size="small"
                />
              </Box>
            </Box>
          </Grid>

          {/* Schedule */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Schedule
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Time Slot Type
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon fontSize="small" color="action" />
                  <Typography variant="body1">
                    {spotData.timeSlotType}
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

          {/* Features */}
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

          {/* Rules */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Rules
            </Typography>
            <Typography variant="body1">
              {spotData.rules || 'No rules specified'}
            </Typography>
          </Grid>

          {/* Host Information */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Host Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 56, height: 56 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  {spotData.hostName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {spotData.hostEmail}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Coordinates */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Location Coordinates
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Latitude: {spotData.lat}, Longitude: {spotData.long}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SpotDetailDialog; 
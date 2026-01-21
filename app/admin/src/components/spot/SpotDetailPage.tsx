'use client';

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Card,
  CardMedia,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  IconButton,
  MobileStepper,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as VerifyIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from '@mui/icons-material';
import { SpotDetailData } from '../../interfaces';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockSpotsApi } from '@/helpers/mockApi';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';

interface SpotDetailPageProps {
  spotId: string;
}

const fetchSpotDetail = async (spotId: string): Promise<SpotDetailData> => {
  return mockSpotsApi.fetchSpotDetail(spotId);
};

const verifySpot = async (spotId: string) => {
  return mockSpotsApi.verifySpot(spotId);
};

const rejectSpot = async (spotId: string) => {
  return mockSpotsApi.rejectSpot(spotId);
};

const SpotDetailPage: React.FC<SpotDetailPageProps> = ({ spotId }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  
  // Check if this is a verification route
  const isVerificationRoute = pathname.includes('/verification');
  
  // Confirmation dialog states
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'verify' | 'reject' | null>(null);
  
  // Image slider states
  const [activeStep, setActiveStep] = useState(0);
  const [activeVerificationStep, setActiveVerificationStep] = useState(0);

  // Fetch spot details
  const { data: spotData, isLoading, error } = useQuery({
    queryKey: ['spot-detail', spotId],
    queryFn: () => fetchSpotDetail(spotId),
    enabled: !!spotId,
  });

  // Mutations
  const verifySpotMutation = useMutation({
    mutationFn: (spotId: string) => verifySpot(spotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] });
      queryClient.invalidateQueries({ queryKey: ['pending-spots'] });
      queryClient.invalidateQueries({ queryKey: ['spot-detail', spotId] });
      toast.success('Spot verified successfully!');
      setIsConfirmDialogOpen(false);
      setConfirmAction(null);
    },
    onError: (error) => {
      console.error('Error verifying spot:', error);
      toast.error('Failed to verify spot. Please try again.');
    },
  });

  const rejectSpotMutation = useMutation({
    mutationFn: (spotId: string) => rejectSpot(spotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] });
      queryClient.invalidateQueries({ queryKey: ['pending-spots'] });
      queryClient.invalidateQueries({ queryKey: ['spot-detail', spotId] });
      toast.success('Spot rejected successfully!');
      setIsConfirmDialogOpen(false);
      setConfirmAction(null);
    },
    onError: (error) => {
      console.error('Error rejecting spot:', error);
      toast.error('Failed to reject spot. Please try again.');
    },
  });

  // Loading states
  const isVerifying = verifySpotMutation.isPending;
  const isRejecting = rejectSpotMutation.isPending;

  // Handle error
  useEffect(() => {
    if (error) {
      console.error('Error fetching spot details:', error);
      toast.error('Failed to load spot details.');
    }
  }, [error]);

  const formatTime = (time: string) => {
    try {
      // Handle timestamp strings (e.g., "2024-01-01T09:00:00.000Z")
      const date = new Date(time);
      
      // Check if it's a valid date
      if (isNaN(date.getTime())) {
        // If it's not a valid timestamp, try to parse it as a time string
        const timeOnly = time.includes('T') ? time.split('T')[1] : time;
        const dateWithTime = new Date(`2000-01-01T${timeOnly}`);
        
        if (isNaN(dateWithTime.getTime())) {
          return time; // Return original if we can't parse it
        }
        
        return dateWithTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
      }
      
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      console.error('Error formatting time:', error, 'Time value:', time);
      return time; // Return original if there's an error
    }
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

  const isPdfFile = (url: string) => {
    return url.toLowerCase().endsWith('.pdf');
  };

  const getFileNameFromUrl = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 1] || 'document';
  };

  const handleDownload = (url: string) => {
    if (isPdfFile(url)) {
      // For PDFs, open in new tab
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show a toast notification
      toast.success('PDF opened in new tab');
    } else {
      // For images, use direct download
      const link = document.createElement('a');
      link.href = url;
      link.download = getFileNameFromUrl(url);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show a toast notification
      toast.success('Image download started');
    }
  };

  const handleVerifySpot = () => {
    setConfirmAction('verify');
    setIsConfirmDialogOpen(true);
  };

  const handleRejectSpot = () => {
    setConfirmAction('reject');
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!spotData || !confirmAction) return;

    try {
      if (confirmAction === 'verify') {
        await verifySpotMutation.mutateAsync(spotData.id);
      } else if (confirmAction === 'reject') {
        await rejectSpotMutation.mutateAsync(spotData.id);
      }
    } catch (error) {
      console.error('Error processing spot:', error);
    }
  };

  // Image slider functions
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleVerificationNext = () => {
    setActiveVerificationStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleVerificationBack = () => {
    setActiveVerificationStep((prevActiveStep) => prevActiveStep - 1);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !spotData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load spot details. Please try again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: 'background.default', minHeight: '100vh', maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: 4,
        p: 3,
        borderRadius: 3,
        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light || theme.palette.primary.main} 100%)`,
        color: 'white',
        boxShadow: (theme) => `0 8px 32px ${theme.palette.primary.main}40`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ 
              color: 'white', 
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
            variant="outlined"
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
              Spot Details
            </Typography>
            {isVerificationRoute && spotData.verification_status === 'pending' && (
              <Chip
                label="PENDING VERIFICATION"
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 24,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  '& .MuiChip-label': {
                    px: 1.5,
                    py: 0.5,
                  }
                }}
              />
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {isVerificationRoute && spotData.verification_status !== 'verified' && (
            <>
              <Button
                variant="contained"
                startIcon={<VerifyIcon />}
                onClick={handleVerifySpot}
                sx={{
                  backgroundColor: 'rgba(76, 175, 80, 0.9)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(76, 175, 80, 0.8)',
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 1)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                    transform: 'translateY(-1px)'
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                    boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(76, 175, 80, 0.3)',
                    color: 'rgba(255,255,255,0.6)',
                    borderColor: 'rgba(76, 175, 80, 0.3)',
                    transform: 'none',
                    boxShadow: 'none'
                  }
                }}
                disabled={isVerifying || isRejecting}
              >
                {isVerifying ? (
                  <>
                    <CircularProgress size={16} sx={{ color: 'white', mr: 1 }} />
                    Verifying...
                  </>
                ) : (
                  'Verify Spot'
                )}
              </Button>
              <Button
                variant="contained"
                onClick={handleRejectSpot}
                sx={{
                  backgroundColor: 'rgba(211, 47, 47, 0.9)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(211, 47, 47, 0.8)',
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 1)',
                    borderColor: 'rgba(211, 47, 47, 1)',
                    boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                    transform: 'translateY(-1px)'
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                    boxShadow: '0 2px 8px rgba(211, 47, 47, 0.3)'
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(211, 47, 47, 0.3)',
                    color: 'rgba(255,255,255,0.6)',
                    borderColor: 'rgba(211, 47, 47, 0.3)',
                    transform: 'none',
                    boxShadow: 'none'
                  }
                }}
                disabled={isVerifying || isRejecting}
              >
                {isRejecting ? (
                  <>
                    <CircularProgress size={16} sx={{ color: 'white', mr: 1 }} />
                    Rejecting...
                  </>
                ) : (
                  'Reject Spot'
                )}
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Main Content - Left Column */}
        <Grid item xs={12} lg={8}>
          {/* Images Section */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ImageIcon color="primary" fontSize="small" />
              <Typography variant="subtitle1" fontWeight="600">
                Spot Images
              </Typography>
              <Chip 
                label={`${spotData.images?.length || 0} images`} 
                size="small" 
                color="primary" 
                variant="outlined"
              />
            </Box>
            <Box sx={{ position: 'relative', maxWidth: 1000, mx: 'auto' }}>
              {spotData.images && spotData.images.length > 0 ? (
                <>
                  <Card sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height={isVerificationRoute ? 300 : 400}
                      image={spotData.images[activeStep]}
                      alt={`Spot image ${activeStep + 1}`}
                      sx={{ 
                        objectFit: 'cover',
                        width: '100%',
                        transition: 'all 0.3s ease-in-out'
                      }}
                    />
                    
                    {/* Navigation arrows */}
                    {spotData.images.length > 1 && (
                      <>
                        <IconButton
                          sx={{
                            position: 'absolute',
                            left: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            color: 'text.primary',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 1)',
                            },
                            zIndex: 1,
                          }}
                          onClick={handleBack}
                          disabled={activeStep === 0}
                        >
                          <KeyboardArrowLeftIcon />
                        </IconButton>
                        <IconButton
                          sx={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            color: 'text.primary',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 1)',
                            },
                            zIndex: 1,
                          }}
                          onClick={handleNext}
                          disabled={activeStep === spotData.images.length - 1}
                        >
                          <KeyboardArrowRightIcon />
                        </IconButton>
                      </>
                    )}
                    
                    {/* Download button overlay */}
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 12, 
                      right: 12,
                      zIndex: 1
                    }}>
                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload(spotData.images[activeStep])}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          color: 'text.primary',
                          backdropFilter: 'blur(10px)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                          },
                        }}
                      >
                        Download
                      </Button>
                    </Box>
                    
                    {/* Image counter */}
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 12, 
                      left: 12,
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      zIndex: 1
                    }}>
                      {activeStep + 1} / {spotData.images.length}
                    </Box>
                  </Card>
                  
                  {/* Stepper dots */}
                  {spotData.images.length > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <MobileStepper
                        steps={spotData.images.length}
                        position="static"
                        activeStep={activeStep}
                        sx={{
                          backgroundColor: 'transparent',
                          '& .MuiMobileStepper-dot': {
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            margin: '0 4px',
                          },
                          '& .MuiMobileStepper-dotActive': {
                            backgroundColor: 'primary.main',
                          },
                        }}
                        nextButton={null}
                        backButton={null}
                      />
                    </Box>
                  )}
                </>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: 200,
                  backgroundColor: 'grey.100',
                  borderRadius: 2,
                  border: '2px dashed',
                  borderColor: 'grey.300'
                }}>
                  <Typography variant="body2" color="text.secondary">
                    No images available
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {spotData.verification_images && spotData.verification_images.length > 0 && (
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PdfIcon color="error" fontSize="small" />
                <Typography variant="subtitle1" fontWeight="600">
                  Verification Documents
                </Typography>
                <Chip 
                  label={`${spotData.verification_images.length} documents`} 
                  size="small" 
                  color="error" 
                  variant="outlined"
                />
              </Box>
              <Box sx={{ position: 'relative', maxWidth: 800, mx: 'auto' }}>
                <Card sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                                     {isPdfFile(spotData.verification_images[activeVerificationStep]) ? (
                    <Box sx={{ height: 400, width: '100%', position: 'relative' }}>
                                             <iframe
                         src={spotData.verification_images[activeVerificationStep]}
                         width="100%"
                         height="100%"
                         style={{ border: 'none' }}
                         title={`PDF Document ${activeVerificationStep + 1}`}
                       />
                       <Box sx={{ 
                         position: 'absolute', 
                         top: 8, 
                         right: 8, 
                         backgroundColor: 'rgba(255,255,255,0.95)', 
                         borderRadius: 1.5,
                         backdropFilter: 'blur(10px)',
                         boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                         border: '1px solid rgba(255,255,255,0.2)'
                       }}>
                         <Button
                           variant="contained"
                           startIcon={<DownloadIcon />}
                           onClick={() => handleDownload(spotData.verification_images![activeVerificationStep])}
                           size="small"
                           sx={{
                             borderRadius: 1.5,
                             textTransform: 'none',
                             fontWeight: 600,
                             px: 1.5,
                             py: 0.5,
                             fontSize: '0.75rem'
                           }}
                         >
                           {isPdfFile(spotData.verification_images[activeVerificationStep]) ? 'Open PDF' : 'Download'}
                         </Button>
                       </Box>
                     </Box>
                   ) : (
                     <CardMedia
                       component="img"
                       height="400"
                       image={spotData.verification_images[activeVerificationStep]}
                       alt={`Verification document ${activeVerificationStep + 1}`}
                       sx={{ 
                         objectFit: 'cover',
                         width: '100%',
                         transition: 'all 0.3s ease-in-out'
                       }}
                     />
                   )}
                  
                  {/* Navigation arrows */}
                  {spotData.verification_images.length > 1 && (
                    <>
                      <IconButton
                        sx={{
                          position: 'absolute',
                          left: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          color: 'text.primary',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                          },
                          zIndex: 1,
                        }}
                        onClick={handleVerificationBack}
                        disabled={activeVerificationStep === 0}
                      >
                        <KeyboardArrowLeftIcon />
                      </IconButton>
                      <IconButton
                        sx={{
                          position: 'absolute',
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          color: 'text.primary',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                          },
                          zIndex: 1,
                        }}
                        onClick={handleVerificationNext}
                        disabled={activeVerificationStep === spotData.verification_images.length - 1}
                      >
                        <KeyboardArrowRightIcon />
                      </IconButton>
                    </>
                  )}
                  
                  {/* Document counter */}
                  <Box sx={{ 
                    position: 'absolute', 
                    bottom: 8, 
                    left: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    px: 1,
                    py: 0.25,
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    zIndex: 1
                  }}>
                    {activeVerificationStep + 1} / {spotData.verification_images.length}
                  </Box>
                </Card>
                
                {/* Stepper dots */}
                {spotData.verification_images.length > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
                    <MobileStepper
                      steps={spotData.verification_images.length}
                      position="static"
                      activeStep={activeVerificationStep}
                      sx={{
                        backgroundColor: 'transparent',
                        '& .MuiMobileStepper-dot': {
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          margin: '0 3px',
                          width: 8,
                          height: 8,
                        },
                        '& .MuiMobileStepper-dotActive': {
                          backgroundColor: 'error.main',
                        },
                      }}
                      nextButton={null}
                      backButton={null}
                    />
                  </Box>
                )}
              </Box>
            </Paper>
          )}

          {/* Schedule Section */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ScheduleIcon color="warning" fontSize="small" />
              <Typography variant="subtitle1" fontWeight="600">
                Schedule & Availability
              </Typography>
            </Box>
            <Grid container spacing={1.5}>
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 1.5, 
                  backgroundColor: 'rgba(237, 108, 2, 0.04)',
                  border: '1px solid rgba(237, 108, 2, 0.1)',
                }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                    Time Slot Type
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                    {spotData.timeSlotType}
                  </Typography>
                </Box>
              </Grid>
              {spotData.startTime && spotData.endTime && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 1.5, 
                    backgroundColor: 'rgba(237, 108, 2, 0.04)',
                    border: '1px solid rgba(237, 108, 2, 0.1)',
                  }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                      Operating Hours
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TimeIcon fontSize="small" color="warning" sx={{ opacity: 0.8, fontSize: '1rem' }} />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                        {formatTime(spotData.startTime)} - {formatTime(spotData.endTime)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Features & Rules Section */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <InfoIcon color="secondary" fontSize="small" />
                  <Typography variant="subtitle1" fontWeight="600">
                    Features
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  p: 1.5,
                  borderRadius: 1.5,
                  backgroundColor: 'rgba(156, 39, 176, 0.04)',
                  border: '1px solid rgba(156, 39, 176, 0.1)',
                  minHeight: 40
                }}>
                  {spotData.features && spotData.features.length > 0 ? (
                    spotData.features.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          fontWeight: 500,
                          borderColor: 'secondary.main',
                          color: 'secondary.main',
                          backgroundColor: 'rgba(156, 39, 176, 0.08)',
                          '&:hover': {
                            backgroundColor: 'rgba(156, 39, 176, 0.12)',
                            transform: 'scale(1.05)'
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      No features listed
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <SecurityIcon color="error" fontSize="small" />
                  <Typography variant="subtitle1" fontWeight="600">
                    Rules
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 1.5,
                  borderRadius: 1.5,
                  backgroundColor: 'rgba(211, 47, 47, 0.04)',
                  border: '1px solid rgba(211, 47, 47, 0.1)',
                  minHeight: 40
                }}>
                  <Typography variant="body2" sx={{ 
                    color: 'text.primary', 
                    lineHeight: 1.4,
                    fontWeight: 500
                  }}>
                    {spotData.rules || 'No rules specified'}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Sidebar - Right Column */}
        <Grid item xs={12} lg={4}>
          {/* Basic Information */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <InfoIcon color="primary" />
              <Typography variant="h6" fontWeight="600">
                Basic Information
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                  Title
                </Typography>
                <Typography variant="h6" fontWeight="600" sx={{ color: 'text.primary' }}>
                  {spotData.title}
                </Typography>
              </Box>
              
              <Divider />
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                  Type
                </Typography>
                <Chip
                  label={spotData.type}
                  color={getTypeColor(spotData.type)}
                  size="medium"
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                  Number of Cars
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                  {spotData.numberOfCars} cars
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
                  {spotData.description}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Location & Pricing */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <LocationIcon color="success" />
              <Typography variant="h6" fontWeight="600">
                Location & Pricing
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                  Address
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LocationIcon fontSize="small" color="success" sx={{ opacity: 0.8 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                    {spotData.address}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                  Rate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <MoneyIcon fontSize="small" color="success" sx={{ opacity: 0.8 }} />
                  <Typography variant="h6" fontWeight="600" sx={{ color: 'text.primary' }}>
                    ${spotData.rate}/hour
                  </Typography>
                </Box>
              </Box>

              {spotData.lateFee && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                      Late Fee
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                      ${spotData.lateFee}
                    </Typography>
                  </Box>
                </>
              )}

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                  Cancellation Policy
                </Typography>
                <Chip
                  label={spotData.cancellationPolicy}
                  color={getCancellationPolicyColor(spotData.cancellationPolicy)}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
              </Box>
            </Box>
          </Paper>

          {/* Host Information */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <PersonIcon color="primary" />
              <Typography variant="h6" fontWeight="600">
                Host Information
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
              border: '1px solid rgba(25, 118, 210, 0.1)',
            }}>
              <Avatar sx={{ 
                width: 56, 
                height: 56,
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                border: '3px solid rgba(255,255,255,0.8)'
              }}>
                <PersonIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="600" sx={{ color: 'text.primary', mb: 0.5 }}>
                  {spotData.hostName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {spotData.hostEmail}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Coordinates */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <BusinessIcon color="success" />
              <Typography variant="h6" fontWeight="600">
                Location Coordinates
              </Typography>
            </Box>
            <Box sx={{ 
              p: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(56, 142, 60, 0.04)',
              border: '1px solid rgba(56, 142, 60, 0.1)',
            }}>
              <Typography variant="body1" sx={{ 
                color: 'text.primary', 
                fontWeight: 500,
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }}>
                Latitude: {spotData.lat}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'text.primary', 
                fontWeight: 500,
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }}>
                Longitude: {spotData.long}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={isConfirmDialogOpen}
        onClose={() => {
          setIsConfirmDialogOpen(false);
          setConfirmAction(null);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {confirmAction === 'verify' ? 'Verify Spot' : 'Reject Spot'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to {confirmAction === 'verify' ? 'verify' : 'reject'} the spot &quot;{spotData?.title}&quot;?
            <br /><br />
            {confirmAction === 'verify' 
              ? 'This will mark the spot as verified and make it available for booking.'
              : 'This will reject the spot and it will not be available for booking.'
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setIsConfirmDialogOpen(false);
              setConfirmAction(null);
            }} 
            color="primary"
            disabled={isVerifying || isRejecting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmAction} 
            color={confirmAction === 'verify' ? 'success' : 'error'}
            variant="contained"
            disabled={isVerifying || isRejecting}
          >
            {isVerifying || isRejecting 
              ? (confirmAction === 'verify' ? 'Verifying...' : 'Rejecting...')
              : (confirmAction === 'verify' ? 'Verify' : 'Reject')
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SpotDetailPage; 
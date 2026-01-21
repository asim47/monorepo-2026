'use client';

import React from 'react';
import { Chip, ChipProps } from '@mui/material';

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status: string;
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
}

const StatusChip: React.FC<StatusChipProps> = ({ 
  status, 
  variant = 'filled', 
  size = 'small',
  ...props 
}) => {
  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case 'active':
      case 'verified':
      case 'approved':
        return {
          color: 'success' as const,
          label: status,
          backgroundColor: '#e8f5e8',
          textColor: '#2e7d32',
        };
      
      case 'inactive':
      case 'pending':
      case 'unverified':
        return {
          color: 'warning' as const,
          label: status,
          backgroundColor: '#fff3e0',
          textColor: '#f57c00',
        };
      
      case 'blocked':
      case 'rejected':
      case 'suspended':
        return {
          color: 'error' as const,
          label: status,
          backgroundColor: '#ffebee',
          textColor: '#d32f2f',
        };
      
      case 'admin':
      case 'super_admin':
        return {
          color: 'primary' as const,
          label: status.replace('_', ' ').toUpperCase(),
          backgroundColor: '#e3f2fd',
          textColor: '#1976d2',
        };
      
      case 'user':
        return {
          color: 'default' as const,
          label: 'User',
          backgroundColor: '#f5f5f5',
          textColor: '#757575',
        };
      
      default:
        return {
          color: 'default' as const,
          label: status,
          backgroundColor: '#f5f5f5',
          textColor: '#757575',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      color={config.color}
      variant={variant}
      size={size}
      sx={{
        fontWeight: 600,
        fontSize: '0.75rem',
        height: variant === 'filled' ? 24 : 28,
        backgroundColor: variant === 'filled' ? config.backgroundColor : 'transparent',
        color: variant === 'filled' ? config.textColor : 'inherit',
        border: variant === 'outlined' ? `1px solid ${config.textColor}` : 'none',
        '& .MuiChip-label': {
          px: 1.5,
        },
        ...props.sx,
      }}
      {...props}
    />
  );
};

export default StatusChip; 
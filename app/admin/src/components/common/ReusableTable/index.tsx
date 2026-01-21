'use client';

import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  LinearProgress,
  Typography
} from '@mui/material';

export interface TableColumn<T> {
  key: string;
  header: string;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  flex?: number;
  render?: (item: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface ReusableTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  loadingRows?: number;
  emptyMessage?: string;
  onRowClick?: (item: T, index: number) => void;
  hover?: boolean;
  size?: 'small' | 'medium';
  stickyHeader?: boolean;
  maxHeight?: string | number;
  minHeight?: string | number;
}

export function ReusableTable<T>({
  data,
  columns,
  loading = false,
  loadingRows = 10,
  emptyMessage = 'No data available',
  onRowClick,
  hover = true,
  size = 'small',
  stickyHeader = true,
  maxHeight = '70vh',
  minHeight = '400px'
}: ReusableTableProps<T>) {

  const renderSkeletonRow = () => (
    <TableRow>
      {columns.map((column, index) => (
        <TableCell key={index}>
          <Skeleton variant="text" width="60%" height={20} />
        </TableCell>
      ))}
    </TableRow>
  );

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={columns.length} align="center">
        <Box sx={{ py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );

  return (
    <Paper sx={{ 
      width: '100%', 
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Loading Bar on Top */}
      {loading && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      )}
      
      <TableContainer sx={{ 
        flex: 1,
        overflow: 'auto',
        minHeight,
        maxHeight
      }}>
        <Table stickyHeader={stickyHeader} size={size} sx={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.key}
                  align={column.align || 'left'}
                  sx={{ 
                    fontWeight: 700, 
                    backgroundColor: 'grey.100',
                    color: 'text.primary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '0.875rem',
                    borderBottom: '2px solid',
                    borderColor: 'grey.300',
                    width: column.width,
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {column.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Show skeleton rows while loading
              Array.from({ length: loadingRows }).map((_, index) => (
                <React.Fragment key={`skeleton-${index}`}>
                  {renderSkeletonRow()}
                </React.Fragment>
              ))
            ) : data.length === 0 ? (
              renderEmptyState()
            ) : (
              // Show actual data
              data.map((item, index) => (
                <TableRow 
                  key={index} 
                  sx={{ 
                    '&:hover': hover ? { backgroundColor: 'action.hover' } : {},
                    cursor: onRowClick ? 'pointer' : 'default'
                  }}
                  onClick={() => onRowClick?.(item, index)}
                >
                  {columns.map((column) => (
                    <TableCell 
                      key={column.key}
                      align={column.align || 'left'}
                      sx={{ 
                        width: column.width,
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {column.render ? column.render(item, index) : (item as any)[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ReusableTable; 
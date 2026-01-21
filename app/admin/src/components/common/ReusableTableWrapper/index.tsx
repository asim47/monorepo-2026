'use client';

import React from 'react';
import { Box } from '@mui/material';
import ReusableTable, { TableColumn } from '../ReusableTable';
import ReusablePagination from '../ReusablePagination';

interface ReusableTableWrapperProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  loadingRows?: number;
  emptyMessage?: string;
  onRowClick?: (item: T, index: number) => void;
  hover?: boolean;
  size?: 'small' | 'medium';
  stickyHeader?: boolean;
  maxHeight?: string | number;
  minHeight?: string | number;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showItemCount?: boolean;
  showPagination?: boolean;
}

export function ReusableTableWrapper<T>({
  data,
  columns,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  loadingRows = 10,
  emptyMessage = 'No data available',
  onRowClick,
  hover = true,
  size = 'small',
  stickyHeader = true,
  maxHeight = '70vh',
  minHeight = '400px',
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeSelector = true,
  showItemCount = true,
  showPagination = true
}: ReusableTableWrapperProps<T>) {

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <ReusableTable
        data={data}
        columns={columns}
        loading={loading}
        loadingRows={loadingRows}
        emptyMessage={emptyMessage}
        onRowClick={onRowClick}
        hover={hover}
        size={size}
        stickyHeader={stickyHeader}
        maxHeight={showPagination ? 'calc(100% - 80px)' : maxHeight}
        minHeight={minHeight}
      />
      
      {showPagination && (
        <ReusablePagination
          totalItems={totalItems}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          loading={loading}
          pageSizeOptions={pageSizeOptions}
          showPageSizeSelector={showPageSizeSelector}
          showItemCount={showItemCount}
        />
      )}
    </Box>
  );
}

export default ReusableTableWrapper; 
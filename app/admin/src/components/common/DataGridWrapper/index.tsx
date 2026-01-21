'use client';

import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridPaginationModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface FilterConfig {
  search?: {
    label: string;
    placeholder?: string;
  };
  status?: {
    label: string;
    options: { value: string; label: string }[];
  };
  custom?: React.ReactNode;
}

interface DataGridWrapperProps {
  title: string;
  subtitle?: string;
  rows: readonly GridValidRowModel[];
  columns: GridColDef[];
  loading?: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  pageSizeOptions?: number[];
  paginationMode?: 'client' | 'server';
  rowCount?: number;
  checkboxSelection?: boolean;
  disableRowSelectionOnClick?: boolean;
  showToolbar?: boolean;
  disableColumnResize?: boolean;
  disableColumnMenu?: boolean;
  getRowHeight?: () => number;
  filters?: FilterConfig;
  onSearchChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  searchValue?: string;
  statusValue?: string;
  height?: number;
  showHeader?: boolean;
  customHeaderActions?: React.ReactNode;
}

const DataGridWrapper: React.FC<DataGridWrapperProps> = ({
  title,
  subtitle,
  rows,
  columns,
  loading = false,
  paginationModel,
  onPaginationModelChange,
  pageSizeOptions = [5, 10, 25, 50],
  paginationMode = "client",
  rowCount,
  checkboxSelection = true,
  disableRowSelectionOnClick = true,
  showToolbar = true,
  disableColumnMenu = true,
  getRowHeight = () => 65,
  filters,
  onSearchChange,
  onStatusChange,
  searchValue = "",
  statusValue = "",
  height = 800,
  showHeader = true,
  customHeaderActions,
}) => {
  // Custom toolbar with search/status controls
  const CustomToolbar = () => {
    if (!showToolbar && !filters) return null;

    return (
      <GridToolbarContainer
        sx={{
          p: 3,
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#fafafa",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            {filters?.search && onSearchChange && (
              <TextField
                label={filters.search.label}
                variant="outlined"
                size="small"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={filters.search.placeholder}
                sx={{
                  minWidth: 320,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    "&:hover": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                      },
                    },
                  },
                }}
              />
            )}

            {filters?.status && onStatusChange && (
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>{filters.status.label}</InputLabel>
                <Select
                  value={statusValue}
                  label={filters.status.label}
                  onChange={(e) => onStatusChange(e.target.value)}
                  sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                  }}
                >
                  {filters.status.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {filters?.custom}
          </Box>

          {showToolbar && (
            <Box>
              <GridToolbarExport />
            </Box>
          )}
        </Box>
      </GridToolbarContainer>
    );
  };
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        p: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {showHeader && (
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                sx={{ color: "text.primary", mb: 1 }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: "0.9rem" }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
            {customHeaderActions && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {customHeaderActions}
              </Box>
            )}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          height,
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
          flex: 1,
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          pageSizeOptions={pageSizeOptions}
          paginationMode={paginationMode}
          rowCount={rowCount}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick={disableRowSelectionOnClick}
          showToolbar={showToolbar}
          disableColumnResize={false}
          disableColumnMenu={disableColumnMenu}
          getRowHeight={getRowHeight}
          autoHeight={false}
          density="comfortable"
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          slots={{ toolbar: CustomToolbar }}
          sx={{
            border: "none",
            width: "100%",
            "& .MuiDataGrid-main": {
              width: "100%",
            },
            "& .MuiDataGrid-virtualScroller": {
              width: "100% !important",
              backgroundColor: "#ffffff",
            },
            "& .MuiDataGrid-virtualScrollerContent": {
              width: "100% !important",
            },
            "& .MuiDataGrid-virtualScrollerRenderZone": {
              width: "100% !important",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f0f0",
              padding: "12px 16px",
              display: "flex !important",
              alignItems: "center !important",
              justifyContent: "flex-start !important",
              minHeight: "55px",
            },
            '& .MuiDataGrid-cell[data-field="actions"]': {
              justifyContent: "center !important",
            },
            '& .MuiDataGrid-cell[data-field="noOfCars"]': {
              justifyContent: "center !important",
            },
            "& .MuiDataGrid-row": {
              width: "100%",
              "&:hover": {
                backgroundColor: "#f8f9fa",
              },
              "&:nth-of-type(even)": {
                backgroundColor: "#fafbfc",
              },
              "&.Mui-selected": {
                backgroundColor: "#e3f2fd",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                },
              },
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#ffffff",
              borderBottom: "2px solid #e0e0e0",
              width: "100%",
              "& .MuiDataGrid-columnHeader": {
                borderRight: "1px solid #f0f0f0",
                "&:last-child": {
                  borderRight: "none",
                },
              },
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "#374151",
              textTransform: "none",
            },
            "& .MuiDataGrid-cellContent": {
              fontSize: "0.875rem",
              lineHeight: 1.4,
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "2px solid #e0e0e0",
              backgroundColor: "#fafafa",
            },
            "& .MuiDataGrid-actionsCell": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
            },
            "& .MuiDataGrid-actionsCellItem": {
              "&:hover": {
                backgroundColor: "#e3f2fd",
                borderRadius: "4px",
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default DataGridWrapper; 
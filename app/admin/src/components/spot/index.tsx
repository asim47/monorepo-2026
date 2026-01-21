'use client';

import React, { useEffect, useState, useRef } from "react";
import {
  Avatar,
  Chip,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import { SpotData } from "../../interfaces";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { mockSpotsApi } from "@/helpers/mockApi";

import ReusableTableWrapper from "../common/ReusableTableWrapper";
import type { TableColumn } from "../common/ReusableTable";

const fetchSpots = async (searchParams?: {
  search?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}) => {
  return mockSpotsApi.fetchSpots(searchParams);
};

interface SpotComponentProps {
  userTypeFilter?: unknown;
}

const SpotComponent: React.FC<SpotComponentProps> = () => {
  const navigate = useNavigate();

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    type: "",
  });

  // Pagination state (server)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Debounced params sent to API
  const [debouncedFilters, setDebouncedFilters] = useState({
    search: "",
    status: "",
    type: "",
    page: 1,
    limit: 10,
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { data, isLoading, error } = useQuery({
    queryKey: ["spots", debouncedFilters],
    queryFn: () => fetchSpots(debouncedFilters),
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching spots:", error);
      toast.error("Failed to load spots. Please refresh the page.");
    }
  }, [error]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedFilters({
        ...filters,
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      });
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters, paginationModel]);

  const handlePaginationChange = (page: number) => {
    setPaginationModel((prev) => ({ ...prev, page: page - 1 }));
  };

  const handlePageSizeChange = (size: number) => {
    setPaginationModel({ page: 0, pageSize: size });
  };

  const handleViewSpot = (spotId: string) => {
    navigate(`/spots/${spotId}`);
  };

  const handleVerifySpot = (spot: SpotData) => {
    navigate(`/spots/verification/${spot.id}`);
  };

  const spots = data?.items || [];

  const columns: TableColumn<SpotData>[] = [
    {
      key: "images",
      header: "Images",
      minWidth: 100,
      render: (item) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          {item.images && item.images.length > 0 ? (
            <Avatar
              src={item.images[0]}
              alt={item.title}
              sx={{ width: 40, height: 40 }}
            >
              {item.title.charAt(0)}
            </Avatar>
          ) : (
            <Avatar sx={{ width: 40, height: 40 }}>
              {item.title.charAt(0)}
            </Avatar>
          )}
        </Box>
      ),
    },
    { key: "title", header: "Title", minWidth: 250 },
    { key: "hostName", header: "Host", minWidth: 180 },
    {
      key: "type",
      header: "Type",
      minWidth: 120,
      render: (item) => (
        <Chip
          label={item.type}
          color={
            item.type === "Indoor"
              ? "primary"
              : item.type === "Outdoor"
              ? "secondary"
              : "default"
          }
          size="small"
          variant="filled"
        />
      ),
    },
    {
      key: "rate",
      header: "Rate",
      minWidth: 120,
      render: (item) => (
        <Typography variant="body2">${item.rate}/hr</Typography>
      ),
    },
    {
      key: "verification_status",
      header: "Status",
      minWidth: 140,
      render: (item) => {
        const status = item.verification_status;
        const color =
          status === "verified"
            ? "success"
            : status === "pending"
            ? "warning"
            : "error";
        const label =
          status === "verified"
            ? "Verified"
            : status === "pending"
            ? "Pending"
            : "Not Verified";
        return (
          <Chip label={label} color={color} size="small" variant="filled" />
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      minWidth: 160,
      align: "center",
      render: (item) => {
        // Show only Verify button for unverified spots
        if (item.verification_status !== "verified") {
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Button
                variant="contained"
                color="success"
                size="small"
                endIcon={<ArrowIcon sx={{ fontSize: 16 }} />}
                onClick={(e) => {
                  e.preventDefault();
                  handleVerifySpot(item);
                }}
                sx={{
                  minWidth: "auto",
                  px: 2,
                  py: 0.5,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(76, 175, 80, 0.3)",
                  textTransform: "none",
                  backgroundColor: "#4caf50",
                  "&:hover": {
                    backgroundColor: "#45a049",
                    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.4)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                Verify
              </Button>
            </Box>
          );
        }

        // Show only View button for verified spots
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                color: "primary.main",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                },
                transition: "background-color 0.2s ease-in-out",
              }}
              onClick={(e) => {
                e.preventDefault();
                handleViewSpot(item.id);
              }}
            >
              <ViewIcon sx={{ fontSize: 20 }} />
              <Typography variant="body2" fontWeight={500}>View</Typography>
            </Box>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%", p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h2" fontWeight="bold">
          Spot Management
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          size="small"
          label="Search spots..."
          placeholder="Search by title or host name..."
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          sx={{ minWidth: 280 }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Verification Status</InputLabel>
          <Select
            value={filters.status}
            label="Verification Status"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="not_verified">Not Verified</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="verified">Verified</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filters.type}
            label="Type"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, type: e.target.value }))
            }
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="Indoor">Indoor</MenuItem>
            <MenuItem value="Outdoor">Outdoor</MenuItem>
            <MenuItem value="Garage">Garage</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <ReusableTableWrapper
        data={spots}
        columns={columns}
        totalItems={data?.total || 0}
        currentPage={paginationModel.page + 1}
        pageSize={paginationModel.pageSize}
        onPageChange={handlePaginationChange}
        onPageSizeChange={handlePageSizeChange}
        loading={isLoading}
        loadingRows={paginationModel.pageSize}
        emptyMessage="No spots found."
        pageSizeOptions={[5, 10, 25, 50]}
      />
    </Box>
  );
};

export default SpotComponent; 
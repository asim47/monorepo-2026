'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Button, Avatar, Chip, Box, Typography, Alert } from "@mui/material";
import {
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import { SpotData } from "../../interfaces";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { mockSpotsApi } from "@/helpers/mockApi";
import ReusableTableWrapper from "../common/ReusableTableWrapper";
import type { TableColumn } from "../common/ReusableTable";

const fetchPendingSpots = async (searchParams?: {
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
}) => {
  // Fetch with pending status filter
  return mockSpotsApi.fetchSpots({ ...searchParams, status: "pending" });
};

const SpotVerificationComponent: React.FC = () => {
  const navigate = useNavigate();

  // Pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Debounced search state
  const [debouncedFilters, setDebouncedFilters] = useState({
    search: "",
    type: "",
    page: 1,
    limit: 10,
  });

  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // No dialog states needed - using page navigation

  // Fetch pending spots
  const { data, isLoading, error } = useQuery({
    queryKey: ["pending-spots", debouncedFilters],
    queryFn: () => {
      return fetchPendingSpots(debouncedFilters);
    },
  });

  // Handle error
  useEffect(() => {
    if (error) {
      console.error("Error fetching pending spots:", error);
      toast.error("Failed to load pending spots. Please refresh the page.");
    }
  }, [error]);

  // No mutations needed - verification handled on detail page

  // Debounced search + pagination effect
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedFilters({
        ...debouncedFilters,
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      });
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [debouncedFilters, paginationModel]);

  const handlePageChange = (page: number) => {
    setPaginationModel((prev) => ({ ...prev, page: page - 1 }));
  };

  const handlePageSizeChange = (size: number) => {
    setPaginationModel({ page: 0, pageSize: size });
  };

  const handleVerifySpot = (spot: SpotData) => {
    console.log("Spot ID:", spot.id);
    console.log("Current pathname:", window.location.pathname);
    console.log("Navigating to:", `/spots/${spot.id}/verification`);

    navigate(`/spots/${spot.id}/verification`);
  };

  // Use data directly from API (server-side filtering)
  const spots = data?.items || [];

  const columns: TableColumn<SpotData>[] = [
    {
      key: "images",
      header: "Images",
      minWidth: 120,
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
    {
      key: "title",
      header: "Title",
      minWidth: 150,
    },
    {
      key: "hostName",
      header: "Host",
      minWidth: 120,
    },
    {
      key: "type",
      header: "Type",
      minWidth: 100,
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
      minWidth: 100,
      render: (item) => (
        <Typography variant="body2">${item.rate}/hr</Typography>
      ),
    },
    {
      key: "verification_status",
      header: "Status",
      minWidth: 120,
      render: (item) => {
        const status = item.verification_status;
        const color = status === "pending" ? "warning" : "error";
        const label = status === "pending" ? "Pending" : "Not Verified";
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
      render: (item) => (
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
      ),
    },
  ];

  // Removed DataGrid toolbar (not needed with ReusableTableWrapper)

  return (
    <Box sx={{ height: "100%", width: "100%", p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h2" fontWeight="bold">
          Spot Verification
        </Typography>
      </Box>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          This page shows all spots that are pending verification or not yet
          verified. Review the spot details and upload verification images to
          approve or reject spots.
        </Typography>
      </Alert>

      {/* Table */}
      <ReusableTableWrapper
        data={spots}
        columns={columns}
        totalItems={data?.total || 0}
        currentPage={paginationModel.page + 1}
        pageSize={paginationModel.pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={isLoading}
        loadingRows={paginationModel.pageSize}
        emptyMessage="No spots pending verification."
        pageSizeOptions={[5, 10, 25, 50]}
      />

      {/* No dialogs needed - using page navigation instead */}
    </Box>
  );
};

export default SpotVerificationComponent; 
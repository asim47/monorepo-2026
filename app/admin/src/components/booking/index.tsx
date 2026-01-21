'use client';

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { BookingData } from "../../interfaces";
import { useQuery } from "@tanstack/react-query";
import { mockBookingsApi } from "@/helpers/mockApi";
import toast from "react-hot-toast";
import ReusableTableWrapper from "../common/ReusableTableWrapper";
import type { TableColumn } from "../common/ReusableTable";

const fetchBookings = async (searchParams?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) => {
  return mockBookingsApi.fetchBookings(searchParams);
};

const BookingComponent: React.FC = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  // Pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Debounced search state
  const [debouncedFilters, setDebouncedFilters] = useState({
    search: "",
    status: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  });

  // Separate state for search and filter inputs
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [startDateValue, setStartDateValue] = useState("");
  const [endDateValue, setEndDateValue] = useState("");

  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Fetch bookings
  const { data, isLoading, error } = useQuery({
    queryKey: ["bookings", debouncedFilters],
    queryFn: () => {
      return fetchBookings(debouncedFilters);
    },
  });

  // Handle error
  useEffect(() => {
    if (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings. Please refresh the page.");
    }
  }, [error]);

  // Debounced search effect
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedFilters({
        ...filters,
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      });
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filters, paginationModel]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateRangeChange = (
    field: "startDate" | "endDate",
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Update the corresponding input state
    if (field === "startDate") {
      setStartDateValue(value);
    } else {
      setEndDateValue(value);
    }
  };

  const handlePaginationModelChange = (newModel: {
    page: number;
    pageSize: number;
  }) => {
    setPaginationModel(newModel);
    setDebouncedFilters((prev) => ({
      ...prev,
      page: newModel.page + 1,
      limit: newModel.pageSize,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "success";
      case "Completed":
        return "info";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const bookings = data?.items || [];

  const DateRangeFilter = () => (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      {(startDateValue || endDateValue) && (
        <Typography variant="caption" color="primary" sx={{ fontWeight: 500 }}>
          Date Filter Active
        </Typography>
      )}
      <TextField
        label="Start Date"
        type="date"
        size="small"
        value={startDateValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleDateRangeChange("startDate", e.target.value)
        }
        InputLabelProps={{ shrink: true }}
        sx={{
          minWidth: 150,
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
      <Typography variant="body2" color="textSecondary">
        to
      </Typography>
      <TextField
        label="End Date"
        type="date"
        size="small"
        value={endDateValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleDateRangeChange("endDate", e.target.value)
        }
        InputLabelProps={{ shrink: true }}
        sx={{
          minWidth: 150,
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
      {(startDateValue || endDateValue) && (
        <Chip
          label="Clear"
          size="small"
          onClick={() => {
            handleDateRangeChange("startDate", "");
            handleDateRangeChange("endDate", "");
            setStartDateValue("");
            setEndDateValue("");
          }}
          sx={{
            backgroundColor: "#f5f5f5",
            color: "#666",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
        />
      )}
    </Box>
  );

  // Filter configuration for the reusable component
  const filterConfig = {
    search: {
      label: "Search bookings...",
      placeholder: "e.g., 627251, Host name, Spot title...",
    },
    status: {
      label: "Booking Status",
      options: [
        { value: "", label: "All Statuses" },
        { value: "Scheduled", label: "Scheduled" },
        { value: "Completed", label: "Completed" },
        { value: "Cancelled", label: "Cancelled" },
      ],
    },
    custom: <DateRangeFilter />,
  };

  // Columns for table
  const columns: TableColumn<BookingData>[] = [
    {
      key: "bookingNumber",
      header: "Booking #",
      minWidth: 120,
      render: (item) => (
        <Typography
          variant="body2"
          fontFamily="monospace"
          sx={{
            backgroundColor: "#f5f5f5",
            px: 1,
            py: 0.5,
            borderRadius: "4px",
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
        >
          #{item.bookingNumber}
        </Typography>
      ),
    },
    {
      key: "userName",
      header: "User",
      minWidth: 240,
      render: (item) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: "#1976d2" }}
          >
            {item.userName || "N/A"}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ fontSize: "0.75rem" }}
          >
            {item.userEmail || "N/A"}
          </Typography>
        </Box>
      ),
    },
    {
      key: "spotTitle",
      header: "Spot",
      minWidth: 240,
      render: (item) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: "#2e7d32" }}
          >
            {item.spotTitle || "N/A"}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ fontSize: "0.75rem" }}
          >
            {item.spotAddress || "N/A"}
          </Typography>
        </Box>
      ),
    },
    {
      key: "hostName",
      header: "Host",
      minWidth: 140,
      render: (item) => (
        <Typography variant="body2" fontWeight={500} sx={{ color: "#ed6c02" }}>
          {item.hostName || "N/A"}
        </Typography>
      ),
    },
    {
      key: "date",
      header: "Date & Time",
      minWidth: 200,
      render: (item) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="body2" fontWeight={500}>
            {formatDate(item.date)}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ fontSize: "0.75rem" }}
          >
            {formatTime(item.startTime)} - {formatTime(item.endTime)}
          </Typography>
        </Box>
      ),
    },
    {
      key: "noOfCars",
      header: "Cars",
      minWidth: 100,
      align: "center",
      render: (item) => (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Box
            sx={{
              backgroundColor: "#e3f2fd",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #1976d2",
            }}
          >
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ color: "#1976d2" }}
            >
              {item.noOfCars || 0}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      key: "totalAmount",
      header: "Amount",
      minWidth: 140,
      render: (item) => (
        <Typography
          variant="body2"
          fontWeight="bold"
          sx={{
            color: "#2e7d32",
            backgroundColor: "#e8f5e8",
            px: 1,
            py: 0.5,
            borderRadius: "4px",
          }}
        >
          {formatCurrency(item.totalAmount || 0, item.currency || "USD")}
        </Typography>
      ),
    },
    {
      key: "bookingStatus",
      header: "Status",
      minWidth: 140,
      render: (item) => (
        <Chip
          label={item.bookingStatus || "Unknown"}
          color={
            getStatusColor(item.bookingStatus)
          }
          size="small"
          sx={{ fontWeight: 600, fontSize: "0.75rem", height: "24px" }}
        />
      ),
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
          Bookings Management
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
        <TextField
          label={filterConfig.search.label}
          placeholder={filterConfig.search.placeholder}
          size="small"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            handleFilterChange("search", e.target.value);
          }}
          sx={{ minWidth: 300 }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>{filterConfig.status.label}</InputLabel>
          <Select
            value={statusValue}
            label={filterConfig.status.label}
            onChange={(e) => {
              setStatusValue(e.target.value);
              handleFilterChange("status", e.target.value);
            }}
          >
            {filterConfig.status.options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {filterConfig.custom}
      </Box>

      <ReusableTableWrapper
        data={bookings}
        columns={columns}
        totalItems={data?.total || 0}
        currentPage={paginationModel.page + 1}
        pageSize={paginationModel.pageSize}
        onPageChange={(page) =>
          handlePaginationModelChange({
            page: page - 1,
            pageSize: paginationModel.pageSize,
          })
        }
        onPageSizeChange={(size) =>
          handlePaginationModelChange({ page: 0, pageSize: size })
        }
        loading={isLoading}
        loadingRows={paginationModel.pageSize}
        emptyMessage="No bookings found."
        pageSizeOptions={[5, 10, 25, 50]}
      />
    </Box>
  );
};

export default BookingComponent; 
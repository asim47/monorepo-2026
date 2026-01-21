'use client';

import React, { useEffect, useState, useRef } from "react";
import { Button, Box, Typography, TextField } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { EventData, EventFormValues } from "../../interfaces";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockEventsApi } from "@/helpers/mockApi";
import toast from "react-hot-toast";
import ReusableTableWrapper from "../common/ReusableTableWrapper";
import type { TableColumn } from "../common/ReusableTable";
import CreateEventDialog from "./CreateEventDialog";
import ConfirmationDialog from "../common/ConfirmationDialog";
import moment from "moment";

const fetchEvents = async (searchParams?: {
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) => {
  return mockEventsApi.fetchEvents(searchParams);
};

const createEvent = async (eventData: Partial<EventFormValues>) => {
  return mockEventsApi.createEvent(eventData);
};

const updateEvent = async ({
  id,
  ...eventData
}: Partial<EventFormValues> & { id: string }) => {
  return mockEventsApi.updateEvent(id, eventData);
};

const deleteEvent = async (eventId: string) => {
  return mockEventsApi.deleteEvent(eventId);
};

const EventComponent: React.FC = () => {
  const queryClient = useQueryClient();

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
  });

  // Date filter input states
  const [startDateValue, setStartDateValue] = useState("");
  const [endDateValue, setEndDateValue] = useState("");

  // Pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Debounced search state
  const [debouncedFilters, setDebouncedFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  });

  // Separate state for search and filter inputs - these are used in the filter handlers
  // const [searchValue] = useState('');
  // const [startDateValue] = useState('');
  // const [endDateValue] = useState('');

  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [dialogEvent, setDialogEvent] = useState<EventData | null>(null);

  // Fetch events
  const { data, isLoading, error } = useQuery({
    queryKey: ["events", debouncedFilters],
    queryFn: () => {
      return fetchEvents(debouncedFilters);
    },
  });

  // Handle error
  useEffect(() => {
    if (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events. Please refresh the page.");
    }
  }, [error]);

  // Mutations
  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event created successfully!");
    },
    onError: (error) => {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating event:", error);
      toast.error("Failed to update event. Please try again.");
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event. Please try again.");
    },
  });

  // Loading states
  const isCreating = createEventMutation.isPending;
  const isUpdating = updateEventMutation.isPending;
  const isDeleting = deleteEventMutation.isPending;
  const isRefetching =
    createEventMutation.isPending ||
    updateEventMutation.isPending ||
    deleteEventMutation.isPending;

  // Debounced search effect
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedFilters({
        ...filters,
        page: paginationModel.page + 1, // DataGrid uses 0-based indexing, API uses 1-based
        limit: paginationModel.pageSize,
      });
    }, 500); // 500ms delay

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filters, paginationModel]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
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

  const clearDateFilters = () => {
    setFilters((prev) => ({
      ...prev,
      startDate: "",
      endDate: "",
    }));
    setStartDateValue("");
    setEndDateValue("");
  };

  const handleEditEvent = (eventId: string) => {
    const event = data?.items?.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setIsUpdateDialogOpen(true);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    const event = data?.items?.find((e) => e.id === eventId);
    if (event) {
      setDialogEvent(event);
      setIsConfirmDialogOpen(true);
    }
  };

  const handleCreateEvent = () => {
    setIsCreateDialogOpen(true);
  };

  const handleSaveEvent = async (eventData: Partial<EventFormValues>) => {
    await createEventMutation.mutateAsync(eventData);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateEvent = async (eventData: Partial<EventFormValues>) => {
    if (selectedEvent) {
      await updateEventMutation.mutateAsync({
        id: selectedEvent.id,
        ...eventData,
      });
      setIsUpdateDialogOpen(false);
      setSelectedEvent(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (dialogEvent) {
      await deleteEventMutation.mutateAsync(dialogEvent.id);
      setIsConfirmDialogOpen(false);
      setDialogEvent(null);
    }
  };

  // Column definitions for table
  const columns: TableColumn<EventData>[] = [
    {
      key: "title",
      header: "Event Title",
      minWidth: 250,
      render: (item) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            width: "100%",
          }}
        >
          <Typography
            variant="body2"
            fontWeight="600"
            sx={{
              color: "#10B981",
              fontSize: "0.9rem",
              lineHeight: 1.3,
            }}
          >
            {item.title}
          </Typography>
          {item.description && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                fontSize: "0.75rem",
                lineHeight: 1.2,
                opacity: 0.8,
                fontStyle: "italic",
              }}
            >
              {item.description.length > 60
                ? `${item.description.substring(0, 60)}...`
                : item.description}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      key: "location",
      header: "Location",
      minWidth: 180,
      render: (item) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationIcon sx={{ fontSize: 16, color: "#757575" }} />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: "#374151",
            }}
          >
            {item.location}
          </Typography>
        </Box>
      ),
    },
    {
      key: "dateTime",
      header: "Date & Time",
      minWidth: 220,
      render: (item) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "#374151",
              fontSize: "0.85rem",
            }}
          >
            {moment(item.startDate).format("MMM DD, YYYY")}
            {!item.isSingleDate && item.endDate && (
              <span> - {moment(item.endDate).format("MMM DD, YYYY")}</span>
            )}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#757575",
              fontSize: "0.75rem",
              fontWeight: 500,
              backgroundColor: "#f5f5f5",
              padding: "2px 8px",
              borderRadius: "4px",
              display: "inline-block",
            }}
          >
            {moment.utc(item.startTime).format("HH:mm")} -{" "}
            {moment.utc(item.endTime).format("HH:mm")}
          </Typography>
        </Box>
      ),
    },
    {
      key: "createdByName",
      header: "Created By",
      minWidth: 220,
      render: (item) => {
        const creatorName = item.createdByName || "Unknown";
        const creatorEmail = item.createdByEmail || "No email";

        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#374151",
                fontSize: "0.85rem",
              }}
            >
              {creatorName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#757575",
                fontSize: "0.75rem",
                fontFamily: "monospace",
                fontWeight: 500,
              }}
            >
              {creatorEmail}
            </Typography>
          </Box>
        );
      },
    },
    {
      key: "createdAt",
      header: "Created",
      minWidth: 130,
      render: (item) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: "#374151",
              fontSize: "0.85rem",
            }}
          >
            {moment(item.createdAt).format("MMM DD, YYYY")}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#757575",
              fontSize: "0.7rem",
            }}
          >
            {moment(item.createdAt).format("HH:mm")}
          </Typography>
        </Box>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      minWidth: 120,
      render: (item) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            startIcon={<EditIcon sx={{ fontSize: 18, color: "#10B981" }} />}
            onClick={() => handleEditEvent(item.id)}
          >
            Edit
          </Button>
          <Button
            size="small"
            startIcon={<DeleteIcon sx={{ fontSize: 18, color: "#dc2626" }} />}
            onClick={() => handleDeleteEvent(item.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  // Date Range Filter Component
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
        <Button
          size="small"
          onClick={clearDateFilters}
          sx={{
            color: "#757575",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          Clear
        </Button>
      )}
    </Box>
  );

  // Filter configuration
  const filterConfig = {
    search: {
      label: "Search Events",
      placeholder: "Search by event title, location, or description...",
    },
    custom: <DateRangeFilter />,
  };

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
          Event Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateEvent}
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create Event"}
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
        <TextField
          label={filterConfig.search.label}
          placeholder={filterConfig.search.placeholder}
          size="small"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          sx={{ minWidth: 300 }}
        />
        {filterConfig.custom}
      </Box>

      <ReusableTableWrapper
        data={data?.items || []}
        columns={columns}
        totalItems={data?.total || 0}
        currentPage={paginationModel.page + 1}
        pageSize={paginationModel.pageSize}
        onPageChange={(page) =>
          setPaginationModel((p) => ({ ...p, page: page - 1 }))
        }
        onPageSizeChange={(size) =>
          setPaginationModel({ page: 0, pageSize: size })
        }
        loading={isLoading || isRefetching}
        loadingRows={paginationModel.pageSize}
        emptyMessage="No events found."
        pageSizeOptions={[5, 10, 25, 50]}
      />

      {/* Create Event Dialog */}
      <CreateEventDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleSaveEvent}
        mode="create"
        isLoading={isCreating}
      />

      {/* Update Event Dialog */}
      <CreateEventDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => {
          setIsUpdateDialogOpen(false);
          setSelectedEvent(null);
        }}
        onSave={handleUpdateEvent}
        mode="update"
        eventData={selectedEvent}
        isLoading={isUpdating}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onClose={() => {
          setIsConfirmDialogOpen(false);
          setDialogEvent(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Event"
        message={`Are you sure you want to delete the event "${dialogEvent?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        severity="warning"
        loading={isDeleting}
      />
    </Box>
  );
};

export default EventComponent; 
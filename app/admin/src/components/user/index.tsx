'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Avatar,
  Box,
  Typography,
  Tooltip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
  Block as BlockIcon,
  CheckCircle as UnblockIcon,
  Bookmark as BookmarkIcon,
} from "@mui/icons-material";
import {
  UserData,
  UserStatus,
  UserTypes,
  UserFormValues,
} from "../../interfaces";
import CreateUserDialog from "./CreateUserDialog";

import ConfirmationDialog from "../common/ConfirmationDialog";
import BlockUserDialog from "../common/BlockUserDialog";
import StatusChip from "../common/StatusChip";
import ReusableTableWrapper from "../common/ReusableTableWrapper";
import type { TableColumn } from "../common/ReusableTable";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { mockUsersApi } from "@/helpers/mockApi";

const fetchUsers = async (searchParams?: {
  search?: string;
  status?: string;
}) => {
  return mockUsersApi.fetchUsers(searchParams);
};

const createUser = async (userData: Partial<UserFormValues>) => {
  return mockUsersApi.createUser(userData);
};

const updateUser = async ({
  id,
  ...userData
}: Partial<UserFormValues> & { id: string }) => {
  return mockUsersApi.updateUser(id, userData);
};

const blockUser = async ({
  id,
  blockNote,
}: {
  id: string;
  blockNote?: string;
}) => {
  return mockUsersApi.blockUser(id, blockNote);
};

const unblockUser = async ({ id }: { id: string }) => {
  return mockUsersApi.unblockUser(id);
};

interface InternalUserComponentProps {
  userTypeFilter?: UserTypes | null;
}

const InternalUserComponent: React.FC<InternalUserComponentProps> = () => {
  // const { user: currentUser } = useContext(UserContext);
  const queryClient = useQueryClient();

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  // Debounced search state
  const [debouncedFilters, setDebouncedFilters] = useState({
    search: "",
    status: "",
  });

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Search input ref to maintain focus - not currently used
  // const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch users
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", debouncedFilters],
    queryFn: () => {
      return fetchUsers(debouncedFilters);
    },
  });

  // Handle error
  useEffect(() => {
    if (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users. Please refresh the page.");
    }
  }, [error]);

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully!");
    },
    onError: (error) => {
      console.error("Error creating user:", error);
      toast.error("Failed to create user. Please try again.");
    },
  });
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User blocked successfully!");
    },
    onError: (error) => {
      console.error("Error blocking user:", error);
      toast.error("Failed to block user. Please try again.");
    },
  });

  const unblockUserMutation = useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User unblocked successfully!");
    },
    onError: (error) => {
      console.error("Error unblocking user:", error);
      toast.error("Failed to unblock user. Please try again.");
    },
  });

  // Loading states
  const isCreating = createUserMutation.isPending;
  const isUpdating = updateUserMutation.isPending;
  const isBlockUnblockLoading = updateUserMutation.isPending;
  const isBlocking = blockUserMutation.isPending;

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // Confirmation dialog state
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [dialogUser, setDialogUser] = useState<UserData | null>(null);
  const [dialogAction, setDialogAction] = useState<"block" | "unblock">(
    "block"
  );

  // Block user dialog state
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [blockDialogUser, setBlockDialogUser] = useState<UserData | null>(null);

  // Debounce search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filters]);

  const handleEditUser = (userId: string) => {
    const user = data?.items?.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsUpdateDialogOpen(true);
    }
  };

  const handleCreateAdmin = () => {
    setIsCreateDialogOpen(true);
  };

  const handleSaveUser = async (userData: Partial<UserFormValues>) => {
    await createUserMutation.mutateAsync(userData);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateUser = async (userData: Partial<UserFormValues>) => {
    if (selectedUser) {
      await updateUserMutation.mutateAsync({
        id: selectedUser.id,
        ...userData,
      });
      setIsUpdateDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleBlockUnblock = async () => {
    if (!dialogUser) return;

    try {
      if (dialogAction === "unblock") {
        await unblockUserMutation.mutateAsync({
          id: dialogUser.id,
        });
      }
      setIsConfirmDialogOpen(false);
      setDialogUser(null);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleBlockUser = async (blockNote: string) => {
    if (!blockDialogUser) return;

    try {
      await blockUserMutation.mutateAsync({
        id: blockDialogUser.id,
        blockNote: blockNote || undefined,
      });
      setIsBlockDialogOpen(false);
      setBlockDialogUser(null);
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleOpenConfirmDialog = (
    user: UserData,
    action: "block" | "unblock"
  ) => {
    if (action === "block") {
      setBlockDialogUser(user);
      setIsBlockDialogOpen(true);
    } else {
      setDialogUser(user);
      setDialogAction(action);
      setIsConfirmDialogOpen(true);
    }
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
    setDialogUser(null);
  };

  // Debounce filter changes
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Filter configuration for the reusable component
  const filterConfig = {
    search: {
      label: "Search users...",
      placeholder: "Search by name or email...",
    },
    status: {
      label: "User Status",
      options: [
        { value: "", label: "All Status" },
        { value: UserStatus.Active, label: "Active" },
        { value: UserStatus.Inactive, label: "Inactive" },
        { value: UserStatus.Blocked, label: "Blocked" },
      ],
    },
  };

  // Define columns
  const columns: TableColumn<UserData>[] = [
    {
      key: "profilePhoto",
      header: "Profile",
      minWidth: 100,
      render: (item) => (
        <Avatar
          src={item.profilePhoto}
          alt={item.fullName}
          sx={{ width: 40, height: 40 }}
        >
          {item.fullName?.charAt(0)?.toUpperCase()}
        </Avatar>
      ),
    },
    { key: "fullName", header: "Name", minWidth: 200 },
    { key: "email", header: "Email", minWidth: 250 },
    {
      key: "phoneNumber",
      header: "Phone",
      minWidth: 180,
      render: (item) => (
        <Typography variant="body2" color="text.secondary">
          {item.phoneNumber || "N/A"}
        </Typography>
      ),
    },
    {
      key: "status",
      header: "Status",
      minWidth: 140,
      render: (item) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <StatusChip status={item.status} />
          {item.isBlocked && item.blockNote && (
            <Tooltip title={item.blockNote} arrow>
              <BookmarkIcon
                sx={{ color: "error.main", fontSize: 16, cursor: "help" }}
              />
            </Tooltip>
          )}
        </Box>
      ),
    },
    // {
    //   key: "type",
    //   header: "Type",
    //   minWidth: 140,
    //   render: (item) => <StatusChip status={(item).type} />,
    // },
    {
      key: "createdAt",
      header: "Created",
      minWidth: 180,
      render: (item) => {
        const value = item.createdAt as string | null;
        if (!value) return <Typography variant="body2">N/A</Typography>;
        let formatted = "Invalid Date";
        try {
          formatted = new Date(value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        } catch {
          // Ignore invalid dates
        }
        return <Typography variant="body2">{formatted}</Typography>;
      },
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (user) => (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          {/* <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              handleEditUser(user.id);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton> */}
          <Button
            variant="text"
            size="small"
            startIcon={<EditIcon sx={{ fontSize: 18 }} />}
            onClick={(e) => {
              e.preventDefault();
              handleEditUser(user.id);
            }}
          >
            Edit
          </Button>
          {user.isBlocked ? (
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<UnblockIcon sx={{ fontSize: 18 }} />}
              onClick={(e) => {
                e.preventDefault();
                handleOpenConfirmDialog(user, "unblock");
              }}
              sx={{
                minWidth: "auto",
                px: 1.25,
                py: 0.25,
                fontSize: "0.75rem",
                fontWeight: 600,
                borderRadius: 1.5,
                boxShadow: "none",
                textTransform: "none",
              }}
            >
              Unblock
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<BlockIcon sx={{ fontSize: 18 }} />}
              onClick={(e) => {
                e.preventDefault();
                handleOpenConfirmDialog(user, "block");
              }}
              sx={{
                minWidth: "auto",
                px: 1.25,
                py: 0.25,
                fontSize: "0.75rem",
                fontWeight: 600,
                borderRadius: 1.5,
                boxShadow: "none",
                textTransform: "none",
              }}
            >
              Block
            </Button>
          )}
        </Box>
      ),
    },
  ];

  // client-side pagination over server-filtered results
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const users = data?.items || [];
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, currentPage, pageSize]);

  return (
    <Box sx={{ height: "100%", width: "100%", p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" component="h2" fontWeight="bold">
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and monitor all user accounts. Search by name, email, or
            phone number.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleCreateAdmin}
          disabled={isCreating}
          sx={{
            color: "white",
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          {isCreating ? "Creating..." : "Create User"}
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label={filterConfig.search.label}
          placeholder={filterConfig.search.placeholder}
          size="small"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          sx={{ minWidth: 300 }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>{filterConfig.status.label}</InputLabel>
          <Select
            value={filters.status}
            label={filterConfig.status.label}
            onChange={(e) =>
              handleFilterChange("status", e.target.value)
            }
          >
            {filterConfig.status.options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <ReusableTableWrapper
        data={paginatedRows}
        columns={columns}
        totalItems={users.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        loading={isLoading}
        loadingRows={pageSize}
        emptyMessage="No users found."
        pageSizeOptions={[5, 10, 25, 50]}
      />

      {/* Create User Dialog */}
      <CreateUserDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleSaveUser}
        mode="create"
        isLoading={isCreating}
      />

      {/* Update User Dialog */}
      <CreateUserDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => {
          setIsUpdateDialogOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleUpdateUser}
        mode="update"
        userData={selectedUser || undefined}
        isLoading={isUpdating}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleBlockUnblock}
        title={dialogAction === "block" ? "Block User" : "Unblock User"}
        message={`Are you sure you want to ${dialogAction} ${
          dialogUser?.fullName
        }? ${
          dialogAction === "block"
            ? "This user will not be able to access the system until unblocked."
            : "This user will regain access to the system."
        }`}
        confirmText={dialogAction === "block" ? "Block" : "Unblock"}
        severity={dialogAction === "block" ? "warning" : "success"}
        loading={isBlockUnblockLoading}
      />

      {/* Block User Dialog */}
      <BlockUserDialog
        open={isBlockDialogOpen}
        onClose={() => {
          setIsBlockDialogOpen(false);
          setBlockDialogUser(null);
        }}
        onConfirm={handleBlockUser}
        userName={blockDialogUser?.fullName || ""}
        loading={isBlocking}
      />
    </Box>
  );
};

export default InternalUserComponent;

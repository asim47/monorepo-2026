'use client';

import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Button,
  Avatar,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import {
  AdminData,
  AdminFormValues,
  AdminRole,
  AdminCreateResponse,
} from "../../interfaces";
import CreateAdminDialog from "./CreateAdminDialog";
import PasswordDisplayDialog from "./PasswordDisplayDialog";
import ReusableTableWrapper from "../common/ReusableTableWrapper";
import type { TableColumn } from "../common/ReusableTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { mockAdminsApi } from "@/helpers/mockApi";

const fetchAdmins = async (searchParams?: {
  search?: string;
  role?: string;
}) => {
  return mockAdminsApi.fetchAdmins(searchParams);
};

const createAdmin = async (
  adminData: Partial<AdminFormValues>
): Promise<AdminCreateResponse> => {
  return mockAdminsApi.createAdmin(adminData);
};

const updateAdmin = async ({
  id,
  ...adminData
}: Partial<AdminFormValues> & { id: string }) => {
  return mockAdminsApi.updateAdmin(id, adminData);
};

const resetAdminPassword = async (
  adminId: string
): Promise<AdminCreateResponse> => {
  return mockAdminsApi.resetPassword(adminId);
};

interface AdminComponentProps {
  userTypeFilter?: unknown; // Keeping for backward compatibility but not using
}

const AdminComponent: React.FC<AdminComponentProps> = () => {
  const queryClient = useQueryClient();

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    role: "",
  });

  // Debounced search state
  const [debouncedFilters, setDebouncedFilters] = useState({
    search: "",
    role: "",
  });
  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Fetch admins
  const { data, isLoading, error } = useQuery({
    queryKey: ["admins", debouncedFilters],
    queryFn: () => {
      return fetchAdmins(debouncedFilters);
    },
  });

  // Handle error
  useEffect(() => {
    if (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to load admins. Please refresh the page.");
    }
  }, [error]);

  // Mutations
  const createAdminMutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: (response: AdminCreateResponse) => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      // Check if response contains password
      if (response?.data?.password) {
        setPasswordData({
          password: response.data.password,
          title: "Admin Created Successfully",
          message:
            "A new admin account has been created with the following password:",
          adminEmail: response.data.email,
        });
        setIsPasswordDialogOpen(true);
      } else {
        toast.success("Admin created successfully!");
      }
    },
    onError: (error) => {
      console.error("Error creating admin:", error);
      toast.error("Failed to create admin. Please try again.");
    },
  });

  const updateAdminMutation = useMutation({
    mutationFn: updateAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error) => {
      console.error("Error updating admin:", error);
      toast.error("Failed to update admin. Please try again.");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetAdminPassword,
    onSuccess: (response: AdminCreateResponse, adminId) => {
      const admin = data?.items.find((a: AdminData) => a.id === adminId);

      // Check if response contains password
      if (response?.data?.password) {
        setPasswordData({
          password: response.data.password,
          title: "Password Reset Successfully",
          message:
            "The admin password has been reset. Here is the new password:",
          adminEmail: admin?.email,
        });
        setIsPasswordDialogOpen(true);
      } else {
        toast.success(
          `Password reset successfully! New password has been sent to ${admin?.email}`
        );
      }
    },
    onError: (error) => {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password. Please try again.");
    },
  });

  // Loading states
  const isCreating = createAdminMutation.isPending;
  const isUpdating = updateAdminMutation.isPending;
  const isResetPasswordLoading = resetPasswordMutation.isPending;

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminData | null>(null);

  // Confirmation dialog state
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [dialogAdmin, setDialogAdmin] = useState<AdminData | null>(null);

  // Password display dialog state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState<{
    password: string;
    title: string;
    message: string;
    adminEmail?: string;
  } | null>(null);

  const handleEditAdmin = (adminId: string) => {
    const admin = data?.items.find((a: AdminData) => a.id === adminId);
    if (admin) {
      setSelectedAdmin(admin);
      setIsUpdateDialogOpen(true);
    }
  };

  const handleCreateAdmin = () => {
    setIsCreateDialogOpen(true);
  };

  const handleSaveAdmin = async (adminData: Partial<AdminFormValues>) => {
    const response = await createAdminMutation.mutateAsync(adminData);
    setIsCreateDialogOpen(false);
    return response;
  };

  const handleUpdateAdmin = async (adminData: Partial<AdminFormValues>) => {
    if (selectedAdmin) {
      const response = await updateAdminMutation.mutateAsync({
        ...adminData,
        id: selectedAdmin.id,
      });
      setIsUpdateDialogOpen(false);
      setSelectedAdmin(null);
      return response;
    }
  };

  const handleResetPassword = async () => {
    if (!dialogAdmin) return;

    try {
      await resetPasswordMutation.mutateAsync(dialogAdmin.id);
      handleCloseConfirmDialog();
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  const handleOpenConfirmDialog = (admin: AdminData) => {
    setDialogAdmin(admin);
    setIsConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
    setDialogAdmin(null);
  };

  const handleClosePasswordDialog = () => {
    setIsPasswordDialogOpen(false);
    setPasswordData(null);
  };

  // Debounced search effect
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500); // 500ms delay

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Use data directly from API (server-side filtering)
  const admins = useMemo(() => data?.items || [], [data?.items]);

  const columns: TableColumn<AdminData>[] = [
    {
      key: "profilePhoto",
      header: "Profile",
      minWidth: 100,
      render: (item) => (
        <Avatar
          src={item.profilePhoto}
          alt={item.name}
          sx={{ width: 40, height: 40 }}
        >
          {item.name?.charAt(0)}
        </Avatar>
      ),
    },
    { key: "name", header: "Name", minWidth: 200 },
    { key: "email", header: "Email", minWidth: 250 },
    {
      key: "role",
      header: "Role",
      minWidth: 150,
      render: (item) => (
        <Chip
          label={item.role}
          color={
            item.role === AdminRole.Admin
              ? "primary"
              : item.role === AdminRole.SubAdmin
              ? "secondary"
              : "default"
          }
          sx={{
            color: "white",
          }}
          size="small"
          variant="filled"
        />
      ),
    },
    {
      key: "resetPassword",
      header: "Reset Password",
      minWidth: 180,
      align: "center",
      render: (item) => (
        <Button
          variant="outlined"
          size="small"
          onClick={(e) => {
            e.preventDefault();
            handleOpenConfirmDialog(item);
          }}
          color="secondary"
          sx={{ minWidth: "auto", px: 2, py: 0.5, fontSize: "0.75rem" }}
        >
          Reset Password
        </Button>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      minWidth: 120,
      align: "center",
      render: (item) => (
        <Button
          variant="contained"
          color="success"
          size="small"
          startIcon={<EditIcon sx={{ fontSize: 18 }} />}
          onClick={(e) => {
            e.preventDefault();
            handleEditAdmin(item.id);
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
          Edit
        </Button>
      ),
    },
  ];

  // Filter configuration for the reusable component
  const filterConfig = {
    search: {
      label: "Search admins...",
      placeholder: "Search by name or email...",
    },
    status: {
      label: "Admin Role",
      options: [
        { value: "", label: "All Roles" },
        { value: "admin", label: "Admin" },
        { value: "subAdmin", label: "Sub-Admin" },
      ],
    },
  };

  // client-side pagination for current result set
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return admins.slice(start, start + pageSize);
  }, [admins, currentPage, pageSize]);

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
        <Typography variant="h5" component="h2" fontWeight="bold">
          Admin Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={(e) => {
            e.preventDefault();
            handleCreateAdmin();
          }}
          disabled={isCreating}
          sx={{
            color: "white",
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          {isCreating ? "Creating..." : "Create Admin"}
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
            value={filters.role}
            label={filterConfig.status.label}
            onChange={(e) =>
              handleFilterChange("role", e.target.value)
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
        totalItems={admins.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        loading={isLoading}
        loadingRows={pageSize}
        emptyMessage="No admins found."
        pageSizeOptions={[5, 10, 25, 50]}
      />

      {/* Dialogs */}
      <CreateAdminDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleSaveAdmin}
        mode="create"
        isLoading={isCreating}
      />

      <CreateAdminDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => {
          setIsUpdateDialogOpen(false);
          setSelectedAdmin(null);
        }}
        onSave={handleUpdateAdmin}
        onResetPassword={(adminId: string) =>
          resetPasswordMutation.mutateAsync(adminId)
        }
        mode="update"
        adminData={selectedAdmin || undefined}
        isLoading={isUpdating}
      />

      {/* Confirmation Dialog */}
      <Dialog
        open={isConfirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Reset Admin Password</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to reset the password for{" "}
            <strong>{dialogAdmin?.name}</strong>?
            <br />
            <br />A new password will be generated and sent to{" "}
            <strong>{dialogAdmin?.email}</strong>.
            <br />
            <br />
            <strong>Note:</strong> The admin will need to use this new password
            to log in.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleCloseConfirmDialog();
            }}
            color="primary"
            disabled={isResetPasswordLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleResetPassword();
            }}
            color="secondary"
            variant="contained"
            disabled={isResetPasswordLoading}
          >
            {isResetPasswordLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Display Dialog */}
      {passwordData && (
        <PasswordDisplayDialog
          isOpen={isPasswordDialogOpen}
          onClose={handleClosePasswordDialog}
          password={passwordData.password}
          title={passwordData.title}
          message={passwordData.message}
          adminEmail={passwordData.adminEmail}
        />
      )}
    </Box>
  );
};

export default AdminComponent;
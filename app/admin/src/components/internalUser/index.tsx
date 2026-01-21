'use client';

import React, { useEffect, useState } from 'react';
import {
  DataGrid,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  GridToolbarContainer,
  GridColDef,
  GridActionsCellItem,
  type GridRenderCellParams,
  type GridRowParams,
} from '@mui/x-data-grid';
import {
  Button,
  Avatar,
  Chip,
  Box,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
  Block as BlockIcon,
  CheckCircle as UnblockIcon,
  Bookmark as BookmarkIcon,
} from '@mui/icons-material';
import { UserData, UserStatus, UserTypes, UserFormValues } from '../../interfaces';
import CreateUserDialog from '../user/CreateUserDialog';
import BlockUserDialog from '../common/BlockUserDialog';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockUsersApi } from '@/helpers/mockApi';
import toast from 'react-hot-toast';

const fetchUsers = async () => {
  return mockUsersApi.fetchUsers();
};

const createUser = async (userData: Partial<UserFormValues>) => {
  return mockUsersApi.createUser(userData);
};

const updateUser = async ({ id, ...userData }: Partial<UserFormValues> & { id: string }) => {
  return mockUsersApi.updateUser(id, userData);
};

const blockUser = async ({ id, blockNote }: { id: string; blockNote?: string }) => {
  return mockUsersApi.blockUser(id, blockNote);
};

const unblockUser = async ({ id }: { id: string }) => {
  return mockUsersApi.unblockUser(id);
};

interface InternalUserComponentProps {
  userTypeFilter?: UserTypes | null;
}

const InternalUserComponent: React.FC<InternalUserComponentProps> = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  useEffect(() => {
    if (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users. Please refresh the page.');
    }
  }, [error]);

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully!');
    },
    onError: (error) => {
      console.error('Error creating user:', error);
      toast.error('Failed to create user. Please try again.');
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      toast.error('Failed to update user. Please try again.');
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User blocked successfully!');
    },
    onError: (error) => {
      console.error('Error blocking user:', error);
      toast.error('Failed to block user. Please try again.');
    },
  });

  const unblockUserMutation = useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User unblocked successfully!');
    },
    onError: (error) => {
      console.error('Error unblocking user:', error);
      toast.error('Failed to unblock user. Please try again.');
    },
  });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [dialogUser, setDialogUser] = useState<UserData | null>(null);
  const [dialogAction, setDialogAction] = useState<'block' | 'unblock'>('block');
  
  // Block user dialog state
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [blockDialogUser, setBlockDialogUser] = useState<UserData | null>(null);

  const handleEditUser = (userId: string) => {
    const user = data?.items.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsUpdateDialogOpen(true);
    }
  };

  const handleSaveUser = async (userData: Partial<UserFormValues>) => {
    const response = await createUserMutation.mutateAsync(userData);
    setIsCreateDialogOpen(false);
    return response;
  };

  const handleUpdateUser = async (userData: Partial<UserFormValues>) => {
    if (selectedUser) {
      const response = await updateUserMutation.mutateAsync({ ...userData, id: selectedUser.id });
      setIsUpdateDialogOpen(false);
      setSelectedUser(null);
      return response;
    }
  };

  const handleBlockUnblock = () => {
    if (!dialogUser) return;
    const isBlocked = dialogUser.status === UserStatus.Blocked || dialogUser.isBlocked;
    
    if (isBlocked) {
      // Unblock user
      unblockUserMutation.mutate(
        { id: dialogUser.id },
        {
          onSuccess: () => toast.success('User unblocked successfully!'),
        }
      );
    }

    setIsConfirmDialogOpen(false);
    setDialogUser(null);
  };

  const handleBlockUser = async (blockNote: string) => {
    if (!blockDialogUser) return;

    try {
      await blockUserMutation.mutateAsync({ 
        id: blockDialogUser.id, 
        blockNote: blockNote || undefined
      });
      setIsBlockDialogOpen(false);
      setBlockDialogUser(null);
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleOpenConfirmDialog = (user: UserData, action: 'block' | 'unblock') => {
    if (action === 'block') {
      setBlockDialogUser(user);
      setIsBlockDialogOpen(true);
    } else {
      setDialogUser(user);
      setDialogAction(action);
      setIsConfirmDialogOpen(true);
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.Active:
        return 'success';
      case UserStatus.Inactive:
        return 'warning';
      case UserStatus.Blocked:
        return 'error';
      default:
        return 'default';
    }
  };

  // const getUserTypeColor = (type: UserTypes) => {
  //   switch (type) {
  //     case UserTypes.SuperAdmin:
  //       return 'error';
  //     case UserTypes.Admin:
  //       return 'primary';
  //     case UserTypes.Customer:
  //       return 'success';
  //     case UserTypes.User:
  //       return 'default';
  //     default:
  //       return 'default';
  //   }
  // };

  const columns: GridColDef<UserData>[] = [
    {
      field: 'profilePhoto',
      headerName: 'Profile',
      width: 80,
      renderCell: (params: GridRenderCellParams<UserData, string>) => (
        <Avatar src={params.value} alt={params.row.fullName} sx={{ width: 40, height: 40 }}>
          {params.row.fullName.charAt(0)}
        </Avatar>
      ),
      sortable: false,
      filterable: false,
    },
    { field: 'fullName', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams<UserData, UserStatus>) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={params.value}
            color={getStatusColor(params.value)}
            size="small"
          />
          {params.row.isBlocked && params.row.blockNote && (
            <Tooltip title={params.row.blockNote} arrow>
              <BookmarkIcon 
                sx={{ 
                  color: 'error.main', 
                  fontSize: 16,
                  cursor: 'help'
                }} 
              />
            </Tooltip>
          )}
        </Box>
      ),
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone',
      width: 150,
      renderCell: (params: GridRenderCellParams<UserData, string>) => (
        <Typography variant="body2" color="text.secondary">
          {params.value || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params: GridRowParams<UserData>) => {
        const user = params.row;
        const isBlocked = user.isBlocked;
        return [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEditUser(user.id)}
          />,
          <GridActionsCellItem
            key="block-unblock"
            icon={isBlocked ? <UnblockIcon /> : <BlockIcon />}
            label={isBlocked ? 'Unblock' : 'Block'}
            onClick={() => handleOpenConfirmDialog(user, isBlocked ? 'unblock' : 'block')}
          />,
        ];
      },
    },
  ];

  const displayedUsers = data?.items || []

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          User List
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
          disabled={createUserMutation.isPending}
        >
          {createUserMutation.isPending ? 'Creating...' : 'Create User'}
        </Button>
      </Box>

      <DataGrid
        rows={displayedUsers}
        columns={columns}
        getRowId={(row: UserData) => row.id}
        getRowHeight={() => 80}
        loading={isLoading}
        paginationModel={{ pageSize: 10, page: 0 }}
        pageSizeOptions={[5, 10, 25, 50]}
        checkboxSelection
        disableRowSelectionOnClick
        slots={{
          toolbar: () => (
            <GridToolbarContainer>
              <GridToolbarQuickFilter />
              <GridToolbarFilterButton />
              <GridToolbarExport />
            </GridToolbarContainer>
          ),
        }}
        sx={{
          height: 600,
          backgroundColor: '#fff',
          '& .MuiDataGrid-row:nth-of-type(even)': {
            backgroundColor: '#f9f9f9',
          },
        }}
      />

      <CreateUserDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleSaveUser}
        mode="create"
        isLoading={createUserMutation.isPending}
      />

      <CreateUserDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => {
          setIsUpdateDialogOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleUpdateUser}
        userData={selectedUser || undefined}
        mode="update"
        isLoading={updateUserMutation.isPending}
      />

      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleBlockUnblock}
        title={dialogAction === 'block' ? 'Block User' : 'Unblock User'}
        message={`Are you sure you want to ${dialogAction} ${dialogUser?.fullName}? ${
          dialogAction === 'block' 
            ? 'This user will not be able to access the system until unblocked.'
            : 'This user will regain access to the system.'
        }`}
        confirmText={dialogAction === 'block' ? 'Block' : 'Unblock'}
        severity={dialogAction === 'block' ? 'warning' : 'success'}
        loading={unblockUserMutation.isPending}
      />

      {/* Block User Dialog */}
      <BlockUserDialog
        open={isBlockDialogOpen}
        onClose={() => {
          setIsBlockDialogOpen(false);
          setBlockDialogUser(null);
        }}
        onConfirm={handleBlockUser}
        userName={blockDialogUser?.fullName || ''}
        loading={blockUserMutation.isPending}
      />
    </Box>
  );
};

export default InternalUserComponent;

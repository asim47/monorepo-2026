'use client';

import React from 'react';
import { Box, Breadcrumbs, Container, Divider, Paper, Typography } from '@mui/material';
import { Home as HomeIcon, UserCog as UserCogIcon, Users as UsersIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import DashboardLayout from '@/common/dashboardLayout';

interface InternalUsersLayoutProps {
  children: React.ReactNode;
}

const InternalUsersLayout: React.FC<InternalUsersLayoutProps> = ({ children }) => {
  const breadcrumbItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: <HomeIcon size={16} />,
    },
    {
      label: 'User Management',
      href: '/user-management',
      icon: <UsersIcon size={16} />,
    },
    {
      label: 'Internal Users',
      href: '/user-management/internal-users',
      icon: <UserCogIcon size={16} />,
      current: true,
    },
  ];

  return (
    <DashboardLayout>
      <Container maxWidth={false} sx={{ py: 3, px: 0 }}>
        {/* Breadcrumbs */}
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
              '& .MuiBreadcrumbs-ol': {
                alignItems: 'center',
              },
            }}
          >
            {breadcrumbItems.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {item.icon}
                {item.current ? (
                  <Typography
                    color="text.primary"
                    sx={{
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {item.label}
                  </Typography>
                ) : (
                  <Link
                    to={item.href}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </Box>
            ))}
          </Breadcrumbs>
        </Box>

        {/* Page Header */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: 3,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <UserCogIcon size={24} />
            </Box>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Internal Users
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage internal users, administrators, and system access
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            View and manage all internal users including administrators, engineers, agents, and brokerage
            administrators. You can create new users, edit existing ones, and manage their permissions and
            status.
          </Typography>
        </Paper>

        {/* Main Content */}
        <Box
          sx={{
            minHeight: 'calc(100vh - 300px)',
            backgroundColor: 'background.default',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {children}
        </Box>
      </Container>
    </DashboardLayout>
  );
};

export default InternalUsersLayout;


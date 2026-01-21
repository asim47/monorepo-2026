import UserComponent from '@/components/user';
import DashboardLayout from '@/common/dashboardLayout';
import React from 'react';

const UsersPage = () => {
  return (
    <DashboardLayout>
      <UserComponent userTypeFilter={null} />
    </DashboardLayout>
  );
};

export default UsersPage; 
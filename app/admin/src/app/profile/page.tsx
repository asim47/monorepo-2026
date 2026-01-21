import ProfileComponent from '@/components/profile';
import DashboardLayout from '@/common/dashboardLayout';
import React from 'react';

const ProfilePage = () => {
  return (
    <DashboardLayout>
      <ProfileComponent />
    </DashboardLayout>
  );
};

export default ProfilePage;
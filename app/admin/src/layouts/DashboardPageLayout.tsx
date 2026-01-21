import React from 'react';

import DashboardLayout from '@/common/dashboardLayout';

interface DashboardPageLayoutProps {
  children: React.ReactNode;
}

export function DashboardPageLayout({ children }: DashboardPageLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}


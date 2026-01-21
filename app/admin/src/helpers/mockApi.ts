/**
 * Mock API functions for template/development
 * Replace these with real API calls when integrating with backend
 */

import {
  MOCK_USERS,
  MOCK_ADMINS,
  MOCK_DASHBOARD_STATS,
  filterMockData,
} from "./mockData";

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Users API
export const mockUsersApi = {
  fetchUsers: async (params?: { search?: string; status?: string }) => {
    await delay();
    let users = [...MOCK_USERS];
    
    if (params?.search) {
      users = filterMockData(users, params.search, ['fullName', 'email']);
    }
    
    if (params?.status) {
      users = users.filter(u => u.status === params.status);
    }
    
    return { items: users, total: users.length };
  },
  
  createUser: async (userData: any) => {
    await delay();
    console.log("Mock: Creating user", userData);
    return { success: true };
  },
  
  updateUser: async (id: string, userData: any) => {
    await delay();
    console.log("Mock: Updating user", id, userData);
    return { success: true };
  },
  
  blockUser: async (id: string, blockNote?: string) => {
    await delay();
    console.log("Mock: Blocking user", id, blockNote);
    return { success: true };
  },
  
  unblockUser: async (id: string) => {
    await delay();
    console.log("Mock: Unblocking user", id);
    return { success: true };
  },
};

// Admins API
export const mockAdminsApi = {
  fetchAdmins: async (params?: { search?: string; role?: string }) => {
    await delay();
    let admins = [...MOCK_ADMINS];
    
    if (params?.search) {
      admins = filterMockData(admins, params.search, ['name', 'email']);
    }
    
    if (params?.role) {
      admins = admins.filter(a => a.role === params.role);
    }
    
    return { items: admins, total: admins.length };
  },
  
  createAdmin: async (adminData: any) => {
    await delay();
    console.log("Mock: Creating admin", adminData);
    return {
      data: {
        email: adminData.email,
        message: "Admin created successfully",
        password: "TempPass123!",
      },
    };
  },
  
  updateAdmin: async (id: string, adminData: any) => {
    await delay();
    console.log("Mock: Updating admin", id, adminData);
    return { success: true };
  },
  
  resetPassword: async (id: string) => {
    await delay();
    console.log("Mock: Resetting admin password", id);
    return {
      data: {
        email: "admin@example.com",
        message: "Password reset successfully",
        password: "NewPass123!",
      },
    };
  },
};

// Dashboard API
export const mockDashboardApi = {
  getStats: async () => {
    await delay();
    return { data: MOCK_DASHBOARD_STATS };
  },
};

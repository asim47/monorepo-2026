import {
  UserData,
  AdminData,
  DashboardStats,
  UserStatus,
  AdminRole,
  UserTypes,
} from "@/interfaces";

// Mock Users
export const MOCK_USERS: UserData[] = [
  {
    id: "1",
    fullName: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1234567890",
    status: UserStatus.Active,
    profilePhoto: "/images/defaultAvatar.png",
    isBlocked: false,
    createdAt: new Date("2024-01-15").toISOString(),
    types: [UserTypes.Customer],
  },
  {
    id: "2",
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    phoneNumber: "+1234567891",
    status: UserStatus.Active,
    profilePhoto: "/images/defaultAvatar.png",
    isBlocked: false,
    createdAt: new Date("2024-02-20").toISOString(),
    types: [UserTypes.Customer],
  },
  {
    id: "3",
    fullName: "Bob Johnson",
    email: "bob.johnson@example.com",
    phoneNumber: "+1234567892",
    status: UserStatus.Blocked,
    profilePhoto: "/images/defaultAvatar.png",
    isBlocked: true,
    blockNote: "Suspicious activity detected",
    createdAt: new Date("2024-03-10").toISOString(),
    types: [UserTypes.Customer],
  },
];

// Mock Admins
export const MOCK_ADMINS: AdminData[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: AdminRole.Admin,
    status: UserStatus.Active,
    fullName: "Admin User",
    phoneNumber: "+1234567890",
    profilePhoto: "/images/defaultAvatar.png",
    createdAt: new Date("2024-01-01").toISOString(),
    types: [UserTypes.Admin],
  },
  {
    id: "2",
    name: "Sub Admin",
    email: "subadmin@example.com",
    role: AdminRole.SubAdmin,
    status: UserStatus.Active,
    fullName: "Sub Admin",
    phoneNumber: "+1234567891",
    profilePhoto: "/images/defaultAvatar.png",
    createdAt: new Date("2024-01-15").toISOString(),
    types: [UserTypes.Admin],
  },
];

// Mock Dashboard Stats
export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalUsers: 1247,
  currentMonthBookings: 89,
  newSpotsThisMonth: 23,
  currentMonthRevenue: 12450,
  spotTypeDistribution: [
    { name: "Indoor", value: 45, color: "#10B981" },
    { name: "Outdoor", value: 35, color: "#3B82F6" },
    { name: "Garage", value: 20, color: "#F59E0B" },
  ],
  topSpots: [
    {
      id: "1",
      name: "Downtown Parking",
      bookings: 156,
      revenue: 2340,
      rating: 4.8,
    },
    {
      id: "2",
      name: "Airport Parking",
      bookings: 134,
      revenue: 2010,
      rating: 4.6,
    },
    {
      id: "3",
      name: "City Center Garage",
      bookings: 98,
      revenue: 1470,
      rating: 4.9,
    },
  ],
  revenueTrend: [
    { month: "Jan", revenue: 8500, bookings: 67 },
    { month: "Feb", revenue: 9200, bookings: 73 },
    { month: "Mar", revenue: 10100, bookings: 81 },
    { month: "Apr", revenue: 11300, bookings: 89 },
    { month: "May", revenue: 10800, bookings: 85 },
    { month: "Jun", revenue: 12450, bookings: 98 },
  ],
  weeklyPerformance: [
    { day: "Mon", bookings: 12, revenue: 1800 },
    { day: "Tue", bookings: 15, revenue: 2250 },
    { day: "Wed", bookings: 18, revenue: 2700 },
    { day: "Thu", bookings: 14, revenue: 2100 },
    { day: "Fri", bookings: 22, revenue: 3300 },
    { day: "Sat", bookings: 25, revenue: 3750 },
    { day: "Sun", bookings: 20, revenue: 3000 },
  ],
};

// Helper function to simulate paginated API response
export function getMockPaginatedData<T>(
  data: T[],
  page: number = 1,
  limit: number = 10
) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    items: data.slice(startIndex, endIndex),
    total: data.length,
  };
}

// Helper function to simulate search/filter
export function filterMockData<T extends Record<string, any>>(
  data: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] {
  if (!searchTerm) return data;
  
  const lowerSearch = searchTerm.toLowerCase();
  return data.filter((item) =>
    searchFields.some((field) =>
      String(item[field]).toLowerCase().includes(lowerSearch)
    )
  );
}

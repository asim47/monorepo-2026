

export interface GenericData<T> {
	data: T;
}

export interface GenericListData<T> {
	data: {
		items: T;
		total: number;
	};
}

export interface AuthSuccessResponse {
	accessToken: string;
	refreshToken: string;
}

export interface UserData {
  id: string;
  status: UserStatus;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePhoto: string;
  isBlocked?: boolean;
  blockNote?: string;
  createdAt: string;
  types: UserTypes[];
}

export interface AdminData extends UserData {
	name: string;
	role: AdminRole;
}

export interface AdminCreateResponse {
	data: {
		email: string;
		message: string;
		password: string;
	};
}

export type UserFormValues = {
	id?: string;
	fullName: string;
	email: string;
	phoneNumber: string;
	status: UserStatus;
	profilePhoto: string;
	isBlocked: boolean;
	blockNote?: string;
};

export type AdminFormValues = {
	id?: string;
	name: string;
	email: string;
	role: AdminRole;
	profilePhoto: string;
};

export interface NavigationItem {
	id: string;
	title: string;
	href?: string;
	icon?: React.ComponentType<{ className?: string }>;
	children?: NavigationItem[];
	isExpanded?: boolean;
	permission?: string;
}

export interface SidebarProps {
	isCollapsed?: boolean;
	onToggle?: () => void;
}

export enum UserStatus {
	Active = 'Active',
	Inactive = 'Inactive',
	Blocked = 'Blocked',
}

export enum AdminRole {
	Admin = 'Admin',
	SubAdmin = 'SubAdmin',
}

export enum UserTypes {
	SuperAdmin = 'SuperAdmin',
	Admin = 'Admin',
	Customer = 'Customer',
	User = 'User',
	Engineer = 'Engineer',
	Agent = 'Agent',
	BrokerageAdmin = 'BrokerageAdmin',
}

export interface SpotData {
	id: string;
	title: string;
	type: 'Indoor' | 'Outdoor' | 'Garage';
	numberOfCars: string;
	startTime: string;
	endTime: string;
	images: string[];
	address: string;
	description: string;
	rules: string;
	features: string[];
	timeSlotType: 'Daily' | 'Weekdays' | 'Custom';
	lat: number;
	long: number;
	rate: number;
	lateFee: number;
	cancellationPolicy: 'Flexible' | 'Moderate' | 'Strict';
	hostName: string;
	verification_status: 'not_verified' | 'pending' | 'verified';
}

export interface SpotDetailData extends SpotData {
	hostEmail: string;
	hourlyRate: number;
	verification_images?: string[];
}

export interface SpotVerificationData {
	images: string[];
}

export type SpotFormValues = {
	title: string;
	address: string;
	type: 'Indoor' | 'Outdoor' | 'Garage';
	numberOfCars: number;
	description: string;
	rules: string;
	features: string[];
	timeSlotType: 'Daily' | 'Weekdays' | 'Custom';
	startTime: string | null;
	endTime: string | null;
	customSchedule: Array<{
		day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
		startTime: string;
		endTime: string;
	}> | null;
	rate: number;
	lateFee: number | null;
	cancellationPolicy: 'Flexible' | 'Moderate' | 'Strict';
	lat: number;
	long: number;
	images: string[];
};

export interface BookingData {
  id: string;
  bookingNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  noOfCars: number;
  noteForHost?: string;
  userName: string;
  bookingStatus: string;
  userEmail: string;
  spotTitle: string;
  spotAddress: string;
  hostName: string;
  totalAmount: number;
  paymentStatus: string;
  currency: string;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  currentMonthBookings: number;
  newSpotsThisMonth: number;
  currentMonthRevenue: number;
  spotTypeDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  topSpots: Array<{
    id: string;
    name: string;
    bookings: number;
    revenue: number;
    rating: number;
  }>;
  revenueTrend: Array<{
    month: string;
    revenue: number;
    bookings: number;
  }>;
  weeklyPerformance: Array<{
    day: string;
    bookings: number;
    revenue: number;
  }>;
}

export interface EventData {
  id: string;
  title: string;
  description?: string;
  location: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate?: string;
  isSingleDate: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  createdByName: string;
  createdByEmail: string;
}

export type EventFormValues = {
  id?: string;
  title: string;
  description?: string;
  location: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate?: string;
  isSingleDate: boolean;
};

export interface WaitingListUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}
  
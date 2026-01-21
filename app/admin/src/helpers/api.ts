import {
	AuthSuccessResponse,
	GenericData,
	UserData,
	DashboardStats
} from "@/interfaces";
import { apiRequest } from "./apiRequest";

export interface LoginFormData {
	email: string;
	password: string;
}


export const login = async (data: LoginFormData) => {
	return apiRequest<GenericData<AuthSuccessResponse>>({
		method: "POST",
		url: "/auth/admin-login",
		data,
	});
};

export const getUser = async () => {
	return apiRequest<GenericData<UserData>>({
		method: "GET",
		url: "/admin/me",
	});
};

export const dashboardApi = {
  getStats: () => apiRequest<{ data: DashboardStats }>({
    method: 'GET',
    url: '/admin/dashboard/stats',
  }),
};
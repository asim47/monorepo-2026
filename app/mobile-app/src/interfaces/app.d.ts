interface AuthSuccessResponse {
  accessToken: string;
  refreshToken: string;
}

export interface GenericResponse<T> {
  data: T;
}

interface GenericData<T> {
  data: T;
}

declare module "*.png" {
  const value: any;
  export default value;
}

declare module "*.jpg" {
  const value: any;
  export default value;
}

declare module "*.jpeg" {
  const value: any;
  export default value;
}

export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  type: UserTypes;
  status: UserStatus;
  isProfileCompleted: boolean;
  providerId?: string;
  providers?: string[];
  profilePhoto?: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlacePayload {
  name: string;
  address: string;
}

export interface SocialAuthRequest {
  email?: string;
  fullName?: string;
  provider: "google" | "apple";
  providerData: any;
}
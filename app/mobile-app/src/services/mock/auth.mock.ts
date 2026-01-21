// Mock authentication service
// This simulates API responses for authentication flows

import { AuthSuccessResponse } from '@/interfaces/app';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock users database
export const MOCK_USERS = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'demo123',
    name: 'Demo User',
    phone: '+1234567890',
  },
  {
    id: '2',
    email: 'test@example.com',
    password: 'test123',
    name: 'Test User',
    phone: '+0987654321',
  },
];

// Mock OTP (for demo purposes, always 123456)
const MOCK_OTP = '123456';

export const mockSendOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
  await delay(1000);
  
  console.log(`[MOCK] Sending OTP to ${email}. Use OTP: ${MOCK_OTP}`);
  
  return {
    success: true,
    message: `OTP sent to ${email}. Use: ${MOCK_OTP}`,
  };
};

export const mockVerifyOTP = async (
  email: string,
  otp: string
): Promise<AuthSuccessResponse> => {
  await delay(800);
  
  if (otp !== MOCK_OTP) {
    throw new Error('Invalid OTP');
  }
  
  const user = MOCK_USERS.find(u => u.email === email) || MOCK_USERS[0];
  
  return {
    accessToken: `mock-access-token-${user.id}`,
    refreshToken: `mock-refresh-token-${user.id}`,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
    },
  };
};

export const mockRegister = async (data: {
  email: string;
  name: string;
  phone: string;
  password: string;
}): Promise<{ success: boolean; message: string }> => {
  await delay(1200);
  
  // Check if user already exists
  const existingUser = MOCK_USERS.find(u => u.email === data.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  console.log('[MOCK] User registered successfully:', data.email);
  
  return {
    success: true,
    message: 'Registration successful. OTP sent to your email.',
  };
};

export const mockSocialAuth = async (data: {
  provider: 'google' | 'apple';
  token: string;
}): Promise<AuthSuccessResponse> => {
  await delay(1000);
  
  const mockUser = {
    id: `social-${data.provider}-123`,
    email: `user@${data.provider}.com`,
    name: `${data.provider} User`,
    phone: '',
  };
  
  return {
    accessToken: `mock-access-token-${mockUser.id}`,
    refreshToken: `mock-refresh-token-${mockUser.id}`,
    user: mockUser,
  };
};

export const mockRefreshToken = async (
  refreshToken: string
): Promise<AuthSuccessResponse> => {
  await delay(500);
  
  return {
    accessToken: 'mock-new-access-token',
    refreshToken: 'mock-new-refresh-token',
    user: MOCK_USERS[0],
  };
};

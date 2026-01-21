// Mock user service
// This simulates API responses for user profile and settings

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export type MockUserProfile = {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinedDate: string;
  verified: boolean;
};

// Mock current user profile
export const MOCK_USER_PROFILE: MockUserProfile = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
  phone: '+1234567890',
  avatar: 'https://i.pravatar.cc/150?img=8',
  bio: 'Hello! I\'m using this awesome app.',
  location: 'San Francisco, CA',
  joinedDate: '2024-01-15',
  verified: true,
};

export const mockGetUserProfile = async (): Promise<MockUserProfile> => {
  await delay(600);
  return MOCK_USER_PROFILE;
};

export const mockUpdateUserProfile = async (
  updates: Partial<MockUserProfile>
): Promise<MockUserProfile> => {
  await delay(800);
  
  // Simulate profile update
  Object.assign(MOCK_USER_PROFILE, updates);
  
  return MOCK_USER_PROFILE;
};

export const mockUploadAvatar = async (imageUri: string): Promise<{ avatarUrl: string }> => {
  await delay(1500);
  
  // In a real app, this would upload to a server
  // For mock, just return the local URI
  console.log('[MOCK] Avatar uploaded:', imageUri);
  
  return {
    avatarUrl: imageUri,
  };
};

export const mockGetUserStats = async () => {
  await delay(500);
  
  return {
    totalItems: 12,
    activeItems: 8,
    completedTransactions: 45,
    rating: 4.7,
    reviewCount: 38,
  };
};

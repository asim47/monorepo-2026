// Mock filters service
// This provides filter options and configurations

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export type FilterOptions = {
  categories: string[];
  features: string[];
  priceRange: {
    min: number;
    max: number;
  };
  radiusOptions: number[]; // in meters
  sortOptions: {
    id: string;
    label: string;
  }[];
};

export const mockGetFilterOptions = async (): Promise<FilterOptions> => {
  await delay(400);
  
  return {
    categories: [
      'All',
      'Premium',
      'Luxury',
      'Standard',
      'Budget',
    ],
    features: [
      'Feature A',
      'Feature B',
      'Feature C',
      'WiFi',
      'Premium Access',
      'VIP Access',
      'Basic Access',
      'Standard Access',
      'Premium Support',
    ],
    priceRange: {
      min: 0,
      max: 150,
    },
    radiusOptions: [500, 1000, 2000, 5000, 10000], // meters
    sortOptions: [
      { id: 'distance', label: 'Closest First' },
      { id: 'price-low', label: 'Price: Low to High' },
      { id: 'price-high', label: 'Price: High to Low' },
      { id: 'rating', label: 'Highest Rated' },
      { id: 'newest', label: 'Newest First' },
    ],
  };
};

export const mockSaveFilterPreferences = async (filters: Record<string, any>) => {
  await delay(300);
  
  console.log('[MOCK] Saved filter preferences:', filters);
  
  return {
    success: true,
    message: 'Filter preferences saved',
  };
};

export const mockGetSavedFilters = async () => {
  await delay(300);
  
  // Return default/saved filter preferences
  return {
    category: 'All',
    priceMin: 0,
    priceMax: 100,
    radius: 2000,
    features: [],
    sortBy: 'distance',
  };
};

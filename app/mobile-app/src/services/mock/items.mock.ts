// Mock items service
// This simulates API responses for item listings and details

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export type MockItem = {
  id: string;
  title: string;
  description: string;
  lat: number;
  long: number;
  images: string[];
  category: string;
  price: number;
  features: string[];
  rating: number;
  reviewCount: number;
  hostName: string;
  hostImage?: string;
  distanceMeters: number;
  available: boolean;
};

// Mock items with various locations (San Francisco area)
export const MOCK_ITEMS: MockItem[] = [
  {
    id: '1',
    title: 'Premium Location Item',
    description: 'A great item in a prime location with excellent features.',
    lat: 37.7749,
    long: -122.4194,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
    ],
    category: 'Premium',
    price: 45,
    features: ['Feature A', 'Feature B', 'Premium Access'],
    rating: 4.8,
    reviewCount: 127,
    hostName: 'John Doe',
    hostImage: 'https://i.pravatar.cc/150?img=1',
    distanceMeters: 250,
    available: true,
  },
  {
    id: '2',
    title: 'Budget Friendly Option',
    description: 'Affordable and convenient location for your needs.',
    lat: 37.7849,
    long: -122.4094,
    images: [
      'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=400',
    ],
    category: 'Budget',
    price: 25,
    features: ['Feature A', 'Basic Access'],
    rating: 4.2,
    reviewCount: 43,
    hostName: 'Jane Smith',
    hostImage: 'https://i.pravatar.cc/150?img=5',
    distanceMeters: 580,
    available: true,
  },
  {
    id: '3',
    title: 'Luxury Experience',
    description: 'Top-tier item with all the amenities you could want.',
    lat: 37.7649,
    long: -122.4294,
    images: [
      'https://images.unsplash.com/photo-1560448205-17d3a46c84de?w=400',
      'https://images.unsplash.com/photo-1560448205-17d3a46c84de?w=400',
      'https://images.unsplash.com/photo-1560448205-17d3a46c84de?w=400',
    ],
    category: 'Luxury',
    price: 85,
    features: ['Feature A', 'Feature B', 'Feature C', 'VIP Access', 'Premium Support'],
    rating: 4.9,
    reviewCount: 201,
    hostName: 'Mike Johnson',
    hostImage: 'https://i.pravatar.cc/150?img=3',
    distanceMeters: 420,
    available: true,
  },
  {
    id: '4',
    title: 'Central Hub Location',
    description: 'Centrally located for easy access to everything.',
    lat: 37.7799,
    long: -122.4144,
    images: [
      'https://images.unsplash.com/photo-1560448208-26be150cd9a6?w=400',
    ],
    category: 'Standard',
    price: 35,
    features: ['Feature A', 'Standard Access', 'WiFi'],
    rating: 4.5,
    reviewCount: 89,
    hostName: 'Sarah Lee',
    hostImage: 'https://i.pravatar.cc/150?img=9',
    distanceMeters: 150,
    available: true,
  },
  {
    id: '5',
    title: 'Quiet Neighborhood Spot',
    description: 'Peaceful area perfect for a relaxing experience.',
    lat: 37.7699,
    long: -122.4244,
    images: [
      'https://images.unsplash.com/photo-1560448075-bb485b067938?w=400',
      'https://images.unsplash.com/photo-1560448075-bb485b067938?w=400',
    ],
    category: 'Standard',
    price: 30,
    features: ['Quiet Area', 'Feature A', 'Basic Access'],
    rating: 4.6,
    reviewCount: 67,
    hostName: 'David Chen',
    hostImage: 'https://i.pravatar.cc/150?img=7',
    distanceMeters: 890,
    available: false,
  },
];

export type GetNearbyItemsParams = {
  lat: string;
  long: string;
  radiusMeters?: string;
  category?: string;
  features?: string;
  priceMin?: string;
  priceMax?: string;
  cursor?: string;
  limit?: string;
};

export const mockGetNearbyItems = async (
  params: GetNearbyItemsParams
): Promise<{ items: MockItem[]; nextCursor?: string }> => {
  await delay(1000);
  
  let filteredItems = [...MOCK_ITEMS];
  
  // Filter by category
  if (params.category && params.category !== 'All') {
    filteredItems = filteredItems.filter(item => item.category === params.category);
  }
  
  // Filter by price range
  if (params.priceMin) {
    filteredItems = filteredItems.filter(item => item.price >= parseInt(params.priceMin!));
  }
  if (params.priceMax) {
    filteredItems = filteredItems.filter(item => item.price <= parseInt(params.priceMax!));
  }
  
  // Filter by features
  if (params.features) {
    const requiredFeatures = params.features.split(',');
    filteredItems = filteredItems.filter(item =>
      requiredFeatures.some(feature => item.features.includes(feature))
    );
  }
  
  // Apply pagination
  const limit = params.limit ? parseInt(params.limit) : 10;
  const paginatedItems = filteredItems.slice(0, limit);
  
  return {
    items: paginatedItems,
    nextCursor: filteredItems.length > limit ? 'next-page-cursor' : undefined,
  };
};

export const mockGetItemDetails = async (itemId: string): Promise<MockItem> => {
  await delay(600);
  
  const item = MOCK_ITEMS.find(i => i.id === itemId);
  if (!item) {
    throw new Error('Item not found');
  }
  
  return item;
};

export const mockGetFilterOptions = async () => {
  await delay(400);
  
  return {
    categories: ['All', 'Premium', 'Luxury', 'Standard', 'Budget'],
    features: ['Feature A', 'Feature B', 'Feature C', 'WiFi', 'Premium Access', 'VIP Access'],
    priceRange: {
      min: 20,
      max: 100,
    },
  };
};

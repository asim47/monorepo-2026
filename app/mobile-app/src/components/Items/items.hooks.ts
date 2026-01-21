// Hooks for Items feature
import { useQuery } from '@tanstack/react-query';
import { mockGetNearbyItems, mockGetItemDetails, mockGetFilterOptions } from '@/services/mock/items.mock';
import { ItemFilters } from './types';

export const useNearbyItems = (filters: ItemFilters & { lat: number; long: number }) => {
  return useQuery({
    queryKey: ['nearby-items', filters],
    queryFn: () => mockGetNearbyItems({
      lat: filters.lat.toString(),
      long: filters.long.toString(),
      category: filters.category,
      priceMin: filters.priceMin?.toString(),
      priceMax: filters.priceMax?.toString(),
      features: filters.features?.join(','),
      radiusMeters: filters.radius?.toString(),
    }),
  });
};

export const useItemDetails = (itemId: string) => {
  return useQuery({
    queryKey: ['item-details', itemId],
    queryFn: () => mockGetItemDetails(itemId),
    enabled: !!itemId,
  });
};

export const useFilterOptions = () => {
  return useQuery({
    queryKey: ['filter-options'],
    queryFn: mockGetFilterOptions,
  });
};

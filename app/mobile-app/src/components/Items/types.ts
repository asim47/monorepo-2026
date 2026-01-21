// Types for Items feature
import { MockItem } from '@/services/mock/items.mock';

export type Item = MockItem;

export type ItemFilters = {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  features?: string[];
  radius?: number;
  sortBy?: string;
};

export type ViewMode = 'list' | 'map';

// Main Items component
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ListView } from './ListView';
import { ItemsMapView } from './MapView';
import { FiltersSheet } from './FiltersSheet';
import { ItemDetailsSheet } from './ItemDetailsSheet';
import { useNearbyItems, useFilterOptions } from './items.hooks';
import { Item, ItemFilters, ViewMode } from './types';

interface ItemsComponentProps {
  userLocation?: { latitude: number; longitude: number };
}

export const ItemsComponent: React.FC<ItemsComponentProps> = ({ userLocation }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filters, setFilters] = useState<ItemFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const { data: filterOptions } = useFilterOptions();
  
  const defaultLocation = userLocation || { latitude: 37.7749, longitude: -122.4194 };
  
  const { data, isLoading, refetch } = useNearbyItems({
    ...filters,
    lat: defaultLocation.latitude,
    long: defaultLocation.longitude,
  });

  const items = data?.items || [];

  const handleItemPress = (item: Item) => {
    setSelectedItem(item);
  };

  const handleApplyFilters = (newFilters: ItemFilters) => {
    setFilters(newFilters);
    refetch();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
              List
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
            onPress={() => setViewMode('map')}
          >
            <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
              Map
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Text style={styles.filterButtonText}>Filters</Text>
          {(filters.category || (filters.features && filters.features.length > 0)) && (
            <View style={styles.filterBadge} />
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      {viewMode === 'list' ? (
        <ListView
          items={items}
          onItemPress={handleItemPress}
          isLoading={isLoading}
          onRefresh={refetch}
        />
      ) : (
        <ItemsMapView
          items={items}
          onItemPress={handleItemPress}
          userLocation={userLocation}
        />
      )}

      {/* Filters Sheet */}
      {showFilters && (
        <View style={styles.modal}>
          <FiltersSheet
            filters={filters}
            onApplyFilters={handleApplyFilters}
            onClose={() => setShowFilters(false)}
            filterOptions={filterOptions}
          />
        </View>
      )}

      {/* Item Details Sheet */}
      {selectedItem && (
        <View style={styles.modal}>
          <ItemDetailsSheet
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onContact={() => {
              console.log('Contact host for item:', selectedItem.id);
              setSelectedItem(null);
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#fff',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  toggleTextActive: {
    color: '#007AFF',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  filterBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff3b30',
    marginLeft: 8,
  },
  modal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
  },
});

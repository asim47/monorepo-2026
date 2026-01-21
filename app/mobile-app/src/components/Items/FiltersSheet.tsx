// Filters bottom sheet for Items
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ItemFilters } from './types';

interface FiltersSheetProps {
  filters: ItemFilters;
  onApplyFilters: (filters: ItemFilters) => void;
  onClose: () => void;
  filterOptions?: {
    categories: string[];
    features: string[];
    priceRange: { min: number; max: number };
  };
}

export const FiltersSheet: React.FC<FiltersSheetProps> = ({
  filters,
  onApplyFilters,
  onClose,
  filterOptions,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<ItemFilters>(filters);

  const categories = filterOptions?.categories || ['All', 'Premium', 'Luxury', 'Standard', 'Budget'];
  const features = filterOptions?.features || ['Feature A', 'Feature B', 'Feature C'];
  const priceRange = filterOptions?.priceRange || { min: 0, max: 150 };

  const handleCategorySelect = (category: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      category: category === 'All' ? undefined : category,
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFilters(prev => {
      const currentFeatures = prev.features || [];
      const isSelected = currentFeatures.includes(feature);
      
      return {
        ...prev,
        features: isSelected
          ? currentFeatures.filter(f => f !== feature)
          : [...currentFeatures, feature],
      };
    });
  };

  const handleReset = () => {
    setSelectedFilters({});
  };

  const handleApply = () => {
    onApplyFilters(selectedFilters);
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filters</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetButton}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.optionsContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.optionChip,
                (selectedFilters.category === category || (category === 'All' && !selectedFilters.category)) &&
                  styles.optionChipSelected,
              ]}
              onPress={() => handleCategorySelect(category)}
            >
              <Text
                style={[
                  styles.optionText,
                  (selectedFilters.category === category || (category === 'All' && !selectedFilters.category)) &&
                    styles.optionTextSelected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price Range */}
        <Text style={styles.sectionTitle}>Price Range</Text>
        <View style={styles.priceContainer}>
          <View style={styles.priceInputContainer}>
            <Text style={styles.priceLabel}>Min</Text>
            <Text style={styles.priceValue}>${selectedFilters.priceMin || priceRange.min}</Text>
          </View>
          <Text style={styles.priceSeparator}>-</Text>
          <View style={styles.priceInputContainer}>
            <Text style={styles.priceLabel}>Max</Text>
            <Text style={styles.priceValue}>${selectedFilters.priceMax || priceRange.max}</Text>
          </View>
        </View>

        {/* Features */}
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.optionsContainer}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature}
              style={[
                styles.optionChip,
                selectedFilters.features?.includes(feature) && styles.optionChipSelected,
              ]}
              onPress={() => handleFeatureToggle(feature)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedFilters.features?.includes(feature) && styles.optionTextSelected,
                ]}
              >
                {feature}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  resetButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
    marginTop: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#fff',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceInputContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
  },
  priceLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  priceSeparator: {
    fontSize: 18,
    color: '#999',
    marginHorizontal: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  applyButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

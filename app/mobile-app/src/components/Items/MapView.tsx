// Map view for Items
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Item } from './types';

interface ItemsMapViewProps {
  items: Item[];
  onItemPress: (item: Item) => void;
  userLocation?: { latitude: number; longitude: number };
}

export const ItemsMapView: React.FC<ItemsMapViewProps> = ({
  items,
  onItemPress,
  userLocation,
}) => {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (items.length > 0 && mapRef.current) {
      // Fit map to show all markers
      const coordinates = items.map(item => ({
        latitude: item.lat,
        longitude: item.long,
      }));
      
      if (userLocation) {
        coordinates.push(userLocation);
      }

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [items, userLocation]);

  const initialRegion = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : {
        latitude: 37.7749, // Default to SF
        longitude: -122.4194,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {items.map((item) => (
          <Marker
            key={item.id}
            coordinate={{
              latitude: item.lat,
              longitude: item.long,
            }}
            title={item.title}
            description={`$${item.price} - ${item.category}`}
            onPress={() => onItemPress(item)}
            pinColor={item.available ? '#007AFF' : '#999'}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

// Your house location in Ann Arbor (positioned on the map image)
// Based on the map screenshot, positioning markers relative to the visible area
const YOUR_HOUSE = { 
  lat: 42.2808, 
  lng: -83.7483,
  // Position on the map image (approximate center of visible area)
  mapX: "50%",
  mapY: "50%",
};

// Real Ann Arbor restaurants - positioned relative to the map image
const MOCK_RESTAURANTS = [
  {
    id: "1",
    name: "Tony's Pizzeria",
    perk: "Free slice with any drink purchase",
    distance: "0.3 mi",
    lat: 42.2814,
    lng: -83.7483,
    // Position on map (north of center, spread out)
    mapX: "45%",
    mapY: "35%",
  },
  {
    id: "2",
    name: "Sakura Sushi Bar",
    perk: "Happy hour 4–6pm • 20% off rolls",
    distance: "0.5 mi",
    lat: 42.2808,
    lng: -83.7475,
    // Position on map (east of center, spread out)
    mapX: "70%",
    mapY: "50%",
  },
  {
    id: "3",
    name: "El Fuego Taqueria",
    perk: "Buy 2 get 1 free on Taco Tuesday",
    distance: "0.7 mi",
    lat: 42.2820,
    lng: -83.7490,
    // Position on map (northwest of center, spread out)
    mapX: "30%",
    mapY: "30%",
  },
  {
    id: "4",
    name: "Tony's Pizzeria",
    perk: "Free slice with any drink purchase",
    distance: "0.4 mi",
    lat: 42.2800,
    lng: -83.7485,
    // Position on map (south of center, spread out)
    mapX: "50%",
    mapY: "70%",
  },
  {
    id: "5",
    name: "Sakura Sushi Bar",
    perk: "Happy hour 4–6pm • 20% off rolls",
    distance: "0.6 mi",
    lat: 42.2818,
    lng: -83.7470,
    // Position on map (southeast of center, spread out)
    mapX: "75%",
    mapY: "65%",
  },
];

export default function MapScreen() {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<(typeof MOCK_RESTAURANTS)[0] | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {/* Real Ann Arbor map image as background */}
        <Image
          source={require("../../assets/images/ann-arbor-map.png")}
          style={styles.mapImage}
          resizeMode="cover"
        />

        {/* Your house marker */}
        <View style={[styles.marker, styles.userMarker, { left: YOUR_HOUSE.mapX as any, top: YOUR_HOUSE.mapY as any }]}>
          <View style={styles.userPulse} />
          <Ionicons name="home" size={18} color="#FFFFFF" />
        </View>

        {/* Restaurant markers positioned on the map */}
        {MOCK_RESTAURANTS.map((restaurant) => (
          <TouchableOpacity
            key={restaurant.id}
            style={[
              styles.marker,
              styles.restaurantMarker,
              { left: restaurant.mapX as any, top: restaurant.mapY as any },
            ]}
            onPress={() => setSelectedRestaurant(restaurant)}
          >
            <Ionicons name="restaurant" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        ))}

        {/* Location label */}
        <View style={styles.locationLabel}>
          <Ionicons name="location" size={14} color="#6B7280" />
          <Text style={styles.locationText}>Ann Arbor, MI</Text>
        </View>
      </View>

      {selectedRestaurant && (
        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHandle} />
          <ScrollView style={styles.bottomSheetContent} showsVerticalScrollIndicator={false}>
            <View style={styles.restaurantHeader}>
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{selectedRestaurant.name}</Text>
                <View style={styles.restaurantMeta}>
                  <Ionicons name="location" size={14} color="#6B7280" />
                  <Text style={styles.restaurantDistance}>{selectedRestaurant.distance}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setSelectedRestaurant(null)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <View style={styles.perkBadge}>
              <Ionicons name="gift" size={16} color="#10B981" />
              <Text style={styles.perkText}>{selectedRestaurant.perk}</Text>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>View Details</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {!selectedRestaurant && (
        <View style={styles.nearbyList}>
          <Text style={styles.nearbyTitle}>Nearby Spots in Ann Arbor</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.nearbyScrollContent}>
            {MOCK_RESTAURANTS.map((restaurant) => (
              <TouchableOpacity
                key={restaurant.id}
                style={styles.nearbyCard}
                onPress={() => setSelectedRestaurant(restaurant)}
              >
                <View style={styles.nearbyCardHeader}>
                  <View style={styles.nearbyCardDot} />
                  <Text style={styles.nearbyCardName}>{restaurant.name}</Text>
                </View>
                <Text style={styles.nearbyCardDistance}>{restaurant.distance}</Text>
                <Text style={styles.nearbyCardPerk} numberOfLines={1}>{restaurant.perk}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: "#E8F5E9",
  },
  mapImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  marker: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
    zIndex: 10,
  },
  userMarker: {
    backgroundColor: "#4A90E2",
  },
  userPulse: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4A90E2",
    opacity: 0.3,
    transform: [{ scale: 2 }],
  },
  restaurantMarker: {
    backgroundColor: "#FF6B35",
  },
  locationLabel: {
    position: "absolute",
    top: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    zIndex: 10,
  },
  locationText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
    maxHeight: height * 0.5,
    zIndex: 20,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  bottomSheetContent: {
    padding: 20,
  },
  restaurantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  restaurantMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  restaurantDistance: {
    fontSize: 14,
    color: "#6B7280",
  },
  closeButton: {
    padding: 4,
  },
  perkBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 20,
    gap: 6,
  },
  perkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
  },
  actionButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  nearbyList: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  nearbyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  nearbyScrollContent: {
    gap: 12,
  },
  nearbyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    width: 200,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  nearbyCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  nearbyCardDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B35",
  },
  nearbyCardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  nearbyCardDistance: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  nearbyCardPerk: {
    fontSize: 13,
    color: "#10B981",
    fontWeight: "500",
  },
});

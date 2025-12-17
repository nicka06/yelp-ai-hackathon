import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MOCK_RESTAURANTS = [
  {
    id: "1",
    name: "Tony's Pizzeria",
    cuisine: "Italian • Pizza",
    distance: "0.2 mi",
    perk: "Free slice with any drink purchase",
    tag: "Near you now",
    rating: 4.8,
    image: require("../../assets/images/pizza.jpeg"),
  },
  {
    id: "2",
    name: "Sakura Sushi Bar",
    cuisine: "Japanese • Sushi",
    distance: "0.5 mi",
    perk: "Happy hour 4–6pm • 20% off rolls",
    tag: "Because you like sushi",
    rating: 4.6,
    image: require("../../assets/images/sushi.jpeg"),
  },
  {
    id: "3",
    name: "El Fuego Taqueria",
    cuisine: "Mexican • Tacos",
    distance: "0.8 mi",
    perk: "Buy 2 get 1 free on Taco Tuesday",
    tag: "Trending nearby",
    rating: 4.7,
    image: require("../../assets/images/taco.jpeg"),
  },
];

const FILTERS = ["All", "Pizza", "Sushi", "Tacos", "Coffee"];

export default function HomeScreen() {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredRestaurants =
    selectedFilter === "All"
      ? MOCK_RESTAURANTS
      : MOCK_RESTAURANTS.filter((r) =>
          r.cuisine.toLowerCase().includes(selectedFilter.toLowerCase())
        );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerLocation}>Today in Ann Arbor</Text>
            <Text style={styles.headerTitle}>Restaurant Concierge</Text>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>
      </View>

      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === filter && styles.filterChipTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredRestaurants.map((restaurant) => (
          <TouchableOpacity key={restaurant.id} style={styles.card} activeOpacity={0.95}>
            <View style={styles.cardImageContainer}>
              <Image
                source={restaurant.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color="#FBBF24" />
                <Text style={styles.ratingText}>{restaurant.rating}</Text>
              </View>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTagContainer}>
                  <View style={styles.tagBadge}>
                    <Text style={styles.cardTag}>{restaurant.tag}</Text>
                  </View>
                </View>
                <View style={styles.distanceContainer}>
                  <Ionicons name="location" size={12} color="#9CA3AF" />
                  <Text style={styles.cardDistance}>{restaurant.distance}</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{restaurant.name}</Text>
              <Text style={styles.cardCuisine}>{restaurant.cuisine}</Text>

              <View style={styles.perkContainer}>
                <Ionicons name="gift" size={18} color="#10B981" />
                <Text style={styles.perkText}>{restaurant.perk}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLocation: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.5,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  liveText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#EF4444",
  },
  filtersWrapper: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  filtersContainer: {
    flexGrow: 0,
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingRight: 40,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 10,
    alignItems: "center",
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterChipActive: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardImageContainer: {
    width: "100%",
    height: 220,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  ratingBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  cardContent: {
    padding: 18,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTagContainer: {
    flex: 1,
  },
  tagBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardTag: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardDistance: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  cardCuisine: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 14,
    fontWeight: "500",
  },
  perkContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  perkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
    flex: 1,
  },
});

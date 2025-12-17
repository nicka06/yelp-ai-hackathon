import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MOCK_FAVORITES = [
  {
    id: "1",
    name: "Tony's Pizzeria",
    cuisine: "Italian • Pizza",
    distance: "0.2 mi",
    isNearby: true,
  },
  {
    id: "2",
    name: "Sakura Sushi Bar",
    cuisine: "Japanese • Sushi",
    distance: "0.5 mi",
    isNearby: false,
  },
  {
    id: "3",
    name: "El Fuego Taqueria",
    cuisine: "Mexican • Tacos",
    distance: "0.8 mi",
    isNearby: false,
  },
];

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>
          Your starred spots get special treatment
        </Text>
      </View>

      {MOCK_FAVORITES.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="heart-outline" size={48} color="#D1D5DB" />
          </View>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptyText}>
            Tap the heart icon on any restaurant to add it here. You'll get
            special notifications when you're nearby.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {MOCK_FAVORITES.map((favorite) => (
            <TouchableOpacity key={favorite.id} style={styles.card}>
              <View style={styles.cardLeft}>
                <View style={styles.cardIcon}>
                  <Ionicons name="restaurant" size={24} color="#FF6B35" />
                </View>
                <View style={styles.cardInfo}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardName}>{favorite.name}</Text>
                    {favorite.isNearby && (
                      <View style={styles.nearbyBadge}>
                        <View style={styles.nearbyDot} />
                        <Text style={styles.nearbyText}>Nearby</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardCuisine}>{favorite.cuisine}</Text>
                  <View style={styles.cardMeta}>
                    <Ionicons name="location" size={12} color="#6B7280" />
                    <Text style={styles.cardDistance}>{favorite.distance}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.favoriteButton}>
                <Ionicons name="heart" size={24} color="#FF6B35" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFF0EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  nearbyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  nearbyDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#10B981",
  },
  nearbyText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#059669",
  },
  cardCuisine: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 6,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardDistance: {
    fontSize: 12,
    color: "#6B7280",
  },
  favoriteButton: {
    padding: 8,
  },
});

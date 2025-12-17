import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MOCK_REWARDS = [
  {
    id: "1",
    type: "active",
    title: "Free dessert at Tony's Pizzeria",
    description: "Valid on any order over $15",
    expires: "Friday",
    distance: "0.2 mi",
    restaurant: "Tony's Pizzeria",
  },
  {
    id: "2",
    type: "progress",
    title: "Sakura Sushi Bar – VIP tier",
    description: "Unlock 15% off forever",
    progress: 2,
    total: 5,
    restaurant: "Sakura Sushi Bar",
  },
  {
    id: "3",
    type: "active",
    title: "Buy 2 get 1 free tacos",
    description: "Valid until end of month",
    expires: "Dec 31",
    distance: "0.8 mi",
    restaurant: "El Fuego Taqueria",
  },
];

export default function RewardsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rewards</Text>
        <Text style={styles.subtitle}>Your wallet of perks and progress</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_REWARDS.map((reward) => (
          <TouchableOpacity key={reward.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                {reward.type === "active" ? (
                  <Ionicons name="gift" size={24} color="#FF6B35" />
                ) : (
                  <Ionicons name="trophy" size={24} color="#FF6B35" />
                )}
              </View>
              <View style={styles.cardContent}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardLabel}>
                    {reward.type === "active" ? "Active reward" : "Progress"}
                  </Text>
                  {reward.distance && (
                    <View style={styles.distanceBadge}>
                      <Ionicons name="location" size={10} color="#6B7280" />
                      <Text style={styles.distanceText}>{reward.distance}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardTitle}>{reward.title}</Text>
                <Text style={styles.cardDescription}>{reward.description}</Text>

                {reward.type === "progress" && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${(reward.progress! / reward.total!) * 100}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {reward.progress} / {reward.total} visits
                    </Text>
                  </View>
                )}

                {reward.expires && (
                  <View style={styles.expiresContainer}>
                    <Ionicons name="time-outline" size={12} color="#6B7280" />
                    <Text style={styles.expiresText}>Expires: {reward.expires}</Text>
                  </View>
                )}

                <View style={styles.restaurantBadge}>
                  <Text style={styles.restaurantText}>{reward.restaurant}</Text>
                </View>
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFF0EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  distanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  distanceText: {
    fontSize: 11,
    color: "#6B7280",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  cardDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF6B35",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  expiresContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  expiresText: {
    fontSize: 12,
    color: "#6B7280",
  },
  restaurantBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  restaurantText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4B5563",
  },
});

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const MOCK_RESTAURANTS = [
  {
    id: "1",
    name: "Joe's Pizza",
    distance: "0.2 mi",
    perk: "Free slice with drink",
    tag: "Near you now",
  },
  {
    id: "2",
    name: "Sushi Place",
    distance: "0.5 mi",
    perk: "Happy hour 4–6pm",
    tag: "Because you like sushi",
  },
  {
    id: "3",
    name: "Taco Spot",
    distance: "0.8 mi",
    perk: "Buy 2 get 1 free",
    tag: "Trending nearby",
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover</Text>
      <Text style={styles.subtitle}>Spots worth a detour, near you.</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_RESTAURANTS.map((r) => (
          <View key={r.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.tag}>{r.tag}</Text>
              <Text style={styles.distance}>{r.distance}</Text>
            </View>
            <Text style={styles.cardTitle}>{r.name}</Text>
            <Text style={styles.perk}>{r.perk}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tag: {
    fontSize: 12,
    color: "#4B5563",
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  distance: {
    fontSize: 12,
    color: "#6B7280",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  perk: {
    fontSize: 14,
    color: "#10B981",
  },
});



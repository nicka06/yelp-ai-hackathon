import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function RewardsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rewards</Text>
      <Text style={styles.subtitle}>
        Imagine this as your wallet of perks and progress toward new ones.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Active reward</Text>
        <Text style={styles.cardTitle}>Free dessert at Joe's Pizza</Text>
        <Text style={styles.cardMeta}>Expires: Friday • 0.2 mi away</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Progress</Text>
        <Text style={styles.cardTitle}>Sushi Place – VIP tier</Text>
        <Text style={styles.cardMeta}>2 / 5 visits • Unlock 15% off forever</Text>
      </View>
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
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  cardLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 14,
    color: "#6B7280",
  },
});



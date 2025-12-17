import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile & Settings</Text>
      <Text style={styles.subtitle}>
        For the demo, this shows how users could control notifications and
        privacy without us wiring up the backend yet.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Notification channels</Text>
        <Text style={styles.row}>• Calls (AI concierge)</Text>
        <Text style={styles.row}>• SMS updates</Text>
        <Text style={styles.row}>• Push notifications</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Quiet hours</Text>
        <Text style={styles.row}>• No calls after 9:00 PM</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <Text style={styles.row}>• Clear location history</Text>
        <Text style={styles.row}>• Manage permissions in system settings</Text>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  row: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
  },
});



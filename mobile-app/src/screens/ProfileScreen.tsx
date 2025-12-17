import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const [callsEnabled, setCallsEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Control your notifications and privacy</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Channels</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="call" size={20} color="#111827" />
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>AI Phone Calls</Text>
                <Text style={styles.settingDescription}>
                  Receive calls from our AI concierge
                </Text>
              </View>
            </View>
            <Switch
              value={callsEnabled}
              onValueChange={setCallsEnabled}
              trackColor={{ false: "#D1D5DB", true: "#FF6B35" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="chatbubble" size={20} color="#111827" />
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>SMS Updates</Text>
                <Text style={styles.settingDescription}>
                  Text messages about nearby spots
                </Text>
              </View>
            </View>
            <Switch
              value={smsEnabled}
              onValueChange={setSmsEnabled}
              trackColor={{ false: "#D1D5DB", true: "#FF6B35" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications" size={20} color="#111827" />
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDescription}>
                  In-app alerts and reminders
                </Text>
              </View>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: "#D1D5DB", true: "#FF6B35" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiet Hours</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon" size={20} color="#111827" />
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Enable Quiet Hours</Text>
                <Text style={styles.settingDescription}>
                  No calls after 9:00 PM
                </Text>
              </View>
            </View>
            <Switch
              value={quietHoursEnabled}
              onValueChange={setQuietHoursEnabled}
              trackColor={{ false: "#D1D5DB", true: "#FF6B35" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="trash-outline" size={20} color="#FF6B35" />
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, styles.dangerText]}>
                  Clear Location History
                </Text>
                <Text style={styles.settingDescription}>
                  Delete all stored location data
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="settings-outline" size={20} color="#111827" />
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>System Permissions</Text>
                <Text style={styles.settingDescription}>
                  Manage location access in device settings
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: "#6B7280",
  },
  dangerText: {
    color: "#FF6B35",
  },
});

import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./src/screens/HomeScreen";
import MapScreen from "./src/screens/MapScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import RewardsScreen from "./src/screens/RewardsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

type TabName = "Home" | "Map" | "Favorites" | "Rewards" | "Profile";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>("Home");

  const renderScreen = () => {
    switch (activeTab) {
      case "Home":
        return <HomeScreen />;
      case "Map":
        return <MapScreen />;
      case "Favorites":
        return <FavoritesScreen />;
      case "Rewards":
        return <RewardsScreen />;
      case "Profile":
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.appContainer}>
      <StatusBar style="dark" />
      <View style={styles.screenContainer}>{renderScreen()}</View>
      <View style={styles.tabBar}>
        {renderTabButton("Home", "home-outline", activeTab, setActiveTab)}
        {renderTabButton("Map", "map-outline", activeTab, setActiveTab)}
        {renderTabButton("Favorites", "heart-outline", activeTab, setActiveTab)}
        {renderTabButton("Rewards", "gift-outline", activeTab, setActiveTab)}
        {renderTabButton("Profile", "person-outline", activeTab, setActiveTab)}
      </View>
    </View>
  );
}

function renderTabButton(
  tab: TabName,
  icon: keyof typeof Ionicons.glyphMap,
  activeTab: TabName,
  setActiveTab: (t: TabName) => void
) {
  const isActive = tab === activeTab;
  return (
    <TouchableOpacity
      key={tab}
      style={styles.tabButton}
      onPress={() => setActiveTab(tab)}
      activeOpacity={0.8}
    >
      <Ionicons
        name={icon}
        size={22}
        color={isActive ? "#111827" : "#9CA3AF"}
      />
      <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
        {tab}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  tabButton: {
    alignItems: "center",
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 2,
  },
  tabLabelActive: {
    color: "#111827",
    fontWeight: "600",
  },
});



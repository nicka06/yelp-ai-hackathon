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
        {renderTabButton("Home", "home", "home-outline", activeTab, setActiveTab)}
        {renderTabButton("Map", "map", "map-outline", activeTab, setActiveTab)}
        {renderTabButton("Favorites", "heart", "heart-outline", activeTab, setActiveTab)}
        {renderTabButton("Rewards", "gift", "gift-outline", activeTab, setActiveTab)}
        {renderTabButton("Profile", "person", "person-outline", activeTab, setActiveTab)}
      </View>
    </View>
  );
}

function renderTabButton(
  tab: TabName,
  iconActive: keyof typeof Ionicons.glyphMap,
  iconInactive: keyof typeof Ionicons.glyphMap,
  activeTab: TabName,
  setActiveTab: (t: TabName) => void
) {
  const isActive = tab === activeTab;
  return (
    <TouchableOpacity
      key={tab}
      style={styles.tabButton}
      onPress={() => setActiveTab(tab)}
      activeOpacity={0.7}
    >
      <View style={[styles.tabIconContainer, isActive && styles.tabIconContainerActive]}>
        <Ionicons
          name={isActive ? iconActive : iconInactive}
          size={22}
          color={isActive ? "#FF6B35" : "#9CA3AF"}
        />
      </View>
      <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
        {tab}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#FFF8F5",
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  tabButton: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 4,
  },
  tabIconContainer: {
    padding: 6,
    borderRadius: 8,
  },
  tabIconContainerActive: {
    backgroundColor: "#FFF0EB",
  },
  tabLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
    fontWeight: "500",
  },
  tabLabelActive: {
    color: "#FF6B35",
    fontWeight: "700",
  },
});

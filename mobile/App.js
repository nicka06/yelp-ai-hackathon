import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import axios from 'axios';

// Change this to your server URL
const SERVER_URL = 'https://frankly-nonrepellent-elvina.ngrok-free.dev';

const LOCATION_TASK_NAME = 'background-location-task';

// Store phone number globally for background task
let globalPhoneNumber = null;

// Define the background task
TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error('Location task error:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    const location = locations[0];
    if (location) {
      sendLocationToServer(location.coords.latitude, location.coords.longitude, globalPhoneNumber);
    }
  }
});

// Generate a unique user ID (stored in device storage in production)
const getUserId = () => {
  // In production, use AsyncStorage to persist this
  if (!global.userId) {
    global.userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return global.userId;
};

// Function to send location to server
const sendLocationToServer = async (latitude, longitude, phoneNumber = null) => {
  try {
    const userId = getUserId();
    console.log('Sending location:', { latitude, longitude, userId });
    await axios.post(`${SERVER_URL}/api/location`, {
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
      userId,
      phoneNumber, // Include phone number if available
    });
  } catch (error) {
    console.error('Error sending location to server:', error.message);
  }
};

export default function App() {
  const [location, setLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneRegistered, setPhoneRegistered] = useState(false);

  useEffect(() => {
    (async () => {
      // Request foreground location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Request background location permissions
      const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus.status !== 'granted') {
        setErrorMsg('Permission to access background location was denied');
        return;
      }

      // Get initial location
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      sendLocationToServer(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        phoneNumber || null
      );
    })();
  }, []);

  // Update global phone number when it changes
  useEffect(() => {
    globalPhoneNumber = phoneNumber || null;
  }, [phoneNumber]);

  const registerPhoneNumber = async () => {
    if (!phoneNumber || !phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    // Format phone number (add +1 if it's a US number without country code)
    let formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+1${formattedPhone.replace(/\D/g, '')}`;
    }

    try {
      const userId = getUserId();
      await axios.post(`${SERVER_URL}/api/register-phone`, {
        userId,
        phoneNumber: formattedPhone,
      });
      setPhoneRegistered(true);
      globalPhoneNumber = formattedPhone;
      Alert.alert('Success', 'Phone number registered!');
    } catch (error) {
      console.error('Error registering phone:', error);
      Alert.alert('Error', 'Failed to register phone number');
    }
  };

  const startLocationTracking = async () => {
    try {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000, // Update every 10 seconds
        distanceInterval: 50, // Update every 50 meters
        foregroundService: {
          notificationTitle: 'Location Tracking',
          notificationBody: 'Tracking your location for restaurant notifications',
        },
      });
      setIsTracking(true);
      Alert.alert('Success', 'Background location tracking started');
    } catch (error) {
      console.error('Error starting location tracking:', error);
      Alert.alert('Error', 'Failed to start location tracking');
    }
  };

  const stopLocationTracking = async () => {
    try {
      const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (isRunning) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        setIsTracking(false);
        Alert.alert('Success', 'Location tracking stopped');
      }
    } catch (error) {
      console.error('Error stopping location tracking:', error);
      Alert.alert('Error', 'Failed to stop location tracking');
    }
  };

  let text = 'Waiting for location...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Lat: ${location.coords.latitude.toFixed(6)}, Lng: ${location.coords.longitude.toFixed(6)}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant Concierge</Text>
      
      {!phoneRegistered && (
        <View style={styles.phoneContainer}>
          <Text style={styles.label}>Enter your phone number:</Text>
          <TextInput
            style={styles.input}
            placeholder="+1234567890"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            autoComplete="tel"
          />
          <Button
            title="Register Phone"
            onPress={registerPhoneNumber}
          />
        </View>
      )}

      {phoneRegistered && (
        <Text style={styles.registeredText}>✓ Phone registered</Text>
      )}

      <Text style={styles.locationText}>{text}</Text>
      <Text style={styles.statusText}>
        Tracking: {isTracking ? 'Active' : 'Inactive'}
      </Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title={isTracking ? 'Stop Tracking' : 'Start Tracking'}
          onPress={isTracking ? stopLocationTracking : startLocationTracking}
        />
      </View>

      <Text style={styles.note}>
        Note: Make sure to update SERVER_URL in App.js with your server address
      </Text>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 30,
    color: '#007AFF',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
  },
  note: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  phoneContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  registeredText: {
    fontSize: 14,
    color: '#34C759',
    marginBottom: 10,
    fontWeight: '600',
  },
});

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem('isOnboarded');
        if (value === 'true') {
          setIsOnboarded(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#495E57" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#EDEFEE' },
          headerTintColor: '#495E57',
          headerTitleAlign: 'center',
        }}
      >
        {!isOnboarded ? (
          <Stack.Screen
            name="Onboarding"
            options={{ headerShown: false }}
          >
            {(props) => (
              <OnboardingScreen {...props} setIsOnboarded={setIsOnboarded} />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              options={{ title: 'User Profile' }}
            >
              {(props) => (
                <ProfileScreen {...props} setIsOnboarded={setIsOnboarded} />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

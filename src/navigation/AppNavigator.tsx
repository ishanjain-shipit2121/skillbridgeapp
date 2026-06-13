import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import RoadmapScreen from '../screens/RoadmapScreen';
import DSATrackScreen from '../screens/DSATrackScreen';
import LearningTracksScreen from '../screens/LearningTracksScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          switch (route.name) {
            case 'HomeTab':
              iconName = 'home-outline';
              break;
            case 'QuizTab':
              iconName = 'help-circle-outline';
              break;
            case 'RoadmapTab':
              iconName = 'map-outline';
              break;
            case 'DSATab':
              iconName = 'code-slash-outline';
              break;
            case 'ChatTab':
              iconName = 'chatbubbles-outline';
              break;
            default:
              iconName = 'home-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="QuizTab" component={QuizScreen} options={{ tabBarLabel: 'Quiz' }} />
      <Tab.Screen name="RoadmapTab" component={RoadmapScreen} options={{ tabBarLabel: 'Roadmap' }} />
      <Tab.Screen name="DSATab" component={DSATrackScreen} options={{ tabBarLabel: 'DSA' }} />
      <Tab.Screen name="ChatTab" component={ChatScreen} options={{ tabBarLabel: 'Chat' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="LearningTracks" component={LearningTracksScreen} options={{ headerShown: true, headerTitle: 'Learning Tracks', headerStyle: { backgroundColor: Colors.card }, headerTintColor: Colors.text }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true, headerTitle: 'Profile', headerStyle: { backgroundColor: Colors.card }, headerTintColor: Colors.text }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

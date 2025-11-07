import { Tabs } from 'expo-router';

import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#e02020ff',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#25292e',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'home' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'information' : 'information-outline'} color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}

import { faHome, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { preloadSounds } from '../../services/audioManager';

export default function TabLayout() {
  useEffect(() => {
    // Preload all sounds when the app layout mounts for the first time.
    // This prevents UI jank when a sound is played.
    void preloadSounds();
  }, []);

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
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faHome} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faInfoCircle} size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

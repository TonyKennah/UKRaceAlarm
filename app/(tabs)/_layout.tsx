import { Tabs } from 'expo-router';

import { faHome, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet } from 'react-native';

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

// You might need to add some styles if the FontAwesomeIcon doesn't render perfectly
// within the tab bar without it, but usually it's fine.
const styles = StyleSheet.create({
  // Example if needed:
  // icon: {
  //   marginBottom: -3,
  // },
  // headerRight: {
  //   marginRight: 15,
  //   flexDirection: 'row',
  //   gap: 10,
  // },
});

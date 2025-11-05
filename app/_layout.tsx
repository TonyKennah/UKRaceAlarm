import { Stack } from 'expo-router';
import { View } from 'react-native';
import CustomAlert from '../components/CustomAlert';

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <CustomAlert />
    </View>
  );
}

import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { StyledLink } from '../components/StyledLink';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View style={styles.container}>
        <StyledLink href="/">
          Go back to Home screen!
        </StyledLink>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import { Linking, StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  const appName = "UK Race Alarm";
  const appVersion = "1";
  const currentDate = "05/11/2025";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{appName}</Text>
      <Text style={styles.version}>Version {appVersion}</Text>
      <Text style={styles.date}>Created On {currentDate}</Text>
      <View style={styles.separator} />
      <Text style={styles.description}>
        This application provides alarms for UK & Irish horse races.
        Set alarms for all races or toggle them individually to receive a two-minute warning before the race is off.
      </Text>
      <View style={styles.separator} />
      <Text style={styles.credit}>Brought to you by</Text>
      <Text style={styles.pluckier} onPress={() => Linking.openURL('https://www.pluckier.co.uk')}>
        Pluckier
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7e3c78ff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  version: {
    fontSize: 18,
    color: '#ffffffff',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: '#ffffffff',
  },
  separator: {
    height: 1,
    width: '80%',
    backgroundColor: '#444',
    marginVertical: 30,
  },
  description: {
    fontSize: 20,
    color: '#ffffffff',
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  credit: {
    fontSize: 16,
    color: '#ffffffff',
    fontStyle: 'italic',
  },
  pluckier: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e02020ff',
    marginTop: 5,
  },
});

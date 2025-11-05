import React, { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppEvents } from '../services/eventService';

interface AlertData {
  title: string;
  message: string;
  raceId?: string;
}

export default function CustomAlert() {
  const [visible, setVisible] = useState(false);
  const [alertData, setAlertData] = useState<AlertData | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleShowAlert = (data: AlertData) => {
      setAlertData(data);
      setVisible(true);
    };

    const handleCloseAlert = (data: { raceId: string }) => {
      // Use a functional update to get the latest alertData state
      setAlertData(currentAlertData => {
        if (currentAlertData?.raceId === data.raceId) {
          setVisible(false);
          return null;
        }
        return currentAlertData;
      });
    };

    const unsubscribeShow = AppEvents.on('showAlert', handleShowAlert);
    const unsubscribeClose = AppEvents.on('closeAlert', handleCloseAlert);
    return () => {
      unsubscribeShow();
      unsubscribeClose();
    };
  }, []);

  if (!visible || !alertData) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle} selectable={false}>
            {alertData.title}
          </Text>
          <Text style={styles.modalText}>{alertData.message}</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setVisible(false)}
          >
            <Text style={styles.textStyle}>Dismiss</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: { borderRadius: 10, padding: 10, elevation: 2 },
  buttonClose: { backgroundColor: '#2196F3' },
  textStyle: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});

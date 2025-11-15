import React, { useEffect, useRef, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppEvent, AppEvents } from '../services/eventService';

interface AlertData {
  title: string;
  message: string;
  raceId?: string;
}

export default function CustomAlert() {
  const [visible, setVisible] = useState(false);
  const [alertData, setAlertData] = useState<AlertData | null>(null);
  const scrollYRef = useRef(0);

  // This effect handles the body scrolling lock on web
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    if (visible) {
      // When the modal becomes visible, save the scroll position and lock the body
      scrollYRef.current = window.scrollY;
      const body = document.body;
      body.style.position = 'fixed';
      body.style.top = `-${scrollYRef.current}px`;
      body.style.width = '100%';
    }

    // Return a cleanup function
    return () => {
      // This runs whenever the modal becomes hidden (or the component unmounts)
      const body = document.body;
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      window.scrollTo(0, scrollYRef.current);
    };
  }, [visible]); // This effect depends only on the `visible` state

  // This effect subscribes to global app events
  useEffect(() => {
    const handleShowAlert = (data: AlertData) => {
      setAlertData(data);
      setVisible(true);
    };

    const handleCloseAlert = (data: { raceId: string }): void => {
      setAlertData(currentAlertData => {
        if (currentAlertData?.raceId === data.raceId) {
          setVisible(false);
          return null;
        }
        return currentAlertData;
      });
    };

    const unsubscribeShow = AppEvents.on('showAlert', handleShowAlert as AppEvent);
    const unsubscribeClose = AppEvents.on('closeAlert', handleCloseAlert as AppEvent);
    return () => {
      unsubscribeShow();
      unsubscribeClose();
    };
  }, []);

  const handleDismiss = () => setVisible(false);

  if (!visible || !alertData) {
    return null;
  }

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={handleDismiss}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle} selectable={false}>
            {alertData.title}
          </Text>
          <Text style={styles.modalText}>{alertData.message}</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]} 
            onPress={handleDismiss}
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

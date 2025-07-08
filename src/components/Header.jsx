import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = () => {
  const [visible, setVisible] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const [hasNotif, setHasNotif] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const checkNotif = async () => {
      const message = await AsyncStorage.getItem('lewatiGantiPasswordMessage');
      if (message) {
        setNotifMessage(message);
        setHasNotif(true);
      }
    };
    checkNotif();
  }, []);

  const togglePopup = () => {
    setVisible(!visible);
    if (!visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{dateStr}</Text>
      <View style={styles.notifWrapper}>
        <TouchableOpacity style={styles.notifButton} onPress={togglePopup}>
          <Icon name="notifications-outline" size={24} color="#000" />
          {hasNotif && <View style={styles.dot} />}
        </TouchableOpacity>

        {/* Balloon Box */}
        {visible && (
          <Animated.View style={[styles.balloon, { opacity: fadeAnim }]}>
            <Text style={styles.balloonTitle}>🔔 Notifikasi (1)</Text>
            <View style={styles.notifCard}>
              <Text style={styles.alertTitle}>❗Penting!</Text>
              <Text style={styles.alertMessage}>{notifMessage}</Text>
              <Text style={styles.time}>Baru saja</Text>
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  notifWrapper: {
    position: 'relative',
  },
  notifButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 12,
    elevation: 2,
  },
  dot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  balloon: {
    position: 'absolute',
    top: 40,
    right: 0,
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 6,
    borderColor: '#ddd',
    borderWidth: 1,
    zIndex: 99,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  balloonTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 6,
    color: '#111',
  },
  notifCard: {
    backgroundColor: '#fff5f5',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  alertTitle: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 13,
    color: '#444',
  },
  time: {
    fontSize: 11,
    color: '#888',
    marginTop: 6,
  },
});

export default Header;

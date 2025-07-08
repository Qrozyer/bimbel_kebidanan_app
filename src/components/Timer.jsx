import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Timer = ({ duration, sectionId, onTimeUp, onTenMinutesLeft }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [notified, setNotified] = useState(false);
  const [ready, setReady] = useState(false);

  const STORAGE_KEY = `@startTime-${sectionId}`;

  useEffect(() => {
    if (!duration || duration <= 0) {
      console.warn('Durasi tidak valid:', duration);
      setTimeLeft(0);
      setReady(true);
      return;
    }

    const initializeTimer = async () => {
      try {
        const storedStartTime = await AsyncStorage.getItem(STORAGE_KEY);
        let startTime;

        if (storedStartTime) {
          startTime = parseInt(storedStartTime, 10);
        } else {
          startTime = Date.now();
          await AsyncStorage.setItem(STORAGE_KEY, startTime.toString());
        }

        const totalSeconds = duration * 60;
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const remainingSeconds = totalSeconds - elapsedSeconds;

        setTimeLeft(remainingSeconds > 0 ? remainingSeconds : 0);
        setReady(true);
      } catch (err) {
        console.error('Gagal inisialisasi timer:', err);
      }
    };

    initializeTimer();
  }, [duration]);

  useEffect(() => {
    if (!ready || timeLeft === null) return;

    if (timeLeft <= 0) {
      AsyncStorage.removeItem(STORAGE_KEY);
      onTimeUp?.();
      return;
    }

    if (timeLeft <= 600 && !notified) {
      onTenMinutesLeft?.();
      setNotified(true);
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, ready]);

  const formatTime = (seconds) => {
    if (seconds === null || isNaN(seconds)) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? `0${s}` : s}`;
  };

  if (!ready) {
    return <Text style={styles.loading}>⏳ Menyiapkan waktu ujian...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>⏰ Waktu Tersisa: {formatTime(timeLeft)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  loading: {
    fontSize: 16,
    color: 'gray',
  },
});

export default Timer;

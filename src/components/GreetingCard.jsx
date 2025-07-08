import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Image } from 'react-native';

const GreetingCard = () => {
  const [peserta, setPeserta] = useState(null);

  const getPeserta = async () => {
    try {
      const storedPeserta = await AsyncStorage.getItem('peserta');
      const parsed = JSON.parse(storedPeserta)?.peserta;
      setPeserta(parsed);
    } catch (error) {
      console.error('Gagal mengambil data peserta:', error);
    }
  };

  useEffect(() => {
    getPeserta();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textBox}>
        <Text style={styles.greeting}>Hi, {peserta?.PesertaNama || 'Peserta'}</Text>
        <Text style={styles.subtext}>
          Ready to start your day with some practice or exam?
        </Text>
      </View>
      <Image
        source={require('../assets/images/greeting.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00A779',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  textBox: {
    flex: 1,
    marginRight: 50,
  },
  greeting: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtext: {
    color: '#fff',
    marginTop: 4,
    fontSize: 13,
  },
  image: {
    position: 'absolute',
    width: 140,
    height: 140,
    right: -25,
    top: -20,
  },
});

export default GreetingCard;

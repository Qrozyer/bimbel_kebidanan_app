// components/HomeHeadCard.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';

const HomeHeadCard = ({ totalMateri, totalUjian, totalPeserta }) => {
  const [peserta, setPeserta] = useState(null);

  const getPeserta = async () => {
    const stored = await AsyncStorage.getItem('peserta');
    const parsed = JSON.parse(stored)?.peserta;
    setPeserta(parsed);
  };

  useEffect(() => {
    getPeserta();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerText}>
        <Text style={styles.greeting}>Hi, {peserta?.PesertaNama || 'Peserta'}</Text>
        <Text style={styles.subtext}>Ready to start your day with some practice or exam?</Text>
      </View>
      <Image
        source={require('../assets/images/greeting.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.cardRow}>
        <View style={[styles.card, { backgroundColor: '#E6F4F1' }]}>
          <Text style={styles.label}>Total Materi</Text>
          <Icon name="book" size={20} color="#00A779" style={styles.icon} />
          <Text style={styles.value}>{totalMateri}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#FFF7E0' }]}>
          <Text style={styles.label}>Total Ujian</Text>
          <Icon name="clipboard-list" size={20} color="#E8A200" style={styles.icon} />
          <Text style={styles.value}>{totalUjian}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#E6F0FB' }]}>
          <Text style={styles.label}>Total Peserta</Text>
          <Icon name="users" size={20} color="#337CCF" style={styles.icon} />
          <Text style={styles.value}>{totalPeserta}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00A779',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 30,
    position: 'relative',
  },
  headerText: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtext: {
    color: '#fff',
    fontSize: 13,
    marginTop: 4,
  },
  image: {
    position: 'absolute',
    width: 140,
    height: 140,
    right: -20,
    top: -10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  card: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  icon: {
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
});

export default HomeHeadCard;

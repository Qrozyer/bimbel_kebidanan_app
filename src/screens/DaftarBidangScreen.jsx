import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchData } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavbar from '../components/BottomNavbar';
import Icon from 'react-native-vector-icons/Ionicons';

const images = [
  require('../assets/images/m1.jpg'),
  require('../assets/images/m2.jpg'),
  require('../assets/images/m3.jpg'),
  require('../assets/images/m4.jpg'),
  require('../assets/images/m5.jpg'),
  require('../assets/images/m6.jpg'),
];

const DaftarBidangScreen = () => {
  const [bidang, setBidang] = useState([]);
  const [akses, setAkses] = useState({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadBidang = async () => {
      const data = await fetchData('bidang');
      setBidang(data || []);
    };
    loadBidang();
  }, []);

  useEffect(() => {
    const fetchAkses = async () => {
      const peserta = JSON.parse(await AsyncStorage.getItem('peserta'));
      const pesertaId = peserta?.peserta?.PesertaId;
      const hasil = {};

      await Promise.all(bidang.map(async (item) => {
        try {
          const res = await fetchData(`peserta/bidang/${item.BidangId}`);
          if (Array.isArray(res)) {
            const relasi = res.find(p => String(p.PesertaId) === String(pesertaId));
            if (relasi) {
              const now = new Date();
              const expired = new Date(relasi.Expired);
              hasil[item.BidangId] = {
                akses: relasi.Aktif === 1 && expired > now,
                expired: expired <= now,
              };
            } else {
              hasil[item.BidangId] = { akses: false, expired: false };
            }
          }
        } catch (e) {
          console.log('Gagal akses bidang', e);
        }
      }));

      setAkses(hasil);
      setLoading(false);
    };

    if (bidang.length) {
      fetchAkses();
    }
  }, [bidang]);

  const handleCardPress = (id) => {
    if (akses[id]?.akses) {
      navigation.navigate('SubBidang', { bidangId: id });
    }
  };

  const handleUnlock = () => {
    navigation.navigate('HubungiKami');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#20B486" />
      </View>
    );
  }

  return (
    <View style={styles.screenWrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Pilih Bidang</Text>

        {bidang.map((item, index) => {
          const isAktif = akses[item.BidangId]?.akses;
          const img = images[index % images.length];

          return (
            <TouchableOpacity
              key={item.BidangId}
              style={[styles.card, !isAktif && styles.cardDisabled]}
              activeOpacity={isAktif ? 0.8 : 1}
              onPress={() => handleCardPress(item.BidangId)}
            >
              <Image source={img} style={styles.image} />
              <View style={styles.content}>
                <Text style={styles.nama}>{item.BidangNama}</Text>

                {!isAktif && (
                  <View style={styles.statusContainer}>
                    <View style={styles.statusLeft}>
                      <Icon name="lock-closed" color="#dc3545" size={16} />
                      <Text style={styles.statusText}>Tidak tersedia</Text>
                    </View>
                    <TouchableOpacity onPress={handleUnlock} style={styles.unlockButton}>
                      <Text style={styles.unlockButtonText}>Unlock</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <BottomNavbar activePage="Bidang" />
    </View>
  );
};

export default DaftarBidangScreen;

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 80,
    paddingBottom: 120,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#20B486',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 3,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  nama: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 6,
    color: '#dc3545',
    fontSize: 14,
  },
  unlockButton: {
    backgroundColor: '#20B486',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  unlockButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

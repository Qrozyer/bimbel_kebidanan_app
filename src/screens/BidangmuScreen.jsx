import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchData } from '../utils/api';
import BottomNavbar from '../components/BottomNavbar';

// Gambar lokal
import m1 from '../assets/images/m1.jpg';
import m2 from '../assets/images/m2.jpg';
import m3 from '../assets/images/m3.jpg';
import m4 from '../assets/images/m4.jpg';
import m5 from '../assets/images/m5.jpg';
import m6 from '../assets/images/m6.jpg';

const images = [m1, m2, m3, m4, m5, m6];

const BidangmuScreen = () => {
  const [bidang, setBidang] = useState([]);
  const [akses, setAkses] = useState({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadData = async () => {
      const pesertaData = await AsyncStorage.getItem('peserta');
      const peserta = JSON.parse(pesertaData);
      const pesertaId = peserta?.peserta?.PesertaId;

      const bidangRes = await fetchData('bidang');
      if (!bidangRes || !Array.isArray(bidangRes)) {
        setLoading(false);
        return;
      }

      const aksesObj = {};

      await Promise.all(
        bidangRes.map(async (item) => {
          const res = await fetchData(`peserta/bidang/${item.BidangId}`);
          if (Array.isArray(res)) {
            const relasi = res.find(
              (p) => String(p.PesertaId) === String(pesertaId)
            );
            if (relasi) {
              const now = new Date();
              const expired = new Date(relasi.Expired);
              aksesObj[item.BidangId] = {
                akses: relasi.Aktif === 1 && expired > now,
              };
            }
          }
        })
      );

      setBidang(bidangRes);
      setAkses(aksesObj);
      setLoading(false);
    };

    loadData();
  }, []);

  const handlePress = (id) => {
    navigation.navigate('SubBidang', { bidangId: id });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#20B486" />
      </View>
    );
  }

  const bidangYangAktif = bidang.filter((item) => akses[item.BidangId]?.akses);

  if (bidangYangAktif.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>
          Kamu belum memiliki bidang yang tersedia saat ini.
        </Text>
        <BottomNavbar activePage="Bidang" />
      </View>
    );
  }

  return (
    <View style={styles.screenWrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Bidangmu</Text>

        {bidangYangAktif.map((item, index) => {
          const img = images[index % images.length];

          return (
            <TouchableOpacity
              key={item.BidangId}
              style={styles.card}
              onPress={() => handlePress(item.BidangId)}
              activeOpacity={0.8}
            >
              <Image source={img} style={styles.image} />
              <Text style={styles.title}>{item.BidangNama}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <BottomNavbar activePage="Bidang" />
    </View>
  );
};

export default BidangmuScreen;

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    paddingTop: 80,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 12,
    color: '#333',
  },
});

import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import GreetingCard from '../components/GreetingCard';
import OverviewCard from '../components/OverviewCard';
import BottomNavbar from '../components/BottomNavbar';
import PopularBidang from '../components/PopularBidang';
import PopularUjian from '../components/PopularUjian';
import { fetchData } from '../utils/api';

export default function HomeScreen() {
  const [totalBidang, setTotalBidang] = useState(0);
  const [totalUjian, setTotalUjian] = useState(0);
  const [totalPeserta, setTotalPeserta] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        const bidangRes = await fetchData('/bidang');
        setTotalBidang(bidangRes.length);

        const ujianRes = await fetchData('/ujian/data/section');
        setTotalUjian(ujianRes.length);

        const pesertaRes = await fetchData('/peserta');
        setTotalPeserta(pesertaRes.length);
      } catch (error) {
        console.error('Gagal mengambil data:', error);
      }
    };

    getData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Header />
        <View style={styles.cardWrapper}>
          <GreetingCard />
          <OverviewCard
            totalBidang={totalBidang}
            totalUjian={totalUjian}
            totalPeserta={totalPeserta}
          />
        </View>        
        <PopularBidang />
        <PopularUjian />
      </ScrollView>
      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {    
    paddingTop: 30,
    flex: 1,
    backgroundColor: '#f6f9fa',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  cardWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    marginHorizontal: 4,

    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    // Android Shadow (elevation)
    elevation: 5,
  },
});

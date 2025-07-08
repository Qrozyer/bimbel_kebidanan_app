import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchData } from '../utils/api';

const images = [
  require('../assets/images/m1.jpg'),
  require('../assets/images/m2.jpg'),
  require('../assets/images/m3.jpg'),
  require('../assets/images/m4.jpg'),
  require('../assets/images/m5.jpg'),
  require('../assets/images/m6.jpg'),
];

const SubBidangScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { bidangId } = route.params;

  const [namaBidang, setNamaBidang] = useState('');
  const [subBidang, setSubBidang] = useState([]);

  useEffect(() => {
    const loadSubBidang = async () => {
      try {
        const data = await fetchData('sub-bidang');
        if (data) {
          const filtered = data.filter((item) => item.BidangId === parseInt(bidangId));
          setSubBidang(filtered);
        }
      } catch (err) {
        console.error('Gagal fetch sub-bidang', err);
      }
    };

    const loadBidang = async () => {
      try {
        const data = await fetchData('bidang');
        const match = data.find((item) => item.BidangId === parseInt(bidangId));
        if (match) {
          setNamaBidang(match.BidangNama);
        }
      } catch (err) {
        console.error('Gagal fetch nama bidang', err);
      }
    };

    loadSubBidang();
    loadBidang();
  }, [bidangId]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Materi', { subBidangId: item.SubId })}
    >
      <Image source={images[index % images.length]} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.SubNama}</Text>
        <Text style={styles.desc}>
          {item.SubKeterangan ? item.SubKeterangan.replace(/<[^>]+>/g, '') : 'Keterangan tidak tersedia'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={subBidang}
      renderItem={renderItem}
      keyExtractor={(item) => item.SubId.toString()}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Sub Bidang untuk: {namaBidang}</Text>
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.emptyText}>Data sub bidang tidak tersedia.</Text>
      }
    />
  );
};

export default SubBidangScreen;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 80,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#20B486',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
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
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  desc: {
    fontSize: 14,
    color: '#777',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});

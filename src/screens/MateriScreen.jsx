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

const MateriScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { subBidangId } = route.params;

  const [namaSub, setNamaSub] = useState('');
  const [materiList, setMateriList] = useState([]);

  useEffect(() => {
    const loadMateri = async () => {
      try {
        const data = await fetchData('materi');
        if (data) {
          const filtered = data.filter((item) => item.SubId === parseInt(subBidangId));
          setMateriList(filtered);
        }
      } catch (err) {
        console.error('Gagal fetch materi', err);
      }
    };

    const loadSubBidang = async () => {
      try {
        const data = await fetchData('sub-bidang');
        const match = data.find((item) => item.SubId === parseInt(subBidangId));
        if (match) {
          setNamaSub(match.SubNama);
        }
      } catch (err) {
        console.error('Gagal fetch nama sub bidang', err);
      }
    };

    loadMateri();
    loadSubBidang();
  }, [subBidangId]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('IsiMateri', { materiId: item.MateriId })}
    >
      <Image source={images[index % images.length]} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.MateriJudul}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={materiList}
      renderItem={renderItem}
      keyExtractor={(item) => item.MateriId.toString()}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Materi dari: {namaSub}</Text>
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.emptyText}>Belum ada materi di sub bidang ini.</Text>
      }
    />
  );
};

export default MateriScreen;

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
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});

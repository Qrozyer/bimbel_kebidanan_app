import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { fetchData } from '../utils/api';

// Gambar lokal dummy untuk bidang
import m1 from '../assets/images/m1.jpg';
import m2 from '../assets/images/m2.jpg';
import m3 from '../assets/images/m3.jpg';
import m4 from '../assets/images/m4.jpg';
import m5 from '../assets/images/m5.jpg';
import m6 from '../assets/images/m6.jpg';

const images = [m1, m2, m3, m4, m5, m6];
const screenWidth = Dimensions.get('window').width;

export default function PopularBidang() {
  const [bidangList, setBidangList] = useState([]);
  const [subBidangCount, setSubBidangCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchBidang = async () => {
      try {
        const bidangRes = await fetchData('/bidang');
        const limitedBidang = bidangRes.slice(0, 8);
        setBidangList(limitedBidang);

        const counts = {};
        for (const bidang of limitedBidang) {
          const subRes = await fetchData(`/sub-bidang/filter/${bidang.BidangId}`);
          counts[bidang.BidangId] = Array.isArray(subRes) ? subRes.length : 0;
        }
        setSubBidangCount(counts);
      } catch (err) {
        console.error('Gagal mengambil data bidang:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBidang();
  }, []);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setModalData(item)}
    >
      <Image source={images[index % images.length]} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.BidangNama}
        </Text>
        <Text style={styles.subTitle}>
          Jumlah Sub Bidang: {subBidangCount[item.BidangId] ?? '-'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bidang Populer</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#10b981" />
      ) : (
        <FlatList
          data={bidangList}
          renderItem={renderItem}
          keyExtractor={(item) => item.BidangId.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 10 }}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>Tidak ada bidang tersedia</Text>
          )}
        />
      )}

      {/* Modal Pop-up */}
      <Modal visible={!!modalData} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Image
              source={images[bidangList.indexOf(modalData) % images.length]}
              style={styles.modalImage}
            />
            <Text style={styles.modalTitle}>{modalData?.BidangNama}</Text>
            <Text style={styles.modalSub}>
              Jumlah Sub Bidang: {subBidangCount[modalData?.BidangId] ?? '-'}
            </Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalData(null)}
            >
              <Text style={styles.closeText}>Tutup</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
  },
  card: {
    width: 240,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  content: {
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    color: '#111',
  },
  subTitle: {
    fontSize: 12,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: screenWidth * 0.8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
  modalImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#10b981',
    borderRadius: 8,
  },
  closeText: {
    color: '#fff',
    fontWeight: '600',
  },
});

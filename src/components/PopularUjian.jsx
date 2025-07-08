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

import m1 from '../assets/images/m1.jpg';
import m2 from '../assets/images/m2.jpg';
import m3 from '../assets/images/m3.jpg';
import m4 from '../assets/images/m4.jpg';
import m5 from '../assets/images/m5.jpg';
import m6 from '../assets/images/m6.jpg';

const images = [m1, m2, m3, m4, m5, m6];
const screenWidth = Dimensions.get('window').width;

export default function PopularUjian() {
  const [ujianList, setUjianList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchUjian = async () => {
      try {
        const res = await fetchData('/ujian/data/section');
        const sliced = res.slice(0, 8); // batasi 8 data
        setUjianList(sliced);
      } catch (err) {
        console.error('Gagal mengambil data ujian:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUjian();
  }, []);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setModalData(item)}
    >
      <Image source={images[index % images.length]} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.SectionNama}
        </Text>
        <Text style={styles.subTitle}>
          Tanggal Ujian: {item.TglUjian || '-'}
        </Text>
        <Text
          style={[
            styles.badge,
            item.Tampil === 1 ? styles.badgeActive : styles.badgeInactive,
          ]}
        >
          {item.Tampil === 1 ? 'Aktif' : 'Tidak Aktif'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ujian Populer</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#10b981" />
      ) : (
        <FlatList
          data={ujianList}
          renderItem={renderItem}
          keyExtractor={(item) => item.SectionID.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 10 }}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>Tidak ada ujian tersedia</Text>
          )}
        />
      )}

      {/* Modal Pop-up */}
      <Modal visible={!!modalData} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Image
              source={
                images[ujianList.indexOf(modalData) % images.length]
              }
              style={styles.modalImage}
            />
            <Text style={styles.modalTitle}>{modalData?.SectionNama}</Text>
            <Text style={styles.modalSub}>
              Tanggal Ujian: {modalData?.TglUjian || '-'}
            </Text>
            <Text
              style={[
                styles.modalBadge,
                modalData?.Tampil === 1
                  ? styles.badgeActive
                  : styles.badgeInactive,
              ]}
            >
              {modalData?.Tampil === 1 ? 'Aktif' : 'Tidak Aktif'}
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

// Styles
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 30,
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
    marginBottom: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  badgeActive: {
    backgroundColor: '#10b981',
    color: '#fff',
  },
  badgeInactive: {
    backgroundColor: '#ef4444',
    color: '#fff',
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
    marginBottom: 10,
  },
  modalBadge: {
  alignSelf: 'center',
  fontSize: 12,
  fontWeight: '600',
  paddingVertical: 2,
  paddingHorizontal: 10,
  borderRadius: 12,
  overflow: 'hidden',
  textAlign: 'center',
},
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#10b981',
    borderRadius: 8,
    marginTop: 10,
  },
  closeText: {
    color: '#fff',
    fontWeight: '600',
  },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Button,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchData } from '../utils/api';
import RenderHTML from 'react-native-render-html';
import Video from 'react-native-video';

const screenWidth = Dimensions.get('window').width;

const PembahasanScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { sectionId } = route.params;

  const [soalUjian, setSoalUjian] = useState([]);
  const [soalLengkap, setSoalLengkap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionNama, setSectionNama] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const fetchSoal = async () => {
      try {
        const ujianSoal = await fetchData(`ujian/soal/${sectionId}`);
        const semuaSoal = await fetchData(`soal`);
        const sectionData = await fetchData(`soal/section/pilih/${sectionId}`);
        setSectionNama(sectionData?.SectionNama || `ID ${sectionId}`);

        setSoalUjian(ujianSoal);
        setSoalLengkap(semuaSoal);
      } catch (error) {
        console.error('Gagal mengambil data soal:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSoal();
  }, [sectionId]);

  const openModal = (url) => {
    setVideoUrl(url);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setVideoUrl('');
  };

  const pembahasanSoal = soalUjian.map((su) => {
    const lengkap = soalLengkap.find(sl => sl.SoalId === su.SoalId);
    return {
      ...su,
      SoalPertanyaan: lengkap?.SoalPertanyaan || 'Soal tidak ditemukan',
      SoalJawaban: lengkap?.SoalJawaban || '-',
      SoalPembahasan: lengkap?.SoalPembahasan || '-',
      SoalVideo: lengkap?.SoalVideo || '-',
    };
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#20B486" />
        <Text style={{ marginTop: 10 }}>Memuat pembahasan...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>      

      <Text style={styles.title}>📘 Pembahasan Soal - Section {sectionNama}</Text>

      {pembahasanSoal.length === 0 && (
        <Text style={{ color: 'black' }}>Tidak ada soal untuk section ini.</Text>
      )}

      {pembahasanSoal.map((soal, index) => (
        <View key={soal.Id || index} style={styles.card}>
          <Text style={styles.cardHeader}>Soal #{index + 1}</Text>

          <RenderHTML contentWidth={screenWidth - 32} source={{ html: soal.SoalPertanyaan }} />

          <View style={styles.optionList}>
            {['OpsiA', 'OpsiB', 'OpsiC', 'OpsiD', 'OpsiE'].map((opsi, idx) => (
              <RenderHTML
                key={idx}
                contentWidth={screenWidth - 64}
                source={{ html: soal[opsi] || soal[`Soal${opsi?.charAt(4)}`] || '-' }}
              />
            ))}
          </View>

          <Text style={styles.answer}>
            ✅ <Text style={{ fontWeight: 'bold' }}>Jawaban Benar:</Text> {soal.SoalJawaban}
          </Text>

          <Text style={styles.subHeader}>📝 Pembahasan:</Text>
          <RenderHTML contentWidth={screenWidth - 32} source={{ html: soal.SoalPembahasan }} />

          <Text style={styles.subHeader}>🎥 Video Pembahasan:</Text>
          {soal.SoalVideo !== '-' ? (
            <TouchableOpacity style={styles.videoButton} onPress={() => openModal(soal.SoalVideo)}>
              <Text style={styles.videoButtonText}>Tonton Video</Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ color: '#666' }}>-</Text>
          )}
        </View>
      ))}

<TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
  <Text style={styles.backButtonText}>⬅ Kembali</Text>
</TouchableOpacity>
      <Button title="Kembali ke Beranda" onPress={() => navigation.navigate('Home')} />

      {/* MODAL VIDEO */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <Video
            source={{ uri: videoUrl }}
            style={{ width: '100%', height: 300 }}
            controls={true}
            resizeMode="contain"
            paused={false}
          />
          <Button title="Tutup Video" onPress={closeModal} />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: 20 , marginTop: 60 , marginBottom: 60},
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#000' , textAlign: 'center' },
  card: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  cardHeader: {
    backgroundColor: '#20B486',
    color: 'white',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionList: {
    marginVertical: 10,
    paddingLeft: 10,
  },
  subHeader: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  answer: {
    marginTop: 8,
    fontSize: 14,
    color: '#000',
  },
  videoButton: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 6,
    alignItems: 'center',
  },
  videoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#20B486',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 2,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PembahasanScreen;

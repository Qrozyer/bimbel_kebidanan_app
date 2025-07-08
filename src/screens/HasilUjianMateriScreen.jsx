import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Dimensions,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderHTML from 'react-native-render-html';
import { useRoute, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { fetchData } from '../utils/api';
import { convertToEmbedUrl } from '../utils/video';
import Orientation from 'react-native-orientation-locker';

const screenWidth = Dimensions.get('window').width;

const HasilUjianMateriScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { materiId } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  const [pesertaId, setPesertaId] = useState(null);
  const [result, setResult] = useState(null);
  const [pembahasan, setPembahasan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Orientation.lockToPortrait();
    return () => {
      Orientation.lockToPortrait(); // Kunci kembali saat keluar screen
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedPeserta = await AsyncStorage.getItem('peserta');
        const parsedPeserta = JSON.parse(storedPeserta);
        const pid = parsedPeserta?.peserta?.PesertaId;

        if (!pid) {
          Alert.alert('Gagal', 'Peserta ID tidak ditemukan');
          return;
        }

        setPesertaId(pid);

        const nilai = await fetchData(`ujian/materi/hasil/nilai/${materiId}/${pid}`);
        const bahasan = await fetchData(`ujian/materi/hasil/${materiId}/${pid}`);

        setResult(nilai);
        setPembahasan(bahasan);
      } catch (err) {
        Alert.alert('Gagal mengambil data', 'Silakan coba lagi nanti');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [materiId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#20B486" />
        <Text style={{ marginTop: 10 }}>Memuat data hasil ujian...</Text>
      </View>
    );
  }

  if (!result) return null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Hasil Ujian</Text>

      <View style={styles.card}>
        <Text style={styles.text}>Nilai: <Text style={styles.bold}>{result.nilai}</Text></Text>
        <Text style={styles.text}>Jumlah Soal: {result.jumlah_soal}</Text>
        <Text style={styles.text}>Jumlah Benar: {result.jumlah_benar}</Text>
        <Text style={styles.text}>Jumlah Salah: {result.jumlah_salah}</Text>
      </View>

      <Text style={styles.subheader}>Pembahasan Soal</Text>

      {pembahasan.map((item, index) => {
        const isCorrect = item.Benar === 1;
        const embedUrl = convertToEmbedUrl(item.Video);

        return (
          <View
            key={index}
            style={[styles.card, isCorrect ? styles.correct : styles.incorrect]}
          >
            <Text style={styles.questionTitle}>
              Soal {index + 1} {isCorrect ? '✅' : '❌'}
            </Text>

            <Text style={styles.label}>Pertanyaan:</Text>
            <RenderHTML contentWidth={screenWidth - 32} source={{ html: item.Soal }} />

            {['A', 'B', 'C', 'D', 'E'].map(
              (opt) =>
                item[`Opsi${opt}`] && (
                  <Text key={opt} style={styles.optionText}>
                    <Text style={styles.bold}>{opt}:</Text>{' '}
                    <RenderHTML contentWidth={screenWidth - 32} source={{ html: item[`Opsi${opt}`] }} />
                  </Text>
                )
            )}

            <Text style={styles.label}>Jawaban Anda: {item.Jawaban}</Text>
            <Text style={styles.label}>Jawaban Benar: {item.JawabanBenar}</Text>
            <Text style={styles.label}>Pembahasan:</Text>
            <Text style={styles.explanation}>{item.Pembahasan || 'Tidak tersedia'}</Text>

            <Text style={styles.label}>Video:</Text>
            {embedUrl ? (
              <>
                <TouchableOpacity
                  style={styles.webviewContainer}
                  onPress={() => {
                    setActiveVideo(embedUrl);
                    setModalVisible(true);
                  }}
                >
                  <WebView
                    source={{ uri: embedUrl }}
                    style={styles.webview}
                    scrollEnabled={false}
                    javaScriptEnabled
                    allowsFullscreenVideo
                  />
                </TouchableOpacity>
                <Text style={{ fontSize: 12, color: '#666', marginTop: 5 }}>
                  Ketuk video untuk fullscreen
                </Text>
              </>
            ) : (
              <Text>Tidak tersedia</Text>
            )}
          </View>
        );
      })}

      <Modal
        visible={modalVisible}
        animationType="slide"
        onShow={() => Orientation.lockToLandscape()}
        onRequestClose={() => {
          setModalVisible(false);
          setActiveVideo(null);
          Orientation.lockToPortrait();
        }}
      >
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          {activeVideo && (
            <WebView
              source={{ uri: activeVideo }}
              style={{ flex: 1 }}
              javaScriptEnabled
              allowsFullscreenVideo
            />
          )}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 40,
              right: 20,
              backgroundColor: 'rgba(255,255,255,0.8)',
              padding: 10,
              borderRadius: 20,
            }}
            onPress={() => {
              setModalVisible(false);
              setActiveVideo(null);
              Orientation.lockToPortrait();
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>✕</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Kembali ke Beranda</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HasilUjianMateriScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#20B486',
    marginBottom: 12,
  },
  subheader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  correct: {
    borderColor: '#28a745',
    borderWidth: 2,
  },
  incorrect: {
    borderColor: '#dc3545',
    borderWidth: 2,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  explanation: {
    marginTop: 4,
    fontSize: 15,
    fontStyle: 'italic',
    color: '#333',
  },
  optionText: {
    marginTop: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  webviewContainer: {
    height: 200,
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  button: {
    backgroundColor: '#20B486',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

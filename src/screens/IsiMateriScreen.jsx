import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { fetchData } from '../utils/api'; // Pastikan kamu punya
import RenderHTML from 'react-native-render-html';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

// Fungsi konversi URL YouTube ke embed URL
const convertToEmbedUrl = (url) => {
  if (!url) return null;
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
  const match = url.match(regex);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return null;
};

const IsiMateriScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { materiId } = route.params;

  const [materi, setMateri] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const getMateri = async () => {
      try {
        const data = await fetchData(`materi/pilih/${materiId}`);
        if (data) setMateri(data);
      } catch (error) {
        console.error('Gagal mengambil data materi:', error);
      }
    };

    getMateri();
  }, [materiId]);

  const handleCompletion = () => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin sudah menyelesaikan materi ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Selesai',
          onPress: () => {
            setIsCompleted(true);
            Alert.alert('Selesai', 'Anda telah menyelesaikan materi.');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleStartUjian = () => {
    navigation.navigate('UjianMateri', { materiId });
  };

  if (!materi) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#20B486" />
        <Text style={{ marginTop: 12, color: '#555' }}>Memuat materi...</Text>
      </View>
    );
  }

  const embedUrl = convertToEmbedUrl(materi.MateriVideo);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Header Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Kembali</Text>
        </TouchableOpacity>

        {!isCompleted ? (
          <TouchableOpacity style={styles.doneButton} onPress={handleCompletion}>
            <Text style={styles.buttonText}>Selesai</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.ujianButton} onPress={handleStartUjian}>
            <Text style={styles.buttonText}>Mulai Ujian</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Materi Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{materi.MateriJudul}</Text>

        <Text style={styles.sectionTitle}>Isi Materi:</Text>
        <RenderHTML
          contentWidth={screenWidth - 32}
          source={{ html: materi.MateriIsi || '<p>(Tidak ada konten)</p>' }}
        />

        <Text style={styles.sectionTitle}>Video Materi:</Text>
        {embedUrl ? (
          <View style={styles.videoWrapper}>
            <WebView
              source={{ uri: embedUrl }}
              style={styles.video}
              javaScriptEnabled
              domStorageEnabled
              allowsFullscreenVideo
            />
          </View>
        ) : (
          <Text style={styles.textMuted}>Tidak tersedia</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default IsiMateriScreen;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  doneButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
  },
  ujianButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
  },
  backText: {
    color: '#333',
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#20B486',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: '#555',
  },
  videoWrapper: {
    height: 200,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 8,
  },
  video: {
    flex: 1,
  },
  textMuted: {
    color: '#888',
    marginTop: 8,
  },
});

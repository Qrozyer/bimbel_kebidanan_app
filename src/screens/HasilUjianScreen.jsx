import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchData } from '../utils/api'; // pastikan ini sesuai dengan struktur RN-mu
import { useNavigation, useRoute } from '@react-navigation/native';

const HasilUjianScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { sectionId, pesertaId } = route.params;

  const [result, setResult] = useState(null);
  const [ujian, setUjian] = useState(null);
  const [peserta, setPeserta] = useState(null);
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllData = async () => {
      try {
        const [hasil, ujianData, pesertaData, sectionData] = await Promise.all([
          fetchData(`ujian/hasil/${sectionId}/${pesertaId}`),
          fetchData(`ujian/data/pilih/${sectionId}`),
          fetchData(`peserta/pilih/${pesertaId}`),
          fetchData(`soal/section/pilih/${sectionId}`)
        ]);

        setResult(hasil);
        setUjian(ujianData);
        setPeserta(pesertaData);
        setSection(sectionData);
      } catch (error) {
        Alert.alert('Gagal mengambil data', 'Terjadi kesalahan saat mengambil data.');
      } finally {
        setLoading(false);
      }
    };

    getAllData();
  }, [sectionId, pesertaId]);

  if (loading || !result || !ujian || !peserta || !section) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#20B486" />
        <Text style={styles.loadingText}>Memuat hasil ujian...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>📄 {section.SectionNama}</Text>
        <Text style={styles.subHeader}>👤 {peserta.PesertaNama}</Text>

        <View style={styles.section}>
          <Text style={styles.title}>📄 Info Ujian</Text>
          <Text>Nama Ujian: {section.SectionNama}</Text>
          <Text>Tanggal Ujian: {ujian.TglUjian}</Text>
          <Text>Waktu Mulai: {ujian.AwalUjian}</Text>
          <Text>Waktu Selesai: {ujian.AkhirUjian}</Text>
          <Text>Durasi: {ujian.Durasi} menit</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>👤 Info Peserta</Text>
          <Text>Nama: {peserta.PesertaNama}</Text>
          <Text>Email: {peserta.PesertaEmail}</Text>
          <Text>Nomor HP: {peserta.PesertaNohp}</Text>
          <Text>Asal Sekolah: {peserta.PesertaAsalSekolah}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>✅ Hasil</Text>
          <Text>Jumlah Soal: {result.jumlah_soal}</Text>
          <Text>Jumlah Benar: {result.jumlah_benar}</Text>
          <Text>Point: {result.point}</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <Button
          title="Pembahasan Soal"
          color="#20B486"
          onPress={() => navigation.navigate('Pembahasan', { sectionId })}
        />
        <Button title="Kembali ke Beranda" onPress={() => navigation.navigate('Home')} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, marginTop: 60 },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    backgroundColor: '#20B486',
    padding: 20,
    textAlign: 'center',
    borderRadius: 8,
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'column',
    gap: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
});

export default HasilUjianScreen;

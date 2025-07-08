import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchDataSafe } from '../utils/api';
import Orientation from 'react-native-orientation-locker';
import BottomNavbar from '../components/BottomNavbar';

export default function UjianScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { sectionId } = route.params;

  const [ujianData, setUjianData] = useState(null);
  const [jumlahSoal, setJumlahSoal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    Orientation.lockToPortrait();
    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  useEffect(() => {
    const fetchUjianData = async () => {
      try {
        const sectionDetail = await fetchDataSafe(`ujian/data/pilih/${sectionId}`);
        const soalList = await fetchDataSafe(`ujian/soal/${sectionId}`);
        const sectionNama = await fetchDataSafe(`soal/section/pilih/${sectionId}`);

        if (!sectionDetail || !soalList || !sectionNama) {
          setUjianData(null); // fallback
          setLoading(false);
          return;
        }

        setUjianData({
          ...sectionDetail,
          SectionNama: sectionNama.SectionNama || '(Tidak Ada Nama)',
        });

        setJumlahSoal(soalList.length);
        setIsActive(sectionDetail.Tampil === 1);
      } catch (error) {
        console.log('Gagal memuat data ujian:', error);
        setUjianData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUjianData();
  }, [sectionId]);

  const handleStartUjian = () => {
    navigation.navigate('UjianSoal', { sectionId });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#20B486" />
      </View>
    );
  }

  if (!ujianData) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 16, color: '#dc3545', fontWeight: '600' }}>
          Belum ada data ujian ditemukan.
        </Text>
        <BottomNavbar activePage="Ujian" />
      </View>
    );
  }

  return (
    <View style={styles.screenWrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Detail Ujian</Text>

        <View style={styles.card}>
          <Text style={styles.label}>
            Ujian: <Text style={styles.value}>{ujianData.SectionNama || '-'}</Text>
          </Text>
          <Text style={styles.label}>
            Tanggal Mulai: <Text style={styles.value}>{ujianData.AwalUjian}</Text>
          </Text>
          <Text style={styles.label}>
            Tanggal Berakhir: <Text style={styles.value}>{ujianData.AkhirUjian}</Text>
          </Text>
          <Text style={styles.label}>
            Durasi: <Text style={styles.value}>{ujianData.Durasi} menit</Text>
          </Text>
          <Text style={styles.label}>
            Jumlah Soal: <Text style={styles.value}>{jumlahSoal} soal</Text>
          </Text>
          <Text style={styles.label}>
            Status:{' '}
            <Text
              style={[
                styles.badge,
                isActive ? styles.badgeActive : styles.badgeInactive,
              ]}
            >
              {isActive ? 'Ujian Aktif' : 'Ujian Tidak Aktif'}
            </Text>
          </Text>
        </View>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeTitle}>📌 Harap Perhatikan:</Text>
          <Text style={styles.noticeText}>• Jawablah dengan jujur tanpa bantuan.</Text>
          <Text style={styles.noticeText}>• Pastikan koneksi stabil.</Text>
          <Text style={styles.noticeText}>• 10 menit sebelum selesai akan ada peringatan.</Text>
          <Text style={styles.noticeText}>• Jangan keluar aplikasi selama ujian.</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, isActive ? styles.buttonActive : styles.buttonDisabled]}
          disabled={!isActive}
          onPress={handleStartUjian}
        >
          <Text style={styles.buttonText}>
            {isActive ? 'Mulai Ujian' : 'Ujian Belum Aktif'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavbar activePage="Ujian" />
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    padding: 20,
    paddingBottom: 100,
    marginTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontWeight: '400',
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 13,
    fontWeight: '600',
    overflow: 'hidden',
  },
  badgeActive: {
    backgroundColor: '#198754',
    color: '#fff',
  },
  badgeInactive: {
    backgroundColor: '#dc3545',
    color: '#fff',
  },
  noticeBox: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  noticeTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 13,
    marginBottom: 4,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#20B486',
  },
  buttonDisabled: {
    backgroundColor: '#adb5bd',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

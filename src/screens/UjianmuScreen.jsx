import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchData, fetchDataSafe } from '../utils/api';
import BottomNavbar from '../components/BottomNavbar';

export default function UjianmuScreen() {
  const [userSections, setUserSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pesertaId, setPesertaId] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const loadPesertaId = async () => {
      try {
        const pesertaStr = await AsyncStorage.getItem('peserta');
        const peserta = pesertaStr ? JSON.parse(pesertaStr) : null;
        const id = peserta?.peserta?.PesertaId;
        setPesertaId(id);
      } catch (err) {
        Alert.alert('Gagal', 'Gagal membaca data peserta.');
      }
    };

    loadPesertaId();
  }, []);

  useEffect(() => {
    if (!pesertaId) return;

    const loadUserSections = async () => {
      try {
        const allSections = await fetchData('ujian/data/section');
        const pesertaSectionPromises = allSections.map((section) =>
          fetchData(`ujian/peserta/${section.SectionID}`)
        );
        const pesertaSectionResults = await Promise.all(pesertaSectionPromises);

        const filteredSections = allSections.filter((section, index) => {
          const data = pesertaSectionResults[index];
          if (!Array.isArray(data)) return false;
          return data.some((item) => String(item.PesertaId) === String(pesertaId));
        });

        const hasilPromises = filteredSections.map(async (section) => {
          try {
            const hasil = await fetchDataSafe(`ujian/hasil/${section.SectionID}/${pesertaId}`);
            const sudahDikerjakan = hasil && typeof hasil === 'object' && hasil.jumlah_soal > 0;
            return {
              ...section,
              sudahDikerjakan,
              point: hasil?.point || 0,
            };
          } catch {
            return {
              ...section,
              sudahDikerjakan: false,
              point: 0,
            };
          }
        });

        const sectionDenganHasil = await Promise.all(hasilPromises);
        setUserSections(sectionDenganHasil);
      } catch (error) {
        Alert.alert('Gagal', 'Gagal memuat data ujian.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadUserSections();
  }, [pesertaId]);

  const isActiveSection = (section) => section.Tampil === 1;

  return (
    <View style={styles.screenWrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Ujianmu</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#20B486" />
        ) : userSections.length === 0 ? (
          <Text style={styles.emptyText}>Kamu belum memiliki sesi ujian yang tersedia.</Text>
        ) : (
          userSections.map((section) => {
            const active = isActiveSection(section);
            return (
              <View
                key={section.SectionID}
                style={[styles.card, !active && styles.cardDisabled]}
              >
                <Text style={styles.sectionName}>{section.SectionNama}</Text>

                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Tanggal Ujian:</Text>
                  <Text>{section.TglUjian || '-'}</Text>
                </View>
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Waktu Mulai:</Text>
                  <Text>{section.AwalUjian || '-'}</Text>
                </View>
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Waktu Selesai:</Text>
                  <Text>{section.AkhirUjian || '-'}</Text>
                </View>
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Durasi:</Text>
                  <Text>{section.Durasi} menit</Text>
                </View>
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Update Terakhir:</Text>
                  <Text>{section.WaktuUpdate || '-'}</Text>
                </View>

                {section.sudahDikerjakan && (
                  <View style={styles.infoBlock}>
                    <Text style={styles.label}>Skor:</Text>
                    <Text>{section.point} poin</Text>
                  </View>
                )}

                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Status:</Text>
                  <View
                    style={[styles.badge, active ? styles.badgeSuccess : styles.badgeDanger]}
                  >
                    <Text style={styles.badgeText}>{active ? 'Aktif' : 'Tidak Aktif'}</Text>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  {active ? (
                    section.sudahDikerjakan ? (
                      <>
                        <TouchableOpacity
                          style={[styles.button, styles.outlineSuccess]}
                          onPress={() => navigation.navigate('UjianScreen', { sectionId: section.SectionID })}
                        >
                          <Text style={styles.buttonText}>✍️ Kerjakan Ulang</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.button, styles.outlineInfo]}
                          onPress={() =>
                            navigation.navigate('HasilUjianScreen', {
                              sectionId: section.SectionID,
                              pesertaId,
                            })
                          }
                        >
                          <Text style={styles.buttonText}>Detail Hasil</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity
                        style={[styles.button, styles.outlineSuccess]}
                        onPress={() => navigation.navigate('UjianScreen', { sectionId: section.SectionID })}
                      >
                        <Text style={styles.buttonText}>✍️ Kerjakan</Text>
                      </TouchableOpacity>
                    )
                  ) : (
                    <TouchableOpacity style={[styles.button, styles.outlineDisabled]} disabled>
                      <Text style={styles.buttonText}>Belum Aktif</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
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
    paddingTop: 80,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardDisabled: { opacity: 0.5 },
  sectionName: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  infoBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
    alignItems: 'center',
  },
  label: { fontWeight: '600', color: '#555' },
  buttonContainer: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: { fontSize: 14, color: '#fff' },
  outlineSuccess: { backgroundColor: '#20B486' },
  outlineInfo: { backgroundColor: '#0d6efd' },
  outlineDisabled: { backgroundColor: '#adb5bd' },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  badgeSuccess: { backgroundColor: '#198754' },
  badgeDanger: { backgroundColor: '#dc3545' },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { fetchData } from '../utils/api';
import BottomNavbar from '../components/BottomNavbar';
import Icon from 'react-native-vector-icons/Ionicons';

const DaftarUjianScreen = () => {
  const [sections, setSections] = useState([]);
  const [userSections, setUserSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [pesertaId, setPesertaId] = useState(null);

  useEffect(() => {
    const loadPesertaId = async () => {
      const local = await AsyncStorage.getItem('peserta');
      const pesertaObj = local ? JSON.parse(local) : null;
      const id = pesertaObj?.peserta?.PesertaId;
      setPesertaId(id);
    };

    loadPesertaId();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!pesertaId) return;

      try {
        const allSections = await fetchData('ujian/data/section');
        setSections(allSections);

        const pesertaSectionPromises = allSections.map((section) =>
          fetchData(`ujian/peserta/${section.SectionID}`)
        );

        const pesertaSectionResults = await Promise.all(pesertaSectionPromises);

        const userSectionIds = pesertaSectionResults.flatMap((data, index) => {
          if (!Array.isArray(data)) return [];
          const found = data.some((item) => String(item.PesertaId) === String(pesertaId));
          return found ? [allSections[index].SectionID] : [];
        });

        setUserSections(userSectionIds);
      } catch (error) {
        console.error('Gagal memuat data section atau peserta:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [pesertaId]);

  const isUserInSection = (section) =>
    userSections.some((id) => String(id) === String(section.SectionID));

  const isActiveSection = (section) => section.Tampil === 1;

  const handleKerjakan = (sectionId) => {
    navigation.navigate('UjianScreen', { sectionId });
  };

  const handleUnlock = () => {
    navigation.navigate('HubungiKami');
  };

  return (
    <View style={styles.screenWrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>📄 Daftar Sesi Ujian</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#20B486" />
        ) : (
          sections.map((section) => {
            const userInSection = isUserInSection(section);
            const active = isActiveSection(section);

            return (
              <View
                key={section.SectionID}
                style={[
                  styles.card,
                  userInSection && active ? styles.cardActive : styles.cardDisabled,
                ]}
              >
                <Text style={styles.sectionTitle}>{section.SectionNama}</Text>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Tanggal Ujian:</Text>
                  <Text>{section.TglUjian || '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Waktu Mulai:</Text>
                  <Text>{section.AwalUjian || '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Waktu Selesai:</Text>
                  <Text>{section.AkhirUjian || '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Durasi:</Text>
                  <Text>{section.Durasi} menit</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Update Terakhir:</Text>
                  <Text>{section.WaktuUpdate || '-'}</Text>
                </View>

                {/* Status sebagai badge */}
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Status:</Text>
                  <View style={[styles.badge, active ? styles.badgeSuccess : styles.badgeDanger]}>
                    <Text style={styles.badgeText}>{active ? 'Aktif' : 'Tidak Aktif'}</Text>
                  </View>
                </View>

                {/* Aksi */}
                <View style={styles.footer}>
                  {userInSection && active ? (
                    <TouchableOpacity
                      style={styles.buttonActive}
                      onPress={() => handleKerjakan(section.SectionID)}
                    >
                      <Text style={styles.buttonText}>✍️ Kerjakan</Text>
                    </TouchableOpacity>
                  ) : userInSection && !active ? (
                    <TouchableOpacity style={styles.buttonDisabled} disabled>
                      <Text style={styles.buttonText}>⏳ Belum Aktif</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.lockedStatusWrapper}>
                      <View style={styles.lockedStatus}>
                        <Icon name="lock-closed" color="#dc3545" size={16} />
                        <Text style={styles.lockText}>Tidak tersedia</Text>
                      </View>
                      <TouchableOpacity onPress={handleUnlock} style={styles.unlockButton}>
                        <Text style={styles.unlockButtonText}>Unlock</Text>
                      </TouchableOpacity>
                    </View>
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
};

export default DaftarUjianScreen;

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 140,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#20B486',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    padding: 16,
    borderWidth: 1,
    elevation: 2,
  },
  cardActive: {
    borderColor: '#20B486',
  },
  cardDisabled: {
    borderColor: '#ccc',
    opacity: 0.7,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: '#6c757d',
    color: '#fff',
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
  infoBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeSuccess: {
    backgroundColor: '#28a745',
  },
  badgeDanger: {
    backgroundColor: '#dc3545',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  footer: {
    marginTop: 16,
  },
  buttonActive: {
    backgroundColor: '#20B486',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  lockedStatusWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  lockedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockText: {
    marginLeft: 6,
    color: '#dc3545',
    fontSize: 14,
  },
  unlockButton: {
    backgroundColor: '#20B486',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  unlockButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

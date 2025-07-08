// screens/ProfilScreen.js
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
import { fetchData } from '../utils/api';
import Logout from '../components/Logout';
import BottomNavbar from '../components/BottomNavbar';

export default function ProfilScreen() {
  const [peserta, setPeserta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchPeserta = async () => {
      try {
        const stored = await AsyncStorage.getItem('peserta');
        const parsed = JSON.parse(stored);
        const pesertaId = parsed?.peserta?.PesertaId;

        if (!pesertaId) throw new Error('Peserta ID tidak ditemukan.');

        const data = await fetchData(`peserta/pilih/${pesertaId}`);
        if (!data || !data.PesertaId) throw new Error('Data peserta tidak valid.');

        setPeserta(data);
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan.');
      } finally {
        setLoading(false);
      }
    };

    fetchPeserta();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#20B486" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const handleGantiPassword = () => {
    navigation.navigate('GantiPassword');
  };

  const handleEditProfil = () => {
    navigation.navigate('EditProfil');
  };

  return (
  <View style={{ flex:1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>👤 Profil Peserta</Text>
        <Text style={styles.headerSubtitle}>
          Berikut adalah informasi lengkap dari peserta.
        </Text>
      </View>

      {/* Informasi Peserta */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Informasi Peserta</Text>
        <View style={styles.table}>
          <RenderItem label="Nama" value={peserta.PesertaNama} />
          <RenderItem label="Email" value={peserta.PesertaEmail} />
          <RenderItem
            label="Jenis Kelamin"
            value={peserta.PesertaJk === 'L' ? 'Laki-laki' : 'Perempuan'}
          />
          <RenderItem label="Alamat" value={peserta.PesertaAlamat || '-'} />
          <RenderItem label="No. HP" value={peserta.PesertaNohp || '-'} />
          <RenderItem
            label="Pendidikan Terakhir"
            value={peserta.PesertaPendidikanTerakhir || '-'}
          />
          <RenderItem
            label="Asal Sekolah"
            value={peserta.PesertaAsalSekolah || '-'}
          />
          <RenderItem label="Periode" value={peserta.PesertaPeriode || '-'} />
        </View>
      </View>

      {/* Tombol Aksi */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity onPress={handleGantiPassword} style={styles.secondaryBtn}>
          <Text style={styles.btnText}>Ganti Password</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEditProfil} style={styles.primaryBtn}>
          <Text style={styles.btnText}>Edit Profil</Text>
        </TouchableOpacity>
      </View>

      {/* Logout pindah ke dalam ScrollView */}
      <Logout />
    </ScrollView>

    <BottomNavbar />
  </View>
);

}

function RenderItem({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.separator}>:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 60,
    paddingBottom: 100,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  headerSection: {
    backgroundColor: '#20B486',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#ffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  table: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  label: {
    width: 130,
    fontWeight: 'bold',
    color: '#333',
  },
  separator: {
    marginRight: 5,
    color: '#333',
  },
  value: {
    flex: 1,
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },  
});

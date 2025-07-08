import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { fetchData, editData } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfilScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [asalOptions, setAsalOptions] = useState([]);
  const [openJk, setOpenJk] = useState(false);
  const [openAsal, setOpenAsal] = useState(false);

  const [form, setForm] = useState({
    PesertaEmail: '',
    PesertaNama: '',
    PesertaJk: 'L',
    PesertaAlamat: '',
    PesertaNohp: '',
    PesertaPendidikanTerakhir: '',
    PesertaAsalSekolah: '',
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const getPesertaId = async () => {
    const stored = await AsyncStorage.getItem('peserta');
    try {
      const parsed = JSON.parse(stored);
      return parsed?.peserta?.PesertaId;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      const pesertaId = await getPesertaId();
      if (!pesertaId) {
        Alert.alert('Error', 'Peserta tidak ditemukan');
        navigation.goBack();
        return;
      }

      try {
        const data = await fetchData(`peserta/pilih/${pesertaId}`);
        const asalData = await fetchData('peserta/asal');

        setForm({
          PesertaEmail: data.PesertaEmail || '',
          PesertaNama: data.PesertaNama || '',
          PesertaJk: data.PesertaJk || 'L',
          PesertaAlamat: data.PesertaAlamat || '',
          PesertaNohp: data.PesertaNohp || '',
          PesertaPendidikanTerakhir: data.PesertaPendidikanTerakhir || '',
          PesertaAsalSekolah: data.PesertaAsalSekolah || '',
        });

        const mappedAsal = asalData.map((item) => ({
          label: item.AsalDaerah,
          value: item.AsalDaerah,
        }));
        setAsalOptions(mappedAsal);
      } catch (e) {
        Alert.alert('Error', 'Gagal mengambil data');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSave = async () => {
    if (!form.PesertaNama || !form.PesertaEmail || !form.PesertaJk) {
      Alert.alert('Error', 'Nama, Email, dan Jenis Kelamin wajib diisi!');
      return;
    }

    const pesertaId = await getPesertaId();
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin menyimpan perubahan profil?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Simpan',
          onPress: async () => {
            try {
              const response = await editData('peserta', pesertaId, form);
              if (response) {
                Alert.alert('Sukses', 'Profil berhasil diperbarui');
                navigation.navigate('Profil');
              }
            } catch (e) {
              Alert.alert('Error', 'Gagal menyimpan data');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#20b486" />
        <Text style={styles.loadingText}>Memuat data...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>Edit Profil Peserta</Text>

        {/* Nama */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nama</Text>
          <TextInput
            style={styles.input}
            value={form.PesertaNama}
            onChangeText={(v) => handleChange('PesertaNama', v)}
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            value={form.PesertaEmail}
            onChangeText={(v) => handleChange('PesertaEmail', v)}
          />
        </View>

        {/* Jenis Kelamin */}
        <View style={[styles.inputGroup, { zIndex: 1000 }]}>
          <Text style={styles.label}>Jenis Kelamin</Text>
          <DropDownPicker
  open={openJk}
  setOpen={setOpenJk}
  value={form.PesertaJk}
  items={[
    { label: 'Laki-laki', value: 'L' },
    { label: 'Perempuan', value: 'P' },
  ]}
  setValue={(callback) =>
    setForm((prev) => ({
      ...prev,
      PesertaJk: callback(prev.PesertaJk),
    }))
  }
  placeholder="Pilih Jenis Kelamin"
  style={styles.dropdown}
  dropDownContainerStyle={styles.dropdownContainer}
  mode="BADGE"
  listMode="SCROLLVIEW"
/>

        </View>

        {/* Alamat */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Alamat</Text>
          <TextInput
            style={styles.input}
            value={form.PesertaAlamat}
            onChangeText={(v) => handleChange('PesertaAlamat', v)}
          />
        </View>

        {/* No HP */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>No. HP</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            value={form.PesertaNohp}
            onChangeText={(v) => handleChange('PesertaNohp', v)}
          />
        </View>

        {/* Pendidikan Terakhir */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pendidikan Terakhir</Text>
          <TextInput
            style={styles.input}
            value={form.PesertaPendidikanTerakhir}
            onChangeText={(v) => handleChange('PesertaPendidikanTerakhir', v)}
          />
        </View>

        {/* Asal Sekolah */}
        <View style={[styles.inputGroup, { zIndex: 999 }]}>
          <Text style={styles.label}>Asal Sekolah</Text>
<DropDownPicker
  open={openAsal}
  setOpen={setOpenAsal}
  value={form.PesertaAsalSekolah}
  items={asalOptions}
  setValue={(callback) =>
    setForm((prev) => ({
      ...prev,
      PesertaAsalSekolah: callback(prev.PesertaAsalSekolah),
    }))
  }
  placeholder="Pilih Asal Sekolah"
  style={styles.dropdown}
  dropDownContainerStyle={styles.dropdownContainer}
  mode="BADGE" // bukan MODAL
  listMode="MODAL" // ini tetap modal agar scrollable
/>


        </View>

        {/* Tombol Aksi */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Batal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Simpan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfilScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#f0f4f8',
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#20b486',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 10,
  },
  saveBtn: {
    backgroundColor: '#20b486',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelBtn: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelText: {
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
});

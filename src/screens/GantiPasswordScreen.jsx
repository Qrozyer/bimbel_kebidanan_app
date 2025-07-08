import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, ScrollView, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setPeserta } from '../redux/reducers/pesertaSlice';
import { API_BASE_URL } from '@env';

const isValidPassword = (password, email) => {
  const specialChars = /[!@#$%^&*()~_+=]/g;
  const uppercase = /[A-Z]/;
  const lowercase = /[a-z]/;
  const repeated = /(.)\1\1/;
  const sequentialAlpha = /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i;
  const sequentialNum = /012|123|234|345|456|567|678|789/;
  const sequentialSpecial = /!@#|@#\$|#\$%|\$%\^|%\^&|\^&\*/;
  const number = /[0-9]/;

  if (password.length < 8) return 'Password minimal 8 karakter';
  if ((password.match(specialChars) || []).length < 2) return 'Minimal 2 karakter spesial';
  if (!number.test(password)) return 'Minimal 1 angka';
  if (!uppercase.test(password)) return 'Minimal 1 huruf besar';
  if (!lowercase.test(password)) return 'Minimal 1 huruf kecil';
  if (repeated.test(password)) return 'Tidak boleh karakter berulang (aaa)';
  if (sequentialAlpha.test(password)) return 'Tidak boleh urutan huruf (abc)';
  if (sequentialNum.test(password)) return 'Tidak boleh urutan angka (123)';
  if (sequentialSpecial.test(password)) return 'Tidak boleh urutan spesial (!@#)';
  if (password.toLowerCase() === email.toLowerCase()) return 'Tidak boleh sama dengan email';
  return null;
};

export default function GantiPasswordScreen() {
  const [peserta, setPesertaData] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const getPeserta = async () => {
      const data = await AsyncStorage.getItem('peserta');
      const parsed = data ? JSON.parse(data)?.peserta : null;
      if (!parsed) {
        navigation.replace('Login');
      } else {
        setPesertaData(parsed);
      }
    };
    getPeserta();
  }, []);

  const handleSubmit = async () => {
    const validationMsg = isValidPassword(password, peserta?.PesertaEmail || '');
    if (validationMsg) {
      Alert.alert('Validasi Gagal', validationMsg);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Gagal', 'Konfirmasi password tidak sesuai');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.put(`${API_BASE_URL}/peserta/pwd/${peserta.PesertaId}`, {
        PesertaPassword: password,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (res) {
        const updatedPeserta = { ...peserta, isDefaultPassword: false };
        await AsyncStorage.setItem('peserta', JSON.stringify({ peserta: updatedPeserta }));
        dispatch(setPeserta({ peserta: updatedPeserta }));

        Alert.alert('Berhasil', 'Password berhasil diperbarui');
        navigation.replace('Home');
      }
    } catch (err) {
      Alert.alert('Gagal', err.response?.data?.message || 'Gagal mengganti password');
    }
  };
  
const handleLewati = async () => {
  try {
    const pesan = 'Anda belum mengganti password. Segera ganti untuk keamanan akun Anda!';
    
    // Simpan pesan ke AsyncStorage
    await AsyncStorage.setItem('lewatiGantiPassword', 'true');
    await AsyncStorage.setItem('lewatiGantiPasswordMessage', pesan);

    // Langsung navigasi ke Home
    navigation.replace('Home');
  } catch (error) {
    console.error('Gagal Lewati:', error);
  }
};



  if (!peserta) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.leftBox}>
        <Text style={styles.welcome}>Selamat Datang Kembali!</Text>
        <Text style={styles.info}>Untuk tetap terhubung, silakan ubah password Anda sesuai ketentuan:</Text>
        <View style={styles.rules}>
          <Text style={styles.rule}>• Minimal 8 karakter</Text>
          <Text style={styles.rule}>• Tidak sama dengan email</Text>
          <Text style={styles.rule}>• Minimal 2 karakter spesial (!@#$%^&*()~_+=)</Text>
          <Text style={styles.rule}>• Minimal 1 huruf besar</Text>
          <Text style={styles.rule}>• Minimal 1 huruf kecil</Text>
          <Text style={styles.rule}>• Tidak boleh karakter yang berulang (aaa, 111)</Text>
          <Text style={styles.rule}>• Tidak boleh urutan huruf/angka/spesial (abc, 123, !@#)</Text>
        </View>
      </View>

      <View style={styles.rightBox}>
        <Text style={styles.title}>Ganti Password</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password Baru"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Icon name={showPassword ? 'eye-slash' : 'eye'} size={18} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Konfirmasi Password Baru"
            secureTextEntry={!showConfirm}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeIcon}>
            <Icon name={showConfirm ? 'eye-slash' : 'eye'} size={18} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Simpan Password</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLewati} style={styles.skip}>
          <Text style={styles.skipText}>Lewati</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 80,
    paddingHorizontal: 20,
    flexGrow: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  leftBox: {
    backgroundColor: '#00A779',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  welcome: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    color: '#fff',
    marginBottom: 12,
  },
  rules: {
    paddingLeft: 8,
  },
  rule: {
    color: '#fff',
    marginBottom: 4,
    fontSize: 13,
  },
  rightBox: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    color: '#00A779',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: '#000',
  },
  eyeIcon: {
    paddingLeft: 8,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  skip: {
    marginTop: 20,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 20,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});

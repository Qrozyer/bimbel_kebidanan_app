import React, { useState, useRef, useEffect} from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Animated, Easing, Alert, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setPeserta } from '../redux/reducers/pesertaSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_BASE_URL, API_USER, API_PASS, API_USER_VALUE, API_PASS_VALUE } from '@env';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const slideAnim = useRef(new Animated.Value(1000)).current;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    (async () => {
      const saved = await AsyncStorage.getItem('remember');
      if (saved) {
        const { email, password } = JSON.parse(saved);
        setEmail(email);
        setPassword(password);
        setRememberMe(true);
      }
    })();
  }, []);

  const fetchToken = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/token`, {
        headers: {
          'Content-Type': 'application/json',
          [API_USER]: API_USER_VALUE,
          [API_PASS]: API_PASS_VALUE,
        },
      });
      return res.data.token;
    } catch (error) {
      Alert.alert('Token Error', error.response?.data?.message || 'Gagal mengambil token.');
      return null;
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan password wajib diisi!');
      return;
    }

    const token = await fetchToken();
    if (!token) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/login/peserta`,
        { PesertaEmail: email, PesertaPassword: password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      const isDefaultPassword = password.trim() === 'user';
      const pesertaData = { ...res.data, isDefaultPassword };

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('peserta', JSON.stringify({ peserta: pesertaData }));

      if (rememberMe) {
        await AsyncStorage.setItem('remember', JSON.stringify({ email, password }));
      } else {
        await AsyncStorage.removeItem('remember');
      }

      dispatch(setPeserta({ peserta: pesertaData }));

      navigation.replace(isDefaultPassword ? 'GantiPassword' : 'Home');
    } catch (error) {
      Alert.alert('Login Gagal', error.response?.data?.message || 'Gagal login.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
 <View style={styles.logoPlaceholder}>
  <Image
    source={require('../assets/images/logo.png')}
    style={styles.logo}
  />
</View>
        <Text style={styles.title}>J.M. Metha{'\n'}Academy</Text>
      </View>

      <Animated.View style={[styles.body, { transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.loginTitle}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password input dengan ikon mata di dalam box */}
        <View style={styles.passwordContainerBox}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIconContainer}
          >
            <Icon
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.rememberMe}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
            <Text style={styles.rememberText}>Remember Me</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('HubungiKami')}>
            <Text style={styles.forgotText}>Lupa password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00A779',
  },
  header: {
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
  },
logoPlaceholder: {
  width: 70,
  height: 70,
  backgroundColor: '#F5F5F5',
  borderRadius: 10,
  marginBottom: 10,
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden', 
},
logo: {
  width: '100%',
  height: '100%',
  resizeMode: 'contain',
},
  title: {
    fontSize: 24,
    fontFamily: 'PoetsenOne-Regular',
    color: 'white',
    textAlign: 'center',
  },
  body: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 24,
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00A779',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
  },
  passwordContainerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    color: '#000',
  },
  eyeIconContainer: {
    paddingLeft: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#00A779',
    marginRight: 6,
    borderRadius: 3,
  },
  checkboxChecked: {
    backgroundColor: '#00A779',
  },
  rememberText: {
    color: '#333',
  },
  forgotText: {
    color: '#00A779',
  },
  loginButton: {
    backgroundColor: '#00A779',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import GantiPasswordScreen from '../screens/GantiPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import DaftarBidangScreen from '../screens/DaftarBidangScreen';
import DaftarUjianScreen from '../screens/DaftarUjianScreen';
import SubBidangScreen from '../screens/SubBidangScreen';
import MateriScreen from '../screens/MateriScreen';
import IsiMateriScreen from '../screens/IsiMateriScreen';
import UjianMateriScreen from '../screens/UjianMateriScreen';
import HasilUjianMateriScreen from '../screens/HasilUjianMateriScreen';
import BidangmuScreen from '../screens/BidangmuScreen';
import UjianmuScreen from '../screens/UjianmuScreen';
import MenuScreen from '../screens/MenuScreen';
import UjianSoalScreen from '../screens/UjianSoalScreen';
import PembahasanScreen from '../screens/PembahasanScreen';
import UjianScreen from '../screens/UjianScreen';
import HasilUjianScreen from '../screens/HasilUjianScreen';
import ProfilScreen from '../screens/ProfilScreen';
import EditProfilScreen from '../screens/EditProfilScreen';
import HubungiKamiScreen from '../screens/HubungiKamiScreen';


const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="GantiPassword" component={GantiPasswordScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="DaftarBidang" component={DaftarBidangScreen} />
      <Stack.Screen name="SubBidang" component={SubBidangScreen} />
      <Stack.Screen name="Materi" component={MateriScreen} />
      <Stack.Screen name="IsiMateri" component={IsiMateriScreen} />
      <Stack.Screen name="UjianMateri" component={UjianMateriScreen} />
      <Stack.Screen name="HasilUjianMateri" component={HasilUjianMateriScreen} />
      <Stack.Screen name="Bidangmu" component={BidangmuScreen} />
      <Stack.Screen name="Ujianmu" component={UjianmuScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="DaftarUjian" component={DaftarUjianScreen} />
      <Stack.Screen name="UjianSoal" component={UjianSoalScreen} />
      <Stack.Screen name="Pembahasan" component={PembahasanScreen} />
      <Stack.Screen name="UjianScreen" component={UjianScreen} />
      <Stack.Screen name="HasilUjianScreen" component={HasilUjianScreen} />
      <Stack.Screen name="Profil" component={ProfilScreen} />
      <Stack.Screen name="EditProfil" component={EditProfilScreen} />
      <Stack.Screen name="HubungiKami" component={HubungiKamiScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;

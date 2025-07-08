import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import BottomNavbar from '../components/BottomNavbar';
import Logout from '../components/Logout';

export default function MenuScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.card, styles.cardGreen]}
          onPress={() => navigation.navigate('DaftarBidang')}
        >
          <View style={[styles.iconContainer, styles.bgGreen]}>
            <FontAwesome5 name="sitemap" size={20} color="white" />
          </View>
          <Text style={styles.label}>Daftar Bidang</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardYellow]}
          onPress={() => navigation.navigate('DaftarUjian')}
        >
          <View style={[styles.iconContainer, styles.bgYellow]}>
            <FontAwesome5 name="clipboard-list" size={24} color="white" />
          </View>
          <Text style={styles.label}>Daftar Ujian</Text>
        </TouchableOpacity>
      </View>
      
      <Logout />
      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 60,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  cardGreen: {
    backgroundColor: '#e6f4f1',
  },
  cardYellow: {
    backgroundColor: '#fff9e6',
  },
  iconContainer: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 50,
    marginBottom: 10,
  },
  bgGreen: {
    backgroundColor: '#20B486',
  },
  bgYellow: {
    backgroundColor: '#facc15',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

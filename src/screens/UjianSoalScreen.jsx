import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import SoalUjian from '../components/SoalUjian';
import Timer from '../components/Timer';
import { fetchData } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

export default function UjianSoalScreen() {
  const [questions, setQuestions] = useState([]);
  const [durasi, setDurasi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pesertaId, setPesertaId] = useState(null);
  const soalRef = useRef();
  const route = useRoute();
  const { sectionId } = route.params;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [soalRes, sectionRes] = await Promise.all([
          fetchData(`ujian/soal/${sectionId}`),
          fetchData(`ujian/data/pilih/${sectionId}`),
        ]);

        setQuestions(soalRes);
        setDurasi(sectionRes.Durasi);
        const storedPeserta = await AsyncStorage.getItem('peserta');
        const parsed = JSON.parse(storedPeserta);
        setPesertaId(parsed?.peserta?.PesertaId);
      } catch (err) {
        console.error('Error loadData ujian:', err);
        Alert.alert('Error', 'Gagal mengambil data ujian');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sectionId]);

  const handleTimeUp = () => {
    Alert.alert('Waktu habis!', 'Ujian akan dikumpulkan secara otomatis');
    if (soalRef.current) {
      soalRef.current.forceFinish();
    }
  };

  const handleTenMinutesLeft = () => {
    Toast.show({
      type: 'info',
      text1: '⏰ Waktu Hampir Habis',
      text2: 'Sisa waktu tinggal 10 menit.',
    });
  };

  if (loading || durasi === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header timer */}
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          marginTop: 60,
          backgroundColor: '#20B486',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
          Ujian
        </Text>
        {durasi > 0 && (
          <Timer
            duration={durasi}
            sectionId={sectionId}
            onTimeUp={handleTimeUp}
            onTenMinutesLeft={handleTenMinutesLeft}
          />
        )}
      </View>

      {/* Komponen Soal */}
      <SoalUjian
        ref={soalRef}
        soalList={questions}
        pesertaId={pesertaId}
        sectionId={sectionId}
      />

      {/* Komponen Toast */}
      <Toast />
    </View>
  );
}

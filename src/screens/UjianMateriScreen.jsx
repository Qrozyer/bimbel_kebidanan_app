// Updated UjianMateriScreen.js (tanpa timer, fitur setara dengan UjianSoalScreen)

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { fetchData } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import MateriUjian from '../components/MateriUjian';

const UjianMateriScreen = () => {
  const [questions, setQuestions] = useState([]);
  const [pesertaId, setPesertaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const soalRef = useRef();
  const route = useRoute();
  const { materiId } = route.params;

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchData(`ujian/materi/${materiId}`);
        setQuestions(res);
        const storedPeserta = await AsyncStorage.getItem('peserta');
        const parsed = JSON.parse(storedPeserta);
        setPesertaId(parsed?.peserta?.PesertaId);
      } catch (err) {
        console.error('Gagal load data ujian materi:', err);
        Alert.alert('Error', 'Gagal mengambil data ujian materi');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [materiId]);

  if (loading || !pesertaId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#20B486" />
        <Text style={{ textAlign: 'center' }}>Memuat soal ujian materi...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 60 }}>
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: '#20B486',
        }}
      >
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
          Ujian Materi
        </Text>
      </View>

      {/* Komponen Soal */}
      <MateriUjian
        ref={soalRef}
        questions={questions}
        pesertaId={pesertaId}
        materiId={materiId}
      />

      <Toast />
    </View>
  );
};

export default UjianMateriScreen;

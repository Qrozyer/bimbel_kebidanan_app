import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { addData } from '../utils/api';
import Toast from 'react-native-toast-message';

const screenWidth = Dimensions.get('window').width;

const MateriUjian = ({ questions, materiId }) => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [pesertaId, setPesertaId] = useState(null);

  useEffect(() => {
    const fetchPeserta = async () => {
      try {
        const storedPeserta = await AsyncStorage.getItem('peserta');
        const parsedPeserta = JSON.parse(storedPeserta);
        setPesertaId(parsedPeserta?.peserta?.PesertaId || null);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: '❌ Error',
          text2: 'Gagal ambil peserta.',
        });
      }
    };
    fetchPeserta();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const current = questions[currentIndex];
      const prev = answers.find((a) => a.MsId === current.MsId);
      setSelectedOption(prev ? prev.Jawaban : null);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (answers.length === questions.length && pesertaId) {
      handleAutoSubmit();
    }
  }, [answers]);

  const handleSelect = (option) => {
    const current = questions[currentIndex];
    const updatedAnswers = [
      ...answers.filter((a) => a.MsId !== current.MsId),
      {
        MsId: current.MsId,
        PesertaId: pesertaId,
        Jawaban: option,
      },
    ];
    setAnswers(updatedAnswers);
    setSelectedOption(option);
  };

  const handleAutoSubmit = async () => {
    try {
      const res = await addData('ujian/materi/bundle', answers);
      if (res) {
        Toast.show({
          type: 'success',
          text1: '✅ Ujian selesai',
          text2: 'Jawaban disimpan otomatis.',
        });
        setTimeout(() => {
          navigation.replace('HasilUjianMateri', {
            materiId,
            pesertaId,
          });
        }, 1000);
      } else {
        Toast.show({
          type: 'error',
          text1: '❌ Gagal',
          text2: 'Jawaban gagal disimpan.',
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: '❌ Error',
        text2: 'Terjadi kesalahan saat submit.',
      });
    }
  };

  const isAnswered = (msId) => answers.some((a) => a.MsId === msId);

  // ✅ Penanganan saat soal kosong
  if (!questions || questions.length === 0) {
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#dc3545', fontWeight: '600' }}>
          Belum ada soal untuk materi ini.
        </Text>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.navRow}>
        {questions.map((q, i) => {
          const active = i === currentIndex;
          return (
            <TouchableOpacity
              key={q.MsId}
              onPress={() => setCurrentIndex(i)}
              style={[
                styles.navButton,
                isAnswered(q.MsId) && styles.answeredButton,
                active && styles.activeButton,
              ]}
            >
              <Text style={styles.navText}>{i + 1}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.title}>Soal {currentIndex + 1}</Text>

      <View style={styles.card}>
        <RenderHTML
          contentWidth={screenWidth - 32}
          source={{ html: currentQuestion.Soal }}
        />

        <View style={styles.optionsBox}>
          {['A', 'B', 'C', 'D', 'E'].map((opt) => {
            const content = currentQuestion[`Opsi${opt}`];
            if (!content) return null;
            const isSelected = selectedOption === opt;

            return (
              <TouchableOpacity
                key={opt}
                onPress={() => handleSelect(opt)}
                style={[styles.option, isSelected && styles.selectedOption]}
              >
                <RenderHTML
                  contentWidth={screenWidth - 64}
                  source={{ html: `<strong>${opt}.</strong> ${content}` }}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default MateriUjian;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  navRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answeredButton: {
    backgroundColor: '#4CAF50',
  },
  activeButton: {
    backgroundColor: '#007bff',
  },
  navText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionsBox: {
    gap: 12,
    marginTop: 12,
  },
  option: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  selectedOption: {
    backgroundColor: '#20B486',
    borderColor: '#20B486',
  },
});

import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addData } from '../utils/api';
import RenderHtml from 'react-native-render-html';
import Toast from 'react-native-toast-message';

const SoalUjian = forwardRef(({ soalList, pesertaId, sectionId }, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const STORAGE_KEY = `@startTime-${sectionId}`;

  useImperativeHandle(ref, () => ({
    forceFinish: () => {
      handleAutoSubmit();
    },
  }));

  useEffect(() => {
    if (soalList.length > 0) {
      const currentSoal = soalList[currentIndex];
      const prevAnswer = answers.find((a) => a.Id === currentSoal.Id);
      setSelectedOption(prevAnswer ? prevAnswer.Jawaban : null);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (answers.length === soalList.length) {
      handleFinishQuiz(answers);
    }
  }, [answers]);

  const handleSelect = (option) => {
    const currentSoal = soalList[currentIndex];
    const updatedAnswers = [
      ...answers.filter((a) => a.Id !== currentSoal.Id),
      {
        Id: currentSoal.Id,
        SectionId: currentSoal.SectionId,
        PesertaId: pesertaId,
        Jawaban: option,
      },
    ];
    setAnswers(updatedAnswers);
    setSelectedOption(option);

    setTimeout(() => {
      if (currentIndex < soalList.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
      }
    }, 300);
  };

  const handleFinishQuiz = async (finalAnswers = answers) => {
    const valid = finalAnswers.every(
      (a) =>
        a.Id && a.SectionId && a.PesertaId &&
        typeof a.Jawaban === 'string' &&
        a.Jawaban.length > 0
    );

    if (!valid) {
      Toast.show({
        type: 'error',
        text1: '❌ Gagal',
        text2: 'Data jawaban tidak valid.',
      });
      return;
    }

    const response = await addData('ujian/soal/bundle', finalAnswers);
    if (response) {
      await AsyncStorage.removeItem(STORAGE_KEY);
      Toast.show({
        type: 'success',
        text1: '✅ Berhasil',
        text2: 'Jawaban berhasil disimpan!',
      });
      setTimeout(() => {
        navigation.replace('HasilUjianScreen', {
          sectionId,
          pesertaId,
        });
      }, 1000);
    } else {
      Toast.show({
        type: 'error',
        text1: '❌ Gagal',
        text2: 'Gagal menyimpan jawaban.',
      });
    }
  };

  const handleAutoSubmit = async () => {
    const finalAnswers = [...answers];
    soalList.forEach((q) => {
      if (!finalAnswers.find((a) => a.Id === q.Id)) {
        finalAnswers.push({
          Id: q.Id,
          SectionId: q.SectionId,
          PesertaId: pesertaId,
          Jawaban: '-',
        });
      }
    });

    const response = await addData('ujian/soal/bundle', finalAnswers);
    if (response) {
      await AsyncStorage.removeItem(STORAGE_KEY);
      Toast.show({
        type: 'info',
        text1: '⏰ Waktu Habis',
        text2: 'Ujian disubmit otomatis.',
      });
      setTimeout(() => {
        navigation.replace('HasilUjianScreen', {
          sectionId,
          pesertaId,
        });
      }, 1000);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Gagal Submit',
        text2: 'Gagal menyimpan jawaban.',
      });
    }
  };

  const current = soalList[currentIndex];

  const isAnswered = (id) => {
    return answers.find((a) => a.Id === id);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.navRow}>
        {soalList.map((soal, index) => {
          const answered = isAnswered(soal.Id);
          const isActive = index === currentIndex;
          return (
            <TouchableOpacity
              key={soal.Id}
              onPress={() => setCurrentIndex(index)}
              style={[
                styles.navButton,
                answered && styles.answeredButton,
                isActive && styles.activeButton,
              ]}
            >
              <Text style={styles.navText}>{index + 1}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.title}>
        Soal {currentIndex + 1} dari {soalList.length}
      </Text>

      <View style={styles.card}>
        <View style={styles.soalBox}>
          <RenderHtml contentWidth={width} source={{ html: current.Soal }} />
        </View>

        <View style={styles.optionsBox}>
          {['A', 'B', 'C', 'D', 'E'].map((opt) => {
            const isi = current[`Opsi${opt}`];
            if (!isi) return null;
            const isSelected = selectedOption === opt;

            return (
              <TouchableOpacity
                key={opt}
                onPress={() => handleSelect(opt)}
                style={[
                  styles.option,
                  isSelected && styles.selectedOption,
                ]}
              >
                <RenderHtml
                  contentWidth={width}
                  source={{ html: `<strong>${opt}.</strong> ${isi}` }}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
});

export default SoalUjian;

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
  soalBox: {
    backgroundColor: '#e6f4f1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  optionsBox: {
    gap: 12,
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

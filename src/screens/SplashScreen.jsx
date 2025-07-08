import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bimbel Kebidanan</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20B486',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    margin: 20,
    textAlign: 'center',
    fontSize: 48,
    fontFamily: 'PoetsenOne-Regular',
    color: '#ffffff',
  },
});

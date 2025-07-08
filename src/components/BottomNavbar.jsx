import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const BottomNavbar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    { name: 'Home', icon: 'home-outline', route: 'Home' },
    { name: 'Bidangmu', icon: 'school-outline', route: 'Bidangmu' },
    { name: 'Ujianmu', icon: 'file-document-outline', route: 'Ujianmu' },
    { name: 'Profil', icon: 'account-outline', route: 'Profil' },
    { name: 'Menu', icon: 'menu', route: 'Menu' },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isActive = route.name === tab.route;
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => navigation.navigate(tab.route)}
              style={styles.tab}
            >
              <Icon
                name={tab.icon}
                size={28}
                color={isActive ? '#00A779' : '#A0A0A0'}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      android: {
        elevation: 10,
      },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
    }),
  },
  container: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 6,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default BottomNavbar;

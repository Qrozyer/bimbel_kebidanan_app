import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const OverviewCard = ({ totalBidang, totalUjian, totalPeserta }) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Overview</Text>
      <View style={styles.container}>
        <View style={[styles.card, { backgroundColor: '#E6F4F1' }]}>
          <Text style={styles.label}>Total Bidang</Text>
          <View style={styles.row}>
            <View style={[styles.iconContainer, { backgroundColor: '#fff' }]}>
              <Icon name="book" size={20} color="#00A779" />
            </View>
            <Text style={styles.value}>{totalBidang}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: '#FFF7E0' }]}>
          <Text style={styles.label}>Total Ujian</Text>
          <View style={styles.row}>
            <View style={[styles.iconContainer, { backgroundColor: '#fff' }]}>
              <Icon name="clipboard-list" size={20} color="#E8A200" />
            </View>
            <Text style={styles.value}>{totalUjian}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: '#E6F0FB' }]}>
          <Text style={styles.label}>Total Peserta</Text>
          <View style={styles.row}>
            <View style={[styles.iconContainer, { backgroundColor: '#fff' }]}>
              <Icon name="users" size={20} color="#337CCF" />
            </View>
            <Text style={styles.value}>{totalPeserta}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
    paddingLeft: 5,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    borderRadius: 16,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    padding: 10,
    borderRadius: 999,
    marginRight: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
});

export default OverviewCard;

import React from 'react';
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const contactData = [
  {
    icon: <FontAwesome5 name="map-marker-alt" size={28} color="#10b981" />,
    title: 'Location',
    subtitle:
      'Kavling Valencia Regency, RT.01/RW.09, Sayidan, Sumberadi, Mlati, Sleman, DIY 55288',
    link: 'https://maps.app.goo.gl/6kbBZ8xMYW4Co67r9',
  },
  {
    icon: <FontAwesome name="whatsapp" size={28} color="#10b981" />,
    title: 'WhatsApp',
    subtitle: '+62 823-2564-6503',
    link: 'https://wa.me/6282325646503',
  },
  {
    icon: <FontAwesome name="instagram" size={28} color="#10b981" />,
    title: 'Instagram',
    subtitle: '@jm.metha_academy',
    link: 'https://www.instagram.com/jm.metha_academy',
  },
  {
    icon: <FontAwesome name="envelope" size={28} color="#10b981" />,
    title: 'Email',
    subtitle: 'jm.metha.academy@gmail.com',
    link: 'mailto:jm.metha.academy@gmail.com',
  },
];

const HubungiKamiScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Hubungi Kami</Text>
      <View style={styles.boxContainer}>
        {contactData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => Linking.openURL(item.link)}
          >
            {item.icon}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f4f8',
    paddingVertical: 60,
    paddingHorizontal: 16,
    flexGrow: 1,
    marginBottom: 100,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 30,
  },
  boxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  card: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    margin: 10,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
    color: '#1f2937',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
  },
});

export default HubungiKamiScreen;

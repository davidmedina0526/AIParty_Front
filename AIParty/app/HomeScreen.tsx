import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// Props con navegación tipada
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/AIParty_icon.png')}
        style={styles.icon}
      />
      <Text style={styles.logo}>
        <Text style={{ color: '#FF00C8' }}>AI</Text>Party
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#FF00C8' }]}
        onPress={() => navigation.navigate('CreateLobby')}
      >
        <Text style={styles.buttonText}>Crear sala</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#009DFF' }]}
        onPress={() => navigation.navigate('JoinLobby')}
      >
        <Text style={styles.buttonText}>Unirse a sala</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#261683',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 130,
    height: 120,
  },
  logo: {
    fontFamily: 'Nerko One',
    fontSize: 55,
    color: '#FFFFFF',
    marginBottom: 40,
    marginTop: 5,
  },
  button: {
    width: '70%',
    paddingVertical: 14,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Nerko One',
    fontSize: 25,
    color: '#FFFFFF',
  },
});

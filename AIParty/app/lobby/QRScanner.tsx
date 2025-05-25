import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from 'react-native-screens';

export default function QRScanner() {
  const nav = useNavigation();

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Escanear QR</Text>

      <ScreenContainer style={styles.container_qr}>

      </ScreenContainer>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#009DFF' }]}
          onPress={() => nav.goBack()}
        >
          <Text style={styles.buttonText}>Atrás</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#261683',
    padding: 20,
  },
  title: {
    fontFamily: 'Nerko One',
    fontSize: 50,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  container_qr: {
    width: '95%',
    height: 500,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    alignSelf: 'center',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Nerko One',
    fontSize: 25,
    color: '#FFFFFF',
  },
});

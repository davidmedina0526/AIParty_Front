import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoom } from '../../app/context/RoomContext';

export default function PlayerLobby() {
  const nav = useNavigation();
  const { roomId } = useRoom();
  const [username, setUsername] = useState('');

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Lobby</Text>

      <Text style={styles.label}>Esperando al anfitrión...</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#EF0004' }]}
          onPress={() => nav.goBack()}
        >
          <Text style={styles.buttonText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.code}>{username}</Text>
      <Text style={styles.code}>Código: {roomId.slice(0,6).toUpperCase()}</Text>
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
    marginTop: 70,
  },
  label: {
    fontFamily: 'Nerko One',
    fontSize: 35,
    color: '#FFFFFF',
    marginTop: 120,
    alignSelf: 'center',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 53,
    marginTop: 6,
    fontFamily: 'Nerko One',
    fontSize: 25,
    color: '#000000',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 150,
    marginBottom: 5,
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
  code: {
    fontFamily: 'Nerko One',
    fontSize: 25,
    color: '#FFFFFF',
    marginTop: 10,
    textAlign: 'center',
  }
});

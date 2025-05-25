import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { socket } from '../../app/services/socket';
import { useRoom } from '../../app/context/RoomContext';

export default function HostLobby() {
  const nav = useNavigation<any>();
  const { roomId, category } = useRoom();

  const displayCode = typeof roomId === 'string' && roomId.length >= 6
    ? roomId.slice(0, 6).toUpperCase()
    : 'Cargando...';

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Lobby</Text>

      <Text style={styles.label}>Esperando jugadores...</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#EF0004' }]}
          onPress={() => nav.goBack()}
        >
          <Text style={styles.buttonText}>Salir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#FF00C8' }]} onPress={() => {
        socket.emit('start-round', { roomId, category });
        nav.navigate('Round');
        }}>
          <Text style={styles.buttonText}>Empezar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.code}>Código: {displayCode}</Text>
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
    marginTop: 50,
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
    justifyContent: 'space-between',
    marginTop: 150,
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

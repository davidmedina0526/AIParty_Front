// app/screens/JoinLobby.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { socket } from '../services/socket';
import { useRoom } from '../context/RoomContext';
import { v4 as uuidv4 } from 'uuid';

export default function JoinLobby() {
  const nav = useNavigation<any>();
  const { setRoomId, setUserId } = useRoom();
  const [code, setCode] = useState('');

  const handleJoin = async () => {
    if (!code) {
      Alert.alert('Ingresa el código de sala');
      return;
    }
    try {
      await api.get(`/rooms/${code}`);
      setRoomId(code);
      const u = uuidv4();
      setUserId(u);
      socket.emit('join-room', code, u);
      nav.navigate('JoinedLobby');
    } catch {
      Alert.alert('Sala no encontrada');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unirse a sala</Text>
      <TextInput style={styles.input} value={code} onChangeText={setCode} placeholder="ABC123" />
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#009DFF' }]} onPress={() => nav.goBack()}>
          <Text style={styles.buttonText}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#FF00C8' }]} onPress={handleJoin}>
          <Text style={styles.buttonText}>Entrar</Text>
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
    marginTop: 150,
  },
  label: {
    fontFamily: 'Nerko One',
    fontSize: 25,
    color: '#FFFFFF',
    marginTop: 12,
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
  qrButton: {
    position: 'absolute',
    right: 30,
    top: 530,
    backgroundColor: '#AE00FF',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
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

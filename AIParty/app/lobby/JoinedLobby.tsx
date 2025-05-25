import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoom } from '../../app/context/RoomContext';

export default function JoinedLobby() {
  const nav = useNavigation<any>();
  const [username, setUsername] = useState('');
  const { roomId } = useRoom();

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Unirse a sala</Text>

      <Text style={styles.label}>Inserta tu nombre</Text>
      <TextInput
        style={styles.input}
        placeholder='Nombre'
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Pon una foto... (opcional)</Text>
      <View style={styles.selectImage}>
        <TouchableOpacity
          style={[styles.selectFileButton]}
          onPress={() => {}}
        >
          <Text style={styles.buttonText}>Buscar archivo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#009DFF' }]}
          onPress={() => nav.goBack()}
        >
          <Text style={styles.buttonText}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF00C8' }]}
          onPress={() => nav.navigate('PlayerLobby')}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>

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
    marginBottom: 40,
    marginTop: 100,
  },
  label: {
    fontFamily: 'Nerko One',
    fontSize: 25,
    color: '#FFFFFF',
    marginTop: 12,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 53,
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'Nerko One',
    fontSize: 25,
    color: '#000000',
    alignSelf: 'center',
    textAlign: 'center',
    width: '97%',
  },
  selectImage: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  selectFileButton: {
    backgroundColor: '#AE00FF',
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 60,
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

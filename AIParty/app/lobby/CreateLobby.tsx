import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import api from '../../app/services/api';
import { socket } from '../../app/services/socket';
import { useRoom } from '../../app/context/RoomContext';
import { v4 as uuidv4 } from 'uuid';

export default function CreateLobby() {
  const nav = useNavigation<any>();
  const {
    setRoomId, setUserId, setGameMode,
    setCategory, setTimeLimit, setTotalRounds, setCurrentRound
  } = useRoom();

  const [gameModeState, setGameModeState] = useState<'Desafío de fotos' | 'El Reto'>('Desafío de fotos');
  const [rounds, setRounds] = useState('4');
  const [time, setTime] = useState('30');
  const [categoryState, setCategoryState] = useState<
    'Family friendly' | 'Plan tranqui' | 'Al siguiente nivel' | 'Pongámonos picantes...'
  >('Family friendly');

  const handleCreate = async () => {
    const payload = {
      name: 'AIParty Lobby',
      totalRounds: Number(rounds),
      timeLimit: Number(time),
      category: categoryState
    };
    try {
      console.log('Creando sala con:', { gameModeState, ...payload });
      const { data } = await api.post('/rooms', payload);
      console.log('Respuesta backend:', data);

      // => guardo todo en contexto
      setRoomId(data.roomId);
      setUserId(uuidv4());
      setGameMode(gameModeState);
      setCategory(categoryState);
      setTimeLimit(Number(time));
      setTotalRounds(Number(rounds));
      setCurrentRound(1);

      // me uno al canal Socket
      socket.emit('join-room', data.roomId, uuidv4());
      nav.navigate('HostLobby');
    } catch (err) {
      console.error('Error creando sala', err);
      Alert.alert('Error', 'No se pudo crear la sala. Revisa la consola.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva sala</Text>

      <Text style={styles.label}>Modo de juego</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gameModeState}
          onValueChange={val => setGameModeState(val)}
          style={styles.picker}
          dropdownIconColor="#757575"
        >
          <Picker.Item label="Desafío de fotos" value="Desafío de fotos" />
          <Picker.Item label="El Reto" value="El Reto" />
        </Picker>
      </View>

      <Text style={styles.label}>Número de rondas</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={rounds}
        onChangeText={setRounds}
      />

      <Text style={styles.label}>Tiempo límite</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          keyboardType="numeric"
          value={time}
          onChangeText={setTime}
        />
        <Text style={styles.unit}>segundos</Text>
      </View>

      <Text style={styles.label}>Categoría de retos</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoryState}
          onValueChange={val => setCategoryState(val)}
          style={styles.picker}
          dropdownIconColor="#757575"
        >
          <Picker.Item label="Family friendly" value="Family friendly" />
          <Picker.Item label="Plan tranqui" value="Plan tranqui" />
          <Picker.Item label="Al siguiente nivel" value="Al siguiente nivel" />
          <Picker.Item label="Pongámonos picantes..." value="Pongámonos picantes..." />
        </Picker>
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
          onPress={handleCreate}
        >
          <Text style={styles.buttonText}>Crear</Text>
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
    marginTop: 50,
  },
  label: {
    fontFamily: 'Nerko One',
    fontSize: 25,
    color: '#FFFFFF',
    marginTop: 12,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 5,
  },
  picker: {
    height: 53,
    width: 'auto',
    alignContent: 'center',
    fontFamily: 'Nerko One',
    fontSize: 25,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unit: {
    fontFamily: 'Nerko One',
    fontSize: 25,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
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

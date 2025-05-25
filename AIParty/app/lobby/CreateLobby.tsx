import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { socket } from '../services/socket';
import { useRoom } from '../context/RoomContext';
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
    if (!rounds.trim() || !time.trim()) {
      Alert.alert('Debes poner número de rondas y tiempo');
      return;
    }

    const payload = {
      name: 'AIParty Lobby',
      totalRounds: Number(rounds),
      timeLimit: Number(time),
      category: categoryState
    };

    try {
      const { data } = await api.post('/rooms', payload);

      // Context
      setRoomId(data.roomId);
      const userUuid = uuidv4();
      setUserId(userUuid);
      setGameMode(gameModeState);
      setCategory(categoryState);
      setTimeLimit(Number(time));
      setTotalRounds(Number(rounds));
      setCurrentRound(1);

      // Join via socket
      socket.emit('join-room', data.roomId, userUuid);
      nav.navigate('HostLobby');
    } catch (err) {
      Alert.alert('Error', 'No se pudo crear la sala');
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva sala</Text>

      <Text style={styles.label}>Modo de juego</Text>
      <View style={styles.pickerContainer}>
        <Picker
          mode="dropdown"
          selectedValue={gameModeState}
          onValueChange={val => setGameModeState(val)}
          style={styles.picker}
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

      <Text style={styles.label}>Tiempo límite (segundos)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={time}
        onChangeText={setTime}
      />

      <Text style={styles.label}>Categoría de retos</Text>
      <View style={styles.pickerContainer}>
        <Picker
          mode="dropdown"
          selectedValue={categoryState}
          onValueChange={val => setCategoryState(val)}
          style={styles.picker}
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
    marginTop: 5,
    // overflow: 'hidden'  // <-- lo quitamos para que el menú desplegable no se recorte
  },
  picker: {
    height: 53,
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

// app/screens/JoinedLobby.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoom } from '../context/RoomContext';
import api from '../services/api';
import { socket } from '../services/socket';
import * as ImagePicker from 'expo-image-picker';

export default function JoinedLobby() {
  const nav = useNavigation<any>();
  const { roomId, setUsername, setUserPhoto, userId } = useRoom();
  const [localUsername, setLocalUsername] = useState('');
  const [localPhoto, setLocalPhoto] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled && result.assets.length > 0) {
      setLocalPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleEnter = async () => {
    if (!localUsername.trim()) {
      Alert.alert('Falta tu nombre', 'Pon tu nombre para continuar');
      return;
    }
    setUsername(localUsername.trim());
    setUserPhoto(localPhoto);

    setLoading(true);
    try {
      await api.post(`/rooms/${roomId}/players`, {
        userId,
        username: localUsername.trim(),
        userPhoto: localPhoto,
      });
      // **EMIT** al socket para notificar a todos
      socket.emit('join-room', roomId, userId);
      nav.navigate('PlayerLobby');
    } catch (e) {
      Alert.alert('Error', 'No se pudo unir a la sala');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unirse a sala</Text>
      <Text style={styles.label}>Inserta tu nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={localUsername}
        onChangeText={setLocalUsername}
      />

      <Text style={styles.label}>Pon una foto... (opcional)</Text>
      <View style={styles.selectImage}>
        <TouchableOpacity
          style={styles.selectFileButton}
          onPress={pickImage}
        >
          <Text style={styles.buttonText}>Buscar archivo</Text>
        </TouchableOpacity>
        {localPhoto ? (
          <Image
            source={{ uri: localPhoto }}
            style={{ width: 60, height: 60, marginLeft: 12, borderRadius: 30 }}
          />
        ) : null}
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
          onPress={handleEnter}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.code}>
        Código: {roomId.slice(0, 6).toUpperCase()}
      </Text>
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
    justifyContent: 'center',
  },
  selectFileButton: {
    backgroundColor: '#AE00FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    flex: 0.48,
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
  },
});

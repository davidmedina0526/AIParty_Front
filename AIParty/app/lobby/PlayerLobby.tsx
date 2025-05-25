// app/screens/PlayerLobby.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoom } from '../context/RoomContext';
import api from '../services/api';
import { socket } from '../services/socket';

type Player = {
  userId: string;
  username: string;
  userPhoto: string;
};

export default function PlayerLobby() {
  const nav = useNavigation<any>();
  const { roomId, userId } = useRoom();
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    // 1) fetch inicial
    api
      .get<Player[]>(`/rooms/${roomId}/players`)
      .then((res) => setPlayers(res.data))
      .catch(() => setPlayers([]));

    // 2) emitir join-room para registrarse en el socket
    socket.emit('join-room', roomId, userId);

    // 3) escuchar actualizaciones
    socket.on('player-list-updated', (list: Player[]) => {
      setPlayers(list);
    });

    return () => {
      socket.off('player-list-updated');
    };
  }, [roomId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lobby</Text>
      <Text style={styles.label}>Esperando al anfitrión...</Text>

      <FlatList
        data={players}
        keyExtractor={(item) => item.userId}
        contentContainerStyle={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            {item.userPhoto ? (
              <Image
                source={{ uri: item.userPhoto }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginRight: 12,
                }}
              />
            ) : null}
            <Text
              style={{
                fontSize: 18,
                color: '#FFF',
                fontFamily: 'Nerko One',
              }}
            >
              {item.username || 'Sin nombre'}
            </Text>
          </View>
        )}
      />

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#EF0004' }]}
          onPress={() => nav.goBack()}
        >
          <Text style={styles.buttonText}>Salir</Text>
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
    marginBottom: 20,
    marginTop: 70,
  },
  label: {
    fontFamily: 'Nerko One',
    fontSize: 35,
    color: '#FFFFFF',
    marginTop: 20,
    alignSelf: 'center',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 80,
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

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { socket } from '../../app/services/socket';
import { useRoom } from '../../app/context/RoomContext';

export default function Round() {
  const nav = useNavigation<any>();
  const { setChallenge, roomId, category } = useRoom();
  const [count, setCount] = useState(3);

  useEffect(() => {
    socket.on('new-challenge', (text: string) => {
      setChallenge(text);
      nav.replace('PhotoChallengeScreen');
    });
    // Contador simple 3 → 0
    const timer = setInterval(() => setCount(c => c - 1), 1000);
    if (count < 0) {
      clearInterval(timer);
      // Solo el host emite start-round
      socket.emit('start-round', { roomId, category });
    }
    return () => { socket.off('new-challenge'); clearInterval(timer); };
  }, [count]);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Ronda</Text>

      <Text style={styles.label}>¿Preparados?</Text>

      <View style={styles.timer}>
        <Text style={styles.time}>{count >= 0 ? count : '...'}</Text>
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
    fontSize: 60,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  label: {
    fontFamily: 'Nerko One',
    fontSize: 40,
    color: '#FFFFFF',
    marginTop: 120,
    alignSelf: 'center',
    textAlign: 'center',
  },
  timer: {
    justifyContent: 'center',
    marginTop: 100,
    backgroundColor: '#AE00FF',
    width: 60,
    height: 60,
    borderRadius: 5,
    alignSelf: 'center',
  },
  time: {
    fontFamily: 'Nerko One',
    fontSize: 35,
    color: '#FFFFFF',
    textAlign: 'center',
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

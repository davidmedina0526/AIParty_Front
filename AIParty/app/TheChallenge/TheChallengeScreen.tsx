import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoom } from '../../app/context/RoomContext';

export default function TheChallengeScreen() {
  const nav = useNavigation<any>();
  const { generateNextChallenge, challenge, timeLimit } = useRoom();
  const [seconds, setSeconds] = useState(timeLimit);

  // Al montar, pedimos un nuevo reto y reiniciamos el contador
  useEffect(() => {
    generateNextChallenge();
    setSeconds(timeLimit);
  }, [generateNextChallenge, timeLimit]);

  // Cuenta atrás y navegación al final
  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s - 1), 1000);
    if (seconds < 0) {
      clearInterval(timer);
      nav.replace('PhotoChallengeScreen');
    }
    return () => clearInterval(timer);
  }, [seconds, nav]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ronda</Text>
      <View style={styles.timer}>
        <Text style={styles.time}>{seconds >= 0 ? seconds : 0}</Text>
      </View>
      <Text style={styles.label}>{challenge}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF00C8' }]}
          onPress={() => nav.replace('PhotoChallengeCamera')}
        >
          <Text style={styles.buttonText}>Tomar foto</Text>
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
    fontSize: 60,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 80,
  },
  timer: {
    justifyContent: 'center',
    marginTop: 30,
    backgroundColor: '#AE00FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: 'center',
  },
  time: {
    fontFamily: 'Nerko One',
    fontSize: 35,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  label: {
    fontFamily: 'Nerko One',
    fontSize: 32,
    color: '#FFFFFF',
    marginTop: 100,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 100,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Nerko One',
    fontSize: 25,
    color: '#FFFFFF',
  },
});

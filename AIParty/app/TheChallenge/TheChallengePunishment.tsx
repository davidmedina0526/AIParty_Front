import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoom } from '../../app/context/RoomContext';

export default function TheChallengePunishment() {
  const nav = useNavigation<any>();
  const {
    generateNextChallenge,
    challenge,
    setChallenge,
    timeLimit,
    currentRound,
    totalRounds
  } = useRoom();
  const [seconds, setSeconds] = useState(timeLimit);

  // Al montar, pedimos una nueva "penitencia" (usamos el mismo generador)
  useEffect(() => {
    generateNextChallenge();
    setSeconds(timeLimit);
  }, [generateNextChallenge, timeLimit]);

  // Cuenta atrás y avance de ronda o podio
  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s - 1), 1000);
    if (seconds < 0) {
      clearInterval(timer);
      if (currentRound < totalRounds) {
        nav.replace('Round');
      } else {
        nav.replace('FinalPodium');
      }
    }
    return () => clearInterval(timer);
  }, [seconds, nav, currentRound, totalRounds]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ronda {currentRound}</Text>
      <View style={styles.timer}>
        <Text style={styles.time}>{seconds >= 0 ? seconds : 0}</Text>
      </View>
      <Text style={styles.label}>{challenge}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#009DFF' }]}
          onPress={() => nav.replace('Round')}
        >
          <Text style={styles.buttonText}>Completó</Text>
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

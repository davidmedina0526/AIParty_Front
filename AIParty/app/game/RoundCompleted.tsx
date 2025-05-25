import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoom } from '../../app/context/RoomContext';

export default function RoundCompleted() {
  const nav = useNavigation<any>();
  const { currentRound, timeLimit, totalRounds } = useRoom();
  const [seconds, setSeconds] = useState(timeLimit);

  useEffect(() => {
    if (seconds <= 0) {
      // al terminar de esperar, paso a siguiente ronda o podio
      if (currentRound < totalRounds) {
        nav.replace('Round');
      } else {
        nav.replace('FinalPodium');
      }
    }
    const timer = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Ronda {currentRound}</Text>

      <View style={styles.timer}>
        <Text style={styles.time}>{seconds}</Text>
      </View>

      <Text style={styles.label}>¡Que velocidad!</Text>

      <Text style={styles.label}>Esperando a los demás jugadores...</Text>
      
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
    marginTop: 60,
  },
  label: {
    fontFamily: 'Nerko One',
    fontSize: 40,
    color: '#FFFFFF',
    marginTop: 80,
    alignSelf: 'center',
    textAlign: 'center',
  },
  timer: {
    justifyContent: 'center',
    marginTop: 60,
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

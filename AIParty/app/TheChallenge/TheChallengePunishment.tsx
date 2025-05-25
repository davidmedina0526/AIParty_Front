import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { socket } from '../../app/services/socket';
import { useRoom } from '../../app/context/RoomContext';

export default function TheChallengePunishment() {
  const nav = useNavigation<any>();
  const { challenge, setChallenge, roomId, category, timeLimit, currentRound, totalRounds } = useRoom();
  const [seconds, setSeconds] = useState(timeLimit);

  useEffect(() => {
    socket.emit('get-penalty', { roomId, category }, (penalty: string) => {
      setChallenge(penalty);
      setSeconds(timeLimit);
    });
  }, []);

  useEffect(() => {
    if (seconds <= 0) {
      // si termina la penitencia avanzo
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
    marginBottom: 20,
    marginTop: 80,
  },
  label: {
    fontFamily: 'Nerko One',
    fontSize: 32,
    color: '#FFFFFF',
    marginTop: 100,
    alignSelf: 'center',
    textAlign: 'center',
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 100,
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
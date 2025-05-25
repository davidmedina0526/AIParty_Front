import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../app/services/api';
import { socket } from '../../app/services/socket';
import { useRoom } from '../../app/context/RoomContext';

type Score = { userId: string; votes: number };

export default function PhotoChallengeScore() {
  const nav = useNavigation<any>();
  const { roomId, category } = useRoom();
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    api.get<Score[]>(`/rooms/${roomId}/scores`).then(r => setScores(r.data));
  }, []);

  const nextRound = () => {
    socket.emit('start-round', { roomId, category });
    nav.replace('Round');
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Resultados</Text>

      <Text style={styles.label}>Ronda 1</Text>

        <View style={styles.scores}>
          {scores.map(s => (
            <Text key={s.userId}>{s.userId}: {s.votes}</Text>
          ))}
        </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF00C8' }]}
          onPress={() => nav.navigate('FinalPodium')}
        >
          <Text style={styles.buttonText}>Siguiente</Text>
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
    marginTop: 50,
  },
  label: {
    fontFamily: 'Nerko One',
    fontSize: 35,
    color: '#FFFFFF',
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: 50,
  },
  scores: {

  },
  score: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#AE00FF',
    borderRadius: 5,
    paddingHorizontal: 12,
    height: 53,
    marginTop: 5,
    marginBottom: 25,
  },
  scoreText: {
    fontFamily: 'Nerko One',
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    alignSelf: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  code: {
    fontFamily: 'Nerko One',
    fontSize: 25,
    color: '#FFFFFF',
    marginTop: 10,
    textAlign: 'center',
  }
});
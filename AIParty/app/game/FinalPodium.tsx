import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../app/services/api';
import { useRoom } from '../../app/context/RoomContext';

type PodioItem = { userId: string; score: number };

export default function FinalPodium() {
  const nav = useNavigation<any>();
  const { roomId } = useRoom();
  const [podio, setPodio] = useState<PodioItem[]>([]);

  useEffect(() => {
    api.get<{ [uid: string]: number }>(`/rooms/${roomId}/scores`)
      .then(r => {
        const arr = Object.entries(r.data)
          .map(([u, s]) => ({ userId: u, score: s }))
          .sort((a,b) => b.score - a.score)
          .slice(0,3);
        setPodio(arr);
      });
  }, []);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Podio</Text>

      <View style={styles.podium}>
        {podio.map((p, i) => (
          <Text key={p.userId}>{i+1}. {p.userId}: {p.score}</Text>
        ))}
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#EF0004' }]}
          onPress={() => nav.replace('Home')
          }
        >
          <Text style={styles.buttonText}>Salir</Text>
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
    marginTop: 90,
  },
  label: {
    marginTop: 0,
  },
  labelText: {
    fontFamily: 'Nerko One',
    fontSize: 25,
    color: '#FFFFFF',
  },
  podium: {
    marginTop: 0,
  },
  position: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 20,
    height: 110,
    marginTop: 20,
    fontFamily: 'Nerko One',
    fontSize: 25,
    color: '#000000',
  },
  imageContainer: {
    width: 100,
    height: 100,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
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
  icon: {
    width: '100%',
    height: '100%',
  },
});

import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { socket } from '../services/socket';
import { useRoom } from '../context/RoomContext';

type Photo = { photoUrl: string; userId: string; username: string; userPhoto: string };

export default function PhotoChallengeVote() {
  const nav = useNavigation<any>();
  const { roomId, timeLimit, userId } = useRoom();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(timeLimit);

  useEffect(() => {
    api.get(`/rooms/${roomId}/photos`).then(r => setPhotos(r.data));
    socket.on('photo-list-updated', setPhotos);
    return () => { socket.off('photo-list-updated', setPhotos); };
  }, []);

  useEffect(() => {
    if (seconds <= 0) submitVote();
    const t = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const submitVote = () => {
    if (!selected) return;
    api.post(`/rooms/${roomId}/votes`, { voterId: userId, targetUserId: selected });
    socket.emit('voting-complete', roomId);
    nav.replace('RoundCompleted');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡A votar!</Text>
      <ScrollView contentContainerStyle={styles.votesContainer}>
        {photos.map(p => (
          <TouchableOpacity
            key={p.userId}
            style={[styles.photoContainer, selected === p.userId && styles.selected]}
            onPress={() => setSelected(p.userId)}
          >
            <Image source={{ uri: p.photoUrl }} style={styles.photoContainer} />
            <View style={{ alignItems: "center" }}>
              {p.userPhoto ? <Image source={{ uri: p.userPhoto }} style={{ width: 28, height: 28, borderRadius: 14, marginTop: 3 }} /> : null}
              <Text style={{ color: "#000", fontFamily: "Nerko One", fontSize: 17 }}>{p.username}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.menu}>
        <View style={styles.timer}>
          <Text style={styles.time}>{seconds}</Text>
        </View>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#FF00C8' }]} onPress={submitVote}>
          <Text style={styles.buttonText}>Subir voto</Text>
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
    marginTop: 25,
  },
  votesContainer: {
    width: '100%',
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    paddingBottom: 20,
  },
  photoContainer: {
    width: 150,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  photoContainerText: {
    fontFamily: 'Nerko One',
    fontSize: 25,
    color: '#000000',
    alignSelf: 'center',
    marginTop: 3,
    marginBottom: 15,
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
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    paddingHorizontal: 10,
  },
  timer: {
    justifyContent: 'center',
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
  imageContainer: {
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  selected: {
    borderColor:'#FF00C8', borderWidth:3
  },
});
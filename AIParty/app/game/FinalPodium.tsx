// app/FinalPodium.tsx

import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoom, Score } from '../context/RoomContext';
import { db, dbRef, get } from '../../src/services/firebase';

type PodioItem = {
  userId: string;
  username: string;
  votes: number;
};

export default function FinalPodium() {
  const nav = useNavigation<any>();
  const { roomId } = useRoom();
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    if (!roomId) return;
    (async () => {
      const snap = await get(dbRef(db, `rooms/${roomId}/scores`));
      const data = snap.val() || {};
      // Aquí cada entry ya trae { userId, votes, username, userPhoto }
      const arr = Object.values(data) as Score[];
      setScores(arr);
    })();
  }, [roomId]);

  const podio = useMemo<PodioItem[]>(() => {
    const sorted = [...scores]
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 3)
      .map(s => ({
        userId: s.userId,
        votes: s.votes,
        username: s.username?.trim() || '—'
      }));

    while (sorted.length < 3) {
      sorted.push({ userId: `empty-${sorted.length}`, username: '—', votes: 0 });
    }
    return sorted;
  }, [scores]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Podio</Text>

      <FlatList
        data={podio}
        keyExtractor={item => item.userId}
        contentContainerStyle={{ width: '100%', alignItems: 'center' }}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.position}>{index + 1}.</Text>
            <Text style={styles.item}>
              {item.username} — {item.votes} votos
            </Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#EF0004' }]}
        onPress={() => nav.replace('Home')}
      >
        <Text style={styles.buttonText}>Salir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex:1, backgroundColor:'#261683', padding:20, alignItems:'center' },
  title:       { fontFamily:'Nerko One', fontSize:50, color:'#FFF', marginTop:90, marginBottom:20 },
  row:         { flexDirection:'row', alignItems:'center', marginVertical:8 },
  position:    { fontFamily:'Nerko One', fontSize:25, color:'#FFF', width:30, textAlign:'right', marginRight:10 },
  item:        { fontFamily:'Nerko One', fontSize:25, color:'#FFF' },
  button:      { marginTop:40, paddingVertical:12, paddingHorizontal:24, borderRadius:8 },
  buttonText:  { fontFamily:'Nerko One', fontSize:25, color:'#FFF' },
});

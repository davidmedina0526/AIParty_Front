import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoom } from '../context/RoomContext';

export default function PhotoChallengeScore() {
  const nav = useNavigation<any>();
  const { scores, roomId } = useRoom();

  const sorted = [...scores].sort((a,b) => b.votes - a.votes);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultados</Text>
      {sorted.map(s => (
        <Text key={s.userId} style={styles.scoreText}>
          {s.username}: {s.votes}
        </Text>
      ))}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#FF00C8' }]}
        onPress={() => nav.replace('Round')}
      >
        <Text style={styles.buttonText}>Siguiente</Text>
      </TouchableOpacity>
      <Text style={styles.code}>Código: {roomId.slice(0,6).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#261683', padding:20, alignItems:'center' },
  title:     { fontSize:50,color:'#FFFFFF',marginTop:50,marginBottom:20,fontFamily:'Nerko One' },
  scoreText: { fontSize:25,color:'#FFF',marginVertical:8,fontFamily:'Nerko One' },
  button:    { marginTop:30,paddingVertical:12,paddingHorizontal:24,borderRadius:8 },
  buttonText:{ fontSize:25,color:'#FFF',fontFamily:'Nerko One' },
  code:      { marginTop:20,fontSize:25,color:'#FFF',fontFamily:'Nerko One' },
});

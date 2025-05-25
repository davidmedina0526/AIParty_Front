import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoom } from '../context/RoomContext';

export default function FinalPodium() {
  const nav = useNavigation<any>();
  const { scores } = useRoom();

  const top3 = [...scores]
    .sort((a,b) => b.votes - a.votes)
    .slice(0,3);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Podio</Text>
      {top3.map((p, i) => (
        <Text key={p.userId} style={styles.item}>
          {i+1}. {p.username} — {p.votes} votos
        </Text>
      ))}
      <TouchableOpacity
        style={[styles.button,{ backgroundColor:'#EF0004'}]}
        onPress={()=>nav.replace('Home')}
      >
        <Text style={styles.buttonText}>Salir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#261683', padding:20, alignItems:'center' },
  title:    { fontFamily:'Nerko One', fontSize:50, color:'#FFF', marginTop:90, marginBottom:20 },
  item:     { fontFamily:'Nerko One', fontSize:25, color:'#FFF', marginVertical:8 },
  button:   { marginTop:40, paddingVertical:12, paddingHorizontal:24, borderRadius:8 },
  buttonText:{ fontFamily:'Nerko One', fontSize:25, color:'#FFF' },
});

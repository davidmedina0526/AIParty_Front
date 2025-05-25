import React, { useState, useEffect } from 'react';
import {
  View, ScrollView, TouchableOpacity, Image, Text, StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoom } from '../context/RoomContext';

export default function PhotoChallengeVote() {
  const nav = useNavigation<any>();
  const { photos, submitVote, timeLimit } = useRoom();
  const [selected, setSelected] = useState<string|null>(null);
  const [seconds, setSeconds] = useState(timeLimit);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s - 1), 1000);
    if (seconds < 0) {
      clearInterval(timer);
      if (selected) submitVote(selected);
      nav.replace('RoundCompleted');
    }
    return () => clearInterval(timer);
  }, [seconds, selected]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡A votar!</Text>
      <ScrollView contentContainerStyle={styles.votesContainer}>
        {photos.map(p=>(
          <TouchableOpacity
            key={p.userId}
            style={[styles.photoContainer, selected===p.userId && styles.selected]}
            onPress={()=>setSelected(p.userId)}
          >
            <Image source={{uri:p.photoUrl}} style={styles.image}/>
            <Text style={styles.photoText}>{p.username}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.timer}>{seconds >= 0 ? seconds : 0}</Text>
      <TouchableOpacity
        style={[styles.button,{ backgroundColor:'#FF00C8'}]}
        onPress={()=>{
          if (selected) submitVote(selected);
          nav.replace('RoundCompleted');
        }}
      >
        <Text style={styles.buttonText}>Votar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex:1, backgroundColor:'#261683', padding:20 },
  title:          { fontSize:50, color:'#FFF', textAlign:'center', marginTop:25, fontFamily:'Nerko One' },
  votesContainer: { flexDirection:'row',flexWrap:'wrap',justifyContent:'flex-start',paddingBottom:20 },
  photoContainer: { width:150,height:200,backgroundColor:'#FFF',borderRadius:5,margin:5,alignItems:'center' },
  image:          { width:140,height:140,borderRadius:5,marginTop:5 },
  photoText:      { fontSize:18,color:'#000',fontFamily:'Nerko One',marginTop:8 },
  selected:       { borderWidth:3,borderColor:'#FF00C8' },
  timer:          { fontSize:25,color:'#FFF',textAlign:'center',marginVertical:10,fontFamily:'Nerko One' },
  button:         { alignSelf:'center',paddingVertical:12,paddingHorizontal:24,borderRadius:8 },
  buttonText:     { fontSize:25,color:'#FFF',fontFamily:'Nerko One' },
});

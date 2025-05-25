import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoom } from '../context/RoomContext';

export default function PhotoChallengeScreen() {
  const nav = useNavigation<any>();
  const { challenge, timeLimit } = useRoom();
  const [seconds, setSeconds] = useState(timeLimit);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s - 1), 1000);
    if (seconds < 0) {
      clearInterval(timer);
      nav.replace('PhotoChallengeCamera');
    }
    return () => clearInterval(timer);
  }, [seconds]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reto</Text>
      <Text style={styles.label}>{challenge}</Text>
      <View style={styles.timer}>
        <Text style={styles.time}>{seconds >= 0 ? seconds : 0}</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => nav.replace('PhotoChallengeCamera')}
      >
        <Text style={styles.buttonText}>Tomar foto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#261683', padding:20 },
  title:    { fontFamily:'Nerko One', fontSize:60, color:'#FFF', textAlign:'center', marginTop:80 },
  label:    { fontFamily:'Nerko One', fontSize:32, color:'#FFF', textAlign:'center', marginTop:100 },
  timer:    { justifyContent:'center', marginTop:30, backgroundColor:'#AE00FF', width:60, height:60, borderRadius:30, alignSelf:'center' },
  time:     { fontFamily:'Nerko One', fontSize:35, color:'#FFF', textAlign:'center' },
  button:   { flex:0.48, paddingVertical:12, borderRadius:8, alignItems:'center', marginTop:100 },
  buttonText:{ fontFamily:'Nerko One', fontSize:25, color:'#FFF' },
});

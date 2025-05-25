import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Round() {
  const nav = useNavigation<any>();
  const [counter, setCounter] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => setCounter(c => c - 1), 1000);
    if (counter < 0) {
      clearInterval(timer);
      nav.replace('PhotoChallengeScreen');
    }
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Preparados!</Text>
      <Text style={styles.timer}>{counter >= 0 ? counter : '...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#261683', alignItems:'center', justifyContent:'center' },
  title:    { fontSize:50, color:'#FFF', marginBottom:20 },
  timer:    { fontSize:60, color:'#AE00FF', backgroundColor:'#AE00FF20', padding:20, borderRadius:10 }
});

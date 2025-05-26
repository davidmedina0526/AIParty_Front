import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoom } from '../context/RoomContext';

export default function RoundCompleted() {
  const nav = useNavigation<any>();
  const {
    currentRound,
    totalRounds,
    timeLimit,
    roundStartTime,
    username,
    roomId,
    startRound,
    advanceRound
  } = useRoom();

  const [seconds, setSeconds] = useState(() =>
    Math.max(0, timeLimit - Math.floor((Date.now() - roundStartTime) / 1000))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const rem = Math.max(0, timeLimit - Math.floor((Date.now() - roundStartTime) / 1000));
      setSeconds(rem);
    }, 1000);

    if (seconds <= 0) {
      clearInterval(timer);

      // Solo el host avanza la ronda y genera el siguiente reto
      if (username === 'Anfitrión') {
        (async () => {
          await advanceRound();
          await startRound();
        })();
      }

      // Navegar según corresponda
      if (currentRound < totalRounds) {
        nav.replace('Round');
      } else {
        nav.replace('FinalPodium');
      }
    }

    return () => clearInterval(timer);
  }, [seconds, timeLimit, roundStartTime, username, currentRound, totalRounds]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ronda {currentRound}</Text>
      <View style={styles.timer}>
        <Text style={styles.time}>{seconds >= 0 ? seconds : 0}</Text>
      </View>
      <Text style={styles.label}>¡Qué velocidad!</Text>
      <Text style={styles.label}>Esperando a los demás jugadores...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#261683', padding:20 },
  title:    { fontFamily:'Nerko One', fontSize:60, color:'#FFF', textAlign:'center', marginTop:60 },
  timer:    { justifyContent:'center', backgroundColor:'#AE00FF', width:60, height:60, borderRadius:30, alignSelf:'center', marginTop:20 },
  time:     { fontFamily:'Nerko One', fontSize:35, color:'#FFF', textAlign:'center' },
  label:    { fontFamily:'Nerko One', fontSize:40, color:'#FFF', marginTop:40, textAlign:'center' },
});
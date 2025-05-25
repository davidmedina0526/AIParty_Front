import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useRoom } from '../context/RoomContext';

export default function PhotoChallengeCamera() {
  const nav = useNavigation<any>();
  const cam = useRef<Camera>(null);
  const { timeLimit, submitPhoto } = useRoom();
  const [seconds, setSeconds] = useState(timeLimit);

  useEffect(() => {
    Camera.requestCameraPermissionsAsync();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s - 1), 1000);
    if (seconds < 0) {
      clearInterval(timer);
      nav.replace('PhotoChallengeVote');
    }
    return () => clearInterval(timer);
  }, [seconds]);

  const snap = async () => {
    if (!cam.current) return;
    const photo = await cam.current.takePictureAsync({ base64: true });
    await submitPhoto(photo.base64!);
    nav.replace('PhotoChallengeVote');
  };

  return (
    <View style={styles.container}>
      <Camera ref={cam} style={styles.cameraPreview} />
      <View style={styles.timer}>
        <Text style={styles.time}>{seconds >= 0 ? seconds : 0}</Text>
      </View>
      <TouchableOpacity onPress={snap} style={styles.button}>
        <Text style={styles.buttonText}>📸</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#261683', padding:20 },
  cameraPreview:{ width:'95%', height:500, borderRadius:5, overflow:'hidden', alignSelf:'center', backgroundColor:'#000' },
  timer:    { justifyContent:'center', backgroundColor:'#AE00FF', width:60, height:60, borderRadius:30, alignSelf:'center', marginTop:10 },
  time:     { fontFamily:'Nerko One', fontSize:35, color:'#FFF', textAlign:'center' },
  button:   { alignSelf:'center', paddingVertical:12, paddingHorizontal:24, borderRadius:8, marginTop:20 },
  buttonText:{ fontFamily:'Nerko One', fontSize:25, color:'#FFF' },
});

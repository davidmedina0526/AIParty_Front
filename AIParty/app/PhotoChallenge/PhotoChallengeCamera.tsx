import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Camera, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useRoom } from '../../app/context/RoomContext';
import api from '../../app/services/api';
import { socket } from '../../app/services/socket';

export default function PhotoChallengeCamera() {
  const nav = useNavigation<any>();
  const { roomId, userId, timeLimit, currentRound } = useRoom();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<Camera>(null);
  const [seconds, setSeconds] = useState(timeLimit);

  useEffect(() => { requestPermission(); }, []);
  useEffect(() => {
    if (seconds <= 0) {
      nav.replace('RoundCompleted');
    }
    const t = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ base64: true });
    await api.post(`/rooms/${roomId}/photos`, { userId, imageBase64: photo.base64 });
    socket.emit('photo-uploaded', { roomId, userId });
    nav.replace('RoundCompleted');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ronda {currentRound}</Text>

      <Text style={styles.subtitle}>Tomar foto</Text>

      {permission?.granted && (
        <Camera
          ref={cameraRef}
          style={styles.cameraPreview}
          type={Camera.Constants.Type.back}
        />
      )}

      <View style={styles.menu}>
        <View style={styles.timer}>
          <Text style={styles.time}>{seconds}</Text>
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#009DFF' }]}
          onPress={takePhoto}
        >
          <Text style={styles.buttonText}>📸</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#261683', padding:20 },
  title: {
    fontFamily:'Nerko One', fontSize:50, color:'#FFF',
    textAlign:'center', marginTop:30
  },
  subtitle: {
    fontFamily:'Nerko One', fontSize:32, color:'#FFF',
    textAlign:'center', marginBottom:10
  },
  cameraPreview: {
    width:'95%', height:500, borderRadius:5,
    overflow:'hidden', alignSelf:'center', backgroundColor:'#000'
  },
  menu: {
    flexDirection:'row', justifyContent:'space-between',
    alignItems:'center', marginTop:30, paddingHorizontal:30
  },
  timer: {
    justifyContent:'center', backgroundColor:'#AE00FF',
    width:60, height:60, borderRadius:30
  },
  time: { fontFamily:'Nerko One', fontSize:35, color:'#FFF', textAlign:'center' },
  button: { flex:0.48, paddingVertical:12, borderRadius:8, alignItems:'center' },
  buttonText: { fontFamily:'Nerko One', fontSize:25, color:'#FFF' },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';
import { useRoom } from '../../app/context/RoomContext';
import { get, dbRef, db, storage, storageRef, uploadBytes, getDownloadURL } from '../../src/services/firebase';

export default function JoinLobby() {
  const nav = useNavigation<any>();
  const { joinRoomWithInfo } = useRoom();

  const [code, setCode]       = useState('');
  const [name, setName]       = useState('');
  const [imageUri, setImageUri] = useState<string|null>(null);

  useEffect(() => {
    (async () => {
      const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (lib.status !== 'granted')
        Alert.alert('Permiso', 'Se necesita acceso a la galería');
      const cam = await ImagePicker.requestCameraPermissionsAsync();
      if (cam.status !== 'granted')
        Alert.alert('Permiso', 'Se necesita acceso a la cámara');
    })();
  }, []);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7
    });
    if (!res.canceled && res.assets.length > 0) {
      setImageUri(res.assets[0].uri);
    }
  };
  
  const takePhoto = async () => {
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7
    });
    if (!res.canceled && res.assets.length > 0) {
      setImageUri(res.assets[0].uri);
    }
  };

  const handleJoin = async () => {
    const roomCode = code.trim().toLowerCase();
    if (!roomCode) return Alert.alert('Error', 'Ingresa el código de sala');
    if (!name.trim()) return Alert.alert('Error', 'Ingresa tu nombre');
  
    let fullRoomId: string | null = null;
    try {
      // Trae todas las rooms
      const roomsSnap = await get(dbRef(db, 'rooms'));
      if (!roomsSnap.exists()) {
        return Alert.alert('Error', 'No hay salas disponibles');
      }
  
      // Busca la sala cuyo ID comience por roomCode
      roomsSnap.forEach(childSnap => {
        const key = childSnap.key || '';
        if (key.slice(0, 6).toLowerCase() === roomCode) {
          fullRoomId = key;
          return true; // rompe el forEach
        }
      });
      if (!fullRoomId) {
        return Alert.alert('Error', 'Sala no encontrada');
      }
    } catch (e) {
      console.error(e);
      return Alert.alert('Error', 'No se pudo verificar la sala');
    }
  
    // Generar ID y avatar (igual que tenías)
    const uId = uuidv4();
    let avatarUrl = '';
    if (imageUri) {
      try {
        const resp = await fetch(imageUri);
        const blob = await resp.blob();
        const path = `avatars/${fullRoomId}/${uId}.jpg`;
        const ref  = storageRef(storage, path);
        await uploadBytes(ref, blob);
        avatarUrl = await getDownloadURL(ref);
      } catch {
        Alert.alert('Aviso', 'No se pudo subir la foto. Continúas sin avatar.');
      }
    }
  
    // Ya con el ID completo, te unes:
    await joinRoomWithInfo(fullRoomId, uId, name.trim(), avatarUrl);
  
    // Navega a PlayerLobby
    nav.replace('PlayerLobby');
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unirse a sala</Text>

      <Text style={styles.label}>Código</Text>
      <TextInput style={styles.input} value={code} onChangeText={setCode} placeholder="ABC123" autoCapitalize="characters"/>

      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Tu nombre"/>

      <Text style={styles.label}>Foto (opcional)</Text>
      <View style={styles.photoActions}>
        <TouchableOpacity style={[styles.photoButton,{backgroundColor:'#009DFF'}]} onPress={pickImage}>
          <Text style={styles.photoButtonText}>Galería</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.photoButton,{backgroundColor:'#FF00C8'}]} onPress={takePhoto}>
          <Text style={styles.photoButtonText}>Cámara</Text>
        </TouchableOpacity>
      </View>
      {imageUri && <Image source={{uri:imageUri}} style={styles.preview}/>}

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button,{backgroundColor:'#666'}]} onPress={()=>nav.goBack()}>
          <Text style={styles.buttonText}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button,{backgroundColor:'#0A0'}]} onPress={handleJoin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex:1, backgroundColor:'#261683', padding:20 },
  title:        { fontFamily:'Nerko One', fontSize:50, color:'#FFF', textAlign:'center', marginTop:60, marginBottom:20 },
  label:        { fontFamily:'Nerko One', fontSize:25, color:'#FFF', marginTop:12 },
  input:        { backgroundColor:'#FFF', borderRadius:5, height:53, paddingHorizontal:10, marginTop:6, fontSize:25, fontFamily:'Nerko One', color:'#000' },
  photoActions: { flexDirection:'row', justifyContent:'space-between', marginTop:6 },
  photoButton:  { flex:0.48, paddingVertical:10, borderRadius:6, alignItems:'center' },
  photoButtonText:{ fontSize:18, color:'#FFF', fontFamily:'Nerko One' },
  preview:      { width:80, height:80, borderRadius:40, marginTop:12, alignSelf:'center' },
  actions:      { flexDirection:'row', justifyContent:'space-between', marginTop:40 },
  button:       { flex:0.48, paddingVertical:14, borderRadius:8, alignItems:'center' },
  buttonText:   { fontFamily:'Nerko One', fontSize:25, color:'#FFF' },
});

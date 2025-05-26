import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../context/AuthContext';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useRoom } from '../context/RoomContext';

export default function CreateLobby() {
  const nav = useNavigation<any>();
  const { user } = useAuth(); 
  const {
    createRoom,
    joinRoom,
    setUsername,
    setUserPhoto
  } = useRoom();

  const [rounds, setRounds] = useState('4');
  const [time,   setTime]   = useState('30');
  const [cat,    setCat]    = useState('Family friendly');

  const handleCreate = async () => {
// ← RESTRICCIÓN: si es picante y no hay user logueado, notificar y cortar
   if (cat === 'Pongámonos picantes...' && !user) {
     await Notifications.scheduleNotificationAsync({
       content: {
         title: 'Acceso restringido',
         body: 'Debes iniciar sesión para usar la categoría "Pongámonos picantes..."'
       },
       trigger: null
     });
     return;
   }

    if (!rounds.trim() || !time.trim()) {
      return Alert.alert('Debes poner número de rondas y tiempo');
    }
    const tot = Number(rounds);
    const lim = Number(time);
    // Crea sala con ESOS valores
    await createRoom({ totalRounds: tot, timeLimit: lim, category: cat });

    // Ahora soy host
    setUsername('Anfitrión');
    setUserPhoto('');
    await joinRoom();

    nav.navigate('HostLobby');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva sala</Text>

      <Text style={styles.label}>Número de rondas</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={rounds}
        onChangeText={setRounds}
      />

      <Text style={styles.label}>Tiempo límite (seg)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={time}
        onChangeText={setTime}
      />

      <Text style={styles.label}>Categoría</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={cat}
          onValueChange={setCat}
          style={styles.picker}
        >
          <Picker.Item label="Family friendly" value="Family friendly"/>
          <Picker.Item label="Plan tranqui"     value="Plan tranqui"/>
          <Picker.Item label="Al siguiente nivel" value="Al siguiente nivel"/>
          <Picker.Item label="Pongámonos picantes..." value="Pongámonos picantes..."/>
        </Picker>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#009DFF' }]}
          onPress={() => nav.goBack()}
        >
          <Text style={styles.buttonText}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF00C8' }]}
          onPress={handleCreate}
        >
          <Text style={styles.buttonText}>Crear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex:1, backgroundColor:'#261683', padding:20 },
  title:           { fontSize:50, color:'#FFF', textAlign:'center', marginTop:50, marginBottom:20, fontFamily:'Nerko One' },
  label:           { fontSize:25, color:'#FFF', marginTop:12, fontFamily:'Nerko One' },
  input:           { backgroundColor:'#FFF', borderRadius:5, height:53, paddingHorizontal:10, fontSize:25, fontFamily:'Nerko One', color:'#000', marginTop:6 },
  pickerContainer: { backgroundColor:'#FFF', borderRadius:6, marginTop:5 },
  picker:          { height:53, fontSize:25, fontFamily:'Nerko One' },
  actions:         { flexDirection:'row', justifyContent:'space-between', marginTop:30 },
  button:          { flex:0.48, paddingVertical:12, borderRadius:8, alignItems:'center' },
  buttonText:      { fontSize:25, color:'#FFF', fontFamily:'Nerko One' },
});

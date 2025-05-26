// app/lobby/HostLobby.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoom } from '../context/RoomContext';

export default function HostLobby() {
  const nav = useNavigation<any>();
  const { players, roomId, startRound } = useRoom();

  const onStart = async () => {
    await startRound();
    nav.replace('Round');
  };

  // 1) Extrae y formatea tu código de sala
  const roomCode = roomId.slice(0, 6).toUpperCase();

  // 2) Construye la URL del QR
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(roomCode)}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lobby (Host)</Text>

      {/* 3) Muestra el QR */}
      <View style={styles.qrContainer}>
        <Image
          source={{ uri: qrImageUrl }}
          style={styles.qrImage}
        />
        <Text style={styles.qrCaption}>
          Escanea para unirte: {roomCode}
        </Text>
      </View>

      <ScrollView style={{ marginTop: 16 }}>
        {players.map(p => (
          <View key={p.userId} style={styles.playerRow}>
            {p.userPhoto && <Image source={{ uri: p.userPhoto }} style={styles.avatar} />}
            <Text style={styles.username}>{p.username}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#FF00C8' }]}
        onPress={onStart}
      >
        <Text style={styles.buttonText}>Empezar Ronda</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex:1, backgroundColor:'#261683', padding:20 },
  title:       { fontSize:50, color:'#FFF', textAlign:'center', marginTop:50, fontFamily:'Nerko One' },

  qrContainer: { alignItems:'center', marginVertical:20 },
  qrImage:     { width:200, height:200, borderRadius:8, backgroundColor:'#FFF' },
  qrCaption:   { color:'#FFF', fontSize:18, marginTop:8, fontFamily:'Nerko One' },

  playerRow:   { flexDirection:'row', alignItems:'center', marginBottom:8 },
  avatar:      { width:32, height:32, borderRadius:16, marginRight:8 },
  username:    { color:'#FFF', fontSize:20, fontFamily:'Nerko One' },

  button:      { marginTop:30, paddingVertical:12, borderRadius:8, alignItems:'center' },
  buttonText:  { fontSize:25, color:'#FFF', fontFamily:'Nerko One' },
});
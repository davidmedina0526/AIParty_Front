import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoom } from '../context/RoomContext';

export default function PlayerLobby() {
  const nav = useNavigation<any>();
  const { players, roomId, currentRound } = useRoom();

  useEffect(() => {
    if (currentRound > 1) {
      nav.replace('Round');
    }
  }, [currentRound]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lobby</Text>
      <FlatList
        data={players}
        keyExtractor={i=>i.userId}
        renderItem={({item})=>(
          <View style={styles.playerRow}>
            {item.userPhoto && <Image source={{uri:item.userPhoto}} style={styles.avatar}/>}
            <Text style={styles.username}>{item.username||'Sin nombre'}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.label}>Esperando jugadores…</Text>}
      />
      <Text style={styles.code}>Código: {roomId.slice(0,6).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#261683', padding:20 },
  title:    { fontSize:50,color:'#FFF',textAlign:'center',marginTop:100,fontFamily:'Nerko One' },
  playerRow:{ flexDirection:'row',alignItems:'center',marginVertical:4 },
  avatar:   { width:32,height:32,borderRadius:16,marginRight:8 },
  username: { color:'#FFF',fontSize:20,fontFamily:'Nerko One' },
  label:    { color:'#FFF',fontSize:20,fontFamily:'Nerko One',textAlign:'center',marginTop:20 },
  code:     { color:'#FFF',fontSize:25,textAlign:'center',marginTop:10,fontFamily:'Nerko One' },
});

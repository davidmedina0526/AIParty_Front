import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useRoom } from '../context/RoomContext';

export default function PlayerLobby() {
  const { players, roomId } = useRoom();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lobby</Text>
      <FlatList
        data={players}
        keyExtractor={i=>i.userId}
        renderItem={({item})=>(
          <View style={{flexDirection:'row',alignItems:'center',margin:4}}>
            {item.userPhoto
              ? <Image source={{uri:item.userPhoto}} style={{width:32,height:32,borderRadius:16,marginRight:8}}/>
              : null}
            <Text style={{color:'#FFF',fontSize:20}}>{item.username}</Text>
          </View>
        )}
      />
      <Text style={styles.code}>Código: {roomId.slice(0,6).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#261683',
    padding: 20,
  },
  title: {
    fontFamily: 'Nerko One',
    fontSize: 50,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 100,
  },
  label: {
    fontFamily: 'Nerko One',
    fontSize: 25,
    color: '#FFFFFF',
    marginTop: 12,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 53,
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'Nerko One',
    fontSize: 25,
    color: '#000000',
    alignSelf: 'center',
    textAlign: 'center',
    width: '97%',
  },
  selectImage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectFileButton: {
    backgroundColor: '#AE00FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    flex: 0.48,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 60,
  },
  button: {
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Nerko One',
    fontSize: 25,
    color: '#FFFFFF',
  },
  code: {
    fontFamily: 'Nerko One',
    fontSize: 25,
    color: '#FFFFFF',
    marginTop: 10,
    textAlign: 'center',
  },
});

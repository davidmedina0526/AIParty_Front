// App.tsx

import 'react-native-get-random-values';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider } from './app/context/AuthContext';
import RoomProvider     from './app/context/RoomContext';
import { RootStackParamList } from './types';

import HomeScreen              from './app/HomeScreen';
import LoginScreen             from './app/lobby/LoginScreen';
import CreateLobby             from './app/lobby/CreateLobby';
import JoinLobby               from './app/lobby/JoinLobby';
import HostLobby               from './app/lobby/HostLobby';
import QRScanner               from './app/lobby/QRScanner';
import JoinedLobby             from './app/lobby/JoinedLobby';
import PlayerLobby             from './app/lobby/PlayerLobby';
import Round                   from './app/game/Round';
import RoundCompleted         from './app/game/RoundCompleted';
import PhotoChallengeScreen   from './app/PhotoChallenge/PhotoChallengeScreen';
import PhotoChallengeCamera   from './app/PhotoChallenge/PhotoChallengeCamera';
import PhotoChallengeVote     from './app/PhotoChallenge/PhotoChallengeVote';
import PhotoChallengeScore    from './app/PhotoChallenge/PhotoChallengeScore';
import TheChallengeScreen     from './app/TheChallenge/TheChallengeScreen';
import TheChallengePunishment from './app/TheChallenge/TheChallengePunishment';
import FinalPodium            from './app/game/FinalPodium';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <View style={styles.container}>
      <AuthProvider>
        <RoomProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="CreateLobby" component={CreateLobby} />
              <Stack.Screen name="JoinLobby" component={JoinLobby} />
              <Stack.Screen name="HostLobby" component={HostLobby} />
              <Stack.Screen name="QRScanner" component={QRScanner} />
              <Stack.Screen name="JoinedLobby" component={JoinedLobby} />
              <Stack.Screen name="PlayerLobby" component={PlayerLobby} />
              <Stack.Screen name="Round" component={Round} />
              <Stack.Screen name="RoundCompleted" component={RoundCompleted} />
              <Stack.Screen name="PhotoChallengeScreen" component={PhotoChallengeScreen} />
              <Stack.Screen name="PhotoChallengeCamera" component={PhotoChallengeCamera} />
              <Stack.Screen name="PhotoChallengeVote" component={PhotoChallengeVote} />
              <Stack.Screen name="PhotoChallengeScore" component={PhotoChallengeScore} />
              <Stack.Screen name="TheChallengeScreen" component={TheChallengeScreen} />
              <Stack.Screen name="TheChallengePunishment" component={TheChallengePunishment} />
              <Stack.Screen name="FinalPodium" component={FinalPodium} />
            </Stack.Navigator>
          </NavigationContainer>
        </RoomProvider>
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' }
});

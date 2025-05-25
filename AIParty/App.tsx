import 'react-native-get-random-values';
import React, { useEffect } from 'react';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RoomProvider } from './app/context/RoomContext';
import { socket } from './app/services/socket';
import { RootStackParamList } from './types';

import HomeScreen from './app/HomeScreen';
import CreateLobby from './app/lobby/CreateLobby';
import JoinLobby from './app/lobby/JoinLobby';
import HostLobby from './app/lobby/HostLobby';
import QRScanner from './app/lobby/QRScanner';
import JoinedLobby from './app/lobby/JoinedLobby';
import PlayerLobby from './app/lobby/PlayerLobby';
import FinalPodium from './app/game/FinalPodium';
import Round from './app/game/Round';
import RoundCompleted from './app/game/RoundCompleted';
import PhotoChallengeScreen from './app/PhotoChallenge/PhotoChallengeScreen';
import PhotoChallengeCamera from './app/PhotoChallenge/PhotoChallengeCamera';
import PhotoChallengeVote from './app/PhotoChallenge/PhotoChallengeVote';
import PhotoChallengeScore from './app/PhotoChallenge/PhotoChallengeScore';
import TheChallengeScreen from './app/TheChallenge/TheChallengeScreen';
import TheChallengePunishment from './app/TheChallenge/TheChallengePunishment';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [loaded] = useFonts({ 'Nerko One': require('./assets/fonts/NerkoOne-Regular.ttf') });
  useEffect(() => { socket.connect(); }, []);
  if (!loaded) return <AppLoading />;

  return (
    <RoomProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
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
  );
}
// App.tsx

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import React, { useEffect, useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RoomProvider from './app/context/RoomContext';
import { RootStackParamList } from './types';

import HomeScreen from './app/HomeScreen';
import CreateLobby from './app/lobby/CreateLobby';
import JoinLobby from './app/lobby/JoinLobby';
import HostLobby from './app/lobby/HostLobby';
import QRScanner from './app/lobby/QRScanner';
import JoinedLobby from './app/lobby/JoinedLobby';
import PlayerLobby from './app/lobby/PlayerLobby';
import Round from './app/game/Round';
import RoundCompleted from './app/game/RoundCompleted';
import PhotoChallengeScreen from './app/PhotoChallenge/PhotoChallengeScreen';
import PhotoChallengeCamera from './app/PhotoChallenge/PhotoChallengeCamera';
import PhotoChallengeVote from './app/PhotoChallenge/PhotoChallengeVote';
import PhotoChallengeScore from './app/PhotoChallenge/PhotoChallengeScore';
import TheChallengeScreen from './app/TheChallenge/TheChallengeScreen';
import TheChallengePunishment from './app/TheChallenge/TheChallengePunishment';
import FinalPodium from './app/game/FinalPodium';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // 1) Cargo la fuente
  const [fontsLoaded] = useFonts({
    'Nerko One': require('./assets/fonts/NerkoOne-Regular.ttf'),
  });

  // 2) Preparo y oculto el splash cuando las fuentes estén listas
  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // 3) Mientras las fuentes no carguen, no renderizo nada
  if (!fontsLoaded) {
    return null;
  }

  return (
    // llamo a onLayoutRootView en el primer render del proveedor
    <RoomProvider onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CreateLobby" component={CreateLobby} />
          <Stack.Screen name="JoinLobby" component={JoinLobby} />
          <Stack.Screen name="HostLobby" component={HostLobby} />
          <Stack.Screen name="QRScanner" component={QRScanner} />
          <Stack.Screen name="JoinedLobby" component={JoinedLobby} />
          <Stack.Screen name="PlayerLobby" component={PlayerLobby} />
          <Stack.Screen name="Round" component={Round} />
          <Stack.Screen name="RoundCompleted" component={RoundCompleted} />
          <Stack.Screen
            name="PhotoChallengeScreen"
            component={PhotoChallengeScreen}
          />
          <Stack.Screen
            name="PhotoChallengeCamera"
            component={PhotoChallengeCamera}
          />
          <Stack.Screen
            name="PhotoChallengeVote"
            component={PhotoChallengeVote}
          />
          <Stack.Screen
            name="PhotoChallengeScore"
            component={PhotoChallengeScore}
          />
          <Stack.Screen
            name="TheChallengeScreen"
            component={TheChallengeScreen}
          />
          <Stack.Screen
            name="TheChallengePunishment"
            component={TheChallengePunishment}
          />
          <Stack.Screen name="FinalPodium" component={FinalPodium} />
        </Stack.Navigator>
      </NavigationContainer>
    </RoomProvider>
  );
}

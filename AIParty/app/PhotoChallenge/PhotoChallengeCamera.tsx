// PhotoChallengeCamera.tsx
import React, { useRef, useEffect, useState } from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet, Alert, Platform
} from 'react-native'
import {
  CameraView,
  useCameraPermissions,
  PermissionStatus
} from 'expo-camera'
import { useNavigation } from '@react-navigation/native'
import { useRoom } from '../context/RoomContext'

export default function PhotoChallengeCamera() {
  const navigation = useNavigation<any>()
  const { timeLimit, submitPhoto } = useRoom()
  const [seconds, setSeconds] = useState(timeLimit)

  const [permission, requestPermission] = useCameraPermissions()
  const cameraRef = useRef<CameraView | null>(null)

  // Pedir permiso si es necesario
  useEffect(() => {
    if (!permission) return
    if (!permission.granted) requestPermission()
  }, [permission, requestPermission])

  // Countdown
  useEffect(() => {
    if (permission?.status !== PermissionStatus.GRANTED) return
    const timer = setInterval(() => {
      setSeconds(s => {
        if (s <= 0) {
          clearInterval(timer)
          navigation.replace('PhotoChallengeVote')
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [permission, navigation])

  const handleSnap = async () => {
    if (!cameraRef.current) return
    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true })
      await submitPhoto(photo.base64!)
      navigation.replace('PhotoChallengeVote')
    } catch {
      Alert.alert('Error', 'No se pudo tomar la foto.')
    }
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Cargando cámara…</Text>
      </View>
    )
  }
  if (permission.status !== PermissionStatus.GRANTED) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Necesito permiso para usar la cámara.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.buttonText}>Solicitar permiso</Text>
        </TouchableOpacity>
      </View>
    )
  }
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>La cámara no está disponible en web.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.cameraPreview}
        facing="back"
      />
      <View style={styles.timer}>
        <Text style={styles.time}>{seconds}</Text>
      </View>
      <TouchableOpacity onPress={handleSnap} style={styles.snapButton}>
        <Text style={styles.snapText}>📸</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#261683',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoText: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 20,
    fontFamily: 'Nerko One',
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#FF00C8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Nerko One',
  },
  cameraPreview: {
    width: '100%',
    height: '70%',
    borderRadius: 5,
    overflow: 'hidden',
  },
  timer: {
    position: 'absolute',
    top: 40,
    backgroundColor: '#AE00FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  time: {
    fontFamily: 'Nerko One',
    fontSize: 35,
    color: '#FFFFFF',
  },
  snapButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#009DFF',
    padding: 20,
    borderRadius: 50,
  },
  snapText: {
    fontSize: 30,
    color: '#FFFFFF',
  },
})
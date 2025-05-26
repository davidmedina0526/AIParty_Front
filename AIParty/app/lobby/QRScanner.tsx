import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function QRScanner() {
  const nav = useNavigation<any>();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleQrScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    // data es el texto contenido en el QR; lo convertimos a minúsculas
    const code = data.trim().toLowerCase();
    // Si quieres validar formato, hazlo aquí.
    nav.replace('JoinLobby', { prefillCode: code });
  };

  if (!permission || !permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Necesitamos permiso de cámara</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: '#009DFF', fontSize: 18 }}>Conceder permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escanear QR</Text>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleQrScanned}
      />
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#009DFF' }]}
          onPress={() => nav.goBack()}
        >
          <Text style={styles.buttonText}>Atrás</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#261683', padding: 20, alignItems: 'center'
  },
  title: {
    fontFamily: 'Nerko One', fontSize: 50, color: '#FFF', textAlign: 'center', marginVertical: 20
  },
  camera: {
    width: '95%', height: 400, borderRadius: 8, overflow: 'hidden'
  },
  actions: {
    flexDirection: 'row', marginTop: 20, width: '100%', justifyContent: 'center'
  },
  button: {
    flex: 0.4, paddingVertical: 12, borderRadius: 8, alignItems: 'center'
  },
  buttonText: {
    fontFamily: 'Nerko One', fontSize: 25, color: '#FFF'
  },
});
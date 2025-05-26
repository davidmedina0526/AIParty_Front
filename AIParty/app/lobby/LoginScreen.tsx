// app/lobby/LoginScreen.tsx

import React, { useState } from 'react';
import {
  View, Text, TextInput,
  TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const { login, register } = useAuth();
  const nav = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [pass, setPass]   = useState('');
  const [isReg, setIsReg] = useState(false);

  const submit = async () => {
    try {
      if (isReg) await register(email, pass);
      else       await login(email, pass);
      nav.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isReg ? 'Regístrate' : 'Inicia sesión'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
      />
      <TouchableOpacity style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>{isReg ? 'Registrar' : 'Entrar'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsReg(!isReg)}>
        <Text style={styles.toggle}>
          {isReg
            ? '¿Ya tienes cuenta? Inicia sesión'
            : '¿No tienes cuenta? Regístrate'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex:1,justifyContent:'center',backgroundColor:'#261683',padding:20 },
  title:      { fontSize:32,color:'#FFF',textAlign:'center',marginBottom:20,fontFamily:'Nerko One' },
  input:      { backgroundColor:'#FFF',borderRadius:8,padding:12,marginVertical:8 },
  button:     { backgroundColor:'#FF00C8',padding:12,borderRadius:8,marginTop:12 },
  buttonText: { color:'#FFF',textAlign:'center',fontSize:18,fontFamily:'Nerko One' },
  toggle:     { color:'#FFF',textAlign:'center',marginTop:16 }
});

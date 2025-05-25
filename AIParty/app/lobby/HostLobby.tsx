import React, { useEffect, useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Image, ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { socket } from "../services/socket";
import api from "../services/api";
import { useRoom } from "../context/RoomContext";

export default function HostLobby() {
  const nav = useNavigation();
  const { roomId, category } = useRoom();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Carga inicial de jugadores
    api.get(`/rooms/${roomId}/players`)
      .then(r => setPlayers(r.data))
      .catch(() => setPlayers([]));

    // Cuando alguien nuevo entra (desde backend)
    socket.on("player-list-updated", newList => {
      setPlayers(newList);
    });

    return () => {
      socket.off("player-list-updated");
    };
  }, [roomId]);

  const startGame = () => {
    // Aquí emitimos al backend para que genere el reto
    socket.emit("start-round", { roomId, category });
    // Navegamos a la pantalla de cuenta regresiva / reto
    nav.replace("Round");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lobby (Host)</Text>
      <Text style={styles.label}>Esperando jugadores...</Text>

      <ScrollView style={{ marginTop: 16 }}>
        {players.map(p => (
          <View key={p.userId} style={styles.playerRow}>
            {p.userPhoto ? (
              <Image
                source={{ uri: p.userPhoto }}
                style={styles.avatar}
              />
            ) : null}
            <Text style={styles.username}>{p.username}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#EF0004" }]}
          onPress={() => nav.goBack()}
        >
          <Text style={styles.buttonText}>Salir</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF00C8" }]}
          onPress={startGame}
        >
          <Text style={styles.buttonText}>Empezar Juego</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.code}>
        Código: {roomId.slice(0, 6).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#261683", padding: 20 },
  title: { fontSize: 50, color: "#FFF", textAlign: "center", marginTop: 50 },
  label: { fontSize: 35, color: "#FFF", textAlign: "center", marginTop: 20 },
  playerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  username: { color: "#FFF", fontSize: 20 },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 150 },
  button: { flex: 0.48, paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { fontSize: 25, color: "#FFF" },
  code: { color: "#FFF", fontSize: 25, textAlign: "center", marginTop: 10 }
});

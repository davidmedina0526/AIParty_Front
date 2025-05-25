import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { socket } from "../services/socket";
import { useRoom } from "../context/RoomContext";

export default function Round() {
  const nav = useNavigation();
  const { roomId, setChallenge } = useRoom();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Cuando el backend responda con el reto
    socket.on("new-challenge", (text) => {
      setChallenge(text);
      // Saltamos inmediatamente a la pantalla de PhotoChallengeScreen
      nav.replace("PhotoChallengeScreen");
    });

    // Contador 3 → 0
    const timer = setInterval(() => {
      setCountdown(c => c - 1);
    }, 1000);

    if (countdown < 0) {
      clearInterval(timer);
      // Si llegamos a 0 y aún no llegó el reto, forzamos la petición
      socket.emit("start-round", { roomId, category: "" });
    }

    return () => {
      clearInterval(timer);
      socket.off("new-challenge");
    };
  }, [countdown]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Preparados!</Text>
      <Text style={styles.timer}>{countdown >= 0 ? countdown : "..."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#261683", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 50, color: "#FFF", marginBottom: 20 },
  timer: {
    fontSize: 60, color: "#AE00FF",
    backgroundColor: "#AE00FF20", padding: 20, borderRadius: 10
  }
});

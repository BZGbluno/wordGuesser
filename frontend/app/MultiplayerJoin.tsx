import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function MultiplayerJoin() {
  const [sessionId, setSessionId] = useState("");
  const router = useRouter();

  const joinGame = () => {
    if (!sessionId.trim()) return;

    router.push({
      pathname: "./Multiplayer",
      params: { sessionId: sessionId.trim() },
    });
  };

  const createGame = () => {
    router.push("./Multiplayer");
  };

  return (
    <View style={styles.container}>

      {/* Back */}
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      {/* Title */}
      <Text style={styles.title}>Multiplayer</Text>
      <Text style={styles.subtitle}>join or create a word battle</Text>

      {/* Input */}
      <TextInput
        style={styles.input}
        placeholder="enter session id..."
        placeholderTextColor="rgba(232,213,183,0.4)"
        value={sessionId}
        onChangeText={setSessionId}
      />

      {/* Join */}
      <Pressable style={styles.button} onPress={joinGame}>
        <Text style={styles.buttonTitle}>
          {sessionId ? `Join ${sessionId}` : "Join Game"}
        </Text>
        <Text style={styles.buttonSub}>
          enter a session code from a friend
        </Text>
      </Pressable>

      {/* Create */}
      <Pressable style={styles.button} onPress={createGame}>
        <Text style={styles.buttonTitle}>Create Game</Text>
        <Text style={styles.buttonSub}>
          start a new multiplayer session
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1108",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: "25%",
    paddingHorizontal: 20,
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },

  backText: {
    color: "rgba(232,213,183,0.7)",
    fontSize: 16,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#c9a96e",
    marginBottom: 6,
    textShadowColor: "#3d2b1f",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },

  subtitle: {
    color: "rgba(232,213,183,0.4)",
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 25,
  },

  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 2,
    borderColor: "#a67c52",
    color: "#e8d5b7",
    padding: 14,
    borderRadius: 14,
    fontSize: 16,
    marginBottom: 15,
  },

  button: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 2,
    borderColor: "#a67c52",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  buttonTitle: {
    color: "#c9a96e",
    fontSize: 18,
    fontWeight: "800",
  },

  buttonSub: {
    color: "rgba(232,213,183,0.6)",
    fontSize: 12,
    marginTop: 4,
  },
});
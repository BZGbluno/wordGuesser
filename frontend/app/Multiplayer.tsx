import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
const BASE_URL = "https://stimulus-epilogue-earshot.ngrok-free.dev";
const WS_URL = "wss://stimulus-epilogue-earshot.ngrok-free.dev";


// const BACKEND_URL = "http://10.0.0.130:8000";


export default function SinglePlayer() {
  const [text, setText] = useState("");
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const { sessionId: passedSessionId } = useLocalSearchParams();
  const router = useRouter();

  // ---------------------------
  // WEBSOCKET CONNECT
  // ---------------------------
  const connectWebSocket = (id: string) => {
    const ws = new WebSocket(`${WS_URL}/ws/${id}`);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log("Server:", msg);

      if (msg.type === "score") {
        setScore(msg.score);
      }

      if (msg.type === "hint") {
        setHint(msg.message);
      }
      if (msg.type === "win") {
        Alert.alert("🎉 You Won!", msg.message || "Great job!");
      }

    };

    ws.onerror = (err) => {
      console.log("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    setSocket(ws);
  };

  // ---------------------------
  // CREATE SESSION
  // ---------------------------
  const createSession = async () => {
    try {
      const res = await fetch(`${BASE_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      const id = data.session_id;

      setSessionId(id);
      connectWebSocket(id);

    } catch (err) {
      console.error("Failed to create session:", err);
    }
  };

  // ---------------------------
  // INIT
  // ---------------------------
  useEffect(() => {
    if (typeof passedSessionId == "string") {
      setSessionId(passedSessionId);
      connectWebSocket(passedSessionId);
    } else {
      createSession();
    }

    return () => {
      console.log("Cleaning up socket...");
      socket?.close();
    };
  }, []);

  // ---------------------------
  // SEND GUESS
  // ---------------------------
  const sendGuess = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(text);
    setText("");
  };

  // ---------------------------
  // REQUEST HINT
  // ---------------------------
  const handleHint = async () => {
    if (!sessionId) return;

    await fetch(
      `${BASE_URL}/hint?session_id=${sessionId}`,
      { method: "POST" }
    );
  };


return (
  <View style={styles.container}>

    {/* Back button */}
    <Pressable onPress={() => router.back()} style={styles.backButton}>
      <Text style={styles.backText}>← Back</Text>
    </Pressable>

    {/* Score */}
    <View style={styles.scoreBox}>
      <Text style={styles.scoreText}>Score: {score}</Text>
    </View>

    {/* Session */}
    {sessionId && (
      <Text style={styles.sessionText}>
        session: {sessionId.slice(0, 6)}...
      </Text>
    )}

    {/* Title */}
    <Text style={styles.title}>Multiplayer</Text>

    {/* Input */}
    <TextInput
      style={styles.input}
      placeholder="type your guess..."
      placeholderTextColor="rgba(232,213,183,0.4)"
      value={text}
      onChangeText={setText}
      onSubmitEditing={sendGuess}
    />

    {/* Hint */}
    {hint !== "" && (
      <View style={styles.hintBox}>
        <Text style={styles.hintText}>💡 {hint}</Text>
      </View>
    )}

    {/* Buttons */}
    <View style={styles.buttonRow}>

      <Pressable style={styles.button} onPress={handleHint}>
        <Text style={styles.buttonText}>Hint</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={sendGuess}>
        <Text style={styles.buttonText}>Guess</Text>
      </Pressable>

    </View>

  </View>
);
}

// ---------------------------
// STYLES
// ---------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1108",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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

  scoreBox: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "#a67c52",
    padding: 10,
    borderRadius: 12,
  },

  scoreText: {
    color: "#c9a96e",
    fontWeight: "700",
    fontSize: 14,
  },

  sessionText: {
    position: "absolute",
    top: 100,
    color: "rgba(232,213,183,0.3)",
    fontSize: 11,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#c9a96e",
    marginBottom: 20,
    textShadowColor: "#3d2b1f",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
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
  },

  hintBox: {
    marginTop: 15,
    padding: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(201,169,110,0.3)",
    borderRadius: 12,
    width: "100%",
  },

  hintText: {
    color: "rgba(232,213,183,0.6)",
    fontStyle: "italic",
    textAlign: "center",
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 12,
  },

  button: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 2,
    borderColor: "#a67c52",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },

  buttonText: {
    color: "#c9a96e",
    fontWeight: "700",
  },
});
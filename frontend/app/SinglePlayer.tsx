import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function SinglePlayer() {
  const [text, setText] = useState("");
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const router = useRouter();

  // ---------------------------
  // CREATE SESSION + CONNECT WS
  // ---------------------------
  useEffect(() => {
    createSession();

    return () => {
      console.log("Cleaning up socket...");
      socket?.close();
    };
  }, []);

  const createSession = async () => {
    try {
      const res = await fetch("http://10.0.0.130:8000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      const id = data.session_id;

      setSessionId(id);

      // ---------------------------
      // CONNECT WEBSOCKET
      // ---------------------------
      const ws = new WebSocket(`ws://10.0.0.130:8000/ws/${id}`);

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        console.log("Server:", msg);

        // handle backend response
        if (msg.type === "score") {
          setScore(msg.score);
        }

        if (msg.type === "hint") {
          setHint(msg.hint);
        }
      };

      ws.onerror = (err) => {
        console.log("WebSocket error:", err);
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
      };

      setSocket(ws);
    } catch (err) {
      console.error("Failed to create session:", err);
    }
  };

  // ---------------------------
  // SEND GUESS
  // ---------------------------
  const sendGuess = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(text);
    setText("");
  };

  // ---------------------------
  // UI ACTIONS
  // ---------------------------
  const handleHint = async () => {
    if (!sessionId) return;

    try {
      const res = await fetch(`http://10.0.0.130:8000/hint?session_id=${sessionId}`, {
        method: "POST",
      });

      const data = await res.json();

      setHint(data.riddle);
    } catch (err) {
      console.error("Failed to fetch hint:", err);
    }
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

      {/* Session debug */}
      {sessionId && (
        <Text style={styles.sessionText}>
          Session: {sessionId.slice(0, 8)}...
        </Text>
      )}

      {/* Title */}
      <Text style={styles.title}>Single Player</Text>

      {/* Input */}
      <TextInput
        style={styles.input}
        placeholder="Type something..."
        placeholderTextColor="#888"
        value={text}
        onChangeText={setText}
        onSubmitEditing={sendGuess}
      />

      {/* Hint */}
      {hint !== "" && (
        <Text style={styles.hintText}>💡 {hint}</Text>
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
    backgroundColor: "#121212",
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
    color: "#fff",
    fontSize: 18,
  },

  scoreBox: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#1f1f1f",
    padding: 10,
    borderRadius: 8,
  },

  scoreText: {
    color: "#fff",
    fontSize: 16,
  },

  sessionText: {
    position: "absolute",
    top: 100,
    color: "#666",
    fontSize: 12,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    marginBottom: 20,
  },

  input: {
    width: "100%",
    backgroundColor: "#1f1f1f",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },

  hintText: {
    color: "#aaa",
    marginTop: 15,
    fontSize: 14,
    textAlign: "center",
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },

  button: {
    backgroundColor: "#1f1f1f",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
});
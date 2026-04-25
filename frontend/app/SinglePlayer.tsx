import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert, Animated, Dimensions } from "react-native";
import { useRouter } from "expo-router";
const { height, width } = Dimensions.get("window");
const bottomZoneTop = height * 0.66;
const BASE_URL = "https://stimulus-epilogue-earshot.ngrok-free.dev";
const WS_URL = "wss://stimulus-epilogue-earshot.ngrok-free.dev";

// const BACKEND_URL = "http://10.0.0.130:8000";
export default function SinglePlayer() {
  const [text, setText] = useState("");
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const walkAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showHintAnimation, setShowHintAnimation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    createSession();

    return () => {
      socket?.close();
    };
  }, []);

  const createSession = async () => {
    try {
      const res = await fetch(`${BASE_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      const id = data.session_id;

      setSessionId(id);

      const ws = new WebSocket(`${WS_URL}/ws/${id}`);

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.type === "score") setScore(msg.score);
        if (msg.type === "hint") {
          setHint(msg.message);
          playHintAnimation(msg.message);

        }
        if (msg.type === "win") {
          Alert.alert("🎉 You Won!", msg.message || "Great job!");
        }
      };

      setSocket(ws);
    } catch (err) {
      console.error(err);
    }
  };

  const sendGuess = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(text);
    setText("");
  };


  const playHintAnimation = (hintText?: string) => {
    setShowHintAnimation(true);
    setHint(hintText || hint);

    walkAnim.setValue(0);
    fadeAnim.setValue(0);

    Animated.timing(walkAnim, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        // optional auto-hide after delay
        setTimeout(() => setShowHintAnimation(false), 3000);
      });
    });
  };

  const handleHint = async () => {
    if (!sessionId) return;

    await fetch(
      `${BASE_URL}/hint?session_id=${sessionId}`,
      { method: "POST" }
    );
  };

  return (
    <View style={styles.container}>

      {/* Back */}
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
          session: {sessionId}
        </Text>
      )}

      {/* Title */}
      <Text style={styles.title}>Single Player</Text>

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

      {showHintAnimation && (
      <Animated.View
        style={[
          styles.character,
          {
            transform: [
              {
                translateX: walkAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-100, width + 100],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={{ fontSize: 32 }}>🚶</Text>
      </Animated.View>
    )}
    {showHintAnimation && (
      <Animated.View style={[styles.paper, { opacity: fadeAnim }]}>
        <Text style={styles.hintText}>💡 {hint}</Text>
      </Animated.View>
    )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1108",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: "20%",
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
    fontSize: 14,
    fontWeight: "700",
  },

  sessionText: {
    position: "absolute",
    top: 50,
    color: "rgba(232,213,183,0.3)",
    fontSize: 11,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#c9a96e",
    marginBottom: 25,
    marginTop: 15,
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

  hintText: {
    marginTop: 15,
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

  character: {
  position: "absolute",
  top: bottomZoneTop,
  },

  paper: {
    position: "absolute",
    top: bottomZoneTop + 60,
    backgroundColor: "rgba(232,213,183,0.08)",
    borderWidth: 2,
    borderColor: "#a67c52",
    padding: 16,
    borderRadius: 14,
    alignSelf: "center",
  },
});
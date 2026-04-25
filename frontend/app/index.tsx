import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

const DOODLE_LETTERS = ["W", "O", "R", "D"];

function Letter({ char }: { char: string }) {
  return <Text style={styles.letter}>{char}</Text>;
}

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <Text style={styles.subHeader}>✦ a word riddle game ✦</Text>

      <View style={styles.titleRow}>
        {DOODLE_LETTERS.map((c, i) => (
          <Letter key={i} char={c} />
        ))}
      </View>

      <Text style={styles.subtitle}>riddle · guess · repeat</Text>

      {/* divider */}
      <View style={styles.divider} />

      {/* BUTTONS */}
      <Pressable
        style={styles.button}
        onPress={() => router.push("/SinglePlayer")}
      >
        <Text style={styles.buttonTitle}>🖊️ Solo Play</Text>
        <Text style={styles.buttonSub}>just you vs the words</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/MultiplayerJoin")}
      >
        <Text style={styles.buttonTitle}>🎲 Multiplayer</Text>
        <Text style={styles.buttonSub}>play with friends</Text>
      </Pressable>

      {/* NOTE */}
      <View style={styles.note}>
        <Text style={styles.noteText}>
          each word hides a riddle. use hints wisely — they cost points.
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1108",
    alignItems: "center",
    paddingTop: "25%",
    paddingHorizontal: 20,
  },

  subHeader: {
    color: "rgba(232,213,183,0.4)",
    fontSize: 12,
    letterSpacing: 3,
    marginBottom: 20,
  },

  titleRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 10,
  },

  letter: {
    fontSize: 48,
    fontWeight: "900",
    color: "#c9a96e",
    textShadowColor: "#3d2b1f",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },

  subtitle: {
    color: "#c9a96e",
    fontStyle: "italic",
    marginBottom: 20,
  },

  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#6b4c2a",
    marginVertical: 20,
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

  note: {
    marginTop: 30,
    padding: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(201,169,110,0.3)",
    borderRadius: 10,
  },

  noteText: {
    color: "rgba(232,213,183,0.5)",
    fontSize: 11,
    textAlign: "center",
    fontStyle: "italic",
  },
});
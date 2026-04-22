import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MenuButton from "../components/MenuButton";
import { useRouter } from "expo-router";


export default function Home() {
  const router = useRouter();

  const handleMultiplayer = () => {
    console.log("Multiplayer clicked");
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Word Guesser</Text>

      <MenuButton
        label="Single Player"
        onPress={() => router.push("./SinglePlayer")}
        description="Play Solo and Challenge Yourself"
      />

      <MenuButton
        label="Multiplayer"
        onPress={handleMultiplayer}
        description="Enjoy Playing with a Team"
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: "30%", // pushes content down slightly from top
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
});
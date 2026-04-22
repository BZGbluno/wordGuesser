import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";

type Props = {
  label: string;
  description?: string; // Optional description for future use
  onPress: () => void;
};

const MenuButton: React.FC<Props> = ({ label, description, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <View>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1f1f1f",
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 10,
    width: 260,
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    color: "#aaaaaa",
    fontSize: 12,
    marginTop: 4,
  },
});

export default MenuButton;
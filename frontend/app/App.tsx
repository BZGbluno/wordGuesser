import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./index";
import SinglePlayer from "./SinglePlayer";
import Multiplayer from "./Multiplayer";
import MultiplayerJoin from "./MultiplayerJoin";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        {/* Home screen is index.tsx */}
        <Stack.Screen name="Home" component={Home} />

        <Stack.Screen
          name="SinglePlayer"
          component={SinglePlayer}
        />

        <Stack.Screen
          name="Multiplayer"
          component={Multiplayer}
        />

        <Stack.Screen
          name="MultiplayerJoin"
          component={MultiplayerJoin}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
import { Montserrat_400Regular, Montserrat_600SemiBold } from "@expo-google-fonts/montserrat";
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Colors } from "../constants/Colors";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular
  });

   const isAuthenticated = false;

  useEffect(() => {
    if(fontsLoaded) {
      SplashScreen.hideAsync()
    }
  },[fontsLoaded]);

  if(!fontsLoaded) {
    return null;
  }
return ( <>

        <StatusBar value="auto" />
        <Stack screenOptions={{
            headerStyle: {backgroundColor: Colors.navBackground},
            headerTintColor:Colors.title,
        }}>
          
          <Stack.Screen name="index" options={{ headerShown:false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
          <Stack.Screen name="(questionnaire)" options={{ headerShown: false }} />
        </Stack>
</>)
}

import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { Colors } from "../constants/Colors";

export default function RootLayout() {
return ( <>

        <StatusBar value="auto" />
        <Stack screenOptions={{
            headerStyle: {backgroundColor: Colors.navBackground},
            headerTintColor:Colors.title,
        }}>

          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          
         <Stack.Screen name="index" options={{ headerShown:false }} />
        </Stack>
</>)
}

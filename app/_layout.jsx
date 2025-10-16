import { Stack } from "expo-router";
import { Colors } from "../constants/Colors";

export default function RootLayout() {
return ( <>
        <Stack screenOptions={{
            headerStyle: {backgroundColor: Colors.navBackground},
            headerTintColor:Colors.title,
        }}>
         <Stack.Screen name="index" options={{ headerShown:false }} />
        </Stack>
</>)
}

import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const RootLayout = () => {
  return (
    <>
      <StatusBar style="auto" />
      <Stack 
        screenOptions={{ headerShown: false, animation: "none" }}>
      
      <Stack.Screen name="/login" options={{ headerShown: false }} />
      <Stack.Screen name="/register" options={{ headerShown: false }} />
        
      </Stack>
    </>
  )
}

export default RootLayout
import { Stack } from 'expo-router'

const RootLayout = () => {
  return (
  <Stack/>
  )
}

export default RootLayout

/*
<>
      <StatusBar style="auto" />
      <Stack 
        screenOptions={{ headerShown: false, animation: "none" }}>
      
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Register" }} />
        
      </Stack>
</>
      */
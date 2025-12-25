import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="add-habits"
        options={{
          presentation: 'modal', // Makes it slide up like a modal
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen 
        name="habit-frequency"
        options={{
          presentation: 'card', 
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="habit-stats"
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="points-history"
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}
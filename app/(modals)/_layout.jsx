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
      {/* Add other modals here later like habit-stats, edit-habit, etc. */}
    </Stack>
  );
}
import { Redirect, Stack, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
export default function QuestionnaireLayout() {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // ✅ Remove the hasCompletedQuestionnaire redirect - let main layout handle it
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="questions" />
      <Stack.Screen name="results" />
    </Stack>
  );
}
import { Redirect,Stack } from "expo-router";
import { useAuthStore } from "../../store/authStore";

export default function QuestionnaireLayout() {
  const {isAuthenticated,hasCompletedQuestionnaire} = useAuthStore();

  if(!isAuthenticated) {
    return <Redirect href="/(auth)/login"/>;
  }

  if(hasCompletedQuestionnaire) {
    return <Redirect href="/(dashboard)"/>;
  }

return (
  <Stack screenOptions={{ headerShown: false}} >
    <Stack.Screen name="index"/>
    </Stack>
  )
}
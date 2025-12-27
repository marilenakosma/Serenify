import { useFonts } from 'expo-font';
import { Slot, useSegments, useRouter } from "expo-router";
import BootSplash from 'react-native-bootsplash';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState,useRef } from 'react';
import { useAuthStore } from "../store/authStore";
import { I18nextProvider } from 'react-i18next';
import i18n from '../constants/translations';
import { onAuthStateChange } from './services/firebaseService';

function RootLayoutNav() {
  const { 
    isAuthenticated, 
    hasCompletedQuestionnaire, 
    questionnaireResults, 
    userId,
    isLoading,
    checkAuth } = useAuthStore();
  const segments = useSegments();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const lastNavigationRef = useRef('');
  const navigationInProgressRef = useRef(false);
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // Initialize auth on mount (only once)
 useEffect(() => {
  let unsubscribe;
  
  const init = async () => {
    // Check MMKV cache first
    await checkAuth();
    
    // Listen for Firebase auth changes
    unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        console.log('User authenticated:', user.uid);
        
        const state = useAuthStore.getState();
        
        // Only sync if:
        // 1. User ID exists in store
        // 2. Has completed questionnaire (means it's an existing user, not new registration)
        // 3. Auth state was already set before (prevents sync during registration)
        if (state.userId && state.hasCompletedQuestionnaire && state.isAuthenticated) {
          console.log('Syncing existing user data...');
          await state.syncFromFirebase();
        } else if (!state.userId) {
          console.log('New registration in progress - skipping sync');
        } else if (!state.hasCompletedQuestionnaire) {
          console.log('User needs to complete questionnaire - skipping sync');
        }
      } else {
        console.log('User signed out');
      }
    });
    
    setIsNavigationReady(true);
  };

  init();

  return () => {
    if (unsubscribe) unsubscribe();
  };
}, []);

  // Handle navigation
  useEffect(() => {

     if (!isNavigationReady || navigationInProgressRef.current) return;

    const navigationTimeout = setTimeout(() => {
      const { showingResults, userId, isLoading  } = useAuthStore.getState();
      const currentRoute = segments.join('/');

      const inAuthGroup = segments[0] === '(auth)';
      const inQuestionnaireGroup = segments[0] === '(questionnaire)';
      const onResultsPage = segments[1] === 'results';

      let shouldNavigate = false;
      let targetRoute = '';

      if (!isAuthenticated) {
        if (!inAuthGroup && segments.length > 0) {
          shouldNavigate = true;
          targetRoute = '/(auth)/login';
        }
      } else if (!hasCompletedQuestionnaire) {
        if (!inQuestionnaireGroup) {
          shouldNavigate = true;
          targetRoute = '/(questionnaire)';
        }
      } else {
        if (showingResults && !onResultsPage) {
          shouldNavigate = true;
          targetRoute = '/(questionnaire)/results';
        } else if (!showingResults && (inAuthGroup || inQuestionnaireGroup)) {
          shouldNavigate = true;
          targetRoute = '/(dashboard)';
        }

      }

         if (shouldNavigate && targetRoute !== currentRoute) {
        console.log(`Redirecting from ${currentRoute} to ${targetRoute}`);
        navigationInProgressRef.current = true;
        lastNavigationRef.current = targetRoute;

        router.replace(targetRoute);

        setTimeout(() => {
          navigationInProgressRef.current = false;
        }, 500);
      }
      },200);

      return () => clearTimeout(navigationTimeout);
  }, [isAuthenticated, hasCompletedQuestionnaire,questionnaireResults, segments, isNavigationReady]);

  return <Slot />;
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    'MontserratZ-Regular': require('../assets/fonts/MontserratZ-Regular.otf'),
    'MontserratZ-SemiBold': require('../assets/fonts/MontserratZ-SemiBold.otf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      setAppIsReady(true);
    }
  }, [fontsLoaded, fontError]);

  if (!appIsReady) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <StatusBar style="auto" translucent={true} />
      <RootLayoutNav />
    </I18nextProvider>
  );
}

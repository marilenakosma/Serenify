import { useFonts } from 'expo-font';
import { Slot, useSegments, useRouter } from "expo-router";
import BootSplash from 'react-native-bootsplash';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from "../store/authStore";
import { Platform,NavigationBar } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import i18n from '../constants/translations';

function RootLayoutNav() {
  const { isAuthenticated, hasCompletedQuestionnaire, checkAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  const lastNavigationRef = useRef('');
  const navigationInProgressRef = useRef(false);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setTimeout(() => setIsNavigationReady(true), 300);
    };
    initAuth();
  }, []);


  useEffect(() => {
    if (!isNavigationReady || navigationInProgressRef.current) return;

    const navigationTimeout = setTimeout(() => {
      const { showingResults } = useAuthStore.getState();
      const currentRoute = segments.join('/');

      if (currentRoute === lastNavigationRef.current) {
        return;
      }

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
    }, 200);

    return () => clearTimeout(navigationTimeout);
  }, [isAuthenticated, hasCompletedQuestionnaire, segments, isNavigationReady]);

  return <Slot />;
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    'MontserratZ-Regular': require('../assets/fonts/MontserratZ-Regular.otf'),
    'MontserratZ-SemiBold': require('../assets/fonts/MontserratZ-SemiBold.otf'),
  });

  const { checkAuth } = useAuthStore();

  useEffect(() => {
    async function prepare() {
      try {
        await checkAuth();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    if (fontsLoaded || fontError) {
      prepare();
    }
  }, [fontsLoaded, fontError]);

  if (!appIsReady) {
    return null; // BootSplash stays visible (don't manually hide it here)
  }

  return (
    <I18nextProvider i18n={i18n}>
      <StatusBar style="auto" translucent={true} />
      <RootLayoutNav />
    </I18nextProvider>
  );
}

import { Montserrat_400Regular, Montserrat_600SemiBold } from "@expo-google-fonts/montserrat";
import { useFonts } from 'expo-font';
import { Stack,Slot,useSegments,useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect,useState,useRef } from 'react';
import { useAuthStore } from "../store/authStore";
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { I18nextProvider } from 'react-i18next';
import i18n from '../constants/translations';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const {isAuthenticated,hasCompletedQuestionnaire,checkAuth} = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  const lastNavigationRef = useRef(''); // last navigation
  const navigationInProgressRef = useRef(false); //  Prevent rapid navigation

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setTimeout(() => setIsNavigationReady(true), 300); // Longer delay
    };
    initAuth();
  }, []);

/*
  useEffect(() => {
  const setupNavigationBar = async () => {
    try {
      if (Platform.OS === 'android') {
        await NavigationBar.setVisibilityAsync('hidden');
      }
    } catch (error) {
      // Safely ignore this error
      console.log('Navigation bar setup failed:', error.message);
    }
  };
  // NavigationBar.setBehaviorAsync('inset-swipe'); //  gesture navigation
      // NavigationBar.setBehaviorAsync('overlay-swipe'); // Alternative behavior
  setupNavigationBar();
}, []);
*/
  
    //Check where the user is
    /* // Route: /(auth)/login
    segments = ['(auth)', 'login'] */
  useEffect(() => {
    if (!isNavigationReady || navigationInProgressRef.current) return; // Prevent navigation during transitions

    const navigationTimeout = setTimeout(() => {
      const {showingResults} = useAuthStore.getState();
      const currentRoute = segments.join('/');

      // Prevent navigation loops
      if (currentRoute === lastNavigationRef.current) {
        return;
      }

      /*
      console.log('Navigation check:', { 
        isAuthenticated, 
        hasCompletedQuestionnaire, 
        showingResults,
        currentRoute: segments,
        lastRoute: lastNavigationRef.current
      });
*/
      const inAuthGroup = segments[0] === '(auth)';
      const inQuestionnaireGroup = segments[0] === '(questionnaire)';
      const inDashboardGroup = segments[0] === '(dashboard)'; 
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

      //  Only navigate if needed and not already there
      if (shouldNavigate && targetRoute !== currentRoute) {
        console.log(`Redirecting from ${currentRoute} to ${targetRoute}`);
        navigationInProgressRef.current = true; // Mark navigation in progress
        lastNavigationRef.current = targetRoute;
        
        router.replace(targetRoute);
        
        // Reset navigation flag after delay
        setTimeout(() => {
          navigationInProgressRef.current = false;
        }, 500);
      }
    }, 200); //  Longer debounce

    return () => clearTimeout(navigationTimeout);
  }, [isAuthenticated, hasCompletedQuestionnaire, segments, isNavigationReady]);

  return <Slot/>;
}
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
    'MontserratZ-Regular': require('../assets/fonts/MontserratZ-Regular.otf'),
    'MontserratZ-SemiBold': require('../assets/fonts/MontserratZ-SemiBold.otf'),
  });

  useEffect(() => {

    if(fontsLoaded ||  fontError) {
      SplashScreen.hideAsync()
    }
  },[fontsLoaded, fontError]);

  if(!fontsLoaded && !fontError) {
    return null;
  }
return ( <I18nextProvider i18n={i18n}>
        <StatusBar style="auto" translucent={true} />
        <RootLayoutNav/>
</I18nextProvider>)
}

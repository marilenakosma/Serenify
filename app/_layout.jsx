import { Montserrat_400Regular, Montserrat_600SemiBold } from "@expo-google-fonts/montserrat";
import { useFonts } from 'expo-font';
import { Stack,Slot,useSegments,useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect,useState } from 'react';
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

 useEffect(() => {
        const initAuth = async () => {
            await checkAuth();
            // Small delay to ensure navigation is ready
            setTimeout(() => setIsNavigationReady(true), 100);
        };
        initAuth();
    }, []);


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

  
    //Check where the user is
    /* // Route: /(auth)/login
    segments = ['(auth)', 'login'] */
  useEffect(() => {
        if (!isNavigationReady) return;

        const {showingResults} = useAuthStore.getState();

        console.log('Navigation check:', { 
            isAuthenticated, 
            hasCompletedQuestionnaire, 
            showingResults,
            currentRoute: segments,
            navigationReady: isNavigationReady,
            segmentDetails: segments.map((seg, index) => `[${index}]: ${seg}`) 
        });

        const inAuthGroup = segments[0] === '(auth)';
        const inQuestionnaireGroup = segments[0] === '(questionnaire)';
        const onResultsPage = segments[1] === 'results'; //  Check for results page
  
        if (!isAuthenticated) {
            if (!inAuthGroup && segments.length > 0) {
                console.log('Redirecting to login');
                router.replace('/(auth)/login');
            }
        } else if (!hasCompletedQuestionnaire) {
            if (!inQuestionnaireGroup) {
                console.log('Redirecting to questionnaire');
                router.replace('/(questionnaire)');
            }
        } else {
        // User is authenticated AND completed questionnaire
        // If showing results, only stay on results page
        if (showingResults && !onResultsPage) {
            console.log('Redirecting to results');
            router.replace('/(questionnaire)/results');
        } else if (!showingResults && (inAuthGroup || inQuestionnaireGroup)) {
            console.log('Redirecting to dashboard');
            router.replace('/(dashboard)');
        }
    }
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

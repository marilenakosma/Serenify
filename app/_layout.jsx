import { Montserrat_400Regular, Montserrat_600SemiBold } from "@expo-google-fonts/montserrat";
import { useFonts } from 'expo-font';
import { Stack,Slot,useSegments,useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { use, useEffect } from 'react';
import { Colors } from "../constants/Colors";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

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
    if (Platform.OS === 'android') {
      // Hide navigation bar
      NavigationBar.setVisibilityAsync('hidden');
      // NavigationBar.setBehaviorAsync('inset-swipe'); //  gesture navigation
      // NavigationBar.setBehaviorAsync('overlay-swipe'); // Alternative behavior
    }
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
        } else if(!showingResults){
            if (inAuthGroup || inQuestionnaireGroup) {
                console.log('Redirecting to dashboard');
                router.replace('/(dashboard)');
            }
        }
    }, [isAuthenticated, hasCompletedQuestionnaire, segments, isNavigationReady]);

  return <Slot/>;
}
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular
  });

  useEffect(() => {
    if(fontsLoaded) {
      SplashScreen.hideAsync()
    }
  },[fontsLoaded]);

  if(!fontsLoaded) {
    return null;
  }
return ( <>
        <StatusBar style="auto" translucent={true} />
        <RootLayoutNav/>
</>)
}

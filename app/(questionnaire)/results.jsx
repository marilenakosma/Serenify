import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedButton from '../../components/ThemedButton';
import ThemedText from '../../components/ThemedText';
import ThemedView from '../../components/ThemedView';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import LottieView from 'lottie-react-native';

const results = () => {
    const router = useRouter();
    const { finishShowingResults } = useAuthStore();

    const handleContinue = () => {
        finishShowingResults(); // ✅ Clear the flag
        router.replace("/(dashboard)");
    };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.content}>
        <ThemedText title={true} style={styles.title}>
          Quiz Complete
        </ThemedText>

        <LottieView
            source={require('../../assets/animations/AnimatedBird.json')} 
            autoPlay
            loop={true}
            style={styles.animation}
                      />

        <ThemedText style={styles.subtitle}>
            Thank you for completing the questionnaire.
            We're preparing personalized recommendations for you.
        </ThemedText>

        <ThemedButton 
            onPress={handleContinue}
            style={styles.button}
                >
          <ThemedText title={true} style={styles.buttonText}>
             Continue to Dashboard
          </ThemedText>
        </ThemedButton>
      </SafeAreaView>
    </ThemedView>
  )
}

export default results

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
   title: {
        textAlign:"center",
        fontSize: 25,
        marginBottom:10,
        paddingHorizontal: 10,
    },
    subtitle: {
        fontSize: 17,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 26,
    },
    button: {
        width: '100%',
    },
    buttonText: {
        color: '#f2f2f2',
        fontSize: 16,
        fontWeight: '600',
    },
    animation: {
    width: 400,
    height: 400,
  },
});
import LottieView from 'lottie-react-native';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';

const SplashScreen = ({ onFinish }) => {
  
  useEffect(() => {
    // Auto-hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <ThemedView style={styles.container}>
      <LottieView
        source={require('../assets/animations/Tree.json')} 
        autoPlay
        loop={false}
        style={styles.animation}
        onAnimationFinish={onFinish} // Hide when animation completes
      />
      
      <ThemedText title={true} style={styles.title}>
        Serenify
      </ThemedText>
    
    </ThemedView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  animation: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.7,
  },
});
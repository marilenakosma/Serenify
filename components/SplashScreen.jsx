import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';

const MINIMUM_SPLASH_TIME = 3000; // 3 seconds

const SplashScreen = ({ onFinish }) => {
  const [animationDone, setAnimationDone] = useState(false);
  const [timerDone, setTimerDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimerDone(true);
    }, MINIMUM_SPLASH_TIME);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only call onFinish when BOTH animation and timer are done
    if (animationDone && timerDone) {
      onFinish();
    }
  }, [animationDone, timerDone, onFinish]);

  return (
    <ThemedView style={styles.container}>
      <LottieView
        source={require('../assets/animations/Tree.json')} 
        autoPlay
        loop={false}
        style={styles.animation}
        onAnimationFinish={() => setAnimationDone(true)}
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
    marginTop: 20,
    textAlign: 'center',
  },
});
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from './ThemedText';
import { Confetti } from 'react-native-fast-confetti';

export function PointsToast({ visible, points, message, onDismiss, duration = 3000 }) {
    const slideAnim = useRef(new Animated.Value(150)).current;

    useEffect(() => {
        if(visible) {

            Animated.spring(slideAnim, {
              toValue:0,
              useNativeDriver:true,
              tension:50,
              friction:8,
            }).start();

            const timer = setTimeout(() => {
                Animated.timing(slideAnim,{
                    toValue:150,
                    duration:300,
                    useNativeDriver:true,
                }).start(() => {
                    onDismiss();
                });
                },duration)
                return () => clearTimeout(timer);
            } else {
                slideAnim.setValue(150);
            }
         },[visible])

         if(!visible) return null;

         return (
    <>
      {visible && (
        <View style={styles.confettiContainer} pointerEvents="none">
          <Confetti 
            //ref={confettiRef}
          />
        </View>
      )}
      
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons name="trophy" size={28} color="#FFD700" />
          </View>
          
          <View style={styles.textContainer}>
            <ThemedText style={styles.title}>
              {message || 'Great Job!'}
            </ThemedText>
            <View style={styles.pointsRow}>
              <Ionicons name="flash" size={18} color="#FFD700" />
              <ThemedText style={styles.points}>
                +{points}
              </ThemedText>
            </View>
          </View>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
  },
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 9999,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  points: {
    fontSize: 15,
    color: '#4CAF50',
  },
});
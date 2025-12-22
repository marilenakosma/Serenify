import { Image, Pressable, StyleSheet, View } from 'react-native'
import { useRouter } from "expo-router";

import ThemedText from './ThemedText'

const DurationButton = ({text, style, length, onPress, duration, label = 'min'}) => {
  // If duration is provided, show stacked layout
  if (duration !== undefined) {
    return (
      <View style={[styles.container, style]}>
        <Pressable 
          style={styles.button} 
          onPress={onPress}
        >
          <ThemedText style={styles.durationNumber}>{duration}</ThemedText>
          <ThemedText style={styles.durationLabel}>{length}</ThemedText>
        </Pressable>
      </View>
    );
  }

  // Fallback to original layout
  return (
    <View style={[styles.container, style]}>
      <Pressable 
        style={styles.button} 
        onPress={onPress}
      >
        <ThemedText title={true} style={styles.text}>{length || text}</ThemedText>
      </Pressable>
    </View>
  );
}

export default DurationButton

const styles = StyleSheet.create({
    container: {
        backgroundColor:"white",
        borderRadius:12,
        elevation: 2, 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    button: {
        backgroundColor: "transparent",
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        minHeight: 80, 
    },
    text: {
        textAlign: 'center',
        fontSize: 12,
    },
    durationNumber: {
        fontSize: 32,
        textAlign: 'center',
        marginBottom: 4,
    },
    durationLabel: {
        fontSize: 12,
        textAlign: 'center',
        color: '#666',
    }
})
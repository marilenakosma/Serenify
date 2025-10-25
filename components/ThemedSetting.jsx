import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import ThemedText from './ThemedText';

export default function ThemedSetting({ name, text, style, ...props }) {
  return (
    <TouchableOpacity style={[styles.container, style]} 
    {...props}>

      <View style={styles.iconContainer}>
        <Ionicons name={name} size={24} color={Colors.primary} />
      </View>
      
      <View style={styles.content}>
        <ThemedText style={styles.text}>
          {text}
        </ThemedText>
      </View>
      
      <View style={styles.arrowContainer}>
        <View style={styles.arrow}>
            <Ionicons name="arrow-forward-outline" size={16} color="white" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  arrowContainer: {
    marginRight: 8,
  },
  arrow: {
    width: 24,
    height: 24,
    borderRadius: 15,
    backgroundColor: Colors.primary,  // ← Fixed: solid background
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  text: {
    fontSize: 16,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    color: Colors.primary,
    marginRight: 12,
  },
  iconContainer: {
    margin:15,
  },
});
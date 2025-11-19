import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import ThemedText from './ThemedText';

export default function ThemedGoal({ icon,name, text, points, 
  completed = false, onToggle, category, duration, style,isRecommendation=false, ...props }) {
    
    const iconName = icon || name || 'checkmark-outline';
    
  return (
    <TouchableOpacity style={[styles.container, style]} 
    onPress={onToggle} {...props}>

      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={24} color={Colors.primary} />
      </View>
      
      <View style={styles.content}>
        <ThemedText style={[styles.text, completed && styles.completedText]}>
          {text}
        </ThemedText>
        <View style={styles.metadata}>
          <ThemedText style={styles.category}>{category || 'Wellness'}</ThemedText>
          {points && (
            <ThemedText style={styles.points}>+{points} pts</ThemedText>
          )}
          <ThemedText style={styles.time}>{duration || '5 min'}</ThemedText>
        </View>
      </View>
      
      {/* Only one indicator based on type */}
      <View style={styles.circleContainer}>
        {isRecommendation ? (
          <View style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={24} color="#2196F3" />
          </View>
        ) : (
          <View style={[styles.circle, completed && styles.completedCircle]}>
            {completed && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
        )}
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    marginRight: 1,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCircle: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  content: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
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
  time: {
    fontSize: 12,
    color: '#666',
  },
  iconContainer: {
    margin:15,
  },
  points: {
    fontSize: 12,
    color: '#FF9800',
    marginRight: 12,
    fontWeight: '600',
  },
});
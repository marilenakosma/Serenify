import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import ThemedText from './ThemedText';

export default function ThemedGoal({ 
  icon,
  name, 
  text, 
  points, 
  completed = false, 
  onToggle, 
  category, 
  duration, 
  style,
  isRecommendation=false, 
  color,
  ...props }) {
    
  const iconName = icon || name || 'checkmark-outline';
  const accentColor = color || Colors.primary; 

  return (
    <TouchableOpacity style={[styles.container, style]} 
    onPress={onToggle} {...props}>

      <View style={[
        styles.iconContainer,
        //color && { backgroundColor : `${color}15`}
        ]}>
        <Ionicons name={iconName} size={24} color={accentColor} />
      </View>
      
      <View style={styles.content}>
        <ThemedText style={[styles.text, completed && styles.completedText]}
          numberOfLines={2}
          ellipsizeMode="tail"
          >
          {text}
        </ThemedText>
        <View style={styles.metadata}>
          <ThemedText style={
            [styles.category,
             color && { color: color}
            ]}>
          {category || 'Wellness'}
          </ThemedText>
          {points && ( <>
            <Ionicons style={{marginLeft:5}} name="flash" size={14} color="#FFD700" />
            <ThemedText style={[styles.points,
            color && { color: '#666'}]
            }>+{points}</ThemedText>
            </>
          )}
          <ThemedText style={styles.time}>{duration || '5 min'}</ThemedText>
        </View>
      </View>
      
      {/* Only one indicator based on type */}
      <View style={styles.circleContainer}>
        {isRecommendation ? (
          <View style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={24} color={accentColor} />
          </View>
        ) : (
         <View style={[
            styles.circle, 
            completed && styles.completedCircle,
            color && { borderColor: color },
            color && completed && { backgroundColor: color }
          ]}>
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
    flexShrink:0,
    width:24,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginRight:8,
    minWidth:0,

  },
  text: {
    fontSize: 15,
    marginBottom: 4,
    flexShrink:1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap:'wrap'
  },
  category: {
    fontSize: 12,
    color: Colors.primary,
    marginRight: 12,
  },
  time: {
    fontSize: 12,
    color: '#666',
    flexShrink:1
  },
  iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      flexShrink:0,
    },
  points: {
    fontSize: 12,
    //color: '#FF9800',
    //color:'#FFD700',
    color: '#4CAF50',
    marginRight: 10,
  },
});
import { View } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import ThemedText from './ThemedText';

const HabitProgressRing = ({ 
  progress = 0, 
  size = 60,
  strokeWidth = 6,
  color = '#4CAF50',
  backgroundColor = '#E0E0E0',
  showPercentage = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          stroke={backgroundColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {showPercentage && (
        <ThemedText style={{ fontSize: 12, fontWeight: '600', color: color }}>
          {Math.round(progress * 100)}%
        </ThemedText>
      )}
    </View>
  );
};

export default HabitProgressRing;
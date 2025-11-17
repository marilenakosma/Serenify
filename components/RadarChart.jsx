import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';
import { Colors } from '../constants/Colors';
import { useTranslation } from '../constants/translations';

const screenWidth = Dimensions.get('window').width;

const RadarChart = () => {
  const { t } = useTranslation();
  const data = [0.8, 0.6, 0.9, 0.7, 0.5, 0.8]; // Values 0-1
  const labels = [
    t('statistics.mentalHealth'),
    t('statistics.growthMindset'),
    t('statistics.relationships'),
    t('statistics.personalDevelopment'),
    t('statistics.selfAwareness'),
    t('statistics.stressManagement'),
  ];

  const size = 340;
  const center = size / 2;
  const maxRadius = 100;
  const levels = 5; // Number of concentric circles

  // Calculate points for each data value
  const getPoints = (values, radius) => {
    return values.map((value, i) => {
      const angle = (i * 2 * Math.PI) / values.length - Math.PI / 2;
      const x = center + Math.cos(angle) * radius * value;
      const y = center + Math.sin(angle) * radius * value;
      return `${x},${y}`;
    }).join(' ');
  };

  // Calculate label positions
  const getLabelPosition = (index, radius) => {
    const angle = (index * 2 * Math.PI) / labels.length - Math.PI / 2;
    const x = center + Math.cos(angle) * (radius + 20);
    const y = center + Math.sin(angle) * (radius + 20);
    return { x, y };
  };

  return (
    <View style={styles.chartContainer}>
      <Svg width={size} height={size}>
        
        {/* Background concentric circles */}
        {[...Array(levels)].map((_, i) => {
          const radius = ((i + 1) * maxRadius) / levels;
          return (
            <Circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis lines */}
        {labels.map((_, i) => {
          const angle = (i * 2 * Math.PI) / labels.length - Math.PI / 2;
          const x = center + Math.cos(angle) * maxRadius;
          const y = center + Math.sin(angle) * maxRadius;
          return (
            <Line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#e0e0e0"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <Polygon
          points={getPoints(data, maxRadius)}
          fill={Colors.primary}
          fillOpacity="0.3"
          stroke={Colors.primary}
          strokeWidth="2"
        />

        {/* Data points */}
        {data.map((value, i) => {
          const angle = (i * 2 * Math.PI) / data.length - Math.PI / 2;
          const x = center + Math.cos(angle) * maxRadius * value;
          const y = center + Math.sin(angle) * maxRadius * value;
          return (
            <Circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill={Colors.primary}
            />
          );
        })}

        {/* Labels */}
        {labels.map((label, i) => {
          const pos = getLabelPosition(i, maxRadius);
          return (
            <SvgText
              key={i}
              x={pos.x}
              y={pos.y}
              fontSize="12"
              fill="#333"
              textAnchor="middle"
            >
              {label}
            </SvgText>
          );
        })}

      </Svg>
    </View>
  );
};

export default RadarChart;

const styles = StyleSheet.create({
  // ...existing styles...
  
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    borderRadius: 8,
  },
  periodButtons: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  activeButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
  },
  dateRange: {
    alignItems: 'center',
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  moodLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  moodEmoji: {
    fontSize: 24,
  },
});


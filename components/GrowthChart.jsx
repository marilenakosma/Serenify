import { Dimensions, StyleSheet, View } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';
const screenWidth = Dimensions.get('window').width;

const GrowthChart = () => {
  // Sample data - you'll replace this with real user data
  const data = {
    labels: [
      'Mental Health',
      'Growth Mindset', 
      'Relationships',
      'Personal Development',
      'Self-awareness',
      'Stress Management'
    ],
    data: [0.8, 0.6, 0.9, 0.7, 0.5, 0.8] // Values between 0 and 1
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(134, 188, 102, ${opacity})`, // Green color
    strokeWidth: 2,
  };

  return (
    <View style={styles.chartContainer}>
      <ProgressChart
        data={data}
        width={screenWidth - 40}
        height={300}
        strokeWidth={16}
        radius={30}
        chartConfig={chartConfig}
        hideLegend={false}
        style={styles.chart}
      />
    </View>
  );
};

export default GrowthChart

const styles = StyleSheet.create({
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
  }
})
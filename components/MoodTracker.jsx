import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Angry from "../assets/images/angry.png";
import Neutral from "../assets/images/neutral.png";
import Sad from "../assets/images/sad.png";
import Happy from "../assets/images/shy.png";
import VeryHappy from "../assets/images/smile.png";
import { Colors } from '../constants/Colors';
import { useTranslation } from '../constants/translations';
import ThemedText from './ThemedText';

const screenWidth = Dimensions.get('window').width;

const MoodTracker = () => {
  const { t } = useTranslation();
  // Sample mood data (1=very sad, 5=very happy)
  const moodData = {
    labels: ['16', '17', '18', '19', '20', '21', '22'],
    datasets: [{
      data: [3, 4, 2, 5, 3, 4, 3],
      strokeWidth: 3,
    }]
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff', 
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(134, 188, 102, ${opacity})`,
    strokeWidth: 2,
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#86bc66'
    }
  };

  return (
    <View style={styles.chartContainer}>
      {/* Time period buttons */}
      <View style={styles.periodButtons}>
        <TouchableOpacity style={styles.periodButton}>
          <ThemedText style={styles.buttonText}> {t('statistics.weekly')}</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.periodButton}>
          <ThemedText style={styles.buttonText}>{t('statistics.monthly')}</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.periodButton}>
          <ThemedText style={styles.buttonText}>{t('statistics.yearly')}</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Date range */}
      <View style={styles.dateRange}>
        <ThemedText style={styles.dateText}>Dec 16 - Dec 22, 2024</ThemedText>
      </View>

      {/* Mood emoji legend */}
      <View style={styles.moodLegend}>
        <Image source={Angry} style={styles.moodEmoji}/>
        <Image source={Sad} style={styles.moodEmoji}/>
        <Image source={Neutral} style={styles.moodEmoji}/>
        <Image source={Happy} style={styles.moodEmoji}/>
        <Image source={VeryHappy} style={styles.moodEmoji}/>
      </View>

      {/* Line Chart */}
      <LineChart
        data={moodData}
        width={screenWidth - 40}
        height={200}
        chartConfig={chartConfig}
        style={styles.chart}
        withInnerLines={false}
        withOuterLines={false}
      />
    </View>
  );
};

export default MoodTracker

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
    width:25,
    height:25
  },
});
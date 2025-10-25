import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MoodTracker from "../../components/MoodTracker";
import GrowthChart from "../../components/RadarChart";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";

const statistics = () => {
  return (
        <ThemedView style={styles.container}>
          <SafeAreaView style={styles.safeArea}>
           <ScrollView showVerticalScrollIndicator={false}>

            <View style={styles.header}>
            <ThemedText title={true} style={styles.sectionTitle}>
               Growth Area
            </ThemedText>
            <GrowthChart/>
            </View>


            <View style={styles.section}>
            <ThemedText title={true} style={styles.sectionTitle}>
               Mood Tracker
            </ThemedText>
            <MoodTracker/>
            </View>

           </ScrollView>
          </SafeAreaView>
        </ThemedView>
      )
}

export default statistics

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#f1f5eeff'
    },
    safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign:'center'
  },
})
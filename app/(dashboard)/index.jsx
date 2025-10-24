import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Angry from "../../assets/images/angry.png";
import Neutral from "../../assets/images/neutral.png";
import Sad from "../../assets/images/sad.png";
import Happy from "../../assets/images/shy.png";
import VeryHappy from "../../assets/images/smile.png";
import Spacer from "../../components/Spacer";
import ThemedGoal from "../../components/ThemedGoal";
import ThemedMood from "../../components/ThemedMood";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";

const index = () => {
  const goalData = [
    { id:1, name:"book",text:"Read a book" },
    { id:2, name:"person", text:"Email people at work"},
    { id:3, name:"battery-full-outline", text:"Discharge my battery"},
    { id:4, name:"bulb-outline", text:"Buy new light bulbs"},
    { id:5, name:"clipboard-outline", text:"A random goal for today"}
  ]

  const moodData = [
    { id:1, image:Angry,text:"Angry" },
    { id:2, image:Sad, text:"Sad"},
    { id:3, image:Neutral, text:"Neutral"},
    { id:4, image:Happy, text:"Shy"},
    { id:5, image:VeryHappy, text:"Happy"}
  ]

  const renderGoal = ({item}) => (
   <ThemedGoal
     name={item.name}
     text={item.text}
   />
  )

  const renderMood = ({item}) => (
   <ThemedMood
     image={item.image}
     text={item.text}
   />
  )
  
  const Separator = () => <Spacer height={15}/>

  return (
    <ThemedView style={{flex:1}}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          {/* Mood Section */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Hello,Sol
            </ThemedText>
            <ThemedText title={true} style={styles.sectionTitle}>
              How are you feeling today?
            </ThemedText>
            <FlatList
              data={moodData}
              renderItem={renderMood}
              keyExtractor={(item) => item.id.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.moodList}
              ItemSeparatorComponent={() => <View style={{width: 5}} />}
            />
          </ThemedView>

          {/* Goals Section */}
          <ThemedView style={styles.section}>
            <ThemedText title={true} style={styles.sectionTitle}>
              Today's Goals
            </ThemedText>
            <FlatList
              data={goalData}
              renderItem={renderGoal}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false} // Disable internal scrolling
              ItemSeparatorComponent={Separator}
            />
          </ThemedView>

          <Spacer height={30}/>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    greeting: {
        fontSize: 18,
        marginBottom: 8,
    },
    title: {
        textAlign: "center",
        fontSize: 24,
        marginBottom: 10,
    },
    section: {
        marginBottom: 30,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 20,
        marginBottom: 15,
        textAlign: 'center',
    },
    moodList: {
        paddingHorizontal: 8,
    },
})
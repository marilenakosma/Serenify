import { useState } from "react";
import { FlatList, ImageBackground, ScrollView, StyleSheet, View } from "react-native";
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
import { useAuthStore } from "../../store/authStore";
import { dashboardContent } from "../../constants/dashboardContent";

const Dashboard = () => {
  const {user,isAuthenticated} = useAuthStore();
  const [completedGoals, setCompletedGoals] = useState(new Set());

  const focusArea = user?.focusArea || 'General Wellness';
  const content = dashboardContent[focusArea];

  if (!isAuthenticated) {
    return (
        <ThemedView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ThemedText>Please log in to continue</ThemedText>
        </ThemedView>
    );
}

  const moodData = [
    { id:1, image:Angry,text:"Angry" },
    { id:2, image:Sad, text:"Sad"},
    { id:3, image:Neutral, text:"Neutral"},
    { id:4, image:Happy, text:"Shy"},
    { id:5, image:VeryHappy, text:"Happy"}
  ]

    const handleToggleGoal = (goalId) => {
    setCompletedGoals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(goalId)) {
        newSet.delete(goalId);
      } else {
        newSet.add(goalId);
      }
      return newSet;
    });
  };

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
          {/* Mood Section with Background Image */}
          <ImageBackground 
            source={require('../../assets/images/field.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            {/* Optional overlay for better text readability */}
            <View style={styles.overlay}>
              <ThemedView style={styles.moodSection}>  
                <ThemedText style={styles.greeting}>
                  Hello, {user?.username || 'User'}! {user?.focusEmoji || '🌱'}
                </ThemedText>
                <ThemedText title={true} style={styles.moodTitle}>
                  {content.greeting}
                </ThemedText>
                <FlatList
                  data={moodData}
                  renderItem={renderMood}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.moodList}
                  ItemSeparatorComponent={() => <View style={{width: 12}} />}
                />
              </ThemedView>
            </View>
          </ImageBackground>

          {/* Goals Section */}
          <ThemedView style={[styles.section,
          styles.other]}>
            <ThemedText title={true} style={styles.sectionTitle}>
              Recommended for You
            </ThemedText>

            {content.recommendedGoals.map((goal, index) => (
              <View key={goal.id}>
                <ThemedGoal
                  name={goal.name}
                  text={goal.text}
                  points={goal.points}
                  category={goal.category}  
                  duration={goal.duration}  
                  completed={completedGoals.has(goal.id)}
                  onToggle={() => handleToggleGoal(goal.id)}
               />
               {index < content.recommendedGoals.length - 1 && <Spacer height={15} />}
             </View>
             ))}
          </ThemedView>

          <Spacer height={30}/>
          </ScrollView>
      </SafeAreaView>
    </ThemedView>
  )
}

export default Dashboard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f1f5eeff'
    },
    backgroundImage: {
        width: '100%',
        minHeight: 300,
        justifyContent: 'center',
        backgroundColor:'white',
        //borderTopLeftRadius: 25,
       // borderTopRightRadius: 25,
       // overflow: 'hidden', // Important: clips the image to the border radius
    },
    overlay: {
        //backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay for text readability
        flex: 1,
        justifyContent: 'center',
       // backgroundColor:Colors.secondary
    },
    moodSection: {
        backgroundColor: 'transparent',
        paddingHorizontal: 16,
        paddingVertical: 25,
    },
    greeting: {
        fontSize: 18,
        marginBottom: 8,
        textAlign: 'center',
        color: 'black', // White text over image
        fontWeight: '500',
    },
    moodTitle: {
        fontSize: 22,
        marginBottom: 20,
        textAlign: 'center',
        color: 'black', // White text over image
    },
    moodList: {
        paddingHorizontal: 8,
        justifyContent: 'center',
    },
    section: {
        marginBottom: 30,
        paddingHorizontal: 16,
        paddingTop: 20,
        backgroundColor:'#f1f5eeff'
    },
    sectionTitle: {
        fontSize: 20,
        marginBottom: 15,
        textAlign: 'center',
    },
    other: {
        paddingLeft: 32,
        paddingRight: 32, 
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -15, // Negative margin to overlap slightly with image
    }
})
import { useState,useEffect } from "react";
import { FlatList, ImageBackground, ScrollView, 
  StyleSheet, View,TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Angry from "../../assets/images/storm.png";
import Neutral from "../../assets/images/hail.png";
import Sad from "../../assets/images/rain.png";
import Happy from "../../assets/images/overcast.png";
import VeryHappy from "../../assets/images/sun.png";
import Spacer from "../../components/Spacer";
import ThemedGoal from "../../components/ThemedGoal";
import ThemedMood from "../../components/ThemedMood";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import DailySummary from "../../components/DailySummary";
import DashboardHabitCard from "../../components/DashboardHabitCard";
import { useAuthStore } from "../../store/authStore";
import { getRecommendedHabits } from '../../constants/availableHabits';
import { useRouter } from "expo-router";
import { useTranslation } from '../../constants/translations';
import { Ionicons } from '@expo/vector-icons';

const Dashboard = () => {
  const {user,
         isAuthenticated,
         userHabits,
         habitCompletions,
         toggleHabitCompletion,
         todayMood,
         setTodayMood,
         loadTodayMood,
         questionnaireResults,
         addHabits,
         points,
         level,
         getLevelName,
         getPointsForNextLevel
        } = useAuthStore();
  const [completedGoals, setCompletedGoals] = useState(new Set());
  const [selectedMood,setSelectedMood] = useState(null);
  
  const router = useRouter();
  const { t } = useTranslation();
  
  const userProfile = {
    focusArea: user?.focusArea || questionnaireResults?.focusArea || "General Wellness"
  };

  const recommendedHabits = getRecommendedHabits(userProfile, userHabits, t);
  //const content = dashboardContent[focusArea];

  useEffect(() => {
    const initMood = async () => {
      const mood = await loadTodayMood();
      if (mood) {
        setSelectedMood(mood.moodId);
      }
    };
    initMood();
  }, []);

  const handleMoodSelect = async (moodId, moodText) => {
    setSelectedMood(moodId);
    
    const moodData = {
      moodId,
      moodText,
    };
    
    const result = await setTodayMood(moodData);
    if (result.success) {
      console.log('Mood logged:', moodText);
    } else {
      console.error('Failed to log mood:', result.error);
    }
  };

  const handleAddHabit = async(habitData) => {
   try {
    console.log('Adding habit:', habitData.title);

    const newHabit = {
      ...habitData,
      title: habitData.title, 
      text: habitData.title, // Store translated text for backward compatibility
      name: habitData.icon, 
      createdAt: new Date().toISOString(),
      isActive: true,
      streak: 0,
      lastCompleted: null
    };

    const result = await addHabits(newHabit);

    if(result.success) {
      console.log('Habit added')
    } else {
      console.error('Failed to add habit:', result?.error || 'Unknown error');
    }
   } catch(error) {
     console.error('Error adding habit:', error.message || error);
   }
  };

  const getMoodGreeting = () => {
    if (todayMood) {
      return t('dashboard.moodLoggedToday');
    }
    return t('dashboard.howAreYouFeeling');
  };

  if (!isAuthenticated) {
    return (
        <ThemedView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ThemedText>Please log in to continue</ThemedText>
        </ThemedView>
    );
}

  const moodData = [
    { id: 1, image: Angry, text: t('moods.angry') },
    { id: 2, image: Sad, text: t('moods.sad') },
    { id: 3, image: Neutral, text: t('moods.neutral') },
    { id: 4, image: Happy, text: t('moods.good') },
    { id: 5, image: VeryHappy, text: t('moods.happy') }
  ];

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
  
  const handleHabitPress = (habitId) => {
    router.push({
      pathname: '/(modals)/habit-stats',
      params: { habitId }
    })
  }
  const renderMood = ({item}) => (
   <ThemedMood
     image={item.image}
     text={item.text}
     moodId={item.id}
     onMoodSelect={handleMoodSelect}
     isSelected={selectedMood === item.id}
   />
  )

  const todayMoodLogged = todayMood !== null;

  const renderHabitCard = ({item}) => (
    <DashboardHabitCard 
      habit={item}
      //completions={habitCompletions}
      onPress={() => handleHabitPress(item.id)}
      onToggleCompletion={toggleHabitCompletion}
    />
  );

  return (
    <ThemedView style={{flex:1}}> 
      <SafeAreaView style={styles.container}>
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          {/* Mood Section with Background Image */}
          <ImageBackground 
            source={require('../../assets/images/field-alt.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            {/* Optional overlay for better text readability */}
            <View style={styles.overlay}>
              <ThemedView style={styles.moodSection}>  
                <ThemedText style={styles.greeting}>
                  {t('dashboard.hello', { username: user?.username || 'User' })} 
                </ThemedText>
                <ThemedText title={true} style={styles.moodTitle}>
                 {getMoodGreeting()} 
                </ThemedText>
                <FlatList
                  data={moodData}
                  renderItem={renderMood}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.moodList}
                  ItemSeparatorComponent={() => <View style={{width: 12}} />}
                  removeClippedSubviews={true}
                  maxToRenderPerBatch={3}
                  initialNumToRender={5}
                  windowSize={5}
                  getItemLayout={(data, index) => ({
                  length: 80,
                  offset: 92 * index, // 80 + 12 separator
                  index,
                  })}
                />
              </ThemedView>
              <TouchableOpacity 
                style={styles.pointsBadge}
                onPress={() => router.push('/(modals)/habit-stats')} // Can link to a points detail page later
                activeOpacity={0.7}
              >
                <Ionicons name="flash" size={20} color="#FFD700" />
                <ThemedText style={styles.pointsBadgeText}>
                  {points || 0}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        

          {userHabits.length > 0 && (
            <ThemedView style={[styles.section, styles.other]}>
              <ThemedText title={true} style={styles.sectionTitle}>
                {t('dashboard.yourHabits')}
              </ThemedText>
              <FlatList
                data={userHabits}
                renderItem={renderHabitCard}
                keyExtractor={(item) => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.habitsContainer}
                ItemSeparatorComponent={() => <View style={{width: 8}} />}
              />
            </ThemedView>
          )}
          

          {/* Goals Section */}
          {recommendedHabits.length > 0 && (
            <ThemedView style={[styles.section, styles.other]}>
              <ThemedText title={true} style={styles.sectionTitle}>
                {t('dashboard.recommendedForYou')}
              </ThemedText>

              {recommendedHabits.map((habit, index) => {

               return (
                <View key={habit.id}>
                <ThemedGoal
                  name={habit.icon}
                  text={habit.title}
                  points={habit.points}
                  category={habit.category}  
                  duration={habit.duration}  
                  completed={false} 
                  onToggle={() => handleAddHabit(habit)} 
                  isRecommendation={true}
               />
               {index < recommendedHabits.length - 1 && <Spacer height={15} />}
              </View>
             );
           })}
       </ThemedView>
)}

          <View style={{height: 1, backgroundColor: '#E0E0E0', marginHorizontal: 32, marginBottom: 10}} />

          {userHabits.length > 0 && (
            <DailySummary 
              habits={userHabits}
              habitCompletions={habitCompletions}
            />
          )}

          
          </ScrollView>
      </SafeAreaView>
    </ThemedView>
  )
}

export default Dashboard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f5eeff'
    },
    backgroundImage: {
        width: '100%',
        minHeight: 320,
        justifyContent: 'center',
        //borderTopLeftRadius: 25,
       // borderTopRightRadius: 25,
       // overflow: 'hidden', // Important: clips the image to the border radius
    },
    overlay: {
        //backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay for text readability
        flex: 1,
        justifyContent: 'center',
       // backgroundColor:'#F0F8FF'
       // backgroundColor:Colors.secondary
    },
    moodSection: {
        backgroundColor: 'transparent',
        paddingHorizontal: 16,
        paddingVertical: 25,
    },
    greeting: {
        fontSize: 18,
        textAlign: 'center',
        color: "black"
    },
    moodTitle: {
        fontSize: 22,
        marginBottom: 20,
        textAlign: 'center',
        color: 'black', 
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
    habitsContainer: {
        paddingHorizontal: 8,
    },
    other: {
        paddingLeft: 32,
        paddingRight: 32, 
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -15, // Negative margin to overlap slightly with image
    },
    pointsBadge: {
     position: 'absolute',
     top: 10,
     right: 20,
     backgroundColor: '#fff',
     flexDirection: 'row',
     alignItems: 'center',
     gap: 6,
     paddingHorizontal: 16,
     paddingVertical: 10,
     borderRadius: 25,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.15,
     shadowRadius: 4,
     elevation: 3,
     zIndex: 10,
    },
    pointsBadgeText: {
     fontSize: 18,
     //color: '#FFD700',
    },


})
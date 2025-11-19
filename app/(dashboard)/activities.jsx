import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Sounds from "../../assets/images/cassette.png";
import Goal from "../../assets/images/clipboard.png";
import Diary from "../../assets/images/diary.png";
import Kit from "../../assets/images/first-aid-kit.png";
import Gift from "../../assets/images/gift.png";
import Timers from "../../assets/images/smartwatch.png";
import Movements from "../../assets/images/sneakers.png";
import Breathe from "../../assets/images/yoga-master.png";
import ThemedCategory from "../../components/ThemedCategory";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { useTranslation } from '../../constants/translations';

const activities = () => {
  const { t } = useTranslation();
  const categoryData = [
    { id:1, image:Goal,text:t('activities.goalIdeas'),route: '/(activities)/goalIdeas'},
    { id:2, image:Diary, text:t('activities.reflections'),route: '/(activities)/reflections'},
    { id:3, image:Breathe, text:t('activities.breathe'),route: '/(activities)/breathe'},
    { id:4, image:Sounds, text:t('activities.soundscapes'),route: '/(activities)/soundscapes'},
    { id:5, image:Movements, text:t('activities.movements'),route: '/(activities)/movements'},
    { id:6, image:Timers, text:t('activities.timers'),route: '/(activities)/timers'},
    { id:7, image:Gift, text:t('activities.actOfKindness'),route: '/(activities)/actOfKindness'},
    { id:8, image:Kit, text:t('activities.firstAidKit'),route: '/(activities)/firstAidKit'},
  ]

  const renderActivity = ({item}) => (
   <ThemedCategory
     image={item.image}
     text={item.text}
     route={item.route}
     style={styles.activityItem}
   />
  )

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <ThemedText title={true} style={styles.title}>
               {t('activities.title')}
            </ThemedText>
      <FlatList
         data={categoryData}  // Array of data to render
         renderItem={renderActivity}  // Function that renders each item
         numColumns={2}          // Creates a grid with 2 columns
         keyExtractor={(item) => item.id.toString()}  // Unique key for each item
         contentContainerStyle = {styles.grid}  // Styles the scrollable content
         columnWrapperStyle={styles.row}  // Styles each row (when numColumns > 1)
      />
      </SafeAreaView>
     </ThemedView>
  )
}

export default activities

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor:'#f1f5eeff'
  },
  grid: {
    padding: 20,
    marginVertical:50
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  activityItem: {
    flex: 1,
    marginHorizontal: 5,
    maxWidth: '45%', // Ensures proper spacing
  },
  title: {
        fontSize: 22,
        marginTop: 30,
        textAlign: 'center',
         },
})
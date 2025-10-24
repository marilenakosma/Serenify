import { FlatList, StyleSheet } from "react-native";
import Sounds from "../../assets/images/cassette.png";
import Goal from "../../assets/images/clipboard.png";
import Diary from "../../assets/images/diary.png";
import Kit from "../../assets/images/first-aid-kit.png";
import Gift from "../../assets/images/gift.png";
import Timers from "../../assets/images/smartwatch.png";
import Movements from "../../assets/images/sneakers.png";
import Breathe from "../../assets/images/yoga-master.png";
import ThemedCategory from "../../components/ThemedCategory";
import ThemedView from "../../components/ThemedView";

const activities = () => {
  const categoryData = [
    { id:1, image:Goal,text:"Goal Ideas" },
    { id:2, image:Diary, text:"Reflections"},
    { id:3, image:Breathe, text:"Breathe"},
    { id:4, image:Sounds, text:"Soundscapes"},
    { id:5, image:Movements, text:"Movements"},
    { id:6, image:Timers, text:"Timers"},
    { id:7, image:Gift, text:"Act of Kindness"},
    { id:8, image:Kit, text:"First Aid Kit"},
  ]

  const renderActivity = ({item}) => (
   <ThemedCategory
     image={item.image}
     text={item.text}
     style={styles.activityItem}
   />
  )

  return (
    <ThemedView style={styles.container}>
      <FlatList
         data={categoryData}  // Array of data to render
         renderItem={renderActivity}  // Function that renders each item
         numColumns={2}          // Creates a grid with 2 columns
         keyExtractor={(item) => item.id.toString()}  // Unique key for each item
         contentContainerStyle = {styles.grid}  // Styles the scrollable content
         columnWrapperStyle={styles.row}  // Styles each row (when numColumns > 1)
      />


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
  }
})
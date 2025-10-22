import { FlatList, StyleSheet } from "react-native";
import ThemedCategory from "../../components/ThemedCategory";
import ThemedView from "../../components/ThemedView";

const activities = () => {
  const categoryData = [
    { id:1, name:"bulb-outline",text:"Goal Ideas" },
    { id:2, name:"person", text:"Reflections"},
    { id:3, name:"person", text:"Breathe"},
    { id:4, name:"person", text:"Soundscapes"},
    { id:5, name:"person", text:"Movements"},
    { id:6, name:"person", text:"Timers"},
    { id:7, name:"person", text:"Act of Kindness"},
    { id:8, name:"person", text:"First Aid Kit"},
  ]

  const renderActivity = ({item}) => (
   <ThemedCategory
     name={item.name}
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
    padding: 10,
  },
  grid: {
    paddingVertical: 20,
  },
  row: {
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  activityItem: {
    flex: 1,
    margin: 5,
    maxWidth: '45%', // Ensures proper spacing
  }
})
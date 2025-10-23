import { FlatList, StyleSheet } from "react-native";
import Spacer from "../../components/Spacer";
import ThemedGoal from "../../components/ThemedGoal";
import ThemedView from "../../components/ThemedView";

const index = () => {
  const goalData = [
    { id:1, name:"book",text:"Read a book" },
    { id:2, name:"person", text:"Email people at work"},
    { id:3, name:"battery-full-outline", text:"Discharge my battery"},
    { id:4, name:"bulb-outline", text:"Buy new light bulbs"},
    { id:5, name:"clipboard-outline", text:"A random goal for today"}
  ]

  const renderGoal = ({item}) => (
   <ThemedGoal
     name={item.name}
     text={item.text}
   />
  )
  
const Separator = () => <Spacer height={20}/>

 return (
     <ThemedView style={styles.container}>
        <FlatList
        data={goalData}
        renderItem={renderGoal}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle = {styles.grid}
        ItemSeparatorComponent={Separator}
        />
     </ThemedView>
   )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    grid: {
      padding: 20,
      marginVertical: 50,
      marginHorizontal: 16,
    }
     
})
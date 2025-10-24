import { FlatList, StyleSheet } from "react-native";
import Spacer from "../../components/Spacer";
import ThemedGoal from "../../components/ThemedGoal";
import ThemedView from "../../components/ThemedView";

const quests = () => {
  const questData = [
    { id:1, name:"create-outline",text:"Complete a goal" },
    { id:2, name:"phone-portrait-outline", text:"Change one interior item"},
    { id:3, name:"journal-outline", text:"Practice Gratitude"},
    { id:4, name:"person-remove-outline", text:"Name your emotion"},
    { id:5, name:"clipboard-outline", text:"A random goal for today"}
  ]

  const renderQuest = ({item}) => (
   <ThemedGoal
     name={item.name}
     text={item.text}
   />
  )

  const Separator = () => <Spacer height={20}/>

 return (
     <ThemedView style={styles.container}>
        <FlatList
        data={questData}
        renderItem={renderQuest}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle = {styles.grid}
        ItemSeparatorComponent={Separator}
        />
     </ThemedView>
   )
}

export default quests

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#f1f5eeff'
    },
    grid: {
      padding: 20,
      marginVertical: 50,
      marginHorizontal: 16,
    }
     
})
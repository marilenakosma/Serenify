import { StyleSheet } from "react-native";
import Spacer from "../../components/Spacer";
import ThemedGoal from "../../components/ThemedGoal";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";

const quests = () => {
  return (
        <ThemedView style={styles.container}>
          <ThemedGoal name="create-outline" 
          text="Complete a goal"></ThemedGoal>
        
        <Spacer height={10}/>
        
          <ThemedGoal name="phone-portrait-outline" 
          text="Change one interior item"></ThemedGoal>
         
         <Spacer height={10}/>

          <ThemedGoal name="journal-outline" 
          text="Practice Gratitude"></ThemedGoal>
        
        <Spacer height={10}/>

          <ThemedGoal name="person-remove-outline" 
          text="Name your emotion"></ThemedGoal>
        
     </ThemedView>
      )
}

export default quests

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    title: {
        textAlign:"center",
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom:30
    },
    btn: {
        backgroundColor:Colors.primary,
        padding:15,
        borderRadius:5
    },
    pressed: {
        opacity:0.8
    }
})
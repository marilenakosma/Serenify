import { StyleSheet } from "react-native";
import Spacer from "../../components/Spacer";
import ThemedGoal from "../../components/ThemedGoal";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";

const index = () => {
 return (
     <ThemedView style={styles.container}>

        <ThemedGoal name="book" 
        text="Read a book"></ThemedGoal>
        
        <Spacer height={10}/>

         <ThemedGoal name="person" 
         text="Email people at work"></ThemedGoal>

        <Spacer height={10}/>
        
         <ThemedGoal name="battery-full-outline" 
         text="Discharge my battery"></ThemedGoal>
         
         <Spacer height={10}/>

         <ThemedGoal name="bulb-outline" 
         text="Buy new light bulbs"></ThemedGoal>
        
        <Spacer height={10}/>

         <ThemedGoal name="clipboard-outline" 
         text="A random goal for today"></ThemedGoal>
        
     </ThemedView>
   )
}

export default index

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
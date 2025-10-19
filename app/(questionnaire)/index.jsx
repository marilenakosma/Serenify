import { useRouter } from 'expo-router';
import { StyleSheet, Text } from "react-native";
import ThemedButton from '../../components/ThemedButton';
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";

const index = () => {
    const router=useRouter()
 return (
     <ThemedView style={styles.container}>
       <ThemedText title={true} style={styles.title}>index</ThemedText>

       <ThemedButton onPress={() => 
        router.navigate("questions")}>
          <Text style={{color:'#f2f2f2'}}>Start Quiz</Text>
        </ThemedButton>

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
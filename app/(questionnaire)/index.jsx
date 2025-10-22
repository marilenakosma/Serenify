import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import ThemedButton from '../../components/ThemedButton';
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";

const index = () => {
    const router=useRouter()
 return (
    <View style={{flex:1}}>

        <SafeAreaView style={{backgroundColor:Colors.background}}>
          <BackButton/>
        </SafeAreaView>

        <ThemedView style={styles.container}>

        <ThemedText  title={true} style={styles.title}>Welcome to Serenify</ThemedText>
        
        
        <ThemedText style={{paddingBottom:20}}> 
          We would like to begin by you asking a few questions
        </ThemedText>

       <ThemedButton onPress={() => 
        router.navigate("questions")}>
          <Text style={{color:'#f2f2f2'}}>Start Quiz</Text>
        </ThemedButton>

     </ThemedView>
     </View>

     
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
        marginBottom:10
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
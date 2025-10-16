import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";

const Register = () => {
  return (
      <ThemedView style={styles.container}>
        <ThemedText>Register</ThemedText>
  
         <Link href="/register" replace>
                <ThemedText style={{textAlign:'center'}}>
                    Login</ThemedText>
                </Link>
  
      </ThemedView>
      
    )
}

export default Register

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
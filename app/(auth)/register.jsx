import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedInput from "../../components/ThemedInput";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";

const Register = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    
    const handleSubmit =() => {
     console.log('Login form submitted',email,password)
    }

    const router = useRouter()
    
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>
        Register for an Account
        </ThemedText>
         
        <ThemedInput 
      style={{width:'80%',marginBottom:20}}
      placeholder="Email"
      keyboardType="email-address"
      onChangeText={setEmail}
      value={email}/>

      <ThemedInput 
      style={{width:'80%',marginBottom:20}}
      placeholder="Password"
      onChangeText={setPassword}
      value={password}
      secureTextEntry/>

        <ThemedButton onPress={() => router.navigate("/(dashboard)/activities")}>
          <Text style={{color:'#f2f2f2'}}>Register</Text>
        </ThemedButton>

        <Spacer height={30}/>

         <Link href="/login" replace>
                <ThemedText style={{textAlign:'center'}}>
                    Have an account? Login</ThemedText>
                </Link>
  
      </ThemedView>
      </TouchableWithoutFeedback>
      
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
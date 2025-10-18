import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedInput from "../../components/ThemedInput";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";

const Login = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    
    const handleSubmit =() => {
     console.log('Login form submitted')
    }
    
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>
        Login to Your Account
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

      <ThemedButton>
        <Text style={{color:'#f2f2f2'}}>Login</Text>
      </ThemedButton>

      <Spacer height={30}/>

       <Link href="/register" replace>
              <ThemedText style={{textAlign:'center'}}>
                  Register instead</ThemedText>
              </Link>

    </ThemedView>
    
  )
}

export default Login

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
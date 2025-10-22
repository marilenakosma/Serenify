import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Image, Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
      <ThemedView style={{flex:1}}>
        <SafeAreaView>

        <BackButton/>

        <ThemedView style={{flexDirection:'row',justifyContent:'center'}}>
          <Image source={require('../../assets/images/leaf-green.png')}
            style={{width:200,height:200}} />   
        </ThemedView>
     </SafeAreaView>

       <ThemedView style={styles.container}>
         <ThemedText style={styles.title}>
          Register for an account
         </ThemedText>
         
         <ThemedInput 
           style={{width:'80%',marginBottom:20}}
           placeholder="Name"
           keyboardType="email-address"
           onChangeText={setEmail}
           value={email}/>

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
           secureTextEntry />
        
          <Spacer height={10}/>

         <ThemedButton onPress={() =>
           router.navigate("/(questionnaire)")}>
           <Text style={{color:'#f2f2f2'}}>Sign Up</Text>
         </ThemedButton>
         
         <Spacer height={20}/>

         <ThemedText style={styles.title}>Or</ThemedText>
          
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity style={styles.image}>
          <Image source={require('../../assets/images/google.png')}
            style={{width:40,height:40}} />  
         </TouchableOpacity>

         <TouchableOpacity style={styles.image}>
          <Image source={require('../../assets/images/apple.png')}
            style={{width:40,height:40}} />  
         </TouchableOpacity>

         <TouchableOpacity style={styles.image}>
          <Image source={require('../../assets/images/facebook.png')}
            style={{width:40,height:40}} />  
         </TouchableOpacity>
         </View>

         <Spacer height={30}/>

         <Link href="/login" replace>
              <ThemedText style={{textAlign:'center'}}>
                  Login instead</ThemedText>
              </Link>        
    </ThemedView>
</ThemedView>
</TouchableWithoutFeedback>    
  )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        backgroundColor:"white",
        paddingLeft: 32,
        paddingRight: 32, 
        paddingTop: 40,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50
    },
    title: {
        textAlign:"center",
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom:30
    },
    image:{
         backgroundColor:Colors.uiBackground,
         padding:8,
         borderRadius:16,
         marginHorizontal: 10 
    },
    button: {
      padding: 8,
      marginLeft: 16,
      borderTopRightRadius: 16, 
      borderBottomLeftRadius:16,
      backgroundColor: Colors.primary,
    }
})
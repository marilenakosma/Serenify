import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Image, Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import validator from 'validator';
import BackButton from "../../components/BackButton";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedInput from "../../components/ThemedInput";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";

/* Email validation - Check if email format is correct
Password requirements - Minimum length, complexity
Real-time feedback - Show errors as user types
Submit validation - Prevent submission with invalid data
Loading states - Show when form is being processed
Error handling - Display meaningful error messages */

const Login = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState(null)
    
    const handleSubmit =() => {
     console.log('Login form submitted',email,password)
    }

    const validateEmail = (input) => {
      setEmail(input)

      if(!input) {
        setError('Email is required')
        return;
      }

      if(validator.isEmail(input)) {
        setError('');
      } else {
        setError("Please enter a valid email address.")
      }
    }

   
    const router = useRouter();

    const handleLogin = () => {
    // After successful login:
    router.replace("/(dashboard)");
  };


    
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
         <ThemedText title={true} style={styles.title}>
          Login to your Account
         </ThemedText>

         <ThemedInput 
           style={{width:'80%',marginBottom:20}}
           placeholder="Email"
           keyboardType="email-address"
           onChangeText={validateEmail}
           value={email}/>

           <View style={styles.validationContainer}>
         {error !== null && (
            error ? (
              <Text style={styles.invalidMark}>X</Text>
            ) : (
              <Text style={styles.validMark}>✓</Text>
            )
           )}

            {error ? 
            <Text style={styles.errorMessage}>{error}</Text> 
            : null}
           </View>

         <ThemedInput 
           style={{width:'80%',marginBottom:20}}
           placeholder="Password"
           onChangeText={setPassword}
           value={password}
           secureTextEntry />

           <Spacer height={10}/>
          
          <TouchableOpacity style={{alignItems:"right"}}>
            <ThemedText>Forgot Password?</ThemedText>
          </TouchableOpacity>

          <Spacer height={20}/>

         <ThemedButton onPress={() =>
           router.navigate("/(questionnaire)")}>
           <ThemedText title={true} style={{color:'#f2f2f2'}}>Login</ThemedText>
         </ThemedButton>
         
         <Spacer height={20}/>

         <ThemedText title={true} 
         style={styles.title}>Or
         </ThemedText>
          
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

         <Link href="/register" replace>
              <ThemedText style={{textAlign:'center'}}>
                  Register instead</ThemedText>
              </Link>        
    </ThemedView>
</ThemedView>
</TouchableWithoutFeedback>    
  )
}



export default Login

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        backgroundColor:"white",
        paddingLeft: 32,
        paddingRight: 32, 
        paddingTop: 60,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50
    },
    title: {
        textAlign:"center",
        fontSize: 18,
        marginBottom:30,
    },
    image:{
         backgroundColor:Colors.uiBackground,
         padding:8,
         borderRadius:16,
         marginHorizontal: 10 
    },
     errorMessage: {
        color: '#ff6b6b',
        fontSize: 13,
        marginLeft: 6,
        flex:1
    },
    validMark: {
        color: '#4CAF50',
        fontSize: 13,
        fontWeight: '500',
    },
    invalidMark: {
        color: '#ff6b6b',
        fontSize: 14,
        marginLeft: 5,
    }
})
/*import LottieView from 'lottie-react-native';

<LottieView
  source={require('../assets/duck-walk.json')}
  autoPlay
  loop
/>
 */
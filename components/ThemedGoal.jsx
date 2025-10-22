import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'

const ThemedGoal = ({name,text}) => {
    function handlePress() {
      console.log("pressed!")
    }

  return (
    <View style={styles.container}>
        <Ionicons style={{padding:5}}
        size={24} 
        name={name} /> 
        <Text style={{padding:10}}>{text}</Text>
        <Pressable style={styles.button} 
        onPress={handlePress}>
        <Text>✅</Text>
        </Pressable>
    </View>
  )
}

export default ThemedGoal

const styles = StyleSheet.create({
    container: {
        backgroundColor:"white",
        flexDirection:"row",
        borderRadius:5,
        justifyContent:'center'
    },
    button: {
        backgroundColor:"white",
        padding:10
    }
})
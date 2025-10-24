import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import ThemedText from './ThemedText'
const ThemedGoal = ({name,text}) => {
    function handlePress() {
      console.log("pressed!")
    }

  return (
    <View style={styles.container}>
        <Ionicons style={{padding:5}}
        size={24} 
        name={name} /> 
        <ThemedText style={{padding:10}}>{text}</ThemedText>
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
        justifyContent:'center',
        elevation: 2, 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    button: {
        backgroundColor:"white",
        padding:10
    }
})
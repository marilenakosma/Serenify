import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, View } from 'react-native'
import ThemedText from './ThemedText'
const ThemedCategory = ({name,text}) => {
  function handlePress() {
      console.log("pressed!")
    }

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} 
        onPress={handlePress}> 
        <Ionicons style={{padding:5}}
        size={24} 
        name={name} /> 
        <ThemedText style={{padding:10}}>{text}</ThemedText>
        </Pressable>
    </View>
  )
}

export default ThemedCategory

const styles = StyleSheet.create({
    container: {
        backgroundColor:"white",
        borderRadius:5,
    },
    button: {
        backgroundColor:"white",
        flexDirection:"row",
        borderRadius:5,
    }
})
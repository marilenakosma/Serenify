import { Image, Pressable, StyleSheet, View } from 'react-native'
import ThemedText from './ThemedText'
const ThemedCategory = ({image,text}) => {
  function handlePress() {
      console.log("pressed!")
    }

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} 
        onPress={handlePress}> 
        <Image source={image}
            style={{width:30,height:30,padding:10}} /> 
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
        padding:7
    }
})
import { Image, Pressable, StyleSheet, View } from 'react-native'
import {useState} from "react"
import ThemedText from './ThemedText'
const ThemedMood = ({image, text, style}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  function handlePress() {
    console.log("pressed!")
  }

  return (
    <View style={[styles.container, style]}>
      <Pressable style={styles.button} onPress={handlePress}> 
        <View style={styles.iconContainer}>
          <Image 
            source={image} 
            style={styles.image}
            onLoad={() => setImageLoaded(true)}
            resizeMode="contain" // Add this to prevent memory bloat
          /> 
        </View>
        <ThemedText title={true} style={styles.text}>{text}</ThemedText>
      </Pressable>
    </View>
  )
}

export default ThemedMood

const styles = StyleSheet.create({
    container: {
        backgroundColor:"white",
        borderRadius:12,
        elevation: 2, 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    button: {
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        padding: 9,
    },
    iconContainer: {
        marginBottom: 8,
    },
    image: {
      width:45,
      height:40,
    },
    text: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '500',
    }
})
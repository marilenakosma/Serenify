import { Image, Pressable, StyleSheet, View } from 'react-native'
import {useState} from "react"
import ThemedText from './ThemedText'
const ThemedMood = ({image, text, style,moodId,onMoodSelect,isSelected}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  function handlePress() {
    console.log("Mood selected:",moodId,text);
    onMoodSelect?.(moodId,text);
  }

  return (
    <View style={[styles.container, style,isSelected && styles.selected]}>
      <Pressable style={styles.button} onPress={handlePress}> 
        <View style={styles.iconContainer}>
          <Image 
            source={image} 
            style={styles.image}
            onLoad={() => setImageLoaded(true)}
            resizeMode="contain" 
          /> 
        </View>
        <ThemedText title={true} style={[styles.text, isSelected && styles.selectedText]}>{text}</ThemedText>
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
    selected: { 
        backgroundColor: "#E8F5E8",
        borderWidth: 2,
        borderColor: "#4CAF50",
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
    },
    selectedText: { 
        color: "#4CAF50",
        fontWeight: '600',
    }
})
import { Image, Pressable, StyleSheet, View } from 'react-native'
import ThemedText from './ThemedText'
const ThemedCategory = ({image,text,style}) => {
  function handlePress() {
      console.log("pressed!")
    }

    const handleStatsPress = (habitId) => {
        router.push({
        pathname: '/(modals)/habit-stats',
        params: { habitId }
      });
      };

  return (
    <View style={[styles.container,style]}>
      <Pressable style={styles.button} 
        onPress={handlePress}> 
        <View style={styles.iconContainer}>
          <Image source={image} style={styles.image} /> 
        </View>
        <ThemedText title={true} style={styles.text}>{text}</ThemedText>
        </Pressable>
    </View>
  )
}

export default ThemedCategory

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
        padding: 15,
        minHeight: 100, // Consistent height
    },
    iconContainer: {
        marginBottom: 8,
    },
    image: {
      width:45,
      height:45,
    },
    text: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '500',
    }
})
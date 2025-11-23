import { Image, Pressable, StyleSheet, View } from 'react-native'
import { useRouter } from "expo-router";

import ThemedText from './ThemedText'
const DurationButton = ({text,style,length,onPress}) => {

  return (
    <View style={[styles.container, style]}>
      <Pressable 
        style={styles.button} 
        onPress={onPress}
      >
        <ThemedText title= {true} style={styles.text}>{length || text}</ThemedText>
      </Pressable>
    </View>
  )
}

export default DurationButton

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
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        minHeight: 80, 
    },
    text: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '500',
    }
})
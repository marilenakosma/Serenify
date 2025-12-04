import { Pressable, StyleSheet,View } from 'react-native'
import { Colors } from "../constants/Colors"

const ThemedButton = ({ style, children, ...props }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        style,
        pressed && styles.pressed
      ]}
      {...props}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </View>
    </Pressable>
  )
}


const styles = StyleSheet.create({
    btn: {
        backgroundColor:Colors.primary,
        padding:15,
        borderRadius:5
    },
    pressed: {
        opacity:0.8
    }
})

export default ThemedButton
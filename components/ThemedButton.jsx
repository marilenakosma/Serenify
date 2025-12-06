import { Pressable, StyleSheet, View } from 'react-native'
import { Colors } from "../constants/Colors"

const ThemedButton = ({ style, contentStyle, children, ...props }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        style,
        pressed && styles.pressed
      ]}
      {...props}
    >
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pressed: {
    opacity: 0.8
  }
})

export default ThemedButton
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'

const ThemedCategory = ({name,text}) => {
  return (
    <View style={styles.container}>
        <Ionicons style={{padding:5}}
        size={24} 
        name={name} /> 
        <Text style={{padding:10}}>{text}</Text>
    </View>
  )
}

export default ThemedCategory

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
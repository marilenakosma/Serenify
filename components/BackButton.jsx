import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { Colors } from "../constants/Colors";
import ThemedView from './ThemedView';

const BackButton = ({style}) => {
    const router = useRouter();
  return (
     <ThemedView style={[{flexDirection:'row',justifyContent:'start'},style]}>
       <TouchableOpacity 
       onPress={router.back} style={styles.button}>
        <ArrowLeftIcon size="20" color="black"/>
       </TouchableOpacity>
     </ThemedView>
  )
}

export default BackButton

const styles = StyleSheet.create({
    button: {
      padding: 8,
      marginLeft: 16,
      marginTop:10,
      borderTopRightRadius: 16, 
      borderBottomLeftRadius:16,
      backgroundColor: Colors.primary,
    }})
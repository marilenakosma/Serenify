import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { Colors } from "../constants/Colors";
import ThemedView from './ThemedView';
import { usePathname } from 'expo-router';

const BackButton = ({style,route = false}) => {
    const router = useRouter();
    const handleBackButton = () => {
      if(route) {
        console.log(' Navigating to:', route);
        router.navigate(route)
      } else {
        console.log(' Going back');
        router.back()
      }
    }
  return (
     <ThemedView style={[{flexDirection:'row',justifyContent:'start'},style]}>
       <TouchableOpacity 
       onPress={handleBackButton} style={styles.button}>
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
import { Image, StyleSheet } from 'react-native';
import LogoGreen from "../assets/images/leaf-green.png";
//import LogoBeige from "../assets/images/leaf-beige.png";
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";

export default function Index() {
  return (
    <ThemedView style={styles.container}>
      
      <Image source={LogoGreen} style={styles.image}/>
      <ThemedText title={true} style={styles.title}>
       Serenify
      </ThemedText>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18
    },
    image: {
        marginVertical: 20,
        width:200,
        height:200
    },
    link: {
        marginVertical: 10,
        borderBottomWidth:1
    }
})

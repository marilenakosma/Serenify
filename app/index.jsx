import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import LogoGreen from "../assets/images/leaf-green.png";
//import LogoBeige from "../assets/images/leaf-beige.png";
import { Montserrat_600SemiBold } from "@expo-google-fonts/montserrat";
import { useFonts } from 'expo-font';
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";

export default function Index() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      
      <Image source={LogoGreen} style={styles.image}/>

      <ThemedText title={true} style={styles.title_alt}>
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
     title_alt: {
        fontSize: 20,
        fontFamily: 'Montserrat_600SemiBold'
    },
    image: {
        marginVertical: 20,
        width:220,
        height:220
    },
    link: {
        marginVertical: 10,
        borderBottomWidth:1
    }
})

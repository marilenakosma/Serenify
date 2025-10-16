import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
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
    },
    link: {
        marginVertical: 10,
        borderBottomWidth:1
    }
})

//c2c9b7

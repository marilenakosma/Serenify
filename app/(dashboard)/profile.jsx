import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Spacer from "../../components/Spacer";
import ThemedSetting from "../../components/ThemedSetting";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";

const profile = () => {
    const settingData = [
        { id:1, name:"trophy-outline",text:"My badges" },
        { id:2, name:"time-outline", text:"Daily Reminder"},
        { id:3, name:"settings-outline", text:"Preferences"},
        { id:4, name:"accessibility-outline", text:"Account and Security"},
        { id:5, name:"stats-chart-outline", text:"Data and Analytics"}
      ]
    
      const renderSettings = ({item}) => (
       <ThemedSetting
         name={item.name}
         text={item.text}
       />
      )

      const Separator = () => <Spacer height={20}/>

  return (
        <ThemedView style={styles.container}>
          <SafeAreaView>

            <ThemedText title={true} style={styles.title}>
               My Profile
            </ThemedText>
                <FlatList
                        data={settingData}
                        renderItem={renderSettings}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle = {styles.grid}
                        ItemSeparatorComponent={Separator}
                        />

          </SafeAreaView>
        </ThemedView>
      )
}

export default profile

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#f1f5eeff'
    },
    safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  grid: {
      padding: 20,
      marginVertical: 20,
      marginHorizontal: 15,
    },
})
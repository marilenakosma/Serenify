import { FlatList, StyleSheet, View,ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import Spacer from "../../components/Spacer";
import ThemedSetting from "../../components/ThemedSetting";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { useAuthStore } from "../../store/authStore";
import { removeItem } from "../../store/storage";
import { useRouter } from "expo-router";
import { useTranslation } from '../../constants/translations';
import LanguagePicker from '../../components/LanguagePicker';
import { Ionicons } from '@expo/vector-icons';
import { CustomAlert } from "../../components/CustomAlert";
import { useState } from 'react';

const profile = () => {
    const { user, 
            logout,
            retakeQuestionnaire,
            points,
            level,
            getLevelName,
            pointsHistory, 
          } = useAuthStore();
    const router = useRouter();
    const { t } = useTranslation();
    const [alertConfig, setAlertConfig] = useState(null);

    const handleLogout = () => {
        setAlertConfig({
            type: 'warning',
            title: t('profile.logout'),
            message: t('profile.logoutConfirmation'),
            showCancel: true,
            onConfirm: async () => {
                try {
                    const result = await logout();
                    if (!result.success) {
                        setAlertConfig({
                            type: 'error',
                            title: t('common.error'),
                            message: t('profile.logoutError'),
                            onClose: () => setAlertConfig(null)
                        });
                    } else {
                        setAlertConfig(null);
                    }
                } catch (error) {
                   // console.log('Logout error:', error);
                    setAlertConfig(null);
                }
            },
            onClose: () => setAlertConfig(null)
        });
    };
    
    
    const handleRetakeQuestionnaire = () => {
       console.log('handleRetakeQuestionnaire called');
         retakeQuestionnaire();
         const navigationPath = '/(questionnaire)/?retake=true';
         router.push(navigationPath);
    }

    const handleSettingPress = (settingId, settingText) => {
        switch (settingId) {
            case 2: // Logout
                handleLogout();
                break;
            case 1:
                handleRetakeQuestionnaire();
                break;
            default:
                break;
        }
    };

    const settingData = [
       // { id: 1, name: "trophy-outline", text: t('profile.myBadges') },
      //  { id: 1, name: "time-outline", text: t('profile.dailyReminder') },
      //  { id: 2, name: "settings-outline", text: t('profile.preferences') },
    //    { id: 4, name: "accessibility-outline", text: t('profile.accountSecurity')},
       // { id: 5, name: "stats-chart-outline", text: t('profile.dataAnalytics') },
        { id: 1, name: "albums-outline", text: t('profile.retakeQuiz') },
        { id: 2, name: "log-out-outline", text: t('profile.logout') }, 
    ];

    const renderSettings = ({ item }) => (
        <ThemedSetting
            name={item.name}
            text={item.text}
            onPress={() => handleSettingPress(item.id, item.text)} //  Add press handler
            isLogout={item.id === 2} //  Mark logout for special styling.TODO:dynamic
        />
    );

    const Separator = () => <Spacer height={20} />;

    return (
        <ThemedView style={styles.container}>
            <LanguagePicker/>
             <SafeAreaView style={styles.safeArea}> 
               <View style={styles.header}> 
                 <BackButton style={{backgroundColor: '#f1f5eeff'}}/>
               </View>

                {/* User Info Section 
                <ThemedView style={styles.userSection}>
                    <View style={styles.userInfo}>
                        <ThemedText style={styles.username}>
                            {user?.username || 'User'}
                        </ThemedText>
                        <ThemedText style={styles.email}>
                            {user?.email || 'No email'}
                        </ThemedText>
                    </View>
                </ThemedView>*/}

                 <ImageBackground 
                            source={require('../../assets/images/canola.jpg')}
                            style={styles.backgroundImage}
                            resizeMode="cover"
                          >
                <View style={styles.pointsCard}>
                  <View style={styles.pointsHeader}>
                    <View style={styles.titleRow}>
                       <Ionicons name="flash" size={22} color="#FFD700" />
                        <View style={styles.titleContent}>
                          <View title={true} style={styles.pointsDisplay}>
                           <ThemedText style={styles.currentPoints}>
                             {points || 0}
                           </ThemedText>
                          <ThemedText title={true} style={styles.maxPoints}>
                               /{level * 100}
                          </ThemedText>
                     </View>
                   </View>
               </View>
               
    
                <View style={styles.progressBar}>
                   <View 
                     style={[
                      styles.progressFill, 
                      { width: `${((points % 100) / 100) * 100}%` }
                     ]} 
                     />
                </View>
    
                <View style={styles.levelRow}>
                  <View style={styles.levelBadge}>
                    <Ionicons name="trophy" size={16} color="#FF6B6B" />
                      <ThemedText style={styles.levelText}>
                        {level || 1}
                     </ThemedText>
                  </View>
                  <ThemedText style={styles.levelName}>
                    {getLevelName(t)}
                 </ThemedText>
                 </View>
               </View>
              </View>
              </ImageBackground>


                {/* Settings List */}
                <FlatList
                    data={settingData}
                    renderItem={renderSettings}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.grid}
                    ItemSeparatorComponent={Separator}
                />

                {alertConfig && (
                    <CustomAlert
                        type={alertConfig.type}
                        title={alertConfig.title}
                        message={alertConfig.message}
                        showCancel={alertConfig.showCancel}
                        onConfirm={alertConfig.onConfirm}
                        onClose={alertConfig.onClose}
                    />
                )}

            </SafeAreaView>
        </ThemedView>
    );
};

export default profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f5eeff'
    },
    safeArea: {
        flex:1,
    },
    header: { 
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: '#f1f5eeff',
    },
    userSection: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#f1f5eeff'
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 16,
        backgroundColor: '#f1f5eeff'
    },
    userInfo: {
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    grid: {
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 15,
    },
    pointsCard: {
      backgroundColor: '#fff',
      marginHorizontal: 35,
      marginTop: 10,
      marginBottom: 15,
      paddingHorizontal: 24,
      paddingVertical: 20,
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    pointsHeader: { 
      width: '100%',
   },
   titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
   },
   titleContent: {
     flex: 1,
   },
   cardTitle: {
     fontSize: 16,
     color: '#999',
     marginBottom: 4,
   },
   pointsDisplay: {
     flexDirection: 'row',
     alignItems: 'baseline',
   },
   currentPoints: {
     fontSize: 25,
     color: '#333',
   },
   maxPoints: {
     fontSize: 25,
     color: '#CCC',
   },
   progressBar: {
     height: 8,
     backgroundColor: '#E0E0E0',
     borderRadius: 10,
     overflow: 'hidden',
     marginBottom: 12,
   },
   progressFill: {
     height: '100%',
     backgroundColor: '#4CAF50',
     borderRadius: 10,
   },
   levelRow: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
   },
   levelBadge: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 6,
   },
   levelText: {
     fontSize: 14,
     fontWeight: '600',
     color: '#333',
   },
   levelName: {
     fontSize: 14,
     color: '#666',
     //fontStyle: 'italic',
    },
});
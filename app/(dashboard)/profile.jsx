import { Alert, FlatList, StyleSheet, View } from "react-native";
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

const profile = () => {
    const { user, logout,retakeQuestionnaire } = useAuthStore();
    const router = useRouter()
    const { t } = useTranslation();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await logout();
                        if (!result.success) {
                            Alert.alert('Error', 'Failed to logout');
                        }
                        // Navigation happens automatically via _layout.jsx
                    },
                },
            ]
        );
    };
    
    
    const handleRetakeQuestionnaire = () => {
       console.log('🚀 handleRetakeQuestionnaire called');
        // Use the authStore function which handles both storage and state
        retakeQuestionnaire();
        //console.log('retakeQuestionnaire completed');
        //router.push('/(questionnaire)/?retake=true&timestamp=' + Date.now());
         const navigationPath = '/(questionnaire)/?retake=true';
       //  console.log('🎯 About to navigate to:', navigationPath);
    
         router.push(navigationPath);
        // console.log('Navigation called');
    }

    const handleSettingPress = (settingId, settingText) => {
        switch (settingId) {
            case 7: // Logout
                handleLogout();
                break;
            case 6:
                handleRetakeQuestionnaire();
                break;
            default:
                // For now, just show which setting was pressed
                Alert.alert('Coming Soon', `${settingText} feature coming soon!`);
                break;
        }
    };

    const settingData = [
        { id: 1, name: "trophy-outline", text: t('profile.myBadges') },
        { id: 2, name: "time-outline", text: t('profile.dailyReminder') },
        { id: 3, name: "settings-outline", text: t('profile.preferences') },
        { id: 4, name: "accessibility-outline", text: t('profile.accountSecurity')},
        { id: 5, name: "stats-chart-outline", text: t('profile.dataAnalytics') },
        { id: 6, name: "albums-outline", text: t('profile.retakeQuiz') },
        { id: 7, name: "log-out-outline", text: t('profile.logout') }, 
    ];

    const renderSettings = ({ item }) => (
        <ThemedSetting
            name={item.name}
            text={item.text}
            onPress={() => handleSettingPress(item.id, item.text)} //  Add press handler
            isLogout={item.id === 7} //  Mark logout for special styling.TODO:dynamic
        />
    );

    const Separator = () => <Spacer height={20} />;

    return (
        <ThemedView style={styles.container}>
            <LanguagePicker/>
            <SafeAreaView>
                <BackButton style={{backgroundColor: '#f1f5eeff'}}/>

                {/* User Info Section */}
                <ThemedView style={styles.userSection}>
                    <View style={styles.userInfo}>
                        <ThemedText style={styles.username}>
                            {user?.username || 'User'}
                        </ThemedText>
                        <ThemedText style={styles.email}>
                            {user?.email || 'No email'}
                        </ThemedText>
                    </View>
                </ThemedView>

                {/* Settings List */}
                <FlatList
                    data={settingData}
                    renderItem={renderSettings}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.grid}
                    ItemSeparatorComponent={Separator}
                />
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
});
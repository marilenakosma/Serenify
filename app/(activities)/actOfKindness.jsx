import { useState,useEffect } from 'react';
import { StyleSheet,View,FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import Spacer from '../../components/Spacer';
import SplashScreen from '../../components/SplashScreen';
import ThemedButton from '../../components/ThemedButton';
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import BackButton from "../../components/BackButton";
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../constants/translations';
import LanguagePicker from '../../components/LanguagePicker';
import { SafeAreaView } from "react-native-safe-area-context";
import { usePathname } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { CustomAlert } from "../../components/CustomAlert";
import { PointsToast } from "../../components/PointsToast";

export default function ActOfKindness() {
   
  const router=useRouter()
  const pathname = usePathname();
  const { t } = useTranslation();
  const {
    toggleKindnessAct,
    getKindnessCompletions,
    getTodayKindnessCount,
    addPoints
  } = useAuthStore();

  const [completedActs,setCompletedActs] = useState([]);
  const [todayCount, setTodayCount] = useState(0);
  const [toastConfig, setToastConfig] = useState({ visible: false, points: 0, message: '' });

  //console.log('Current pathname:', pathname);
  //console.log('Attempting to go back to: /(dashboard)/activities');
//<Image source={LogoGreen} style={styles.image}/>

useEffect(() => {
  const todayCompleted = getKindnessCompletions();
  const count = getTodayKindnessCount();
  setCompletedActs(todayCompleted);
  setTodayCount(count);
},[]);

const kindnessActs = [
    // Personal connections
    {
      id: 1,
      category: 'Personal',
      text: t('kindness.callFriend'),
      icon: 'call-outline',
      color: '#FF6B9D'
    },
    {
      id: 2, 
      category: 'Personal',
      text: t('kindness.sendThankYou'),
      icon: 'heart-outline',
      color: '#FF6B9D'
    },
    {
      id: 3,
      category: 'Personal',
      text: t('kindness.compliment'),
      icon: 'chatbubble-outline',
      color: '#FF6B9D'
    },
    
    // Community help
    {
      id: 4,
      category: 'Community',
      text: t('kindness.helpNeighbor'),
      icon: 'home-outline',
      color: '#4ECDC4'
    },
    {
      id: 5,
      category: 'Community',
      text: t('kindness.volunteer'),
      icon: 'people-outline',
      color: '#4ECDC4'
    },
    {
      id: 6,
      category: 'Community',
      text: t('kindness.pickupLitter'),
      icon: 'trash-outline',
      color: '#4ECDC4'
    },
    
    // Small gestures
    {
      id: 7,
      category: 'Gestures',
      text: t('kindness.holdDoor'),
      icon: 'exit-outline',
      color: '#45B7D1'
    },
    {
      id: 8,
      category: 'Gestures',
      text: t('kindness.smile'),
      icon: 'happy-outline',
      color: '#45B7D1'
    },
    {
      id: 9,
      category: 'Gestures',
      text: t('kindness.letMerge'),
      icon: 'car-outline',
      color: '#45B7D1'
    },
    
    // Financial support
    {
      id: 10,
      category: 'Support',
      text: t('kindness.donate'),
      icon: 'card-outline',
      color: '#96CEB4'
    },
    {
      id: 11,
      category: 'Support',
      text: t('kindness.tipExtra'),
      icon: 'restaurant-outline',
      color: '#96CEB4'
    },
    {
      id: 12,
      category: 'Support',
      text: t('kindness.buyMeal'),
      icon: 'fast-food-outline',
      color: '#96CEB4'
    },
    
    // Online kindness
    {
      id: 13,
      category: 'Online',
      text: t('kindness.positiveReview'),
      icon: 'star-outline',
      color: '#FECA57'
    },
    {
      id: 14,
      category: 'Online',
      text: t('kindness.shareGood'),
      icon: 'share-outline',
      color: '#FECA57'
    },
    {
      id: 15,
      category: 'Online',
      text: t('kindness.encourageOnline'),
      icon: 'thumbs-up-outline',
      color: '#FECA57'
    }
  ];

const completeAct = (actId) => {
  const wasCompleted = completedActs.includes(actId); 
  
  toggleKindnessAct(actId);
  
  const updated = getKindnessCompletions();
  const newCount = getTodayKindnessCount();
  setCompletedActs(updated);
  setTodayCount(newCount);

  if (!wasCompleted) {
    addPoints(15, 'kindness-act');

    setToastConfig({
      visible: true,
      points: 15,
      message: t('kindness.completionMessage') || 'Great job giving back!'
    });

  } else {
    addPoints(-15, 'kindness-act-undo');
  }
};

const groupedActs = kindnessActs.reduce((groups,act) => {
  if (!groups[act.category]) {
    groups[act.category] = [];
  }
  groups[act.category].push(act);
  return groups;
},{});

const renderActItem = (act) => {
    const isCompleted = completedActs.includes(act.id);
    
    return (
      <View key={act.id} style={[styles.actCard, { borderLeftColor: act.color }]}>
        <View style={styles.actInfo}>
          <Ionicons 
            name={act.icon} 
            size={24} 
            color={isCompleted ? '#4CAF50' : act.color} 
          />
          <ThemedText style={[
            styles.actText,
            isCompleted && styles.completedText
          ]}>
            {act.text}
          </ThemedText>
        </View>
        
        <ThemedButton
          onPress={() => completeAct(act.id)}
          style={[
            styles.checkButton,
            { backgroundColor: isCompleted ? '#4CAF50' : '#E0E0E0' }
          ]}
          //contentStyle={{ padding: 0 }}
        >
          <Ionicons
            name={isCompleted ? 'checkmark' : 'add'}
            size={20}
            color={isCompleted ? '#fff' : '#666'}
          />
        </ThemedButton>
      </View>
    );
  };

  const renderCategory = (categoryName, acts) => (
    <View key={categoryName} style={styles.categorySection}>
      <ThemedText title={true} style={styles.categoryTitle}>
        {t(`kindness.categories.${categoryName.toLowerCase()}`)}
      </ThemedText>
      {acts.map(renderActItem)}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton 
        style={{ backgroundColor: '#f1f5eeff' }} 
        onPress={() => router.push('/(dashboard)/activities')}
      />
      
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText title={true} style={styles.title}>
            {t('kindness.title')}
          </ThemedText>
          
          <View style={styles.progressCard}>
            <Ionicons name="heart" size={24} color="#FF6B9D" />
            <ThemedText style={styles.progressText}>
              {todayCount} {t('kindness.actsToday')}
            </ThemedText>
          </View>
        </View>

        <FlatList
          data={Object.entries(groupedActs)}
          renderItem={({ item: [categoryName, acts] }) => 
            renderCategory(categoryName, acts)
          }
          keyExtractor={([categoryName]) => categoryName}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />

        {toastConfig && (
          <PointsToast
          visible={toastConfig.visible}
          points={toastConfig.points}
          message={toastConfig.message}
          onDismiss={() => setToastConfig({ visible: false, points: 0, message: '' })}
          duration={3000}
        />
        )}

      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5eeff',
    paddingHorizontal: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f1f5eeff'
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'center',
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE0E6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  progressText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  list: {
    paddingBottom: 20,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 20,
    marginBottom: 12,
    color: '#333',
  },
  actCard: {
    flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
  },
  actInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actText: {
    marginLeft: 12,
    fontSize: 15,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  checkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
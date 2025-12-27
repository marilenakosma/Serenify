import { StyleSheet, View, FlatList, TouchableOpacity,Image,ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../constants/translations';
import BackButton from "../../components/BackButton";
//import Breathe from "../../assets/images/lungs.png";
import Movements from "../../assets/images/Athletics.png";
import Meditation from "../../assets/images/Yoga.png";
import Notes from "../../assets/images/Notes.png";
import Gifts from "../../assets/images/Gifts.png";
import Journal from "../../assets/images/Journal.png";
import Breathe from "../../assets/images/Heart4.png";
import Star from "../../assets/images/Star.png";
import { getHabitTranslation } from '../../constants/habitTranslations';


export default function PointsHistory() {
  const router = useRouter();
  const { t,currentLanguage } = useTranslation();
  const { pointsHistory, points, level, getLevelName,userHabits } = useAuthStore();
  
  const getHabitName = (habitId) => {
  const habit = userHabits.find(h => h.id === habitId);
  
  // If habit exists and has stored text/title, use it
  if (habit) {
    if (habit.text && !habit.text.includes('.')) return habit.text;
    if (habit.title && !habit.title.includes('.')) return habit.title;
  }
  
  // Otherwise use the centralized translation helper
  return getHabitTranslation(habitId, t);
};

  const getSourceIcon = (source) => {
    if (source.includes('habit')) return Notes;
    if (source.includes('reflection')) return Journal;
    if (source.includes('kindness')) return Gifts;
    if (source.includes('breathe')) return Breathe;
    if (source.includes('meditation')) return Meditation;
    if (source.includes('movements')) return Movements;
    return Star;
  };

  const getSourceColor = (source) => {
    if (source.includes('habit')) return '#4CAF50';
    if (source.includes('reflection')) return '#2196F3';
    if (source.includes('kindness')) return '#FF6B6B';
    if (source.includes('breathe')) return '#e04f5f';
    if (source.includes('meditation')) return '#f5c941';
    if (source.includes('movements')) return '#6bb219';
    return '#FFD700';
  };

  const getSourceText = (source) => {
    // Extract habit ID from source if it's a habit
    if (source.includes('habit-')) {
      const habitId = source.replace('habit-', '').replace('-undo', '');
      return getHabitName(habitId);
    }
    
    if (source.includes('reflection')) return t('points.fromReflection');
    if (source.includes('kindness')) return t('points.fromKindness');
    if (source.includes('breathe')) return t('points.fromBreathing');
    if (source.includes('meditation')) return t('points.fromMeditation');
    if (source.includes('movements')) return t('points.fromMovement');
    return t('points.fromActivity');
  };

  // Update the groupedHistory section (around line 85):
  const groupedHistory = pointsHistory.reduce((groups, item) => {
    const date = new Date(item.timestamp);
  
  // Use user's locale and timezone for date formatting
    const locale = currentLanguage === 'el' ? 'el-GR' : 'en-US';
    const timeZone = currentLanguage === 'el' ? 'Europe/Athens' : Intl.DateTimeFormat().resolvedOptions().timeZone;
  
    const formattedDate = new Intl.DateTimeFormat(locale, {
     timeZone: timeZone,
     weekday: 'long',
     year: 'numeric', 
     month: 'long',
     day: 'numeric'
    }).format(date);

    if (!groups[formattedDate]) {
      groups[formattedDate] = [];
    }

    groups[formattedDate].push(item);
    return groups;
  }, {});

  // Flattened list with date headers
  const flattenedData = Object.entries(groupedHistory)
    .sort(([dateA, itemsA], [dateB, itemsB]) => {
  // Compare using the actual timestamps from the items
  const timeA = new Date(itemsA[0].timestamp).getTime();
  const timeB = new Date(itemsB[0].timestamp).getTime();
  return timeB - timeA; // Newest (today) first
}) // Sort by date desc
    .flatMap(([date, items]) => {
      const habitCount = items.filter(item => item.source.includes('habit-') && !item.source.includes('-undo')).length;
      const totalPoints = items.reduce((sum, item) => sum + item.amount, 0);
      
      return [
        { type: 'header', date, habitCount, totalPoints, items },
        ...items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(item => ({ type: 'item', ...item }))
      ];
    });

  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.dateHeader}>
          <View style={styles.dateHeaderLeft}>
            <ThemedText title style={styles.dateText}>{item.date}</ThemedText>
           { /*{item.habitCount > 0 && (
              <ThemedText style={styles.habitCountText}>
                {item.habitCount} {item.habitCount === 1 ? 
                  (currentLanguage === 'el' ? 'συνήθεια ολοκληρώθηκε' : 'habit completed') : 
                  (currentLanguage === 'el' ? 'συνήθειες ολοκληρώθηκαν' : 'habits completed')
                }
              </ThemedText>
            )} */}
          </View>
          <View style={styles.dateHeaderRight}>
            <Ionicons name="flash" size={16} color="#FFD700" />
            <ThemedText style={[styles.totalPointsText, { color: item.totalPoints >= 0 ? '#4CAF50' : '#FF6B6B' }]}>
              {item.totalPoints >= 0 ? '+' : ''}{item.totalPoints}
            </ThemedText>
          </View>
        </View>
      );
    }

    const isNegative = item.amount < 0;
    const color = isNegative ? '#FF6B6B' : getSourceColor(item.source);

    return (
      <View style={styles.historyItem}>
        <View style={[styles.iconContainer,{backgroundColor: `${color}15`} ]}>
           <Image source={getSourceIcon(item.source)} style={{
             width: item.source.includes('breathe') ? 42 : 25, 
             height: item.source.includes('breathe') ? 42 : 25
           }} />
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={[styles.sourceText]}>{getSourceText(item.source)}</ThemedText>
          <ThemedText style={styles.timeText}>
           {new Date(item.timestamp).toLocaleTimeString(
           currentLanguage === 'el' ? 'el-GR' : 'en-US', 
           { 
             hour: '2-digit', 
             minute: '2-digit',
             timeZone: currentLanguage === 'el' ? 'Europe/Athens' : Intl.DateTimeFormat().resolvedOptions().timeZone
           }
          )}
         </ThemedText>
        </View>
        <Ionicons name="flash" size={20} color="#FFD700" />
        <ThemedText style={[styles.pointsText, { color }]}>
          {isNegative ? '' : '+'}{item.amount}
        </ThemedText>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <BackButton style={{backgroundColor: '#f1f5eeff'}}/>
          <ThemedText title style={styles.headerTitle}>
            {t('points.history')}
          </ThemedText>
          <View style={{ width: 24 }} />
        </View>

        {/* Summary Card */}
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
                       

        {/* History List */}
        {pointsHistory.length > 0 ? (
          <FlatList
            data={flattenedData}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.type}-${index}`}
            contentContainerStyle={styles.list}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#CCC" />
            <ThemedText style={styles.emptyText}>{t('points.noHistory')}</ThemedText>
          </View>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f1f5eeff'
  },
  container: {
    flex: 1,
    backgroundColor: '#f1f5eeff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f1f5eeff'
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
  },

  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    //backgroundColor: '#f8f9fa',
    //borderBottomWidth: 1,
    //borderBottomColor: '#e0e0e0',
    marginTop: 10,
    marginBottom:10
    
  },
  dateHeaderLeft: {
    flex: 1,
  },
  dateHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    alignItems: 'center',
  },
  habitCountText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  totalPointsText: {
    fontSize: 16,
    fontWeight: '600',
  },

  summaryCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  rankText: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  list: {
    padding: 20,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  sourceText: {
    fontSize: 15,
    flexShrink:1,
    flexWrap:'wrap'
  },
  pointsText: {
    fontSize: 20,
    //fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
   pointsCard: {
      backgroundColor: '#ffffffff',
      marginHorizontal: 20,
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
   timeText:{
    fontSize:13,
    color: '#999',
    marginTop:2,
   },
   cardTitle: {
     fontSize: 15,
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
    backgroundImage: {
        width: '100%'
    },
});
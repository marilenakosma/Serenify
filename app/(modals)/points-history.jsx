import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../constants/translations';
import BackButton from "../../components/BackButton";

export default function PointsHistory() {
  const router = useRouter();
  const { t } = useTranslation();
  const { pointsHistory, points, level, getLevelName } = useAuthStore();

  const getSourceIcon = (source) => {
    if (source.includes('habit')) return 'checkmark-circle';
    if (source.includes('reflection')) return 'journal';
    if (source.includes('kindness')) return 'heart';
    if (source.includes('breathe')) return 'flower';
    return 'star';
  };

  const getSourceColor = (source) => {
    if (source.includes('habit')) return '#4CAF50';
    if (source.includes('reflection')) return '#2196F3';
    if (source.includes('kindness')) return '#FF6B6B';
    if (source.includes('breathe')) return '#9C27B0';
    return '#FFD700';
  };

  const getSourceText = (source) => {
    if (source.includes('habit')) return t('points.fromHabit');
    if (source.includes('reflection')) return t('points.fromReflection');
    if (source.includes('kindness')) return t('points.fromKindness');
    if (source.includes('breathe')) return t('points.fromBreathing');
    return t('points.fromActivity');
  };

  const renderItem = ({ item }) => {
    const isNegative = item.amount < 0;
    const color = isNegative ? '#FF6B6B' : getSourceColor(item.source);

    return (
      <View style={styles.historyItem}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={getSourceIcon(item.source)} size={24} color={color} />
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.sourceText}>{getSourceText(item.source)}</ThemedText>
          <ThemedText style={styles.dateText}>
            {new Date(item.timestamp).toLocaleDateString()}
          </ThemedText>
        </View>
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
                             {getLevelName()}
                          </ThemedText>
                          </View>
                        </View>
                       </View>

        {/* History List */}
        {pointsHistory.length > 0 ? (
          <FlatList
            data={[...pointsHistory].reverse()}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
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
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  sourceText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
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
      backgroundColor: '#fff',
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
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../../components/ThemedText';
import ThemedView from '../../../components/ThemedView';
import ThemedButton from '../../../components/ThemedButton';
import BackButton from '../../../components/BackButton';
import { useTranslation } from '../../../constants/translations';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Affirmations() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);

  const affirmations = [
    {
      text: t('firstAid.affirmations.affirmation1'),
      category: 'strength',
      color: '#FF6B9D'
    },
    {
      text: t('firstAid.affirmations.affirmation2'),
      category: 'peace',
      color: '#66BB6A'
    },
    {
      text: t('firstAid.affirmations.affirmation3'),
      category: 'growth',
      color: '#42A5F5'
    },
    {
      text: t('firstAid.affirmations.affirmation4'),
      category: 'confidence',
      color: '#9575CD'
    },
    {
      text: t('firstAid.affirmations.affirmation5'),
      category: 'strength',
      color: '#FFA726'
    },
    {
      text: t('firstAid.affirmations.affirmation6'),
      category: 'peace',
      color: '#26A69A'
    },
    {
      text: t('firstAid.affirmations.affirmation7'),
      category: 'growth',
      color: '#7E57C2'
    },
    {
      text: t('firstAid.affirmations.affirmation8'),
      category: 'confidence',
      color: '#EC407A'
    },
    {
      text: t('firstAid.affirmations.affirmation9'),
      category: 'strength',
      color: '#66BB6A'
    },
    {
      text: t('firstAid.affirmations.affirmation10'),
      category: 'peace',
      color: '#42A5F5'
    },
    {
      text: t('firstAid.affirmations.affirmation11'),
      category: 'growth',
      color: '#FF6B9D'
    },
    {
      text: t('firstAid.affirmations.affirmation12'),
      category: 'confidence',
      color: '#FFA726'
    },
    {
      text: t('firstAid.affirmations.affirmation13'),
      category: 'strength',
      color: '#9575CD'
    },
    {
      text: t('firstAid.affirmations.affirmation14'),
      category: 'peace',
      color: '#26A69A'
    },
    {
      text: t('firstAid.affirmations.affirmation15'),
      category: 'growth',
      color: '#7E57C2'
    }
  ];

  const currentAffirmation = affirmations[currentIndex];
  const isFavorite = favorites.includes(currentIndex);

  const handleNext = () => {
    if (currentIndex < affirmations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to start
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(affirmations.length - 1); // Loop to end
    }
  };

  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setCurrentIndex(randomIndex);
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites(favorites.filter(i => i !== currentIndex));
    } else {
      setFavorites([...favorites, currentIndex]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton style={{backgroundColor: '#f1f5eeff'}} onPress={() => router.back()} />
      
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="heart-outline" size={40} color="#FF6B9D" />
          <ThemedText title={true} style={styles.title}>
            {t('firstAid.affirmations.title')}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {t('firstAid.affirmations.subtitle')}
          </ThemedText>
        </View>

        <View style={styles.content}>
          <View style={styles.counterContainer}>
            <ThemedText style={styles.counter}>
              {currentIndex + 1} / {affirmations.length}
            </ThemedText>
          </View>

          <View style={[styles.affirmationCard, { borderColor: currentAffirmation.color }]}>
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={toggleFavorite}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={28} 
                color={isFavorite ? "#FF6B9D" : "#999"} 
              />
            </TouchableOpacity>

            <View style={[styles.categoryBadge, { backgroundColor: currentAffirmation.color }]}>
              <ThemedText style={styles.categoryText}>
                {t(`firstAid.affirmations.categories.${currentAffirmation.category}`)}
              </ThemedText>
            </View>

            <ScrollView 
              contentContainerStyle={styles.affirmationTextContainer}
              showsVerticalScrollIndicator={false}
            >
              <ThemedText style={styles.affirmationText}>
                "{currentAffirmation.text}"
              </ThemedText>
            </ScrollView>

            <View style={styles.instructionBox}>
              <Ionicons name="bulb-outline" size={20} color="#FFA726" />
              <ThemedText style={styles.instructionText}>
                {t('firstAid.affirmations.instruction')}
              </ThemedText>
            </View>
          </View>

          <View 
          style={styles.navigationContainer}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={handlePrevious}
            >
              <Ionicons name="chevron-back" size={32} color="#666" />
            </TouchableOpacity>
            
            
              <ThemedButton
              style={styles.randomButton}
              onPress={handleRandom}
            >
              <Ionicons name="shuffle" size={20} color="#fff" />
              <ThemedText style={styles.randomButtonText}>
                {t('firstAid.affirmations.random')}
              </ThemedText>
            </ThemedButton>
            

            <TouchableOpacity 
              style={styles.navButton}
              onPress={handleNext}
            >
              <Ionicons name="chevron-forward" size={32} color="#666" />
            </TouchableOpacity>
          </View>

          {favorites.length > 0 && (
            <View style={styles.favoritesContainer}>
              <ThemedText style={styles.favoritesTitle}>
                {t('firstAid.affirmations.yourFavorites')} ({favorites.length})
              </ThemedText>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.favoritesList}
              >
                {favorites.map((favIndex) => (
                  <TouchableOpacity
                    key={favIndex}
                    style={[
                      styles.favoriteChip,
                      { backgroundColor: affirmations[favIndex].color }
                    ]}
                    onPress={() => setCurrentIndex(favIndex)}
                  >
                    <ThemedText style={styles.favoriteChipText}>
                      {favIndex + 1}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
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
    backgroundColor: '#f1f5eeff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  counter: {
    fontSize: 14,
    color: '#999',
  },
  affirmationCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  affirmationTextContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  affirmationText: {
    fontSize: 24,
    lineHeight: 36,
    textAlign: 'center',
    //fontStyle: 'italic',
    color: '#333',
  },
  instructionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  instructionText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#F57C00',
    flex: 1,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  randomButton: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  randomButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft:8
  },
  favoritesContainer: {
    marginBottom: 20,
  },
  favoritesTitle: {
    fontSize: 14,
    marginBottom: 12,
    color: '#666',
  },
  favoritesList: {
    gap: 8,
  },
  favoriteChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  favoriteChipText: {
    color: '#fff',
    fontSize: 14,
  },
});

import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';
import ThemedButton from '../../components/ThemedButton';
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import BackButton from "../../components/BackButton";
import { useTranslation } from '../../constants/translations';
import { SafeAreaView } from "react-native-safe-area-context";

export default function Soundscapes() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentSound, setCurrentSound] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  const player = useAudioPlayer();

  const soundscapes = [
    {
      id: 1,
      name: t('soundscapes.rain'),
      description: t('soundscapes.rainDesc'),
      file: require('../../assets/sounds/ambient/permafrost.mp3'),
      color: '#4FC3F7',
      icon: 'rainy-outline'
    },
    {
      id: 2,
      name: t('soundscapes.ocean'),
      description: t('soundscapes.oceanDesc'),
      file: require('../../assets/sounds/ambient/reverie.mp3'),
      color: '#26C6DA',
      icon: 'water-outline'
    },
    {
      id: 3,
      name: t('soundscapes.forest'),
      description: t('soundscapes.forestDesc'),
      file: require('../../assets/sounds/meditation/laetha.mp3'),
      color: '#66BB6A',
      icon: 'leaf-outline'
    },
    {
      id: 4,
      name: t('soundscapes.fire'),
      description: t('soundscapes.fireDesc'),
      file: require('../../assets/sounds/meditation/spatium.mp3'),
      color: '#FF7043',
      icon: 'flame-outline'
    },
    {
      id: 5,
      name: t('soundscapes.birds'),
      description: t('soundscapes.birdsDesc'),
      file: require('../../assets/sounds/productivity/daydreams.mp3'),
      color: '#FFA726',
      icon: 'musical-notes-outline'
    },
    {
      id: 6,
      name: t('soundscapes.evening'), 
      description: t('soundscapes.eveningDesc'), 
      file: require('../../assets/sounds/sleep/EveningImprovisation.mp3'),
      color: '#9575CD',
      icon: 'moon-outline'
    },
    {
      id: 7,
      name: t('soundscapes.sunset'), 
      description: t('soundscapes.sunsetDesc'), 
      file: require('../../assets/sounds/sleep/SunsetLandscape.mp3'),
      color: '#F06292',
      icon: 'sunny-outline'
    },
    {
      id: 8,
      name: t('soundscapes.whiteNoise'), 
      description: t('soundscapes.whiteNoiseDesc'), 
      file: require('../../assets/sounds/white-noise/whiteNoise.mp3'),
      color: '#90A4AE',
      icon: 'radio-outline'
    },
  ];

  const toggleSound = async (soundscape) => {
    try {
      if (player.playing && playingId === soundscape.id) {
        // Stop current sound
        player.pause();
        setPlayingId(null);
        setCurrentSound(null);
      } else {
        // Play new sound
        player.replace(soundscape.file);
        player.loop = true;
        player.play();
        
        setCurrentSound(soundscape);
        setPlayingId(soundscape.id);
      }
    } catch (error) {
      console.log('Sound toggle error:', error);
      Alert.alert('Error', 'Could not play audio');
    }
  };

  const handleBack = () => {
    if (player.playing) {
      player.pause();
    }
    router.push('/(dashboard)/activities');
  };

  const renderSoundscape = ({ item }) => (
    <View style={[styles.soundCard, { borderLeftColor: item.color }]}>
      <View style={styles.soundInfo}>
        <Ionicons name={item.icon} size={32} color={item.color} />
        <View style={styles.soundText}>
          <ThemedText title={true} style={styles.soundName}>{item.name}</ThemedText>
          <ThemedText style={styles.soundDescription}>{item.description}</ThemedText>
        </View>
      </View>
      
      <ThemedButton 
        onPress={() => toggleSound(item)}
        style={[styles.playButton, 
          { 
            backgroundColor: playingId === item.id ? '#FF5722' : item.color 
          }
        ]}
      >
        <Ionicons 
          name={playingId === item.id ? 'stop' : 'play'} 
          size={20} 
          color="#fff" 
        />
      </ThemedButton>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton 
        style={{ backgroundColor: '#f1f5eeff' }} 
        onPress={handleBack}
      />

      <ThemedView style={styles.container}>
        <ThemedText title={true} style={styles.title}>
          {t('soundscapes.title')}
        </ThemedText>
        
        {/* Show currently playing */}
        {currentSound && (
          <View style={styles.nowPlaying}>
            <Ionicons name="musical-note" size={20} color="#2E7D32" />
            <ThemedText style={styles.nowPlayingText}>
              Playing: {currentSound.name}
            </ThemedText>
          </View>
        )}
        
        <FlatList
          data={soundscapes}
          renderItem={renderSoundscape}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      </ThemedView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f1f5eeff', 
    paddingHorizontal: 20 
  },
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f1f5eeff' 
  },
  title: {
    fontSize: 28, 
    marginVertical: 20, 
    textAlign: 'center' 
  },
  nowPlaying: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  nowPlayingText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '500',
  },
  list: { 
    paddingBottom: 20 
  },
  soundCard: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: '#fff', 
    padding: 16, 
    marginBottom: 12, 
    borderRadius: 12, 
    //borderLeftWidth: 4,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  soundInfo: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1 
  },
  soundText: { 
    marginLeft: 12, 
    flex: 1 
  },
  soundName: { 
    fontSize: 18,
    marginBottom: 4 
  },
  soundDescription: { 
    fontSize: 14, 
    color: '#666' 
  },
  playButton: { 
    width: 50, 
    height: 50, 
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center' 
  },
});
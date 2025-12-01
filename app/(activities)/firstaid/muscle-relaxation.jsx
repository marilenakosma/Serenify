import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../../components/ThemedText';
import ThemedView from '../../../components/ThemedView';
import ThemedButton from '../../../components/ThemedButton';
import BackButton from '../../../components/BackButton';
import { useTranslation } from '../../../constants/translations';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MuscleRelaxation() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [phase, setPhase] = useState('tense'); // 'tense' or 'relax'

  const muscleGroups = [
    {
      name: t('firstAid.muscleRelaxation.hands'),
      tenseInstruction: t('firstAid.muscleRelaxation.handsTense'),
      relaxInstruction: t('firstAid.muscleRelaxation.handsRelax'),
      icon: 'hand-right-outline',
      color: '#42A5F5'
    },
    {
      name: t('firstAid.muscleRelaxation.arms'),
      tenseInstruction: t('firstAid.muscleRelaxation.armsTense'),
      relaxInstruction: t('firstAid.muscleRelaxation.armsRelax'),
      icon: 'fitness-outline',
      color: '#66BB6A'
    },
    {
      name: t('firstAid.muscleRelaxation.shoulders'),
      tenseInstruction: t('firstAid.muscleRelaxation.shouldersTense'),
      relaxInstruction: t('firstAid.muscleRelaxation.shouldersRelax'),
      icon: 'body-outline',
      color: '#9575CD'
    },
    {
      name: t('firstAid.muscleRelaxation.face'),
      tenseInstruction: t('firstAid.muscleRelaxation.faceTense'),
      relaxInstruction: t('firstAid.muscleRelaxation.faceRelax'),
      icon: 'happy-outline',
      color: '#FF6B9D'
    },
    {
      name: t('firstAid.muscleRelaxation.stomach'),
      tenseInstruction: t('firstAid.muscleRelaxation.stomachTense'),
      relaxInstruction: t('firstAid.muscleRelaxation.stomachRelax'),
      icon: 'ellipse-outline',
      color: '#FFA726'
    },
    {
      name: t('firstAid.muscleRelaxation.legs'),
      tenseInstruction: t('firstAid.muscleRelaxation.legsTense'),
      relaxInstruction: t('firstAid.muscleRelaxation.legsRelax'),
      icon: 'walk-outline',
      color: '#26A69A'
    },
    {
      name: t('firstAid.muscleRelaxation.feet'),
      tenseInstruction: t('firstAid.muscleRelaxation.feetTense'),
      relaxInstruction: t('firstAid.muscleRelaxation.feetRelax'),
      icon: 'footsteps-outline',
      color: '#7E57C2'
    }
  ];

  const handleStart = () => {
    setIsStarted(true);
    setCurrentStep(0);
    setPhase('tense');
  };

  const handleNext = () => {
    if (phase === 'tense') {
      setPhase('relax');
    } else {
      if (currentStep < muscleGroups.length - 1) {
        setCurrentStep(currentStep + 1);
        setPhase('tense');
      } else {
        // Finished
        setIsStarted(false);
        setCurrentStep(0);
        setPhase('tense');
      }
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setPhase('tense');
  };

  if (!isStarted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <BackButton style={{backgroundColor: '#f1f5eeff'}} onPress={() => router.back()} />
        
        <ThemedView style={styles.container}>
          <ScrollView contentContainerStyle={styles.introContainer}>
            <Ionicons name="body-outline" size={80} color="#42A5F5" />
            
            <ThemedText title={true} style={styles.title}>
              {t('firstAid.muscleRelaxation.title')}
            </ThemedText>
            
            <ThemedText style={styles.description}>
              {t('firstAid.muscleRelaxation.intro')}
            </ThemedText>

            <View style={styles.instructionsBox}>
              <ThemedText style={styles.instructionsTitle}>
                {t('firstAid.muscleRelaxation.howItWorks')}
              </ThemedText>
              <ThemedText style={styles.instructions}>
                {t('firstAid.muscleRelaxation.instructions')}
              </ThemedText>
            </View>

            <View style={styles.tipsBox}>
              <Ionicons name="bulb-outline" size={24} color="#FFA726" />
              <ThemedText style={styles.tipsText}>
                {t('firstAid.muscleRelaxation.tip')}
              </ThemedText>
            </View>

            <ThemedButton
              style={styles.startButton}
              onPress={handleStart}
            >
              <ThemedText style={styles.startButtonText}>
                {t('activities.start')}
              </ThemedText>
            </ThemedButton>
          </ScrollView>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const muscleGroup = muscleGroups[currentStep];
  const isLastStep = currentStep === muscleGroups.length - 1 && phase === 'relax';

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton style={{backgroundColor: '#f1f5eeff'}} onPress={() => router.back()} />
      
      <ThemedView style={styles.container}>
        <View style={styles.progressContainer}>
          <ThemedText style={styles.progressText}>
            {currentStep + 1} / {muscleGroups.length}
          </ThemedText>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentStep + (phase === 'relax' ? 0.5 : 0)) / muscleGroups.length) * 100}%` }
              ]} 
            />
          </View>
        </View>

        <ScrollView 
          contentContainerStyle={styles.stepContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={[
            styles.iconCircle, 
            { 
              backgroundColor: phase === 'tense' ? `${muscleGroup.color}30` : `${muscleGroup.color}15`,
              borderWidth: phase === 'tense' ? 3 : 0,
              borderColor: phase === 'tense' ? muscleGroup.color : 'transparent'
            }
          ]}>
            <Ionicons name={muscleGroup.icon} size={60} color={muscleGroup.color} />
          </View>

          <View style={[
            styles.phaseIndicator,
            { backgroundColor: phase === 'tense' ? '#FF6B6B' : '#4CAF50' }
          ]}>
            <ThemedText style={styles.phaseText}>
              {phase === 'tense' ? t('firstAid.muscleRelaxation.tensePhase') : t('firstAid.muscleRelaxation.relaxPhase')}
            </ThemedText>
          </View>

          <ThemedText style={styles.muscleName}>
            {muscleGroup.name}
          </ThemedText>

          <View style={styles.instructionBox}>
            <ThemedText style={styles.instruction}>
              {phase === 'tense' ? muscleGroup.tenseInstruction : muscleGroup.relaxInstruction}
            </ThemedText>
          </View>

          {phase === 'tense' && (
            <View style={styles.timerBox}>
              <Ionicons name="timer-outline" size={24} color="#666" />
              <ThemedText style={styles.timerText}>
                {t('firstAid.muscleRelaxation.holdFor5')}
              </ThemedText>
            </View>
          )}

          {phase === 'relax' && (
            <View style={styles.timerBox}>
              <Ionicons name="sparkles-outline" size={24} color="#4CAF50" />
              <ThemedText style={styles.timerText}>
                {t('firstAid.muscleRelaxation.releaseFor10')}
              </ThemedText>
            </View>
          )}

          {isLastStep && (
            <View style={styles.completionBox}>
              <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
              <ThemedText style={styles.completionText}>
                {t('firstAid.muscleRelaxation.complete')}
              </ThemedText>
            </View>
          )}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <ThemedButton
            style={[
              styles.nextButton,
              { backgroundColor: phase === 'tense' ? '#FF6B6B' : '#4CAF50' }
            ]}
            onPress={handleNext}
          >
            <ThemedText style={styles.nextButtonText}>
              {isLastStep ? t('common.done') : (phase === 'tense' ? t('firstAid.muscleRelaxation.release') : t('common.next'))}
            </ThemedText>
          </ThemedButton>

          {isLastStep && (
            <ThemedButton
              style={styles.restartButton}
              onPress={handleRestart}
            >
              <ThemedText style={styles.restartButtonText}>
                {t('activities.again')}
              </ThemedText>
            </ThemedButton>
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
  introContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    marginTop: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    lineHeight: 24,
  },
  instructionsBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: '100%',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1565C0',
  },
  instructions: {
    fontSize: 14,
    color: '#42A5F5',
    lineHeight: 22,
  },
  tipsBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  tipsText: {
    fontSize: 14,
    color: '#F57C00',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#42A5F5',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '100%',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#42A5F5',
  },
  stepContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  phaseIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  phaseText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  muscleName: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructionBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    lineHeight: 24,
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  timerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  completionBox: {
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 12,
  },
  completionText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  nextButton: {
    paddingVertical: 16,
    borderRadius: 12,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  restartButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 16,
    borderRadius: 12,
  },
  restartButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
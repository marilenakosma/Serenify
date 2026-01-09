import React, { useState } from 'react';
import { StyleSheet, View, ScrollView,Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../../components/ThemedText';
import ThemedView from '../../../components/ThemedView';
import ThemedButton from '../../../components/ThemedButton';
import BackButton from '../../../components/BackButton';
import { useTranslation } from '../../../constants/translations';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { PointsToast } from "../../../components/PointsToast";
import { Confetti } from 'react-native-fast-confetti';
import completionImage from "../../../assets/images/sun.png";

export default function Grounding() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [showCompletion,setShowCompletion] = useState(false);

  const steps = [
    {
      number: 5,
      sense: t('firstAid.grounding.see'),
      prompt: t('firstAid.grounding.seePrompt'),
      icon: 'eye-outline',
      color: '#6B9E78'
    },
    {
      number: 4,
      sense: t('firstAid.grounding.touch'),
      prompt: t('firstAid.grounding.touchPrompt'),
      icon: 'hand-left-outline',
      color: '#7BA3C1'
    },
    {
      number: 3,
      sense: t('firstAid.grounding.hear'),
      prompt: t('firstAid.grounding.hearPrompt'),
      icon: 'ear-outline',
      color: '#9E8BC1'
    },
    {
      number: 2,
      sense: t('firstAid.grounding.smell'),
      prompt: t('firstAid.grounding.smellPrompt'),
      icon: 'flower-outline',
      color: '#D989AA'
    },
    {
      number: 1,
      sense: t('firstAid.grounding.taste'),
      prompt: t('firstAid.grounding.tastePrompt'),
      icon: 'ice-cream-outline',
      color: '#E8B86D'
    }
  ];

  const handleStart = () => {
    setIsStarted(true);
    setShowCompletion(false);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step completed - show toast and completion screen
      setShowCompletion(true);
    }
  };

  const handleComplete = () => {
    router.back();
  }

  const handleRestart = () => {
    setIsStarted(true);
    setShowCompletion(false);
    setCurrentStep(0);
  };

  if (!isStarted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <BackButton style={{backgroundColor: '#f1f5eeff'}}
         onPress={() => router.back()} />
        
        <ThemedView style={styles.container}>
          <View style={styles.introContainer}>
            <Ionicons name="hand-left-outline" size={80} color="#66BB6A" />
            
            <ThemedText title={true} style={styles.title}>
              {t('firstAid.grounding.title')}
            </ThemedText>
            
            <ThemedText style={styles.description}>
              {t('firstAid.grounding.intro')}
            </ThemedText>

            <View style={styles.instructionsBox}>
              <ThemedText style={styles.instructionsTitle}>
                {t('firstAid.grounding.howItWorks')}
              </ThemedText>
              <ThemedText style={styles.instructions}>
                {t('firstAid.grounding.instructions')}
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
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  // Completion screen
  if (showCompletion) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <BackButton style={{backgroundColor: '#f1f5eeff'}}
          onPress={() => router.back()} />
        
        <ThemedView style={styles.container}>
          <Confetti/>
          <View style={styles.completionContainer}>
            <Image source={completionImage} 
                   style={styles.image}
                   resizeMode="contain" 
            />
            
            <ThemedText title={true} style={styles.completionTitle}>
              {t('firstAid.grounding.complete')}
            </ThemedText>

            <View style={styles.completionButtonContainer}>
              <ThemedButton
                style={styles.completeButton}
                onPress={handleComplete}
              >
                <ThemedText style={styles.completeButtonText}>
                  {t('common.complete')}
                </ThemedText>
              </ThemedButton>

              <ThemedButton
                style={styles.restartButton}
                onPress={handleRestart}
              >
                <ThemedText style={styles.restartButtonText}>
                  {t('activities.again')}
                </ThemedText>
              </ThemedButton>
            </View>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton style={{backgroundColor: '#f1f5eeff'}}
      onPress={() => router.back()} />
      
      <ThemedView style={styles.container}>
        <View style={styles.progressContainer}>
          <ThemedText style={styles.progressText}>
            {currentStep + 1} / {steps.length}
          </ThemedText>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentStep + 1) / steps.length) * 100}%` }
              ]} 
            />
          </View>
        </View>

        <ScrollView 
          contentContainerStyle={styles.stepContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.iconCircle, { backgroundColor: `${step.color}15` }]}>
            <Ionicons name={step.icon} size={60} color={step.color} />
          </View>
          
          {/*<View style={{flexDirection:'row',alignItems:'flex-end',paddingHorizontal:27,gap:15}}>*/}
          <ThemedText title={true} style={[styles.stepNumber,{color:step.color}]}>
            {step.number}
          </ThemedText>

          <ThemedText style={styles.stepSense}>
            {step.sense}
          </ThemedText>
         {/* </View> */}


          <ThemedText style={styles.stepPrompt}>
            {step.prompt}
          </ThemedText>

        </ScrollView>

        <View style={styles.buttonContainer}>
          <ThemedButton
            style={styles.nextButton}
            onPress={handleNext}
          >
            <ThemedText style={styles.nextButtonText}>
              {t('common.next')}
            </ThemedText>
          </ThemedButton>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    //textAlign: 'center',
    color: '#555',
    marginBottom: 30,
    marginLeft:15,
    lineHeight: 22,
    maxWidth:320,
  },
  instructionsBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    width: '100%',
  },
  instructionsTitle: {
    fontSize: 17,
    marginBottom: 8,
    color: '#2E7D32',
  },
  instructions: {
    fontSize: 14,
    color: '#4CAF50',
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#66BB6A',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '100%',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    //paddingBottom: 7,
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
    backgroundColor: '#4CAF50',
    //backgroundColor:Colors.primary,
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
  stepNumber: {
    fontSize: 55,
    color: '#66BB6A',
    marginBottom: 5,
    //marginLeft:30,
    
  },
  stepSense: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  stepPrompt: {
    fontSize: 15,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
  completionBox: {
    marginTop: 40,
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 12,
  },
  completionText: {
    fontSize: 18,
    color: '#4CAF50',
    marginTop: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
    flexGrow:1,
    justifyContent: 'center',
  },
  nextButton: {
    backgroundColor: '#66BB6A',
    paddingVertical: 16,
    borderRadius: 12,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
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
    textAlign: 'center',
  },
  completionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  completionTitle: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  completionDescription: {
    fontSize: 15,
    textAlign: 'center',
    color: '#555',
    marginBottom: 40,
    lineHeight: 22,
  },
  completionButtonContainer: {
    width: '100%',
    gap: 12,
  },
  completeButton: {
    backgroundColor: '#66BB6A',
    paddingVertical: 16,
    borderRadius: 12,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
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
    textAlign: 'center',
  },
  image: {
          width:175,
          height:170,
        },
});
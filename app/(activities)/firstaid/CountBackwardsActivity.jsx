import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import ThemedText from '../../../components/ThemedText';
import ThemedButton from '../../../components/ThemedButton';
import BackButton from '../../../components/BackButton';
import ThemedView from '../../../components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CountBackwardsActivity({ onDone }) {
  const [input, setInput] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton style={{backgroundColor: '#f1f5eeff'}} onPress={() => router.back()} />
    <ThemedView style={styles.container}>

    <View style={styles.header}>
        <ThemedText title={true} style={styles.title}>
          Count Backwards
        </ThemedText>
    </View>
    
     <View style={styles.content}>
      <ThemedText style={styles.instruction}>
        Count backwards from 100 by 7s. Enter your sequence below:
      </ThemedText>
      <TextInput
        style={styles.input}
        placeholder="100, 93, 86, ..."
        value={input}
        onChangeText={setInput}
        multiline
      />
      <ThemedButton style={styles.button} onPress={onDone}>
        <ThemedText style={styles.buttonText}>Done</ThemedText>
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
    padding: 24,
    backgroundColor: '#f1f5eeff'
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
  instruction: { 
    fontSize: 16, 
    marginBottom: 16 
},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
    marginBottom: 24,
    fontSize: 16,
  },
  button: { 
    alignSelf: 'center', 
    paddingHorizontal: 32 
},
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold' 
},
});
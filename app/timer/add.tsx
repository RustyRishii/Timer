import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTimers } from '@/context/TimerContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function AddTimerScreen() {
  const [name, setName] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [category, setCategory] = useState('');
  const [halfwayAlert, setHalfwayAlert] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { addTimer } = useTimers();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Timer name is required';
    }
    
    if (!hours && !minutes && !seconds) {
      newErrors.duration = 'Duration is required';
    }
    
    if (!category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    // Calculate total duration in seconds
    const hoursInSeconds = parseInt(hours || '0') * 3600;
    const minutesInSeconds = parseInt(minutes || '0') * 60;
    const secondsValue = parseInt(seconds || '0');
    const totalDuration = hoursInSeconds + minutesInSeconds + secondsValue;
    
    if (totalDuration <= 0) {
      setErrors({ duration: 'Duration must be greater than 0' });
      return;
    }
    
    try {
      addTimer({
        name: name.trim(),
        duration: totalDuration,
        category: category.trim(),
        halfwayAlert,
      });
      
      Alert.alert(
        "Timer Created",
        `"${name.trim()}" timer has been created successfully.`,
        [
          { 
            text: "OK", 
            onPress: () => router.push("/") 
          }
        ]
      );
    } catch (error) {
      console.error("Error creating timer:", error);
      Alert.alert(
        "Error",
        "There was a problem creating your timer. Please try again."
      );
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Add Timer' }} />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.formGroup}>
            <ThemedText style={styles.label}>Timer Name</ThemedText>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, borderColor: errors.name ? '#f44336' : '#ccc' }
              ]}
              placeholder="Enter timer name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
            {errors.name && <ThemedText style={styles.errorText}>{errors.name}</ThemedText>}
          </ThemedView>
          
          <ThemedView style={styles.formGroup}>
            <ThemedText style={styles.label}>Duration</ThemedText>
            <View style={styles.durationContainer}>
              <View style={styles.durationField}>
                <TextInput
                  style={[
                    styles.durationInput,
                    { color: colors.text, borderColor: errors.duration ? '#f44336' : '#ccc' }
                  ]}
                  placeholder="00"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={hours}
                  onChangeText={setHours}
                />
                <ThemedText style={styles.durationLabel}>Hours</ThemedText>
              </View>
              
              <View style={styles.durationField}>
                <TextInput
                  style={[
                    styles.durationInput,
                    { color: colors.text, borderColor: errors.duration ? '#f44336' : '#ccc' }
                  ]}
                  placeholder="00"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={minutes}
                  onChangeText={setMinutes}
                />
                <ThemedText style={styles.durationLabel}>Minutes</ThemedText>
              </View>
              
              <View style={styles.durationField}>
                <TextInput
                  style={[
                    styles.durationInput,
                    { color: colors.text, borderColor: errors.duration ? '#f44336' : '#ccc' }
                  ]}
                  placeholder="00"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={seconds}
                  onChangeText={setSeconds}
                />
                <ThemedText style={styles.durationLabel}>Seconds</ThemedText>
              </View>
            </View>
            {errors.duration && <ThemedText style={styles.errorText}>{errors.duration}</ThemedText>}
          </ThemedView>
          
          <ThemedView style={styles.formGroup}>
            <ThemedText style={styles.label}>Category</ThemedText>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, borderColor: errors.category ? '#f44336' : '#ccc' }
              ]}
              placeholder="Enter category (e.g., Workout, Study)"
              placeholderTextColor="#999"
              value={category}
              onChangeText={setCategory}
            />
            {errors.category && <ThemedText style={styles.errorText}>{errors.category}</ThemedText>}
          </ThemedView>
          
          <ThemedView style={styles.formGroup}>
            <View style={styles.switchContainer}>
              <ThemedText style={styles.switchLabel}>Enable halfway alert</ThemedText>
              <Switch
                value={halfwayAlert}
                onValueChange={setHalfwayAlert}
                trackColor={{ false: '#767577', true: '#0a7ea4' }}
                thumbColor="#f4f3f4"
              />
            </View>
            <ThemedText style={styles.helperText}>
              Shows an alert when the timer reaches 50% of its duration
            </ThemedText>
          </ThemedView>
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <ThemedText style={styles.submitButtonText}>Create Timer</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationField: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  durationInput: {
    height: 48,
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  durationLabel: {
    marginTop: 4,
    fontSize: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#0a7ea4',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
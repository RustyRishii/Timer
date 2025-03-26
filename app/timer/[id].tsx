import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTimers } from '@/context/TimerContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TimerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTimerById, startTimer, stopTimer, isTimerRunning, resetTimer, deleteTimer } = useTimers();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const timer = getTimerById(id);
  const [timeLeft, setTimeLeft] = useState(timer?.remainingTime || 0);
  const progress = useSharedValue(0);

  const animatedCircle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 360}deg` }],
    };
  });

  useEffect(() => {
    if (!timer) {
      router.back();
      return;
    }
    
    setTimeLeft(timer.remainingTime);
    progress.value = withTiming(1 - timer.remainingTime / timer.duration);
  }, [timer, router]);

  useEffect(() => {
    if (timer && isTimerRunning(timer.id)) {
      const interval = setInterval(() => {
        const updatedTimer = getTimerById(timer.id);
        if (updatedTimer) {
          setTimeLeft(updatedTimer.remainingTime);
          progress.value = withTiming(1 - updatedTimer.remainingTime / updatedTimer.duration);
          
          if (updatedTimer.remainingTime <= 0) {
            clearInterval(interval);
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer, isTimerRunning]);

  if (!timer) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Timer not found</ThemedText>
      </ThemedView>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleTimer = () => {
    if (isTimerRunning(timer.id)) {
      stopTimer(timer.id);
    } else {
      startTimer(timer.id);
    }
  };
  
  const handleReset = () => {
    resetTimer(timer.id);
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Timer',
      'Are you sure you want to delete this timer?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteTimer(timer.id);
            router.back();
          }
        }
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: timer.name,
          headerBackTitle: 'Back',
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={24} color="#f44336" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.timerContainer}>
        <View style={styles.timerCircle}>
          <Animated.View style={[styles.progressIndicator, animatedCircle]} /><ThemedText style={styles.timerText}>{formatTime(timeLeft)}</ThemedText>
          <ThemedText style={styles.categoryText}>{timer.category}</ThemedText>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, isTimerRunning(timer.id) ? styles.pauseButton : styles.playButton]} 
            onPress={handleToggleTimer}
          >
            <Ionicons
              name={isTimerRunning(timer.id) ? 'pause' : 'play'}
              size={32}
              color="white"
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.resetButton]} 
            onPress={handleReset}
          >
            <Ionicons
              name="refresh"
              size={32}
              color="white"
            />
          </TouchableOpacity>
        </View>
        
        <ThemedView style={styles.infoCard}>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Total Duration:</ThemedText>
            <ThemedText style={styles.infoValue}>
              {formatTime(timer.duration)}
            </ThemedText>
          </View>
          
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Halfway Alert:</ThemedText>
            <ThemedText style={styles.infoValue}>
              {timer.halfwayAlert ? 'Enabled' : 'Disabled'}
            </ThemedText>
          </View>
        </ThemedView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  deleteButton: {
    padding: 8,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  timerCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 8,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  progressIndicator: {
    position: 'absolute',
    top: -8,
    left: 115,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.light.tint,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 18,
    opacity: 0.7,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playButton: {
    backgroundColor: '#0a7ea4',
  },
  pauseButton: {
    backgroundColor: '#FFC107',
  },
  resetButton: {
    backgroundColor: '#757575',
  },
  infoCard: {
    width: '100%',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  infoLabel: {
    fontWeight: '600',
  },
  infoValue: {
    fontFamily: 'SpaceMono',
  },
});
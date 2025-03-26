import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Timer } from '@/types/Timer';
import { useTimers } from '@/context/TimerContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface TimerCardProps {
  timer: Timer;
  onPress?: () => void;
}

export function TimerCard({ timer, onPress }: TimerCardProps) {
  const { startTimer, pauseTimer, resetTimer } = useTimers();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/timer/${timer.id}`);
    }
  };

  const handleStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    startTimer(timer.id);
  };

  const handlePause = (e: React.TouchEvent) => {
    e.stopPropagation();
    pauseTimer(timer.id);
  };

  const handleReset = (e: React.TouchEvent) => {
    e.stopPropagation();
    resetTimer(timer.id);
  };

  const getStatusColor = () => {
    if (timer.remainingTime === 0) return '#4CAF50'; // Completed
    if (timer.isActive && !timer.isPaused) return '#2196F3'; // Running
    if (timer.isPaused) return '#FFC107'; // Paused
    return '#757575'; // Ready
  };

  const getStatusText = () => {
    if (timer.remainingTime === 0) return 'Completed';
    if (timer.isActive && !timer.isPaused) return 'Running';
    if (timer.isPaused) return 'Paused';
    return 'Ready';
  };

  return (
    <TouchableOpacity onPress={handleCardPress} activeOpacity={0.7}>
      <ThemedView style={styles.card}>
        <View style={styles.cardHeader}>
          <ThemedText type="defaultSemiBold" style={styles.timerName}>{timer.name}</ThemedText>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]}>
            <ThemedText style={styles.statusText}>{getStatusText()}</ThemedText>
          </View>
        </View>
        
        <View style={styles.timeContainer}>
          <ThemedText style={styles.timeText}>{formatTime(timer.remainingTime)}</ThemedText>
          <ThemedText style={styles.totalTime}>/ {formatTime(timer.duration)}</ThemedText>
        </View>
        
        <View style={styles.controls}>
          {timer.remainingTime > 0 && (
            <>
              {(!timer.isActive || timer.isPaused) ? (
                <TouchableOpacity 
                  style={[styles.controlButton, { backgroundColor: colors.tint }]} 
                  onPress={handleStart}
                >
                  <Ionicons name="play" size={20} color="#fff" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[styles.controlButton, { backgroundColor: '#FFC107' }]} 
                  onPress={handlePause}
                >
                  <Ionicons name="pause" size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </>
          )}
          
          <TouchableOpacity 
            style={[styles.controlButton, { backgroundColor: '#757575' }]} 
            onPress={handleReset}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timerName: {
    flex: 1,
    marginRight: 8,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  timeText: {
    fontSize: 24,
    fontFamily: 'SpaceMono',
  },
  totalTime: {
    marginLeft: 4,
    opacity: 0.6,
    fontFamily: 'SpaceMono',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
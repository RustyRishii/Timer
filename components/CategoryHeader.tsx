import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTimers } from '@/context/TimerContext';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface CategoryHeaderProps {
  category: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function CategoryHeader({ category, isOpen, onToggle }: CategoryHeaderProps) {
  const { startAllTimers, pauseAllTimers, resetAllTimers, timers } = useTimers();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  // Count timers in this category
  const timerCount = timers.filter(timer => timer.category === category).length;
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.headerLeft}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={isOpen ? "chevron-down" : "chevron-forward"} 
          size={20} 
          color={colors.icon}
          style={styles.icon}
        />
        <ThemedText type="defaultSemiBold">{category}</ThemedText>
        <ThemedText style={styles.count}>({timerCount})</ThemedText>
      </TouchableOpacity>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => startAllTimers(category)}
        >
          <Ionicons name="play" size={18} color={colors.tint} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => pauseAllTimers(category)}
        >
          <Ionicons name="pause" size={18} color={colors.tint} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => resetAllTimers(category)}
        >
          <Ionicons name="refresh" size={18} color={colors.tint} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  count: {
    marginLeft: 6,
    fontSize: 14,
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
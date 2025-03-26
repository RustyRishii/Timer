import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Timer } from '@/types/Timer';
import { CategoryHeader } from '@/components/CategoryHeader';
import { TimerCard } from '@/components/TimerCard';
import { useRouter } from 'expo-router';

interface TimerCategoryGroupProps {
  category: string;
  timers: Timer[];
}

export function TimerCategoryGroup({ category, timers }: TimerCategoryGroupProps) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  
  const handleTimerPress = (timer: Timer) => {
    router.push({
      pathname: '/timer/[id]',
      params: { id: timer.id }
    });
  };
  
  return (
    <View style={styles.container}>
      <CategoryHeader 
        category={category} 
        isOpen={isOpen} 
        onToggle={handleToggle} 
      />
      
      {isOpen && (
        <View style={styles.timersList}>
          {timers.map(timer => (
            <TimerCard 
              key={timer.id} 
              timer={timer} 
              onPress={() => handleTimerPress(timer)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  timersList: {
    paddingHorizontal: 8,
  },
});
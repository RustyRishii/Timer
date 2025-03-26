import AsyncStorage from '@react-native-async-storage/async-storage';
import { Timer, TimerHistory } from '@/types/Timer';

const TIMERS_STORAGE_KEY = '@timers_app/timers';
const HISTORY_STORAGE_KEY = '@timers_app/history';

// Timer Storage Functions
export const saveTimers = async (timers: Timer[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(timers));
  } catch (error) {
    console.error('Error saving timers:', error);
  }
};

export const getTimers = async (): Promise<Timer[]> => {
  try {
    const timersJson = await AsyncStorage.getItem(TIMERS_STORAGE_KEY);
    return timersJson ? JSON.parse(timersJson) : [];
  } catch (error) {
    console.error('Error getting timers:', error);
    return [];
  }
};

// History Storage Functions
export const saveHistory = async (history: TimerHistory[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving history:', error);
  }
};

export const getHistory = async (): Promise<TimerHistory[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};

// Add a completed timer to history
export const addTimerToHistory = async (timer: Timer): Promise<void> => {
  try {
    const history = await getHistory();
    const newHistoryEntry: TimerHistory = {
      id: Date.now().toString(),
      timerId: timer.id,
      timerName: timer.name,
      category: timer.category,
      duration: timer.duration,
      completedAt: Date.now(),
    };
    
    history.push(newHistoryEntry);
    await saveHistory(history);
  } catch (error) {
    console.error('Error adding timer to history:', error);
  }
};

// Helper function to get unique categories from timers
export const getCategories = async (): Promise<string[]> => {
  try {
    const timers = await getTimers();
    const categories = new Set(timers.map(timer => timer.category));
    return Array.from(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};
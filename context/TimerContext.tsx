import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { Timer, TimerHistory } from '@/types/Timer';
import { saveTimers, getTimers, addTimerToHistory, getHistory, saveHistory } from '@/utils/storage';

interface TimerContextType {
  timers: Timer[];
  history: TimerHistory[];
  addTimer: (timer: Omit<Timer, 'id' | 'isActive' | 'isPaused' | 'remainingTime' | 'lastStartedAt' | 'completedAt'>) => void;
  updateTimer: (timer: Timer) => void;
  deleteTimer: (id: string) => void;
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  resetTimer: (id: string) => void;
  startAllTimers: (category: string) => void;
  pauseAllTimers: (category: string) => void;
  resetAllTimers: (category: string) => void;
  clearHistory: () => void;
  isLoading: boolean;
  getTimerById: (id: string) => Timer | undefined;
  isTimerRunning: (id: string) => boolean;
  stopTimer: (id: string) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimers = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimers must be used within a TimerProvider');
  }
  return context;
};

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [history, setHistory] = useState<TimerHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load timers and history from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedTimers = await getTimers();
        const storedHistory = await getHistory();
        
        setTimers(storedTimers);
        setHistory(storedHistory);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Timer tick effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => {
        let updated = false;
        const newTimers = prevTimers.map(timer => {
          if (timer.isActive && !timer.isPaused) {
            const now = Date.now();
            const elapsed = timer.lastStartedAt ? Math.floor((now - timer.lastStartedAt) / 1000) : 0;
            const newRemainingTime = Math.max(0, timer.remainingTime - elapsed);
            
            // Check if timer just completed
            if (timer.remainingTime > 0 && newRemainingTime === 0) {
              // Timer just completed
              addTimerToHistory(timer);
              
              // Show alert
              Alert.alert(
                'Timer Completed!',
                `"${timer.name}" has finished.`,
                [{ text: 'OK' }]
              );
              
              return {
                ...timer,
                isActive: false,
                isPaused: false,
                remainingTime: 0,
                lastStartedAt: undefined,
              };
            }
            
            // Check for halfway alert
            if (timer.halfwayAlert && 
                timer.remainingTime > timer.duration / 2 && 
                newRemainingTime <= timer.duration / 2) {
              Alert.alert(
                'Halfway Point!',
                `"${timer.name}" is halfway done.`,
                [{ text: 'OK' }]
              );
            }
            
            updated = true;
            return {
              ...timer,
              remainingTime: newRemainingTime,
              lastStartedAt: now,
              isActive: newRemainingTime > 0,
            };
          }
          return timer;
        });
        
        if (updated) {
          saveTimers(newTimers);
          return newTimers;
        }
        return prevTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addTimer = (timerData: Omit<Timer, 'id' | 'isActive' | 'isPaused' | 'remainingTime' | 'lastStartedAt' | 'completedAt'>) => {
    const newTimer: Timer = {
      id: Date.now().toString(),
      ...timerData,
      isActive: false,
      isPaused: false,
      remainingTime: timerData.duration,
      completedAt: [],
    };

    setTimers(prevTimers => {
      const updatedTimers = [...prevTimers, newTimer];
      saveTimers(updatedTimers);
      return updatedTimers;
    });
  };

  const updateTimer = (updatedTimer: Timer) => {
    setTimers(prevTimers => {
      const updatedTimers = prevTimers.map(timer => 
        timer.id === updatedTimer.id ? updatedTimer : timer
      );
      saveTimers(updatedTimers);
      return updatedTimers;
    });
  };

  const deleteTimer = (id: string) => {
    setTimers(prevTimers => {
      const updatedTimers = prevTimers.filter(timer => timer.id !== id);
      saveTimers(updatedTimers);
      return updatedTimers;
    });
  };

  const startTimer = (id: string) => {
    setTimers(prevTimers => {
      const updatedTimers = prevTimers.map(timer => {
        if (timer.id === id) {
          return {
            ...timer,
            isActive: true,
            isPaused: false,
            lastStartedAt: Date.now(),
          };
        }
        return timer;
      });
      saveTimers(updatedTimers);
      return updatedTimers;
    });
  };

  const pauseTimer = (id: string) => {
    setTimers(prevTimers => {
      const updatedTimers = prevTimers.map(timer => {
        if (timer.id === id && timer.isActive) {
          return {
            ...timer,
            isPaused: true,
          };
        }
        return timer;
      });
      saveTimers(updatedTimers);
      return updatedTimers;
    });
  };

  const resetTimer = (id: string) => {
    setTimers(prevTimers => {
      const updatedTimers = prevTimers.map(timer => {
        if (timer.id === id) {
          return {
            ...timer,
            isActive: false,
            isPaused: false,
            remainingTime: timer.duration,
            lastStartedAt: undefined,
          };
        }
        return timer;
      });
      saveTimers(updatedTimers);
      return updatedTimers;
    });
  };

  const startAllTimers = (category: string) => {
    setTimers(prevTimers => {
      const now = Date.now();
      const updatedTimers = prevTimers.map(timer => {
        if (timer.category === category && timer.remainingTime > 0) {
          return {
            ...timer,
            isActive: true,
            isPaused: false,
            lastStartedAt: now,
          };
        }
        return timer;
      });
      saveTimers(updatedTimers);
      return updatedTimers;
    });
  };

  const pauseAllTimers = (category: string) => {
    setTimers(prevTimers => {
      const updatedTimers = prevTimers.map(timer => {
        if (timer.category === category && timer.isActive) {
          return {
            ...timer,
            isPaused: true,
          };
        }
        return timer;
      });
      saveTimers(updatedTimers);
      return updatedTimers;
    });
  };

  const resetAllTimers = (category: string) => {
    setTimers(prevTimers => {
      const updatedTimers = prevTimers.map(timer => {
        if (timer.category === category) {
          return {
            ...timer,
            isActive: false,
            isPaused: false,
            remainingTime: timer.duration,
            lastStartedAt: undefined,
          };
        }
        return timer;
      });
      saveTimers(updatedTimers);
      return updatedTimers;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  // New functions for timer/[id].tsx
  const getTimerById = (id: string) => {
    return timers.find(timer => timer.id === id);
  };

  const isTimerRunning = (id: string) => {
    const timer = timers.find(t => t.id === id);
    return timer ? timer.isActive && !timer.isPaused : false;
  };

  const stopTimer = (id: string) => {
    setTimers(prevTimers => {
      const now = Date.now();
      const updatedTimers = prevTimers.map(timer => {
        if (timer.id === id) {
          // Calculate elapsed time since last start
          const elapsed = timer.lastStartedAt ? Math.floor((now - timer.lastStartedAt) / 1000) : 0;
          const newRemainingTime = Math.max(0, timer.remainingTime - elapsed);
          
          return {
            ...timer,
            isActive: false,
            isPaused: false,
            remainingTime: newRemainingTime,
            lastStartedAt: undefined,
          };
        }
        return timer;
      });
      saveTimers(updatedTimers);
      return updatedTimers;
    });
  };

  return (
    <TimerContext.Provider
      value={{
        timers,
        history,
        addTimer,
        updateTimer,
        deleteTimer,
        startTimer,
        pauseTimer,
        resetTimer,
        startAllTimers,
        pauseAllTimers,
        resetAllTimers,
        clearHistory,
        isLoading,
        getTimerById,
        isTimerRunning,
        stopTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
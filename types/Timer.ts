export interface Timer {
  id: string;
  name: string;
  duration: number; // in seconds
  category: string;
  isActive: boolean;
  isPaused: boolean;
  remainingTime: number;
  lastStartedAt?: number;
  completedAt?: number[];
  halfwayAlert?: boolean;
}

export interface TimerHistory {
  id: string;
  timerId: string;
  timerName: string;
  category: string;
  duration: number;
  completedAt: number;
}
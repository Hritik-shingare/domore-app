export type TabType = 'home' | 'skills' | 'leaderboard' | 'profile';

export interface DailyActivity {
  score: number;
  maxScore: number;
  steps: number;
  stepGoal: number;
  hasRunToday: boolean;
  runDistanceKm: number;
  caloriesBurned: number;
  calorieGoal: number;
  streakDays: number;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Fitness' | 'Coding' | 'Mindset' | 'Language' | 'Productivity';
  level: number;
  progressPercent: number; // 0 - 100
  hoursInvested: number;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  weeklyScore: number;
  isCurrentUser: boolean;
}

export interface UserProfile {
  name: string;
  username: string;
  level: number;
  overallScore: number;
  weeklyScore: number;
  rank: number;
  daysActive: number;
  completedGoals: number;
}

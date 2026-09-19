import { DailyActivity, Skill, LeaderboardUser, UserProfile } from '../types';

export const mockDailyActivity: DailyActivity = {
  score: 84,
  maxScore: 100,
  steps: 8420,
  stepGoal: 10000,
  hasRunToday: true,
  runDistanceKm: 3.2,
  caloriesBurned: 520,
  calorieGoal: 650,
  streakDays: 7,
};

export const mockSkills: Skill[] = [
  {
    id: '1',
    name: 'React Native & Mobile',
    category: 'Coding',
    level: 4,
    progressPercent: 75,
    hoursInvested: 42,
  },
  {
    id: '2',
    name: 'Distance Running',
    category: 'Fitness',
    level: 3,
    progressPercent: 60,
    hoursInvested: 28,
  },
  {
    id: '3',
    name: 'Mindfulness & Meditation',
    category: 'Mindset',
    level: 2,
    progressPercent: 40,
    hoursInvested: 14,
  },
  {
    id: '4',
    name: 'Spanish Fluency',
    category: 'Language',
    level: 1,
    progressPercent: 30,
    hoursInvested: 9,
  },
  {
    id: '5',
    name: 'Deep Work Discipline',
    category: 'Productivity',
    level: 5,
    progressPercent: 90,
    hoursInvested: 65,
  },
];

export const mockLeaderboard: LeaderboardUser[] = [
  { rank: 1, id: 'u1', name: 'Alex Vance', avatar: '🥇', weeklyScore: 680, isCurrentUser: false },
  { rank: 2, id: 'u2', name: 'Hritik (You)', avatar: '⚡', weeklyScore: 615, isCurrentUser: true },
  { rank: 3, id: 'u3', name: 'Samantha Wu', avatar: '🥉', weeklyScore: 590, isCurrentUser: false },
  { rank: 4, id: 'u4', name: 'Marcus Miller', avatar: '🏃', weeklyScore: 540, isCurrentUser: false },
  { rank: 5, id: 'u5', name: 'Elena Rostov', avatar: '🧠', weeklyScore: 512, isCurrentUser: false },
  { rank: 6, id: 'u6', name: 'David Park', avatar: '💻', weeklyScore: 485, isCurrentUser: false },
  { rank: 7, id: 'u7', name: 'Priya Sharma', avatar: '🔥', weeklyScore: 460, isCurrentUser: false },
];

export const mockProfile: UserProfile = {
  name: 'Hritik Shingare',
  username: '@hritik',
  level: 14,
  overallScore: 3420,
  weeklyScore: 615,
  rank: 2,
  daysActive: 48,
  completedGoals: 124,
};

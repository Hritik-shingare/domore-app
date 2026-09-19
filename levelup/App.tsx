import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Session } from '@supabase/supabase-js';

import { Header } from './src/components/Header';
import { BottomNav } from './src/components/BottomNav';
import { HomeScreen } from './src/screens/HomeScreen';
import { SkillsScreen } from './src/screens/SkillsScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { SignupScreen } from './src/screens/SignupScreen';

import { supabase } from './src/lib/supabase';
import {
  createSkill,
  fetchLeaderboard,
  fetchTodayActivity,
  fetchUserProfile,
  fetchUserSkills,
} from './src/services/dataService';
import { DailyActivity, LeaderboardUser, Skill, TabType, UserProfile } from './src/types';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  // Authenticated user's live data state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyActivity, setDailyActivity] = useState<DailyActivity | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [, setLoadingData] = useState(false);

  // Track if component is mounted to avoid setting state on unmounted tree
  const isMountedRef = useRef(true);

  const initAuth = async () => {
    try {
      setLoadingSession(true);
      setInitError(null);

      // Create a 5-second safety timeout so initialization can NEVER hang indefinitely
      const timeoutPromise = new Promise<{ data: { session: null }; error: Error }>((_, reject) =>
        setTimeout(() => reject(new Error('Session check timed out. Proceeding to login.')), 5000)
      );

      const sessionPromise = supabase.auth.getSession();
      const result = await Promise.race([sessionPromise, timeoutPromise]);

      if (isMountedRef.current) {
        if ('error' in result && result.error) {
          console.warn('Supabase getSession error:', result.error.message);
          setSession(null);
        } else if ('data' in result) {
          setSession(result.data.session);
        }
      }
    } catch (err: any) {
      console.warn('Auth initialization warning:', err?.message || err);
      if (isMountedRef.current) {
        setSession(null);
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingSession(false);
      }
    }
  };

  const loadUserData = async (userId: string, userMeta?: any) => {
    try {
      setLoadingData(true);
      console.log('[Auth] Loading Supabase data for authenticated user UUID:', userId);

      const [fetchedProfile, fetchedActivity, fetchedSkills] = await Promise.all([
        fetchUserProfile(userId).catch((err) => {
          console.warn('[DataService] Profile fetch warning:', err);
          return {
            name: userMeta?.display_name || userMeta?.username || 'LevelUp User',
            username: `@${userMeta?.username || 'user'}`,
            level: 1,
            overallScore: 0,
            weeklyScore: 0,
            rank: 1,
            daysActive: 0,
            completedGoals: 0,
          };
        }),
        fetchTodayActivity(userId).catch((err) => {
          console.warn('[DataService] Activity fetch warning:', err);
          return {
            score: 0,
            maxScore: 100,
            steps: 0,
            stepGoal: 8000,
            hasRunToday: false,
            runDistanceKm: 0,
            caloriesBurned: 0,
            calorieGoal: 500,
            streakDays: 0,
          };
        }),
        fetchUserSkills(userId).catch((err) => {
          console.warn('[DataService] Skills fetch warning:', err);
          return [];
        }),
      ]);

      if (isMountedRef.current) {
        setUserProfile(fetchedProfile);
        setDailyActivity(fetchedActivity);
        setSkills(fetchedSkills);

        const fetchedLeaderboard = await fetchLeaderboard(userId, fetchedProfile).catch(() => []);
        if (isMountedRef.current) {
          setLeaderboard(fetchedLeaderboard);
        }
      }
    } catch (err) {
      console.warn('[DataService] Data load error:', err);
    } finally {
      if (isMountedRef.current) {
        setLoadingData(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    // 1. Initialize session with timeout safety
    initAuth();

    // 2. Listen to auth state transitions
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMountedRef.current) {
        setSession(newSession);
        setLoadingSession(false);
      }
    });

    return () => {
      isMountedRef.current = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Fetch or reset user data when the authenticated user session changes
  useEffect(() => {
    if (session?.user?.id) {
      loadUserData(session.user.id, session.user.user_metadata);
    } else {
      // Clear all user data immediately upon sign out to ensure account isolation
      setUserProfile(null);
      setDailyActivity(null);
      setSkills([]);
      setLeaderboard([]);
    }
  }, [session?.user?.id]);

  if (loadingSession) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="light" />
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Starting LevelUp...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (initError) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="light" />
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Connection Notice</Text>
          <Text style={styles.errorText}>{initError}</Text>
          <Pressable style={styles.retryButton} onPress={initAuth}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
          <Pressable
            style={styles.continueButton}
            onPress={() => {
              setInitError(null);
              setSession(null);
            }}
          >
            <Text style={styles.continueButtonText}>Continue to Login</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        {authMode === 'login' ? (
          <LoginScreen onSwitchToSignup={() => setAuthMode('signup')} />
        ) : (
          <SignupScreen onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </SafeAreaView>
    );
  }

  // Active user data fallbacks scoped to current session user
  const currentProfile: UserProfile = userProfile || {
    name: session.user.user_metadata?.display_name || session.user.user_metadata?.username || 'LevelUp User',
    username: `@${session.user.user_metadata?.username || 'user'}`,
    level: 1,
    overallScore: 0,
    weeklyScore: 0,
    rank: 1,
    daysActive: 0,
    completedGoals: 0,
  };

  const currentActivity: DailyActivity = dailyActivity || {
    score: 0,
    maxScore: 100,
    steps: 0,
    stepGoal: 8000,
    hasRunToday: false,
    runDistanceKm: 0,
    caloriesBurned: 0,
    calorieGoal: 500,
    streakDays: 0,
  };

  const handleAddSkill = async (name: string, category: Skill['category']) => {
    if (!session?.user?.id) return;
    const newSkill = await createSkill(session.user.id, name, category);
    if (newSkill) {
      setSkills((prev) => [newSkill, ...prev]);
    }
  };

  const renderCurrentScreen = () => {
    switch (currentTab) {
      case 'home':
        return <HomeScreen activity={currentActivity} />;
      case 'skills':
        return <SkillsScreen skills={skills} onAddSkill={handleAddSkill} />;
      case 'leaderboard':
        return <LeaderboardScreen users={leaderboard} />;
      case 'profile':
        return <ProfileScreen profile={currentProfile} />;
      default:
        return <HomeScreen activity={currentActivity} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <Header level={currentProfile.level} streak={currentActivity.streakDays} />
      <View style={styles.screenContainer}>
        {renderCurrentScreen()}
      </View>
      <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#090D16',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingBox: {
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  errorBox: {
    backgroundColor: '#131D31',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  errorTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  retryButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
  continueButton: {
    paddingVertical: 8,
  },
  continueButtonText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#090D16',
  },
});



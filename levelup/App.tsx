import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';
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
  mockDailyActivity,
  mockSkills,
  mockLeaderboard,
  mockProfile,
} from './src/data/mockData';
import { TabType } from './src/types';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  useEffect(() => {
    // 1. Fetch initial session from storage
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setLoadingSession(false);
    });

    // 2. Listen to auth state transitions
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoadingSession(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loadingSession) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#10B981" />
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

  const renderCurrentScreen = () => {
    switch (currentTab) {
      case 'home':
        return <HomeScreen activity={mockDailyActivity} />;
      case 'skills':
        return <SkillsScreen skills={mockSkills} />;
      case 'leaderboard':
        return <LeaderboardScreen users={mockLeaderboard} />;
      case 'profile':
        return <ProfileScreen profile={mockProfile} />;
      default:
        return <HomeScreen activity={mockDailyActivity} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <Header level={mockProfile.level} streak={mockDailyActivity.streakDays} />
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
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#090D16',
  },
});


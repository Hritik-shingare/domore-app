import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Header } from './src/components/Header';
import { BottomNav } from './src/components/BottomNav';
import { HomeScreen } from './src/screens/HomeScreen';
import { SkillsScreen } from './src/screens/SkillsScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

import {
  mockDailyActivity,
  mockSkills,
  mockLeaderboard,
  mockProfile,
} from './src/data/mockData';
import { TabType } from './src/types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');

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
  screenContainer: {
    flex: 1,
    backgroundColor: '#090D16',
  },
});

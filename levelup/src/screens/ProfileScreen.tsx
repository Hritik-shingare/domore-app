import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';

interface ProfileScreenProps {
  profile: UserProfile;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ profile }) => {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    // The auth listener in App.tsx will handle switching to the login screen.
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarIcon}>⚡</Text>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.username}>{profile.username}</Text>

        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>LEVEL {profile.level} ACHIEVER</Text>
        </View>
      </View>

      {/* Main Score Highlights */}
      <View style={styles.scoreRow}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>OVERALL SCORE</Text>
          <Text style={styles.scoreNumber}>{profile.overallScore.toLocaleString()}</Text>
          <Text style={styles.scoreSub}>All-time points</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>WEEKLY SCORE</Text>
          <Text style={[styles.scoreNumber, { color: '#10B981' }]}>{profile.weeklyScore}</Text>
          <Text style={styles.scoreSub}>Rank #{profile.rank} this week</Text>
        </View>
      </View>

      {/* Lifetime Stats */}
      <Text style={styles.sectionTitle}>Journey Milestones</Text>
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🗓️</Text>
          <View style={styles.statTexts}>
            <Text style={styles.statValue}>{profile.daysActive} Days</Text>
            <Text style={styles.statDesc}>Active Self-Improvement Days</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🎯</Text>
          <View style={styles.statTexts}>
            <Text style={styles.statValue}>{profile.completedGoals} Goals</Text>
            <Text style={styles.statDesc}>Milestones & Habits Completed</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🏆</Text>
          <View style={styles.statTexts}>
            <Text style={styles.statValue}>Top 5 Rank</Text>
            <Text style={styles.statDesc}>Best Weekly Finish</Text>
          </View>
        </View>
      </View>

      {/* Account / Sync Status Section */}
      <Text style={styles.sectionTitle}>Sync & Companion Status</Text>
      <View style={styles.syncCard}>
        <View style={styles.syncRow}>
          <Text style={styles.syncLabel}>LevelUp Website Sync</Text>
          <View style={styles.syncBadge}>
            <Text style={styles.syncBadgeText}>Pending Phase 3</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.syncRow}>
          <Text style={styles.syncLabel}>Android Health Connect</Text>
          <View style={styles.syncBadge}>
            <Text style={styles.syncBadgeText}>Pending Phase 4</Text>
          </View>
        </View>
      </View>

      {/* Logout */}
      <Pressable
        style={[styles.logoutButton, loggingOut && styles.logoutButtonDisabled]}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <ActivityIndicator color="#EF4444" size="small" />
        ) : (
          <Text style={styles.logoutText}>Sign Out</Text>
        )}
      </Pressable>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#131D31',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E293B',
    borderWidth: 3,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarIcon: {
    fontSize: 36,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  username: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 12,
  },
  levelBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  levelText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  scoreBox: {
    flex: 1,
    backgroundColor: '#131D31',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 6,
  },
  scoreNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  scoreSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F1F5F9',
    marginBottom: 12,
  },
  statsCard: {
    backgroundColor: '#131D31',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statIcon: {
    fontSize: 22,
    marginRight: 14,
  },
  statTexts: {
    flex: 1,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  statDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  syncCard: {
    backgroundColor: '#131D31',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  syncRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  syncLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  syncBadge: {
    backgroundColor: '#1E293B',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  syncBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonDisabled: {
    opacity: 0.5,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
});


import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { DailyActivity } from '../types';
import { supabase } from '../lib/supabase';

interface HomeScreenProps {
  activity: DailyActivity;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ activity }) => {
  const stepProgress = Math.min(100, Math.round((activity.steps / activity.stepGoal) * 100));
  const calorieProgress = Math.min(100, Math.round((activity.caloriesBurned / activity.calorieGoal) * 100));

  // Phase 3 Step 1: Verify Supabase connection on mount.
  // Queries a known public table. Logs success or error to the console.
  // No UI is changed. This block will be replaced by real data fetching later.
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const { error } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);

        if (error) {
          // An error here is still a successful connection — it means the
          // request reached Supabase (e.g., RLS blocked it, table not found, etc.)
          console.log('[Supabase] Connected. Query response:', error.message);
        } else {
          console.log('[Supabase] Connected successfully ✅');
        }
      } catch (err) {
        console.error('[Supabase] Connection failed ❌', err);
      }
    };

    checkSupabaseConnection();
  }, []);


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* LevelUp Score Card */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreHeader}>TODAY'S LEVELUP SCORE</Text>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreValue}>{activity.score}</Text>
          <Text style={styles.scoreMax}>/ {activity.maxScore}</Text>
        </View>
        <View style={styles.scorePill}>
          <Text style={styles.scoreStatus}>🔥 Great Momentum — Top 15%</Text>
        </View>
        <Text style={styles.scoreSubtext}>Calculated from fitness, skills, and daily activity habits.</Text>
      </View>

      {/* Daily Stats Grid */}
      <Text style={styles.sectionTitle}>Today's Physical Activity</Text>
      <View style={styles.grid}>
        {/* Steps Card */}
        <View style={styles.statCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>👟</Text>
            <Text style={styles.cardBadge}>{stepProgress}%</Text>
          </View>
          <Text style={styles.statNumber}>{activity.steps.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Steps Walked</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${stepProgress}%`, backgroundColor: '#38BDF8' }]} />
          </View>
          <Text style={styles.goalText}>Goal: {activity.stepGoal.toLocaleString()}</Text>
        </View>

        {/* Calories Card */}
        <View style={styles.statCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🔥</Text>
            <Text style={styles.cardBadge}>{calorieProgress}%</Text>
          </View>
          <Text style={styles.statNumber}>{activity.caloriesBurned}</Text>
          <Text style={styles.statLabel}>Active Calories</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${calorieProgress}%`, backgroundColor: '#F97316' }]} />
          </View>
          <Text style={styles.goalText}>Goal: {activity.calorieGoal} kcal</Text>
        </View>
      </View>

      {/* Running Card */}
      <View style={styles.runCard}>
        <View style={styles.runHeader}>
          <View style={styles.runIconWrapper}>
            <Text style={styles.runIcon}>🏃‍♂️</Text>
          </View>
          <View style={styles.runInfo}>
            <Text style={styles.runTitle}>Daily Run</Text>
            <Text style={styles.runSubtitle}>
              {activity.hasRunToday
                ? `Completed ${activity.runDistanceKm} km today`
                : 'No run recorded yet today'}
            </Text>
          </View>
          <View style={[styles.statusTag, activity.hasRunToday ? styles.tagComplete : styles.tagPending]}>
            <Text style={[styles.statusTagText, activity.hasRunToday ? styles.textComplete : styles.textPending]}>
              {activity.hasRunToday ? 'COMPLETED' : 'PENDING'}
            </Text>
          </View>
        </View>
      </View>

      {/* Daily Habit Checklist */}
      <Text style={styles.sectionTitle}>Daily Objectives</Text>
      <View style={styles.checklistCard}>
        <View style={styles.checkItem}>
          <Text style={styles.checkIcon}>✅</Text>
          <View style={styles.checkTexts}>
            <Text style={styles.checkTitle}>Hit 8,000+ Steps</Text>
            <Text style={styles.checkDesc}>Currently at 8,420 steps</Text>
          </View>
          <Text style={styles.pointsBadge}>+25 pts</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.checkItem}>
          <Text style={styles.checkIcon}>✅</Text>
          <View style={styles.checkTexts}>
            <Text style={styles.checkTitle}>Morning Run</Text>
            <Text style={styles.checkDesc}>3.2 km recorded</Text>
          </View>
          <Text style={styles.pointsBadge}>+35 pts</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.checkItem}>
          <Text style={styles.checkIcon}>⏳</Text>
          <View style={styles.checkTexts}>
            <Text style={styles.checkTitle}>Burn 650 Calories</Text>
            <Text style={styles.checkDesc}>130 kcal remaining</Text>
          </View>
          <Text style={[styles.pointsBadge, styles.pendingPoints]}>+20 pts</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.checkItem}>
          <Text style={styles.checkIcon}>⏳</Text>
          <View style={styles.checkTexts}>
            <Text style={styles.checkTitle}>Log Nutrition</Text>
            <Text style={styles.checkDesc}>1 meal logged</Text>
          </View>
          <Text style={[styles.pointsBadge, styles.pendingPoints]}>+20 pts</Text>
        </View>
      </View>

      {/* Note for Phase 2 */}
      <View style={styles.phaseNotice}>
        <Text style={styles.phaseNoticeTitle}>ℹ️ Phase 2 UI Demonstration</Text>
        <Text style={styles.phaseNoticeText}>
          Displaying static demo values. Real Android hardware step counting and Health Connect integration will be connected in upcoming phases.
        </Text>
      </View>
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
  scoreCard: {
    backgroundColor: '#131D31',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 20,
  },
  scoreHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  scoreCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#0F172A',
    borderWidth: 6,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  scoreMax: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  scorePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 10,
  },
  scoreStatus: {
    color: '#34D399',
    fontSize: 13,
    fontWeight: '700',
  },
  scoreSubtext: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F1F5F9',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#131D31',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 22,
  },
  cardBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    backgroundColor: '#1E293B',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 12,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  runCard: {
    backgroundColor: '#131D31',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 20,
  },
  runHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  runIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  runIcon: {
    fontSize: 22,
  },
  runInfo: {
    flex: 1,
  },
  runTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  runSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  statusTag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  tagComplete: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  tagPending: {
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  textComplete: {
    color: '#34D399',
  },
  textPending: {
    color: '#94A3B8',
  },
  checklistCard: {
    backgroundColor: '#131D31',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 20,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  checkTexts: {
    flex: 1,
  },
  checkTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  checkDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  pointsBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  pendingPoints: {
    color: '#94A3B8',
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 4,
  },
  phaseNotice: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  phaseNoticeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 4,
  },
  phaseNoticeText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
});

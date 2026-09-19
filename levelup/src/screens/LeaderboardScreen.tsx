import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LeaderboardUser } from '../types';

interface LeaderboardScreenProps {
  users: LeaderboardUser[];
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ users }) => {
  const topThree = users.slice(0, 3);
  const remainingUsers = users.slice(3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerBox}>
        <Text style={styles.title}>Weekly Leaderboard</Text>
        <Text style={styles.subtitle}>Resets every Sunday at midnight</Text>
      </View>

      {/* Podium for Top 3 */}
      <View style={styles.podiumContainer}>
        {/* 2nd Place */}
        {topThree[1] && (
          <View style={[styles.podiumColumn, styles.podiumSecond]}>
            <Text style={styles.podiumAvatar}>{topThree[1].avatar}</Text>
            <Text style={styles.podiumName} numberOfLines={1}>{topThree[1].name}</Text>
            <Text style={styles.podiumScore}>{topThree[1].weeklyScore} pts</Text>
            <View style={[styles.podiumBlock, styles.podiumBlockSecond]}>
              <Text style={styles.podiumRank}>2</Text>
            </View>
          </View>
        )}

        {/* 1st Place */}
        {topThree[0] && (
          <View style={[styles.podiumColumn, styles.podiumFirst]}>
            <View style={styles.crownWrapper}>
              <Text style={styles.crown}>👑</Text>
            </View>
            <Text style={styles.podiumAvatar}>{topThree[0].avatar}</Text>
            <Text style={styles.podiumName} numberOfLines={1}>{topThree[0].name}</Text>
            <Text style={styles.podiumScore}>{topThree[0].weeklyScore} pts</Text>
            <View style={[styles.podiumBlock, styles.podiumBlockFirst]}>
              <Text style={styles.podiumRankFirst}>1</Text>
            </View>
          </View>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <View style={[styles.podiumColumn, styles.podiumThird]}>
            <Text style={styles.podiumAvatar}>{topThree[2].avatar}</Text>
            <Text style={styles.podiumName} numberOfLines={1}>{topThree[2].name}</Text>
            <Text style={styles.podiumScore}>{topThree[2].weeklyScore} pts</Text>
            <View style={[styles.podiumBlock, styles.podiumBlockThird]}>
              <Text style={styles.podiumRank}>3</Text>
            </View>
          </View>
        )}
      </View>

      {/* User Current Position Banner */}
      <View style={styles.myRankBanner}>
        <Text style={styles.myRankText}>⚡ You are currently ranked <Text style={styles.myRankHighlight}>#2</Text> this week!</Text>
      </View>

      {/* List of Remaining Rankings */}
      <Text style={styles.listHeader}>Top Contenders</Text>
      <View style={styles.listCard}>
        {remainingUsers.map((user) => (
          <View
            key={user.id}
            style={[styles.listItem, user.isCurrentUser && styles.currentUserItem]}
          >
            <Text style={styles.rankNumber}>#{user.rank}</Text>
            <Text style={styles.userAvatar}>{user.avatar}</Text>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, user.isCurrentUser && styles.currentUserName]}>
                {user.name}
              </Text>
              <Text style={styles.userStatus}>Active streak</Text>
            </View>
            <Text style={styles.userScore}>{user.weeklyScore} pts</Text>
          </View>
        ))}
      </View>

      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>ℹ️ Placeholder Competition Data</Text>
        <Text style={styles.noticeText}>
          Real Supabase leaderboard rankings from the website and community will be linked during the backend integration phase.
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
  headerBox: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  podiumColumn: {
    flex: 1,
    alignItems: 'center',
  },
  podiumFirst: {
    zIndex: 2,
  },
  podiumSecond: {
    zIndex: 1,
  },
  podiumThird: {
    zIndex: 1,
  },
  crownWrapper: {
    marginBottom: -4,
  },
  crown: {
    fontSize: 22,
  },
  podiumAvatar: {
    fontSize: 26,
    marginBottom: 4,
  },
  podiumName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F1F5F9',
    textAlign: 'center',
    marginBottom: 2,
  },
  podiumScore: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
    marginBottom: 8,
  },
  podiumBlock: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  podiumBlockFirst: {
    height: 90,
    backgroundColor: '#1E293B',
    borderColor: '#F59E0B',
    borderWidth: 2,
  },
  podiumBlockSecond: {
    height: 70,
    backgroundColor: '#131D31',
  },
  podiumBlockThird: {
    height: 55,
    backgroundColor: '#131D31',
  },
  podiumRank: {
    fontSize: 20,
    fontWeight: '900',
    color: '#94A3B8',
  },
  podiumRankFirst: {
    fontSize: 26,
    fontWeight: '900',
    color: '#F59E0B',
  },
  myRankBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginVertical: 12,
  },
  myRankText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  myRankHighlight: {
    color: '#34D399',
    fontWeight: '800',
  },
  listHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 8,
    marginBottom: 10,
  },
  listCard: {
    backgroundColor: '#131D31',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    overflow: 'hidden',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  currentUserItem: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  rankNumber: {
    width: 32,
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  userAvatar: {
    fontSize: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  currentUserName: {
    color: '#34D399',
  },
  userStatus: {
    fontSize: 11,
    color: '#64748B',
  },
  userScore: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  noticeCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  noticeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface HeaderProps {
  level: number;
  streak: number;
}

export const Header: React.FC<HeaderProps> = ({ level, streak }) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.logo}>LEVEL<Text style={styles.logoAccent}>UP</Text></Text>
        <Text style={styles.tagline}>Self-Improvement Companion</Text>
      </View>
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>🔥</Text>
          <Text style={styles.badgeText}>{streak}d</Text>
        </View>
        <View style={[styles.badge, styles.levelBadge]}>
          <Text style={styles.levelText}>LVL {level}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  logo: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 1.5,
  },
  logoAccent: {
    color: '#10B981',
  },
  tagline: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  badgeText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  levelBadge: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

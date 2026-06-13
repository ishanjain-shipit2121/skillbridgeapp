import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../constants/theme';

export default function ProfileScreen() {
  const initials = 'SB';
  const name = 'SkillBridge User';
  const targetRole = 'Full Stack Developer';
  const roadmapProgress = 35;
  const dsaSolved = 42;
  const streakDays = 7;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.roleBadge}>
          <Ionicons name="briefcase-outline" size={14} color={Colors.accent} />
          <Text style={styles.roleText}>{targetRole}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="map-outline" size={28} color={Colors.accent} />
          <Text style={styles.statValue}>{roadmapProgress}%</Text>
          <Text style={styles.statLabel}>Roadmap</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${roadmapProgress}%` }]} />
          </View>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle-outline" size={28} color={Colors.success} />
          <Text style={styles.statValue}>{dsaSolved}</Text>
          <Text style={styles.statLabel}>DSA Solved</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="flame-outline" size={28} color={Colors.warning} />
          <Text style={styles.statValue}>{streakDays}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingBottom: 40 },
  avatarContainer: { alignItems: 'center', marginBottom: Spacing.xl },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: { color: '#fff', fontSize: FontSizes.heading, fontWeight: 'bold' },
  name: { color: Colors.text, fontSize: FontSizes.title, fontWeight: 'bold' },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.accent + '20',
    gap: 6,
  },
  roleText: { color: Colors.accent, fontSize: 14, fontWeight: '600' },
  statsContainer: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statValue: { color: Colors.text, fontSize: FontSizes.heading, fontWeight: 'bold', marginTop: Spacing.sm },
  statLabel: { color: Colors.textMuted, fontSize: 14, marginTop: 4 },
  progressBar: { width: '100%', height: 4, backgroundColor: Colors.border, borderRadius: 2, marginTop: Spacing.sm },
  progressFill: { height: '100%', backgroundColor: Colors.accent, borderRadius: 2 },
});

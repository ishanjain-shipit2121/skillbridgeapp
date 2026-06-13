import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../constants/theme';

type Props = { navigation: any };

export default function ProfileScreen({ navigation }: Props) {
  const initials = 'SB';
  const name = 'SkillBridge User';
  const targetRole = 'Full Stack Developer';
  const roadmapProgress = 35;
  const dsaSolved = 42;
  const streakDays = 7;

  const stats = [
    {
      icon: 'map-outline' as keyof typeof Ionicons.glyphMap,
      label: 'Roadmap',
      value: `${roadmapProgress}%`,
      color: Colors.neonCyan,
      hasProgress: true,
    },
    {
      icon: 'checkmark-circle-outline' as keyof typeof Ionicons.glyphMap,
      label: 'DSA Solved',
      value: dsaSolved,
      color: Colors.neonGreen,
      hasProgress: false,
    },
    {
      icon: 'flame-outline' as keyof typeof Ionicons.glyphMap,
      label: 'Day Streak',
      value: streakDays,
      color: Colors.neonPink,
      hasProgress: false,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar Section */}
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { borderColor: Colors.neonPurple }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
        <View style={[styles.roleBadge, { borderColor: Colors.neonCyan }]}>
          <Ionicons name="briefcase-outline" size={14} color={Colors.neonCyan} />
          <Text style={[styles.roleText, { color: Colors.neonCyan }]}>{targetRole}</Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        {stats.map((stat, idx) => (
          <View key={idx} style={[styles.statCard, { borderTopColor: stat.color, borderTopWidth: 2 }]}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: stat.color + '15' },
              ]}
            >
              <Ionicons name={stat.icon} size={24} color={stat.color} />
            </View>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
            {stat.hasProgress && (
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${roadmapProgress}%`,
                      backgroundColor: stat.color,
                    },
                  ]}
                />
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={[styles.actionButton, { borderColor: Colors.neonGreen }]}
          onPress={() => navigation.navigate('ProfileAnalysis', { dreamRole: targetRole, skills: [] })}
        >
          <Ionicons name="analytics" size={20} color={Colors.neonGreen} />
          <Text style={[styles.actionButtonText, { color: Colors.neonGreen }]}>
            Analyze Profile
          </Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.neonGreen} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { borderColor: Colors.neonCyan }]}
          onPress={() => navigation.navigate('RoadmapTab')}
        >
          <Ionicons name="map-outline" size={20} color={Colors.neonCyan} />
          <Text style={[styles.actionButtonText, { color: Colors.neonCyan }]}>
            View Roadmap
          </Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.neonCyan} />
        </TouchableOpacity>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Ionicons name="bulb" size={20} color={Colors.neonYellow} />
          <Text style={[styles.infoTitle, { color: Colors.neonYellow }]}>Next Step</Text>
        </View>
        <Text style={styles.infoText}>
          Connect your GitHub and LinkedIn profiles to get a detailed skill gap analysis and personalized recommendations.
        </Text>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => navigation.navigate('ProfileAnalysis', { dreamRole: targetRole, skills: [] })}
        >
          <Text style={styles.infoButtonText}>Start Analysis</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.neonYellow} />
        </TouchableOpacity>
      </View>

      {/* Quick Tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>Performance Tips</Text>
        {[
          { icon: 'code-outline', tip: 'Solve 2 DSA problems daily to build consistency' },
          { icon: 'book-outline', tip: 'Follow your roadmap week by week for best results' },
          { icon: 'people-outline', tip: 'Share your progress with a study buddy' },
        ].map((item, idx) => (
          <View key={idx} style={styles.tipItem}>
            <View style={styles.tipIcon}>
              <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={16} color={Colors.neonPurple} />
            </View>
            <Text style={styles.tipText}>{item.tip}</Text>
          </View>
        ))}
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
    backgroundColor: Colors.neonPurple + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    shadowColor: Colors.neonPurple,
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  avatarText: { color: Colors.neonPurple, fontSize: FontSizes.heading, fontWeight: 'bold' },
  name: { color: Colors.text, fontSize: FontSizes.title, fontWeight: 'bold' },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neonCyan + '10',
    gap: 6,
    borderWidth: 1,
  },
  roleText: { fontSize: 14, fontWeight: '600' },

  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: Spacing.xl },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: { fontSize: FontSizes.heading, fontWeight: 'bold', marginTop: Spacing.sm },
  statLabel: { color: Colors.textMuted, fontSize: 12, marginTop: 4, textAlign: 'center' },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },

  actionsSection: { gap: Spacing.md, marginBottom: Spacing.xl },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.md,
  },
  actionButtonText: { flex: 1, fontSize: 14, fontWeight: '600' },

  infoCard: {
    backgroundColor: Colors.card,
    borderLeftWidth: 3,
    borderLeftColor: Colors.neonYellow,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    shadowColor: Colors.neonYellow,
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  infoTitle: { fontSize: 14, fontWeight: 'bold' },
  infoText: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: Spacing.md },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    backgroundColor: Colors.neonYellow + '15',
    alignSelf: 'flex-start',
  },
  infoButtonText: { color: Colors.neonYellow, fontSize: 13, fontWeight: '600' },

  tipsSection: { marginTop: Spacing.xl },
  tipsTitle: { color: Colors.text, fontSize: FontSizes.subtitle, fontWeight: 'bold', marginBottom: Spacing.md },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.neonPurple + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: { flex: 1, color: Colors.text, fontSize: 14, lineHeight: 20, marginTop: 2 },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../constants/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = { navigation: NativeStackNavigationProp<any> };

const features = [
  { icon: 'map-outline' as keyof typeof Ionicons.glyphMap, title: 'AI Roadmap', desc: 'Personalized career path', color: Colors.neonCyan },
  { icon: 'code-slash-outline' as keyof typeof Ionicons.glyphMap, title: 'DSA Track', desc: 'Company-wise questions', color: Colors.neonGreen },
  { icon: 'bulb-outline' as keyof typeof Ionicons.glyphMap, title: 'Learn AI/ML', desc: 'ML from scratch', color: Colors.neonYellow },
  { icon: 'globe-outline' as keyof typeof Ionicons.glyphMap, title: 'Web Dev', desc: 'Full stack path', color: '#3B82F6' },
];

export default function HomeScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Hey there! 👋</Text>
      <Text style={styles.welcome}>Welcome to SkillBridge</Text>
      <Text style={styles.subtitle}>Your AI-powered career guide for engineering students</Text>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('QuizTab')}
        activeOpacity={0.85}
      >
        <Ionicons name="play-circle" size={28} color="#000" />
        <Text style={styles.startButtonText}>Start Skill Quiz</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Explore Features</Text>
      <View style={styles.featuresGrid}>
        {features.map((f, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.featureCard, { borderLeftColor: f.color }]}
            onPress={() => {
              if (f.title === 'AI Roadmap') navigation.navigate('RoadmapTab');
              else if (f.title === 'DSA Track') navigation.navigate('DSATab');
              else navigation.navigate('LearningTracks');
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.featureIcon, { backgroundColor: f.color + '20' }]}>
              <Ionicons name={f.icon} size={28} color={f.color} />
            </View>
            <Text style={styles.featureTitle}>{f.title}</Text>
            <Text style={styles.featureDesc}>{f.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.ctaSection}>
        <TouchableOpacity
          style={styles.profileAnalysisButton}
          onPress={() => navigation.navigate('ProfileAnalysis', { dreamRole: 'Full Stack Developer', skills: [] })}
        >
          <View style={styles.profileAnalysisContent}>
            <View style={styles.profileAnalysisIconContainer}>
              <Ionicons name="analytics" size={24} color={Colors.neonGreen} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileAnalysisTitle}>GitHub & LinkedIn Analysis</Text>
              <Text style={styles.profileAnalysisDesc}>Connect your profiles to see skill gaps vs your dream role</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.neonGreen} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-circle-outline" size={24} color={Colors.neonCyan} />
          <Text style={styles.profileButtonText}>View Your Profile</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.neonCyan} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Ionicons name="bulb" size={20} color={Colors.neonPink} />
          <Text style={styles.infoTitle}>Pro Tip</Text>
        </View>
        <Text style={styles.infoText}>
          Take the quiz first to get your personalized roadmap, then connect your GitHub & LinkedIn to identify exactly which skills to prioritize.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingBottom: 40 },
  greeting: { color: Colors.textSecondary, fontSize: FontSizes.body },
  welcome: { color: Colors.text, fontSize: FontSizes.heading, fontWeight: 'bold', marginTop: Spacing.xs },
  subtitle: { color: Colors.textMuted, fontSize: FontSizes.body, marginTop: Spacing.sm, marginBottom: Spacing.xl },
  startButton: {
    backgroundColor: Colors.neonCyan,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: 16,
    gap: 12,
    shadowColor: Colors.neonCyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: Spacing.xl,
  },
  startButtonText: { color: '#000', fontSize: FontSizes.subtitle, fontWeight: 'bold' },
  sectionTitle: { color: Colors.text, fontSize: FontSizes.title, fontWeight: 'bold', marginBottom: Spacing.md },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: Spacing.xl },
  featureCard: {
    backgroundColor: Colors.card,
    width: '47%',
    padding: Spacing.md,
    borderRadius: 16,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  featureTitle: { color: Colors.text, fontSize: FontSizes.body, fontWeight: '600' },
  featureDesc: { color: Colors.textMuted, fontSize: 14, marginTop: 4 },

  ctaSection: { gap: Spacing.md, marginBottom: Spacing.xl },
  profileAnalysisButton: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neonGreen + '30',
    shadowColor: Colors.neonGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  profileAnalysisContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  profileAnalysisIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.neonGreen + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAnalysisTitle: { color: Colors.text, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  profileAnalysisDesc: { color: Colors.textMuted, fontSize: 12, lineHeight: 18 },

  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.neonCyan + '30',
    shadowColor: Colors.neonCyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  profileButtonText: { color: Colors.text, fontSize: FontSizes.body, fontWeight: '600', flex: 1, marginLeft: Spacing.md },

  infoCard: {
    backgroundColor: Colors.card,
    borderLeftColor: Colors.neonPink,
    borderLeftWidth: 3,
    padding: Spacing.md,
    borderRadius: 12,
    marginTop: Spacing.lg,
  },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  infoTitle: { color: Colors.neonPink, fontSize: 14, fontWeight: 'bold' },
  infoText: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20 },
});

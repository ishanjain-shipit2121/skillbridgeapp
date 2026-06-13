import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../constants/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = { navigation: NativeStackNavigationProp<any> };

const features = [
  { icon: 'map-outline' as keyof typeof Ionicons.glyphMap, title: 'AI Roadmap', desc: 'Personalized career path', color: '#6366F1' },
  { icon: 'code-slash-outline' as keyof typeof Ionicons.glyphMap, title: 'DSA Track', desc: 'Company-wise questions', color: '#22C55E' },
  { icon: 'bulb-outline' as keyof typeof Ionicons.glyphMap, title: 'Learn AI/ML', desc: 'ML from scratch', color: '#F59E0B' },
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
        <Ionicons name="play-circle" size={28} color="#fff" />
        <Text style={styles.startButtonText}>Start Skill Quiz</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Explore Features</Text>
      <View style={styles.featuresGrid}>
        {features.map((f, i) => (
          <TouchableOpacity
            key={i}
            style={styles.featureCard}
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

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons name="person-circle-outline" size={24} color={Colors.accent} />
        <Text style={styles.profileButtonText}>View Profile</Text>
      </TouchableOpacity>
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
    backgroundColor: Colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: 16,
    gap: 12,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: { color: '#fff', fontSize: FontSizes.subtitle, fontWeight: 'bold' },
  sectionTitle: { color: Colors.text, fontSize: FontSizes.title, fontWeight: 'bold', marginTop: Spacing.xl, marginBottom: Spacing.md },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  featureCard: {
    backgroundColor: Colors.card,
    width: '47%',
    padding: Spacing.md,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
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
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    padding: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.card,
    gap: 8,
  },
  profileButtonText: { color: Colors.accent, fontSize: FontSizes.body, fontWeight: '600' },
});

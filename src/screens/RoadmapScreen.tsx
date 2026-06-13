import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../constants/theme';
import { Roadmap, QuizAnswers } from '../types';
import { generateRoadmap } from '../services/groq';
import { useFocusEffect } from '@react-navigation/native';

type Props = { navigation: any; route: any };

const GAP_COLORS = ['#6366F1', '#22C55E', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

export default function RoadmapScreen({ navigation, route }: Props) {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const answers: QuizAnswers | undefined = route.params?.answers;

  const loadRoadmap = useCallback(async () => {
    if (!answers) return;
    setLoading(true);
    try {
      const result = await generateRoadmap(answers);
      setRoadmap(result);
    } finally {
      setLoading(false);
    }
  }, [answers]);

  useFocusEffect(
    useCallback(() => {
      if (answers && !roadmap) {
        loadRoadmap();
      }
    }, [answers, roadmap, loadRoadmap])
  );

  if (!answers) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="map-outline" size={64} color={Colors.textMuted} />
        <Text style={styles.emptyTitle}>No Roadmap Yet</Text>
        <Text style={styles.emptySubtitle}>Complete the skill quiz first to generate your personalized roadmap</Text>
        <TouchableOpacity style={styles.startQuizButton} onPress={() => navigation.navigate('QuizTab')}>
          <Text style={styles.startQuizText}>Start Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Analyzing your skills...</Text>
        <Text style={styles.loadingSubtext}>Generating your personalized roadmap</Text>
      </View>
    );
  }

  if (!roadmap) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your Skill Gaps</Text>
      <View style={styles.gapsContainer}>
        {roadmap.skillGaps.map((gap, i) => (
          <View
            key={i}
            style={[styles.gapChip, { backgroundColor: GAP_COLORS[i % GAP_COLORS.length] + '20', borderColor: GAP_COLORS[i % GAP_COLORS.length] }]}
          >
            <Text style={[styles.gapText, { color: GAP_COLORS[i % GAP_COLORS.length] }]}>{gap}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.timelineTitle}>Week-by-Week Timeline</Text>
      {roadmap.weeks.map((week, i) => (
        <View key={i} style={styles.weekCard}>
          <View style={styles.weekNumberContainer}>
            <View style={styles.weekCircle}>
              <Text style={styles.weekNumber}>{week.week}</Text>
            </View>
            {i < roadmap.weeks.length - 1 && <View style={styles.weekLine} />}
          </View>
          <View style={styles.weekContent}>
            <Text style={styles.weekTopic}>{week.topic}</Text>
            <Text style={styles.weekResource}>{week.resources}</Text>
            <View style={styles.weekHours}>
              <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.weekHoursText}>{week.estimatedHours} hrs</Text>
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.saveButton, saved && styles.saveButtonDone]}
        onPress={() => setSaved(true)}
      >
        <Ionicons name={saved ? 'checkmark-circle' : 'bookmark-outline'} size={20} color="#fff" />
        <Text style={styles.saveButtonText}>{saved ? 'Roadmap Saved!' : 'Save Roadmap'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingBottom: 40 },
  emptyContainer: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  emptyTitle: { color: Colors.text, fontSize: FontSizes.title, fontWeight: 'bold', marginTop: Spacing.md },
  emptySubtitle: { color: Colors.textMuted, fontSize: FontSizes.body, textAlign: 'center', marginTop: Spacing.sm, marginBottom: Spacing.xl },
  startQuizButton: { backgroundColor: Colors.accent, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12 },
  startQuizText: { color: '#fff', fontSize: FontSizes.body, fontWeight: '600' },
  loadingText: { color: Colors.text, fontSize: FontSizes.subtitle, fontWeight: '600', marginTop: Spacing.lg },
  loadingSubtext: { color: Colors.textMuted, fontSize: FontSizes.body, marginTop: Spacing.sm },
  title: { color: Colors.text, fontSize: FontSizes.title, fontWeight: 'bold', marginBottom: Spacing.md },
  gapsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: Spacing.xl },
  gapChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  gapText: { fontSize: FontSizes.body, fontWeight: '600' },
  timelineTitle: { color: Colors.text, fontSize: FontSizes.title, fontWeight: 'bold', marginBottom: Spacing.lg },
  weekCard: { flexDirection: 'row', marginBottom: 4 },
  weekNumberContainer: { alignItems: 'center', width: 48 },
  weekCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekNumber: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  weekLine: { width: 2, flex: 1, backgroundColor: Colors.border },
  weekContent: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.md,
    marginLeft: Spacing.sm,
    marginBottom: Spacing.md,
  },
  weekTopic: { color: Colors.text, fontSize: FontSizes.subtitle, fontWeight: '600' },
  weekResource: { color: Colors.textSecondary, fontSize: 14, marginTop: 4 },
  weekHours: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  weekHoursText: { color: Colors.textMuted, fontSize: 14 },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: Spacing.lg,
  },
  saveButtonDone: { backgroundColor: Colors.success },
  saveButtonText: { color: '#fff', fontSize: FontSizes.body, fontWeight: '600' },
});

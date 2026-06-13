import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../constants/theme';
import { Roadmap, QuizAnswers, EnhancedRoadmapWeek } from '../types';
import { generateRoadmap } from '../services/groq';
import { useFocusEffect } from '@react-navigation/native';

type Props = { navigation: any; route: any };

const GAP_COLORS = ['#00D9FF', '#00FF41', '#FF006E', '#9D00FF', '#FFFF00', '#6366F1', '#3B82F6', '#EC4899'];

export default function RoadmapScreen({ navigation, route }: Props) {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());

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

  const toggleWeekExpand = (weekNumber: number) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekNumber)) {
      newExpanded.delete(weekNumber);
    } else {
      newExpanded.add(weekNumber);
    }
    setExpandedWeeks(newExpanded);
  };

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
        <ActivityIndicator size="large" color={Colors.neonCyan} />
        <Text style={styles.loadingText}>Analyzing your skills...</Text>
        <Text style={styles.loadingSubtext}>Generating your personalized roadmap</Text>
      </View>
    );
  }

  if (!roadmap) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>Your Personalized Roadmap</Text>
        <Text style={styles.headerSubtitle}>
          Complete {roadmap.weeks.length} weeks to master the required skills
        </Text>
      </View>

      {/* Skill Gaps */}
      <View style={styles.gapsSection}>
        <Text style={styles.sectionTitle}>Skill Gaps to Master</Text>
        <View style={styles.gapsContainer}>
          {roadmap.skillGaps.map((gap, i) => (
            <View
              key={i}
              style={[
                styles.gapChip,
                {
                  backgroundColor: GAP_COLORS[i % GAP_COLORS.length] + '20',
                  borderColor: GAP_COLORS[i % GAP_COLORS.length],
                },
              ]}
            >
              <Text style={[styles.gapText, { color: GAP_COLORS[i % GAP_COLORS.length] }]}>
                {gap}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Timeline */}
      <Text style={styles.timelineTitle}>Week-by-Week Timeline</Text>
      {roadmap.weeks.map((week, i) => (
        <WeekCard
          key={i}
          week={week as EnhancedRoadmapWeek}
          index={i}
          total={roadmap.weeks.length}
          isExpanded={expandedWeeks.has(week.week)}
          onToggle={() => toggleWeekExpand(week.week)}
          color={GAP_COLORS[i % GAP_COLORS.length]}
        />
      ))}

      {/* Action Button */}
      <TouchableOpacity
        style={[styles.saveButton, saved && styles.saveButtonDone]}
        onPress={() => setSaved(true)}
      >
        <Ionicons name={saved ? 'checkmark-circle' : 'bookmark-outline'} size={20} color="#fff" />
        <Text style={styles.saveButtonText}>{saved ? 'Roadmap Saved!' : 'Save Roadmap'}</Text>
      </TouchableOpacity>

      {/* Profile Analysis CTA */}
      <TouchableOpacity
        style={styles.profileAnalysisButton}
        onPress={() => navigation.navigate('ProfileAnalysis', { dreamRole: answers.dreamRole, skills: answers.skills })}
      >
        <Ionicons name="analytics" size={20} color={Colors.neonGreen} />
        <View style={{ flex: 1 }}>
          <Text style={styles.profileAnalysisTitle}>Analyze Your Profile</Text>
          <Text style={styles.profileAnalysisDesc}>Connect GitHub/LinkedIn for skill gap analysis</Text>
        </View>
        <Ionicons name="arrow-forward" size={20} color={Colors.neonGreen} />
      </TouchableOpacity>
    </ScrollView>
  );
}

function WeekCard({
  week,
  index,
  total,
  isExpanded,
  onToggle,
  color,
}: {
  week: EnhancedRoadmapWeek;
  index: number;
  total: number;
  isExpanded: boolean;
  onToggle: () => void;
  color: string;
}) {
  return (
    <View style={styles.weekCard}>
      {/* Timeline connector */}
      <View style={styles.weekNumberContainer}>
        <View style={[styles.weekCircle, { backgroundColor: color, borderColor: color }]}>
          <Text style={styles.weekNumber}>{week.week}</Text>
        </View>
        {index < total - 1 && <View style={[styles.weekLine, { backgroundColor: color + '40' }]} />}
      </View>

      {/* Card content */}
      <TouchableOpacity style={styles.weekContentWrapper} onPress={onToggle} activeOpacity={0.7}>
        <View style={[styles.weekContent, { borderLeftColor: color, borderLeftWidth: 3 }]}>
          <View style={styles.weekHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.weekTopic}>{week.topic}</Text>
              <Text style={styles.weekResource}>{week.resources}</Text>
            </View>
            <View style={styles.weekMetrics}>
              <View style={styles.metricBadge}>
                <Ionicons name="time-outline" size={14} color={color} />
                <Text style={[styles.metricText, { color }]}>{week.estimatedHours}h</Text>
              </View>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Colors.textSecondary}
              />
            </View>
          </View>

          {/* Expanded content */}
          {isExpanded && (
            <View style={styles.expandedContent}>
              {/* Key Topics */}
              {week.keyTopics && week.keyTopics.length > 0 && (
                <View style={styles.subsection}>
                  <View style={styles.subsectionHeader}>
                    <Ionicons name="layers-outline" size={16} color={Colors.neonCyan} />
                    <Text style={styles.subsectionTitle}>Key Topics</Text>
                  </View>
                  <View style={styles.topicsGrid}>
                    {week.keyTopics.map((topic, idx) => (
                      <View key={idx} style={styles.topicTag}>
                        <Text style={styles.topicText}>{topic}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Milestones */}
              {week.milestones && week.milestones.length > 0 && (
                <View style={styles.subsection}>
                  <View style={styles.subsectionHeader}>
                    <Ionicons name="checkmark-done-circle" size={16} color={Colors.neonGreen} />
                    <Text style={styles.subsectionTitle}>Milestones</Text>
                  </View>
                  {week.milestones.map((milestone, idx) => (
                    <View key={idx} style={styles.milestone}>
                      <View style={styles.milestoneMarker} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                        <Text style={styles.milestoneDesc}>{milestone.description}</Text>
                        <Text style={styles.milestoneHours}>{milestone.estimatedHours} hours</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Projects */}
              {week.projects && week.projects.length > 0 && (
                <View style={styles.subsection}>
                  <View style={styles.subsectionHeader}>
                    <Ionicons name="hammer-outline" size={16} color={Colors.neonPink} />
                    <Text style={styles.subsectionTitle}>Projects</Text>
                  </View>
                  {week.projects.map((project, idx) => (
                    <View key={idx} style={styles.projectCard}>
                      <View style={styles.projectHeader}>
                        <Text style={styles.projectName}>{project.name}</Text>
                        <View
                          style={[
                            styles.difficultyBadge,
                            {
                              backgroundColor:
                                project.difficulty === 'Easy'
                                  ? Colors.neonGreen + '20'
                                  : project.difficulty === 'Medium'
                                  ? Colors.warning + '20'
                                  : Colors.error + '20',
                            },
                          ]}
                        >
                          <Text
                            style={{
                              color:
                                project.difficulty === 'Easy'
                                  ? Colors.neonGreen
                                  : project.difficulty === 'Medium'
                                  ? Colors.warning
                                  : Colors.error,
                              fontSize: 12,
                              fontWeight: '600',
                            }}
                          >
                            {project.difficulty}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.projectDesc}>{project.description}</Text>
                      <View style={styles.projectFooter}>
                        <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
                        <Text style={styles.projectHours}>{project.estimatedHours} hours</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Resources */}
              {week.resources && week.resources.length > 0 && (
                <View style={styles.subsection}>
                  <View style={styles.subsectionHeader}>
                    <Ionicons name="book-outline" size={16} color={Colors.neonYellow} />
                    <Text style={styles.subsectionTitle}>Learning Resources</Text>
                  </View>
                  <View style={styles.resourcesContainer}>
                    {week.resources.map((resource, idx) => (
                      <View key={idx} style={styles.resourceChip}>
                        <Ionicons
                          name={
                            resource.type === 'video'
                              ? 'play-circle'
                              : resource.type === 'article'
                              ? 'document-text'
                              : 'book'
                          }
                          size={14}
                          color={color}
                        />
                        <Text style={styles.resourceChipText}>{resource.title}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingBottom: 40 },

  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: FontSizes.title,
    fontWeight: 'bold',
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    color: Colors.textMuted,
    fontSize: FontSizes.body,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  startQuizButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  startQuizText: { color: '#fff', fontSize: FontSizes.body, fontWeight: '600' },

  loadingText: {
    color: Colors.text,
    fontSize: FontSizes.subtitle,
    fontWeight: '600',
    marginTop: Spacing.lg,
  },
  loadingSubtext: { color: Colors.textMuted, fontSize: FontSizes.body, marginTop: Spacing.sm },

  headerSection: { marginBottom: Spacing.xl },
  title: { color: Colors.text, fontSize: FontSizes.heading, fontWeight: 'bold' },
  headerSubtitle: { color: Colors.textMuted, fontSize: FontSizes.body, marginTop: Spacing.sm },

  gapsSection: { marginBottom: Spacing.xl },
  sectionTitle: { color: Colors.text, fontSize: FontSizes.title, fontWeight: 'bold', marginBottom: Spacing.md },
  gapsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gapChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  gapText: { fontSize: 13, fontWeight: '600' },

  timelineTitle: {
    color: Colors.text,
    fontSize: FontSizes.title,
    fontWeight: 'bold',
    marginBottom: Spacing.lg,
  },

  weekCard: { flexDirection: 'row', marginBottom: 4 },
  weekNumberContainer: { alignItems: 'center', width: 48, position: 'relative' },
  weekCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#00D9FF',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  weekNumber: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  weekLine: { width: 2, flex: 1, marginVertical: 0 },

  weekContentWrapper: { flex: 1, marginLeft: Spacing.sm, marginBottom: Spacing.md },
  weekContent: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.md,
  },
  weekHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing.sm },
  weekTopic: { color: Colors.text, fontSize: FontSizes.subtitle, fontWeight: '600' },
  weekResource: { color: Colors.textSecondary, fontSize: 13, marginTop: 4 },
  weekMetrics: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  metricBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: Colors.cardLight,
  },
  metricText: { fontSize: 12, fontWeight: '600' },

  expandedContent: { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopColor: Colors.border, borderTopWidth: 1 },

  subsection: { marginTop: Spacing.md },
  subsectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  subsectionTitle: { color: Colors.text, fontSize: 14, fontWeight: '600' },

  topicsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  topicTag: {
    backgroundColor: Colors.neonCyan + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neonCyan + '30',
  },
  topicText: { color: Colors.neonCyan, fontSize: 12, fontWeight: '500' },

  milestone: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, marginBottom: Spacing.md },
  milestoneMarker: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.neonGreen, marginTop: 6 },
  milestoneTitle: { color: Colors.text, fontSize: 14, fontWeight: '600' },
  milestoneDesc: { color: Colors.textSecondary, fontSize: 13, marginTop: 2 },
  milestoneHours: { color: Colors.textMuted, fontSize: 12, marginTop: 4, fontStyle: 'italic' },

  projectCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.neonPink,
  },
  projectHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  projectName: { color: Colors.text, fontSize: 14, fontWeight: '600', flex: 1 },
  difficultyBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  projectDesc: { color: Colors.textSecondary, fontSize: 13, marginBottom: Spacing.sm },
  projectFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  projectHours: { color: Colors.textMuted, fontSize: 12 },

  resourcesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  resourceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resourceChipText: { color: Colors.text, fontSize: 12, fontWeight: '500' },

  saveButton: {
    flexDirection: 'row',
    backgroundColor: Colors.neonCyan,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: Spacing.lg,
    shadowColor: Colors.neonCyan,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButtonDone: { backgroundColor: Colors.neonGreen },
  saveButtonText: { color: '#000', fontSize: FontSizes.body, fontWeight: '600' },

  profileAnalysisButton: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.neonGreen + '30',
  },
  profileAnalysisTitle: { color: Colors.text, fontSize: 14, fontWeight: '600' },
  profileAnalysisDesc: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
});

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../constants/theme';
import { ProfileAnalysisResult, SkillGap } from '../types';
import { analyzeProfiles } from '../services/profileAnalyzer';
import { createFadeInAnimation } from '../utils/neonEffects';

type Props = { navigation: any; route: any };

export default function ProfileAnalysisScreen({ navigation, route }: Props) {
  const dreamRole = route.params?.dreamRole || 'Full Stack Developer';
  const currentSkills = route.params?.skills || [];

  const [githubId, setGithubId] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProfileAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fadeAnim = createFadeInAnimation(0);

  const handleAnalyze = useCallback(async () => {
    if (!githubId.trim() && !linkedinUrl.trim()) {
      setError('Please provide at least one profile link');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      fadeAnim.animate();
      const analysisResult = await analyzeProfiles(
        githubId.trim(),
        linkedinUrl.trim(),
        dreamRole,
        currentSkills
      );
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze profiles');
    } finally {
      setLoading(false);
    }
  }, [githubId, linkedinUrl, dreamRole, currentSkills, fadeAnim]);

  if (result) {
    return <ResultScreen result={result} onBack={() => setResult(null)} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile Analysis</Text>
      <Text style={styles.subtitle}>
        Connect your GitHub and LinkedIn to get personalized skill gap analysis
      </Text>

      <View style={styles.inputSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>GitHub Username or URL</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="logo-github" size={20} color={Colors.neonCyan} />
            <TextInput
              style={styles.input}
              placeholder="username or github.com/username"
              placeholderTextColor={Colors.textDim}
              value={githubId}
              onChangeText={setGithubId}
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>LinkedIn Profile URL</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="logo-linkedin" size={20} color={Colors.neonPink} />
            <TextInput
              style={styles.input}
              placeholder="linkedin.com/in/yourprofile"
              placeholderTextColor={Colors.textDim}
              value={linkedinUrl}
              onChangeText={setLinkedinUrl}
              editable={!loading}
            />
          </View>
        </View>
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={20} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.analyzeButton, loading && styles.analyzeButtonDisabled]}
        onPress={handleAnalyze}
        disabled={loading}
      >
        {loading ? (
          <>
            <ActivityIndicator color="#fff" />
            <Text style={styles.analyzeButtonText}>Analyzing...</Text>
          </>
        ) : (
          <>
            <Ionicons name="flash" size={20} color="#fff" />
            <Text style={styles.analyzeButtonText}>Analyze My Profile</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color={Colors.neonGreen} />
        <Text style={styles.infoText}>
          We analyze your GitHub repositories and LinkedIn profile to identify skill gaps specific to your dream role.
        </Text>
      </View>

      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>What we analyze:</Text>
        <View style={styles.tipItem}>
          <View style={styles.tipDot} />
          <Text style={styles.tipText}>Your GitHub repos, languages, and contribution history</Text>
        </View>
        <View style={styles.tipItem}>
          <View style={styles.tipDot} />
          <Text style={styles.tipText}>LinkedIn skills and endorsements</Text>
        </View>
        <View style={styles.tipItem}>
          <View style={styles.tipDot} />
          <Text style={styles.tipText}>Gap analysis vs your target role requirements</Text>
        </View>
        <View style={styles.tipItem}>
          <View style={styles.tipDot} />
          <Text style={styles.tipText}>Personalized learning recommendations</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function ResultScreen({
  result,
  onBack,
}: {
  result: ProfileAnalysisResult;
  onBack: () => void;
}) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.resultContent}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="chevron-back" size={24} color={Colors.text} />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Overall Score */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreValue}>{result.overallScore}</Text>
          <Text style={styles.scoreLabel}>Score</Text>
        </View>
        <View style={styles.scoreInfo}>
          <Text style={styles.scoreTitle}>Overall Readiness</Text>
          <Text style={styles.scoreDesc}>
            {result.overallScore >= 80
              ? 'Excellent progress! You are well-prepared for your target role.'
              : result.overallScore >= 60
              ? 'Good foundation. Focus on filling key skill gaps.'
              : 'Great opportunity to learn and grow!'}
          </Text>
        </View>
      </View>

      {/* Strength Areas */}
      {result.strengthAreas.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Strengths</Text>
          {result.strengthAreas.map((strength, idx) => (
            <View key={idx} style={styles.strengthItem}>
              <View style={styles.strengthIcon}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.neonGreen} />
              </View>
              <Text style={styles.strengthText}>{strength}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Skill Gaps */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skill Gaps Analysis</Text>
        {result.skillGaps.map((gap, idx) => (
          <GapCard key={idx} gap={gap} index={idx} />
        ))}
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Next Steps</Text>
        {result.recommendations.map((rec, idx) => (
          <View key={idx} style={styles.recommendationItem}>
            <View
              style={[
                styles.recIcon,
                {
                  backgroundColor:
                    idx === 0
                      ? Colors.neonPink + '20'
                      : idx === 1
                      ? Colors.neonPurple + '20'
                      : Colors.neonCyan + '20',
                },
              ]}
            >
              <Text style={styles.recNumber}>{idx + 1}</Text>
            </View>
            <Text style={styles.recommendationText}>{rec}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function GapCard({ gap, index }: { gap: SkillGap; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const colors = [Colors.neonCyan, Colors.neonGreen, Colors.neonPink, Colors.neonPurple];
  const color = colors[index % colors.length];

  const priorityColor =
    gap.priority === 'Must'
      ? Colors.error
      : gap.priority === 'Should'
      ? Colors.warning
      : Colors.success;

  return (
    <View style={[styles.gapCard, { borderLeftColor: color, borderLeftWidth: 3 }]}>
      <TouchableOpacity
        style={styles.gapHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.gapTitleSection}>
          <Text style={styles.gapTitle}>{gap.skill}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
            <Text style={[styles.priorityText, { color: priorityColor }]}>{gap.priority}</Text>
          </View>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={Colors.textSecondary}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.gapDetails}>
          <View style={styles.levelRow}>
            <View style={styles.levelItem}>
              <Text style={styles.levelLabel}>Current Level</Text>
              <Text style={styles.levelValue}>{gap.currentLevel}</Text>
            </View>
            <View style={styles.levelItem}>
              <Text style={styles.levelLabel}>Required Level</Text>
              <Text style={styles.levelValue}>{gap.requiredLevel}</Text>
            </View>
            <View style={styles.levelItem}>
              <Text style={styles.levelLabel}>Timeline</Text>
              <Text style={styles.levelValue}>{gap.timelineWeeks}w</Text>
            </View>
          </View>

          {gap.suggestedResources.length > 0 && (
            <View style={styles.resourcesSection}>
              <Text style={styles.resourcesTitle}>Suggested Resources</Text>
              {gap.suggestedResources.slice(0, 2).map((res, idx) => (
                <View key={idx} style={styles.resourceItem}>
                  <Ionicons
                    name={
                      res.type === 'video'
                        ? 'play-circle'
                        : res.type === 'article'
                        ? 'document-text'
                        : 'book'
                    }
                    size={16}
                    color={Colors.neonGreen}
                  />
                  <Text style={styles.resourceName}>{res.title}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingBottom: 40 },
  resultContent: { padding: Spacing.lg, paddingBottom: 40 },

  title: { color: Colors.text, fontSize: FontSizes.heading, fontWeight: 'bold' },
  subtitle: { color: Colors.textMuted, fontSize: FontSizes.body, marginTop: Spacing.sm, marginBottom: Spacing.lg },

  inputSection: { marginBottom: Spacing.xl },
  inputGroup: { marginBottom: Spacing.lg },
  label: { color: Colors.text, fontSize: 14, fontWeight: '600', marginBottom: Spacing.sm },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSizes.body,
    paddingVertical: Spacing.md,
  },

  errorBox: {
    flexDirection: 'row',
    backgroundColor: Colors.error + '15',
    borderColor: Colors.error,
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  errorText: { flex: 1, color: Colors.error, fontSize: 14, fontWeight: '500' },

  analyzeButton: {
    flexDirection: 'row',
    backgroundColor: Colors.neonPink,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    shadowColor: Colors.neonPink,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  analyzeButtonDisabled: { opacity: 0.6 },
  analyzeButtonText: { color: '#fff', fontSize: FontSizes.body, fontWeight: 'bold' },

  infoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderLeftColor: Colors.neonGreen,
    borderLeftWidth: 3,
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  infoText: { flex: 1, color: Colors.textSecondary, fontSize: 14, lineHeight: 20 },

  tipsSection: { marginTop: Spacing.xl },
  tipsTitle: { color: Colors.text, fontSize: FontSizes.subtitle, fontWeight: 'bold', marginBottom: Spacing.md },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, marginBottom: Spacing.md },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.neonCyan,
    marginTop: 8,
  },
  tipText: { flex: 1, color: Colors.textSecondary, fontSize: 14, lineHeight: 20 },

  // Result styles
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  backButtonText: { color: Colors.text, fontSize: FontSizes.body, fontWeight: '600' },

  scoreCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderColor: Colors.neonPurple,
    borderWidth: 1,
    gap: Spacing.lg,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.neonPurple + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.neonPurple,
  },
  scoreValue: { color: Colors.neonPurple, fontSize: 32, fontWeight: 'bold' },
  scoreLabel: { color: Colors.textMuted, fontSize: 12, marginTop: 4 },
  scoreInfo: { flex: 1, justifyContent: 'center' },
  scoreTitle: { color: Colors.text, fontSize: FontSizes.subtitle, fontWeight: 'bold' },
  scoreDesc: { color: Colors.textSecondary, fontSize: 14, marginTop: Spacing.sm, lineHeight: 20 },

  section: { marginBottom: Spacing.xl },
  sectionTitle: { color: Colors.text, fontSize: FontSizes.title, fontWeight: 'bold', marginBottom: Spacing.md },

  strengthItem: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  strengthIcon: { marginTop: 2 },
  strengthText: { flex: 1, color: Colors.text, fontSize: 14, lineHeight: 20 },

  gapCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  gapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  gapTitleSection: { flex: 1, gap: Spacing.sm },
  gapTitle: { color: Colors.text, fontSize: FontSizes.body, fontWeight: '600' },
  priorityBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  priorityText: { fontSize: 12, fontWeight: '600' },
  gapDetails: { borderTopColor: Colors.border, borderTopWidth: 1, padding: Spacing.md, gap: Spacing.md },
  levelRow: { flexDirection: 'row', gap: Spacing.md },
  levelItem: { flex: 1 },
  levelLabel: { color: Colors.textMuted, fontSize: 12, marginBottom: 4 },
  levelValue: { color: Colors.neonCyan, fontSize: FontSizes.subtitle, fontWeight: '700' },
  resourcesSection: { marginTop: Spacing.md },
  resourcesTitle: { color: Colors.text, fontSize: 14, fontWeight: '600', marginBottom: Spacing.sm },
  resourceItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  resourceName: { color: Colors.textSecondary, fontSize: 14 },

  recommendationItem: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  recIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recNumber: { color: Colors.text, fontSize: 14, fontWeight: 'bold' },
  recommendationText: { flex: 1, color: Colors.text, fontSize: 14, lineHeight: 20 },
});

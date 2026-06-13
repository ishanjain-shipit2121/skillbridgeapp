import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../constants/theme';
import { QuizAnswers } from '../types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = { navigation: NativeStackNavigationProp<any> };

const SKILLS = ['Python', 'JavaScript', 'C++', 'Java', 'None'];
const ROLES = ['Full Stack', 'ML Engineer', 'Mobile Dev', 'DevOps'];
const COMPANIES = ['Google', 'Amazon', 'Microsoft', 'Flipkart', 'Zomato'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Working'];

export default function QuizScreen({ navigation }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    skills: [], dreamRole: '', targetCompany: '', studyHours: 15, currentYear: '',
  });
  const slideAnim = useRef(new Animated.Value(0)).current;

  const slideIn = () => {
    slideAnim.setValue(300);
    Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const goNext = () => {
    if (currentQ < 4) { setCurrentQ(currentQ + 1); slideIn(); }
  };

  const goBack = () => {
    if (currentQ > 0) { setCurrentQ(currentQ - 1); slideIn(); }
  };

  const toggleSkill = (skill: string) => {
    if (skill === 'None') {
      setAnswers({ ...answers, skills: ['None'] });
      return;
    }
    const filtered = answers.skills.filter(s => s !== 'None');
    if (filtered.includes(skill)) {
      setAnswers({ ...answers, skills: filtered.filter(s => s !== skill) });
    } else {
      setAnswers({ ...answers, skills: [...filtered, skill] });
    }
  };

  const canProceed = () => {
    switch (currentQ) {
      case 0: return answers.skills.length > 0;
      case 1: return answers.dreamRole !== '';
      case 2: return answers.targetCompany !== '';
      case 3: return true;
      case 4: return answers.currentYear !== '';
      default: return false;
    }
  };

  const handleGenerate = () => {
    navigation.navigate('RoadmapTab', { answers });
  };

  const progress = ((currentQ + 1) / 5) * 100;

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>Question {currentQ + 1} of 5</Text>

      <ScrollView style={styles.questionContainer} contentContainerStyle={styles.questionContent}>
        <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
          {currentQ === 0 && (
            <>
              <Text style={styles.questionTitle}>What are your current skills?</Text>
              <Text style={styles.questionHint}>Select all that apply</Text>
              <View style={styles.chipsContainer}>
                {SKILLS.map(skill => (
                  <TouchableOpacity
                    key={skill}
                    style={[styles.chip, answers.skills.includes(skill) && styles.chipSelected]}
                    onPress={() => toggleSkill(skill)}
                  >
                    <Text style={[styles.chipText, answers.skills.includes(skill) && styles.chipTextSelected]}>
                      {skill}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {currentQ === 1 && (
            <>
              <Text style={styles.questionTitle}>What's your dream role?</Text>
              <Text style={styles.questionHint}>Pick one</Text>
              <View style={styles.cardsContainer}>
                {ROLES.map(role => (
                  <TouchableOpacity
                    key={role}
                    style={[styles.roleCard, answers.dreamRole === role && styles.roleCardSelected]}
                    onPress={() => { setAnswers({ ...answers, dreamRole: role }); }}
                  >
                    <Ionicons
                      name={role === 'Full Stack' ? 'layers-outline' : role === 'ML Engineer' ? 'bulb-outline' : role === 'Mobile Dev' ? 'phone-portrait-outline' : 'server-outline'}
                      size={32}
                      color={answers.dreamRole === role ? '#fff' : Colors.accent}
                    />
                    <Text style={[styles.roleText, answers.dreamRole === role && styles.roleTextSelected]}>
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {currentQ === 2 && (
            <>
              <Text style={styles.questionTitle}>Which company do you target?</Text>
              <Text style={styles.questionHint}>Select one</Text>
              <View style={styles.chipsContainer}>
                {COMPANIES.map(company => (
                  <TouchableOpacity
                    key={company}
                    style={[styles.chip, answers.targetCompany === company && styles.chipSelected]}
                    onPress={() => setAnswers({ ...answers, targetCompany: company })}
                  >
                    <Text style={[styles.chipText, answers.targetCompany === company && styles.chipTextSelected]}>
                      {company}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {currentQ === 3 && (
            <>
              <Text style={styles.questionTitle}>How many hours/week can you study?</Text>
              <Text style={styles.questionHint}>Slide to choose</Text>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderValue}>{answers.studyHours} hrs</Text>
                <View style={styles.sliderTrack}>
                  {Array.from({ length: 8 }).map((_, i) => {
                    const val = 5 + i * 5;
                    const isActive = answers.studyHours >= val;
                    return (
                      <TouchableOpacity
                        key={i}
                        style={[styles.sliderDot, isActive && styles.sliderDotActive]}
                        onPress={() => setAnswers({ ...answers, studyHours: val })}
                      >
                        <Text style={[styles.sliderLabel, isActive && styles.sliderLabelActive]}>{val}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View style={styles.sliderRange}>
                  <Text style={styles.sliderRangeText}>5 hrs</Text>
                  <Text style={styles.sliderRangeText}>40 hrs</Text>
                </View>
              </View>
            </>
          )}

          {currentQ === 4 && (
            <>
              <Text style={styles.questionTitle}>What's your current year?</Text>
              <Text style={styles.questionHint}>Select one</Text>
              <View style={styles.radioContainer}>
                {YEARS.map(year => (
                  <TouchableOpacity
                    key={year}
                    style={[styles.radioOption, answers.currentYear === year && styles.radioOptionSelected]}
                    onPress={() => setAnswers({ ...answers, currentYear: year })}
                  >
                    <View style={[styles.radioCircle, answers.currentYear === year && styles.radioCircleSelected]}>
                      {answers.currentYear === year && <View style={styles.radioInner} />}
                    </View>
                    <Text style={[styles.radioText, answers.currentYear === year && styles.radioTextSelected]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </Animated.View>
      </ScrollView>

      <View style={styles.navButtons}>
        {currentQ > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={20} color={Colors.textSecondary} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        {currentQ < 4 ? (
          <TouchableOpacity
            style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
            onPress={goNext}
            disabled={!canProceed()}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled, styles.generateButton]}
            onPress={handleGenerate}
            disabled={!canProceed()}
          >
            <Ionicons name="sparkles" size={20} color="#fff" />
            <Text style={styles.nextButtonText}>Generate My Roadmap</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  progressContainer: { height: 4, backgroundColor: Colors.card, marginHorizontal: Spacing.lg, marginTop: Spacing.md, borderRadius: 2 },
  progressBar: { height: '100%', backgroundColor: Colors.accent, borderRadius: 2 },
  progressText: { color: Colors.textMuted, fontSize: 14, textAlign: 'center', marginTop: Spacing.sm },
  questionContainer: { flex: 1 },
  questionContent: { padding: Spacing.lg, paddingBottom: 40 },
  questionTitle: { color: Colors.text, fontSize: FontSizes.title, fontWeight: 'bold', marginBottom: Spacing.xs },
  questionHint: { color: Colors.textMuted, fontSize: 14, marginBottom: Spacing.lg },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText: { color: Colors.textSecondary, fontSize: FontSizes.body },
  chipTextSelected: { color: '#fff', fontWeight: '600' },
  cardsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  roleCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  roleCardSelected: { borderColor: Colors.accent, backgroundColor: Colors.accent },
  roleText: { color: Colors.text, fontSize: FontSizes.body, fontWeight: '600', marginTop: Spacing.sm },
  roleTextSelected: { color: '#fff' },
  sliderContainer: { alignItems: 'center' },
  sliderValue: { color: Colors.accent, fontSize: FontSizes.heading, fontWeight: 'bold', marginBottom: Spacing.lg },
  sliderTrack: { flexDirection: 'row', gap: 8, marginBottom: Spacing.md },
  sliderDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  sliderDotActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  sliderLabel: { color: Colors.textMuted, fontSize: 12 },
  sliderLabelActive: { color: '#fff', fontWeight: '600' },
  sliderRange: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: Spacing.sm },
  sliderRangeText: { color: Colors.textMuted, fontSize: 14 },
  radioContainer: { gap: 12 },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  radioOptionSelected: { borderColor: Colors.accent, backgroundColor: Colors.accent + '15' },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: { borderColor: Colors.accent },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.accent },
  radioText: { color: Colors.text, fontSize: FontSizes.body },
  radioTextSelected: { color: Colors.accent, fontWeight: '600' },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 6,
  },
  backButtonText: { color: Colors.textSecondary, fontSize: FontSizes.body },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonDisabled: { opacity: 0.4 },
  nextButtonText: { color: '#fff', fontSize: FontSizes.body, fontWeight: '600' },
  generateButton: { backgroundColor: '#6366F1' },
});

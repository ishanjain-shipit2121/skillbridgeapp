import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../constants/theme';
import { dsaQuestions } from '../services/mockData';

const COMPANIES = ['Google', 'Amazon', 'Microsoft', 'Flipkart', 'Zomato'];

const DIFF_COLORS: Record<string, string> = {
  Easy: Colors.success,
  Medium: Colors.warning,
  Hard: Colors.error,
};

export default function DSATrackScreen() {
  const [selectedCompany, setSelectedCompany] = useState('Google');
  const questions = dsaQuestions[selectedCompany] || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DSA Practice Track</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.companyScroll}>
        {COMPANIES.map(company => (
          <TouchableOpacity
            key={company}
            style={[styles.companyChip, selectedCompany === company && styles.companyChipSelected]}
            onPress={() => setSelectedCompany(company)}
          >
            <Text style={[styles.companyText, selectedCompany === company && styles.companyTextSelected]}>
              {company}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
        {questions.map(q => (
          <View key={q.id} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionTitle}>{q.title}</Text>
              <View style={[styles.diffBadge, { backgroundColor: DIFF_COLORS[q.difficulty] + '20' }]}>
                <Text style={[styles.diffText, { color: DIFF_COLORS[q.difficulty] }]}>{q.difficulty}</Text>
              </View>
            </View>
            <View style={styles.questionMeta}>
              <View style={styles.topicTag}>
                <Text style={styles.topicText}>{q.topic}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.practiceButton}
              onPress={() => Linking.openURL(q.leetcodeUrl)}
            >
              <Ionicons name="open-outline" size={16} color={Colors.accent} />
              <Text style={styles.practiceText}>Practice</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: { color: Colors.text, fontSize: FontSizes.title, fontWeight: 'bold', padding: Spacing.lg, paddingBottom: Spacing.sm },
  companyScroll: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  companyChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.card,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  companyChipSelected: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  companyText: { color: Colors.textSecondary, fontSize: FontSizes.body },
  companyTextSelected: { color: '#fff', fontWeight: '600' },
  listContainer: { flex: 1 },
  listContent: { padding: Spacing.lg, paddingTop: 0 },
  questionCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  questionTitle: { color: Colors.text, fontSize: FontSizes.body, fontWeight: '600', flex: 1, marginRight: Spacing.sm },
  diffBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  diffText: { fontSize: 13, fontWeight: '600' },
  questionMeta: { flexDirection: 'row', marginTop: Spacing.sm },
  topicTag: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, backgroundColor: Colors.cardLight },
  topicText: { color: Colors.textSecondary, fontSize: 13 },
  practiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 4,
    marginTop: Spacing.sm,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: Colors.accent + '15',
  },
  practiceText: { color: Colors.accent, fontSize: 14, fontWeight: '600' },
});

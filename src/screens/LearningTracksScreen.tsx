import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../constants/theme';
import { learningResources } from '../services/mockData';

const TABS = [
  { key: 'dsa', label: 'DSA' },
  { key: 'aiml', label: 'AI-ML' },
  { key: 'web', label: 'Web' },
  { key: 'app', label: 'App' },
];

export default function LearningTracksScreen() {
  const [activeTab, setActiveTab] = useState('dsa');
  const filtered = learningResources.filter(r => r.category === activeTab);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
        {filtered.map((resource, i) => (
          <View key={i} style={styles.resourceCard}>
            <View style={styles.resourceHeader}>
              <Text style={styles.resourceName}>{resource.name}</Text>
              <View style={[styles.badge, resource.isFree ? styles.badgeFree : styles.badgePaid]}>
                <Text style={[styles.badgeText, resource.isFree ? styles.badgeTextFree : styles.badgeTextPaid]}>
                  {resource.isFree ? 'FREE' : 'PAID'}
                </Text>
              </View>
            </View>
            <Text style={styles.resourceLearn}>{resource.learn}</Text>
            <TouchableOpacity
              style={styles.visitButton}
              onPress={() => Linking.openURL(resource.url)}
            >
              <Ionicons name="open-outline" size={16} color={Colors.accent} />
              <Text style={styles.visitText}>Visit</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    margin: Spacing.lg,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: { backgroundColor: Colors.accent },
  tabText: { color: Colors.textMuted, fontSize: FontSizes.body, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  listContainer: { flex: 1 },
  listContent: { padding: Spacing.lg, paddingTop: 0 },
  resourceCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  resourceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  resourceName: { color: Colors.text, fontSize: FontSizes.body, fontWeight: '600', flex: 1, marginRight: Spacing.sm },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeFree: { backgroundColor: Colors.success + '20' },
  badgePaid: { backgroundColor: Colors.warning + '20' },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  badgeTextFree: { color: Colors.success },
  badgeTextPaid: { color: Colors.warning },
  resourceLearn: { color: Colors.textSecondary, fontSize: 14, marginTop: Spacing.sm },
  visitButton: {
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
  visitText: { color: Colors.accent, fontSize: 14, fontWeight: '600' },
});

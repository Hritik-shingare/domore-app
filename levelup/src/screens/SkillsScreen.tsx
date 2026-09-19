import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Skill } from '../types';

interface SkillsScreenProps {
  skills: Skill[];
}

const CATEGORIES: Skill['category'][] = ['Fitness', 'Coding', 'Mindset', 'Language', 'Productivity'];

export const SkillsScreen: React.FC<SkillsScreenProps> = ({ skills: initialSkills }) => {
  const [skillsList, setSkillsList] = useState<Skill[]>(initialSkills);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<Skill['category']>('Coding');

  const filteredSkills = selectedCategory === 'All'
    ? skillsList
    : skillsList.filter((s) => s.category === selectedCategory);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: 1,
      progressPercent: 10,
      hoursInvested: 1,
    };
    setSkillsList([newSkill, ...skillsList]);
    setNewSkillName('');
    setIsAddModalVisible(false);
  };

  const getCategoryColor = (category: Skill['category']) => {
    switch (category) {
      case 'Coding': return '#38BDF8';
      case 'Fitness': return '#F97316';
      case 'Mindset': return '#A855F7';
      case 'Language': return '#EC4899';
      case 'Productivity': return '#10B981';
      default: return '#94A3B8';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Add Button */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.screenTitle}>Skills Mastery</Text>
          <Text style={styles.screenSubtitle}>Track deliberate practice & levels</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+ Add Skill</Text>
        </TouchableOpacity>
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        <TouchableOpacity
          style={[styles.catPill, selectedCategory === 'All' && styles.catPillActive]}
          onPress={() => setSelectedCategory('All')}
        >
          <Text style={[styles.catPillText, selectedCategory === 'All' && styles.catPillTextActive]}>
            All ({skillsList.length})
          </Text>
        </TouchableOpacity>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catPill, selectedCategory === cat && styles.catPillActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.catPillText, selectedCategory === cat && styles.catPillTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Skills List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {filteredSkills.map((skill) => {
          const catColor = getCategoryColor(skill.category);
          return (
            <View key={skill.id} style={styles.skillCard}>
              <View style={styles.cardTop}>
                <View>
                  <View style={[styles.categoryBadge, { backgroundColor: `${catColor}20` }]}>
                    <Text style={[styles.categoryText, { color: catColor }]}>{skill.category}</Text>
                  </View>
                  <Text style={styles.skillName}>{skill.name}</Text>
                </View>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelNumber}>LVL {skill.level}</Text>
                </View>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressLabels}>
                  <Text style={styles.hoursText}>{skill.hoursInvested} hrs invested</Text>
                  <Text style={styles.percentText}>{skill.progressPercent}% to next level</Text>
                </View>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${skill.progressPercent}%`, backgroundColor: catColor }]} />
                </View>
              </View>
            </View>
          );
        })}

        {filteredSkills.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No skills found in this category.</Text>
          </View>
        )}
      </ScrollView>

      {/* Add Skill Modal */}
      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Skill</Text>
            <Text style={styles.inputLabel}>Skill Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Python, Public Speaking, Guitar"
              placeholderTextColor="#64748B"
              value={newSkillName}
              onChangeText={setNewSkillName}
            />

            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categoryPicker}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.pickerOption,
                    newSkillCategory === cat && styles.pickerOptionSelected,
                  ]}
                  onPress={() => setNewSkillCategory(cat)}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      newSkillCategory === cat && styles.pickerOptionTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsAddModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, !newSkillName.trim() && styles.disabledButton]}
                onPress={handleAddSkill}
                disabled={!newSkillName.trim()}
              >
                <Text style={styles.confirmButtonText}>Create Skill</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  categoryScroll: {
    maxHeight: 48,
    marginBottom: 8,
  },
  categoryContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  catPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#131D31',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  catPillActive: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  catPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 12,
  },
  skillCard: {
    backgroundColor: '#131D31',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  levelBadge: {
    backgroundColor: '#1E293B',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  levelNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  progressSection: {
    marginTop: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  hoursText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  percentText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
  },
  progressBg: {
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#131D31',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#F8FAFC',
    fontSize: 14,
    marginBottom: 16,
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  pickerOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  pickerOptionSelected: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  pickerOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  pickerOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const DIETS = [
  { id: 'normal', label: 'Bình thường', icon: 'restaurant-outline' },
  { id: 'keto', label: 'Keto', icon: 'fitness-outline' },
  { id: 'vegan', label: 'Thuần chay', icon: 'leaf-outline' },
  { id: 'vegetarian', label: 'Ăn chay', icon: 'nutrition-outline' },
  { id: 'low_carb', label: 'Low Carb', icon: 'barbell-outline' },
];

const ALLERGIES = [
  { id: 'peanut', label: 'Đậu phộng' },
  { id: 'gluten', label: 'Gluten' },
  { id: 'dairy', label: 'Sữa (Dairy)' },
  { id: 'seafood', label: 'Hải sản' },
  { id: 'eggs', label: 'Trứng' },
];

export default function SurveyScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const [selectedDiet, setSelectedDiet] = useState('normal');
  const [avoidedIngredients, setAvoidedIngredients] = useState<string[]>([]);

  const handleToggleIngredient = (id: string) => {
    if (avoidedIngredients.includes(id)) {
      setAvoidedIngredients(avoidedIngredients.filter((item) => item !== id));
    } else {
      setAvoidedIngredients([...avoidedIngredients, id]);
    }
  };

  const handleFinish = () => {
    // Navigate back or to recommendations
    // Here we can store preferences to global state, AsyncStorage, or API
    console.log("Selected Diet:", selectedDiet);
    console.log("Avoid:", avoidedIngredients);
    alert('Đã lưu sở thích của bạn!');
    if(router.canGoBack()) {
        router.back();
    } else {
        router.push('/');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        {router.canGoBack() && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, { color: theme.text }]}>Sở thích ăn uống</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Chế độ ăn của bạn là gì?</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.icon }]}>Giúp chúng tôi gợi ý món ăn phù hợp nhất</Text>
          
          <View style={styles.optionsList}>
            {DIETS.map((diet) => {
              const isSelected = selectedDiet === diet.id;
              return (
                <TouchableOpacity
                  key={diet.id}
                  style={[
                    styles.optionCard,
                    { backgroundColor: theme.background, borderColor: isSelected ? '#ff6b6b' : (colorScheme === 'dark' ? '#333' : '#eee') },
                    isSelected && styles.optionCardSelected
                  ]}
                  onPress={() => setSelectedDiet(diet.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={diet.icon as any} size={24} color={isSelected ? '#ff6b6b' : theme.icon} />
                  <Text style={[styles.optionText, { color: isSelected ? '#ff6b6b' : theme.text }]}>
                    {diet.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark-circle" size={20} color="#ff6b6b" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Bạn có dị ứng hay kiêng gì không?</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.icon }]}>Có thể chọn nhiều mục</Text>
          
          <View style={styles.chipContainer}>
            {ALLERGIES.map((allergy) => {
              const isSelected = avoidedIngredients.includes(allergy.id);
              return (
                <TouchableOpacity
                  key={allergy.id}
                  style={[
                    styles.chip,
                    { backgroundColor: isSelected ? '#ff6b6b' : (colorScheme === 'dark' ? '#2c2c2c' : '#f0f0f0') }
                  ]}
                  onPress={() => handleToggleIngredient(allergy.id)}
                >
                  <Text style={[
                      styles.chipText, 
                      { color: isSelected ? '#fff' : theme.text, fontWeight: isSelected ? '600' : '400'}
                  ]}>
                    {allergy.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        
        {/* Placeholder for future expansion like Goals / Budget */}

      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: colorScheme === 'dark' ? '#333' : '#eee' }]}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleFinish}>
          <Text style={styles.primaryButtonText}>Lưu thiết lập</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  optionCardSelected: {
    backgroundColor: '#fff5f5', 
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
  },
  primaryButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const dietTypes = [
  { id: 'keto', name: 'Keto', icon: '🥑', description: 'Ít carb, nhiều chất béo' },
  { id: 'vegan', name: 'Thuần Chay', icon: '🥬', description: 'Không sản phẩm động vật' },
  { id: 'vegetarian', name: 'Chay', icon: '🌿', description: 'Không thịt cá' },
  { id: 'lowfat', name: 'Ít Chất Béo', icon: '🥗', description: 'Giảm chất béo' },
  { id: 'glutenfree', name: 'Không Gluten', icon: '🌾', description: 'Cho người dị ứng gluten' },
  { id: 'diabetes', name: 'Tiểu Đường', icon: '🩺', description: 'Kiểm soát đường huyết' },
];

const allergyTypes = [
  { id: 'peanut', name: 'Đậu phộng', icon: '🥜' },
  { id: 'seafood', name: 'Hải sản', icon: '🦐' },
  { id: 'egg', name: 'Trứng', icon: '🥚' },
  { id: 'milk', name: 'Sữa', icon: '🥛' },
  { id: 'soy', name: 'Đậu nành', icon: '🫘' },
  { id: 'wheat', name: 'Lúa mì', icon: '🌾' },
];

const tasteOptions = [
  { id: 'spicy', name: 'Cay', icon: '🌶️' },
  { id: 'sweet', name: 'Ngọt', icon: '🍯' },
  { id: 'sour', name: 'Chua', icon: '🍋' },
  { id: 'salty', name: 'Mặn', icon: '🧂' },
  { id: 'umami', name: 'Umami', icon: '🍄' },
];

const cookingTimeOptions = [
  { id: 'quick', name: 'Nhanh (< 30p)', icon: '⚡' },
  { id: 'medium', name: 'Trung bình (30-60p)', icon: '⏱️' },
  { id: 'long', name: 'Lâu (> 60p)', icon: '🔰' },
];

export default function PreferenceScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [selectedDiet, setSelectedDiet] = useState(null);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [selectedTastes, setSelectedTastes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const toggleAllergy = (id) => {
    if (selectedAllergies.includes(id)) {
      setSelectedAllergies(selectedAllergies.filter(a => a !== id));
    } else {
      setSelectedAllergies([...selectedAllergies, id]);
    }
  };

  const toggleTaste = (id) => {
    if (selectedTastes.includes(id)) {
      setSelectedTastes(selectedTastes.filter(t => t !== id));
    } else {
      setSelectedTastes([...selectedTastes, id]);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const preferences = {
        dietType: selectedDiet,
        allergies: selectedAllergies,
        tastes: selectedTastes,
        cookingTime: selectedTime,
      };

      console.log('Saving preferences:', preferences);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      Alert.alert(
        '✅ Thành công!',
        'Đã lưu sở thích của bạn. Chúng tôi sẽ gợi ý món ăn phù hợp!',
        [
          {
            text: 'Xem gợi ý',
            onPress: () => router.push('/(tabs)/recommendations'),
          },
          {
            text: 'Quay lại',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu sở thích. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return true; // Diet is optional
      case 2:
        return true; // Allergies optional
      case 3:
        return true; // Tastes optional
      case 4:
        return true; // Time optional
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Chế độ ăn uống của bạn?</Text>
            <Text style={styles.stepSubtitle}>
              Chọn chế độ ăn phù hợp để nhận gợi ý tốt hơn
            </Text>

            <TouchableOpacity
              style={[styles.dietCard, selectedDiet === null && styles.dietCardSelected]}
              onPress={() => setSelectedDiet(null)}
            >
              <Text style={styles.dietIcon}>🍽️</Text>
              <Text style={styles.dietName}>Tất cả</Text>
              <Text style={styles.dietDescription}>Không giới hạn</Text>
            </TouchableOpacity>

            {dietTypes.map((diet) => (
              <TouchableOpacity
                key={diet.id}
                style={[styles.dietCard, selectedDiet === diet.id && styles.dietCardSelected]}
                onPress={() => setSelectedDiet(diet.id)}
              >
                <Text style={styles.dietIcon}>{diet.icon}</Text>
                <View style={styles.dietInfo}>
                  <Text style={styles.dietName}>{diet.name}</Text>
                  <Text style={styles.dietDescription}>{diet.description}</Text>
                </View>
                {selectedDiet === diet.id && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Bạn dị ứng gì?</Text>
            <Text style={styles.stepSubtitle}>
              Chọn các thực phẩm bạn không thể ăn
            </Text>

            <View style={styles.chipGrid}>
              {allergyTypes.map((allergy) => {
                const isSelected = selectedAllergies.includes(allergy.id);
                return (
                  <TouchableOpacity
                    key={allergy.id}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => toggleAllergy(allergy.id)}
                  >
                    <Text style={styles.chipIcon}>{allergy.icon}</Text>
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {allergy.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedAllergies.length === 0 && (
              <TouchableOpacity style={styles.skipOption} onPress={() => setStep(3)}>
                <Text style={styles.skipText}>Không có dị ứng →</Text>
              </TouchableOpacity>
            )}
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Bạn thích vị gì?</Text>
            <Text style={styles.stepSubtitle}>
              Chọn khẩu vị yêu thích của bạn
            </Text>

            <View style={styles.chipGrid}>
              {tasteOptions.map((taste) => {
                const isSelected = selectedTastes.includes(taste.id);
                return (
                  <TouchableOpacity
                    key={taste.id}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => toggleTaste(taste.id)}
                  >
                    <Text style={styles.chipIcon}>{taste.icon}</Text>
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {taste.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Bạn có bao nhiêu thời gian?</Text>
            <Text style={styles.stepSubtitle}>
              Chọn thời gian bạn muốn nấu
            </Text>

            <TouchableOpacity
              style={[styles.timeCard, selectedTime === null && styles.timeCardSelected]}
              onPress={() => setSelectedTime(null)}
            >
              <Text style={styles.timeIcon}>⏰</Text>
              <Text style={styles.timeName}>Tất cả</Text>
            </TouchableOpacity>

            {cookingTimeOptions.map((time) => (
              <TouchableOpacity
                key={time.id}
                style={[styles.timeCard, selectedTime === time.id && styles.timeCardSelected]}
                onPress={() => setSelectedTime(time.id)}
              >
                <Text style={styles.timeIcon}>{time.icon}</Text>
                <Text style={styles.timeName}>{time.name}</Text>
                {selectedTime === time.id && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()}>
          <Text style={styles.backButton}>{step > 1 ? '←' : '×'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Khảo sát sở thích</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4].map((s) => (
          <View
            key={s}
            style={[styles.progressDot, step >= s && styles.progressDotActive]}
          />
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderStep()}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        {step < 4 ? (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => setStep(step + 1)}
          >
            <Text style={styles.nextButtonText}>Tiếp tục</Text>
            <Text style={styles.nextButtonIcon}>→</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.saveButtonIcon}>✓</Text>
                <Text style={styles.saveButtonText}>Lưu & Gợi ý</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    fontSize: 28,
    color: '#374151',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 28,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  progressDot: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
  },
  progressDotActive: {
    backgroundColor: '#EA580C',
  },
  scrollView: {
    flex: 1,
  },
  stepContent: {
    paddingHorizontal: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  dietCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  dietCardSelected: {
    borderColor: '#EA580C',
    backgroundColor: '#FFF7ED',
  },
  dietIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  dietInfo: {
    flex: 1,
  },
  dietName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  dietDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  checkmark: {
    fontSize: 20,
    color: '#EA580C',
    fontWeight: '700',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
  },
  chipSelected: {
    backgroundColor: '#FFF7ED',
    borderColor: '#EA580C',
  },
  chipIcon: {
    fontSize: 18,
  },
  chipText: {
    fontSize: 14,
    color: '#6B7280',
  },
  chipTextSelected: {
    color: '#EA580C',
    fontWeight: '600',
  },
  skipOption: {
    marginTop: 20,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    color: '#6B7280',
  },
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  timeCardSelected: {
    borderColor: '#EA580C',
    backgroundColor: '#FFF7ED',
  },
  timeIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  timeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EA580C',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  nextButtonIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

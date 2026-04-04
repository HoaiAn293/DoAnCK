import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';

const moods = [
  { id: 'happy', name: 'Vui vẻ', icon: '😊', color: '#FFD700' },
  { id: 'sad', name: 'Buồn', icon: '😢', color: '#4169E1' },
  { id: 'stressed', name: 'Căng thẳng', icon: '😰', color: '#9370DB' },
  { id: 'lazy', name: 'Lười biếng', icon: '😴', color: '#90EE90' },
  { id: 'romantic', name: 'Lãng mạn', icon: '💕', color: '#FF69B4' },
  { id: 'energetic', name: 'Năng động', icon: '💪', color: '#FF6347' },
];

export default function RecommendationsScreen() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState(null);
  const [spinResult, setSpinResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  // Mock recommendations data
  const mockRecommendations = [
    {
      id: '1',
      name: 'Phở Bò Hà Nội',
      time: 45,
      rating: 4.8,
      author: 'Chef Nguyễn',
      difficulty: 'Trung bình',
      image: 'https://images.unsplash.com/photo-1583224964978-2257b1c1c8e4?w=400',
      matchReason: 'Phù hợp với tâm trạng của bạn!',
    },
    {
      id: '4',
      name: 'Mì Trộn Hàn Quốc',
      time: 25,
      rating: 4.7,
      author: 'Korean Food',
      difficulty: 'Dễ',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
      matchReason: 'Nhanh và ngon!',
    },
    {
      id: '3',
      name: 'Salad Rau Trộn',
      time: 15,
      rating: 4.5,
      author: 'Healthy Food',
      difficulty: 'Dễ',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      matchReason: 'Nhẹ nhàng và tươi mát!',
    },
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setShowMoodSelector(false);
    spinWheel(mood);
  };

  const spinWheel = (mood) => {
    setIsSpinning(true);

    // Simulate spinning animation
    setTimeout(() => {
      const randomRecipe = mockRecommendations[Math.floor(Math.random() * mockRecommendations.length)];
      setSpinResult(randomRecipe);
      setRecommendations(mockRecommendations);
      setIsSpinning(false);
    }, 2000);
  };

  const handleSpinAgain = () => {
    setShowMoodSelector(true);
    setSpinResult(null);
    setRecommendations([]);
  };

  const openRecipeDetail = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };

  // Mood Selector View
  if (showMoodSelector) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🎡 Vòng quay món ăn</Text>
            <Text style={styles.subtitle}>
              Chọn tâm trạng để nhận gợi ý món ăn phù hợp!
            </Text>
          </View>

          {/* Mood Grid */}
          <View style={styles.moodGrid}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[styles.moodCard, { borderColor: mood.color }]}
                onPress={() => handleMoodSelect(mood)}
              >
                <View style={[styles.moodIconContainer, { backgroundColor: mood.color + '20' }]}>
                  <Text style={styles.moodIcon}>{mood.icon}</Text>
                </View>
                <Text style={styles.moodName}>{mood.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom Info */}
          <View style={styles.infoSection}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              Vòng quay sẽ gợi ý món ăn dựa trên tâm trạng của bạn
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Spinning View
  if (isSpinning) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.spinningContainer}>
          <Text style={styles.spinningTitle}>Đang chọn món ăn...</Text>
          <View style={styles.spinner}>
            <Text style={styles.spinnerEmoji}>🍜</Text>
          </View>
          <Text style={styles.spinningMood}>{selectedMood?.icon} {selectedMood?.name}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Results View
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Result Header */}
        <View style={styles.resultHeader}>
          <View style={styles.resultBadge}>
            <Text style={styles.resultBadgeIcon}>{selectedMood?.icon}</Text>
            <Text style={styles.resultBadgeText}>{selectedMood?.name}</Text>
          </View>
          <Text style={styles.resultTitle}>
            {spinResult ? 'Gợi ý cho bạn!' : 'Chọn tâm trạng của bạn'}
          </Text>
          <TouchableOpacity style={styles.spinAgainButton} onPress={handleSpinAgain}>
            <Text style={styles.spinAgainText}>🔄 Quay lại</Text>
          </TouchableOpacity>
        </View>

        {/* Recipe List */}
        <View style={styles.recipeList}>
          {recommendations.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              onPress={() => openRecipeDetail(recipe)}
            >
              <Image
                source={{ uri: recipe.image }}
                style={styles.recipeImage}
                contentFit="cover"
              />
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName} numberOfLines={2}>{recipe.name}</Text>
                <Text style={styles.recipeMeta}>⏱️ {recipe.time} phút • ⭐ {recipe.rating}</Text>
                <View style={styles.matchBadge}>
                  <Text style={styles.matchText}>{recipe.matchReason}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Recipe Detail Modal */}
      <Modal
        visible={showRecipeModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRecipeModal(false)}
      >
        {selectedRecipe && (
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowRecipeModal(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>

              <Image
                source={{ uri: selectedRecipe.image }}
                style={styles.modalImage}
                contentFit="cover"
              />

              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedRecipe.name}</Text>
                <View style={styles.modalMeta}>
                  <Text style={styles.modalMetaText}>⏱️ {selectedRecipe.time} phút</Text>
                  <Text style={styles.modalMetaText}>⭐ {selectedRecipe.rating}</Text>
                  <Text style={styles.modalMetaText}>👨‍🍳 {selectedRecipe.difficulty}</Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>❤️</Text>
                    <Text style={styles.actionText}>Yêu thích</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>🛒</Text>
                    <Text style={styles.actionText}>Mua nguyên liệu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>📤</Text>
                    <Text style={styles.actionText}>Chia sẻ</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.viewDetailButton}
                  onPress={() => {
                    setShowRecipeModal(false);
                    router.push('/(tabs)/search');
                  }}
                >
                  <Text style={styles.viewDetailText}>Xem công thức chi tiết →</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  moodCard: {
    width: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodIcon: {
    fontSize: 32,
  },
  moodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 20,
    gap: 8,
  },
  infoIcon: {
    fontSize: 18,
  },
  infoText: {
    fontSize: 12,
    color: '#9CA3AF',
    flex: 1,
  },
  spinningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinningTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 24,
  },
  spinner: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#EA580C',
  },
  spinnerEmoji: {
    fontSize: 64,
  },
  spinningMood: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 20,
  },
  resultHeader: {
    padding: 20,
    alignItems: 'center',
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginBottom: 12,
  },
  resultBadgeIcon: {
    fontSize: 20,
  },
  resultBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EA580C',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  spinAgainButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  spinAgainText: {
    fontSize: 14,
    color: '#6B7280',
  },
  recipeList: {
    padding: 20,
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recipeImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  recipeInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  recipeMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  matchBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  matchText: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  closeButtonText: {
    fontSize: 28,
    color: '#374151',
    fontWeight: '300',
  },
  modalImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#F3F4F6',
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  modalMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  modalMetaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: {
    fontSize: 28,
  },
  actionText: {
    fontSize: 12,
    color: '#6B7280',
  },
  viewDetailButton: {
    backgroundColor: '#EA580C',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewDetailText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

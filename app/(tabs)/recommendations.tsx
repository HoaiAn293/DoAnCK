// @ts-nocheck
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { RecipeDetailModal } from '../../components/RecipeDetailModal';

const moods = [
  { id: 'happy', name: 'Vui vẻ', icon: '😊', color: '#FFD700' },
  { id: 'sad', name: 'Buồn', icon: '😢', color: '#4169E1' },
  { id: 'stressed', name: 'Căng thẳng', icon: '😰', color: '#9370DB' },
  { id: 'lazy', name: 'Lười biếng', icon: '😴', color: '#90EE90' },
  { id: 'romantic', name: 'Lãng mạn', icon: '💕', color: '#FF69B4' },
  { id: 'energetic', name: 'Năng động', icon: '💪', color: '#FF6347' },
];

// Map mood -> keyword để filter từ API
const moodKeywords: Record<string, string[]> = {
  happy: ['ăn', 'ngon', 'vui', 'party', 'món', 'bữa'],
  sad: ['canh', 'súp', 'nóng', 'ấm', 'comfort', 'cheese'],
  stressed: ['nhanh', 'đơn giản', 'easy', 'salad', 'trái cây'],
  lazy: ['nhanh', 'đơn giản', 'easy', 'ổ bánh mì', 'bento'],
  romantic: ['tráng miệng', 'ngọt', 'bánh', 'cake', 'món ngọt', 'wine'],
  energetic: ['năng lượng', 'protein', 'thịt', 'gà', 'bò', 'cơm'],
};

export default function RecommendationsScreen() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    setShowMoodSelector(false);
    setIsSpinning(true);

    // Simulate spinning delay
    setTimeout(async () => {
      try {
        // Gọi API filterByIngredients với keywords theo mood
        const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
        const keywords = moodKeywords[mood.id] || [];
        if (keywords.length > 0) {
          const response = await fetch(`${apiUrl}/products/filter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredients: keywords }),
          });
          const data = await response.json();
          if (data.success && data.data.length > 0) {
            setRecipes(data.data);
          } else {
            // Fallback: lấy all products
            const allRes = await fetch(`${apiUrl}/products?limit=20`);
            const allData = await allRes.json();
            setRecipes(allData.data || []);
          }
        } else {
          const allRes = await fetch(`${apiUrl}/products?limit=20`);
          const allData = await allRes.json();
          setRecipes(allData.data || []);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setRecipes([]);
      }
      setIsSpinning(false);
    }, 2000);
  };

  const handleSpinAgain = () => {
    setShowMoodSelector(true);
    setRecipes([]);
    setSelectedMood(null);
  };

  const openRecipeDetail = (recipe) => {
    setSelectedRecipe(recipe);
    setDetailModalVisible(true);
  };

  // Mood Selector View
  if (showMoodSelector) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>🎡 Vòng quay món ăn</Text>
            <Text style={styles.subtitle}>
              Chọn tâm trạng để nhận gợi ý món ăn phù hợp!
            </Text>
          </View>

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
        <View style={styles.centered}>
          <Text style={styles.spinningTitle}>Đang chọn món ăn...</Text>
          <View style={styles.spinner}>
            <Text style={styles.spinnerEmoji}>🍜</Text>
          </View>
          {selectedMood && (
            <Text style={styles.spinningMood}>{selectedMood.icon} {selectedMood.name}</Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Results View
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.resultHeader}>
          {selectedMood && (
            <View style={[styles.resultBadge, { backgroundColor: selectedMood.color + '20' }]}>
              <Text style={styles.resultBadgeIcon}>{selectedMood.icon}</Text>
              <Text style={[styles.resultBadgeText, { color: selectedMood.color }]}>{selectedMood.name}</Text>
            </View>
          )}
          <Text style={styles.resultTitle}>
            {recipes.length > 0 ? 'Gợi ý cho bạn!' : 'Không tìm thấy món phù hợp'}
          </Text>
          <TouchableOpacity style={styles.spinAgainButton} onPress={handleSpinAgain}>
            <Text style={styles.spinAgainText}>🔄 Quay lại</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#EA580C" style={{ marginTop: 40 }} />
        ) : recipes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>😢</Text>
            <Text style={styles.emptyText}>Không có món ăn nào cho tâm trạng này</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleSpinAgain}>
              <Text style={styles.addButtonText}>Thử tâm trạng khác</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.recipeList}>
            {recipes.map((recipe) => (
              <TouchableOpacity
                key={recipe._id}
                style={styles.recipeCard}
                onPress={() => openRecipeDetail(recipe)}
              >
                <Image
                  source={{ uri: recipe.thumbnail || recipe.image || 'https://via.placeholder.com/100x100' }}
                  style={styles.recipeImage}
                />
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeName} numberOfLines={2}>{recipe.name}</Text>
                  <Text style={styles.recipeMeta}>
                    ⏱ {recipe.duration} phút
                  </Text>
                  {recipe.ingredients && recipe.ingredients.length > 0 && (
                    <View style={styles.ingredientRow}>
                      {recipe.ingredients.slice(0, 2).map((ing, i) => (
                        <View key={i} style={styles.ingredientTag}>
                          <Text style={styles.ingredientTagText}>{ing}</Text>
                        </View>
                      ))}
                      {recipe.ingredients.length > 2 && (
                        <Text style={styles.moreTag}>+{recipe.ingredients.length - 2}</Text>
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <RecipeDetailModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        recipe={selectedRecipe}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { paddingBottom: 100 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center' },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 16, gap: 12 },
  moodCard: {
    width: '45%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  moodIconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  moodIcon: { fontSize: 30 },
  moodName: { fontSize: 14, fontWeight: '600', color: '#374151' },
  infoSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 8 },
  infoIcon: { fontSize: 20 },
  infoText: { fontSize: 13, color: '#9CA3AF', flex: 1 },
  spinningTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 20 },
  spinner: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF3E0',
    justifyContent: 'center', alignItems: 'center', shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4,
  },
  spinnerEmoji: { fontSize: 50 },
  spinningMood: { fontSize: 18, color: '#6B7280', marginTop: 16 },
  resultHeader: { padding: 20, alignItems: 'center' },
  resultBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 12 },
  resultBadgeIcon: { fontSize: 20, marginRight: 6 },
  resultBadgeText: { fontSize: 16, fontWeight: '700' },
  resultTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  spinAgainButton: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#E5E7EB', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  spinAgainText: { color: '#6B7280', fontSize: 14, fontWeight: '500' },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', marginBottom: 20 },
  addButton: { backgroundColor: '#EA580C', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25 },
  addButtonText: { color: '#FFF', fontWeight: '600' },
  recipeList: { paddingHorizontal: 16 },
  recipeCard: { backgroundColor: '#FFF', borderRadius: 16, marginBottom: 12, flexDirection: 'row', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  recipeImage: { width: 100, height: 100 },
  recipeInfo: { flex: 1, padding: 12 },
  recipeName: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  recipeMeta: { fontSize: 13, color: '#6B7280', marginBottom: 6 },
  ingredientRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  ingredientTag: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  ingredientTagText: { fontSize: 11, color: '#92400E' },
  moreTag: { fontSize: 11, color: '#9CA3AF', alignSelf: 'center' },
});

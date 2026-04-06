// @ts-nocheck
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import recipeService from '../../services/recipeService';

const commonIngredients = [
  'thịt heo',
  'thịt gà',
  'thịt bò',
  'tôm',
  'cá',
  'trứng',
  'hành',
  'tỏi',
  'cà chua',
  'cà rốt',
  'bông cải',
  'nấm',
  'đậu',
  'gạo',
  'mì',
  'phô mai',
  'sữa',
  'bơ',
  'cơm',
  'bún',
];

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  // Toggle ingredient selection
  const toggleIngredient = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  // Add custom ingredient
  const handleAddIngredient = () => {
    if (searchText.trim()) {
      const normalized = searchText.trim().toLowerCase();
      if (!selectedIngredients.includes(normalized)) {
        setSelectedIngredients([...selectedIngredients, normalized]);
      }
      setSearchText('');
    }
  };

  // Remove ingredient
  const removeIngredient = (ingredient) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
  };

  // Search recipes by ingredients
  const handleSearch = async () => {
    try {
      setLoading(true);
      setShowResults(true);

      const response = await recipeService.searchByIngredients(selectedIngredients);

      if (response.success) {
        setResults(response.recipes || []);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Open recipe detail
  const openRecipeDetail = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tìm Món Từ Nguyên Liệu</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Question */}
          <Text style={styles.question}>Bạn có gì trong tủ lạnh?</Text>
          <Text style={styles.description}>
            Chọn ít nhất 1 nguyên liệu để nhận gợi ý tốt nhất.
          </Text>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Nhập tôm, ức, trứng..."
                placeholderTextColor="#9CA3AF"
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleAddIngredient}
                returnKeyType="done"
              />
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddIngredient}
            >
              <Text style={styles.addButtonText}>+ Thêm</Text>
            </TouchableOpacity>
          </View>

          {/* Selected Ingredients */}
          {selectedIngredients.length > 0 && (
            <View style={styles.selectedSection}>
              <Text style={styles.selectedTitle}>
                Đã chọn ({selectedIngredients.length}):
              </Text>
              <View style={styles.selectedTags}>
                {selectedIngredients.map((ingredient, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.selectedTag}
                    onPress={() => removeIngredient(ingredient)}
                  >
                    <Text style={styles.selectedTagText}>{ingredient}</Text>
                    <Text style={styles.removeIcon}>×</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Common Ingredients Grid */}
          <View style={styles.ingredientsSection}>
            <Text style={styles.ingredientsTitle}>Nguyên liệu phổ biến</Text>
            <View style={styles.ingredientsGrid}>
              {commonIngredients.map((ingredient, index) => {
                const isSelected = selectedIngredients.includes(ingredient);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.ingredientChip,
                      isSelected && styles.ingredientChipSelected,
                    ]}
                    onPress={() => toggleIngredient(ingredient)}
                  >
                    <Text
                      style={[
                        styles.ingredientText,
                        isSelected && styles.ingredientTextSelected,
                      ]}
                    >
                      {ingredient}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Search Results */}
          {showResults && (
            <View style={styles.resultsSection}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#EA580C" />
                  <Text style={styles.loadingText}>Đang tìm công thức...</Text>
                </View>
              ) : results.length > 0 ? (
                <>
                  <Text style={styles.resultsTitle}>
                    Tìm thấy {results.length} công thức
                  </Text>
                  {results.map((recipe) => (
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
                        <Text style={styles.recipeName} numberOfLines={2}>
                          {recipe.name}
                        </Text>
                        <Text style={styles.recipeMeta}>
                          ⏱️ {recipe.time} phút • 👨‍🍳 {recipe.author}
                        </Text>
                        <View style={styles.ratingRow}>
                          <Text style={styles.rating}>⭐ {recipe.rating}</Text>
                          <View style={styles.difficultyBadge}>
                            <Text style={styles.difficultyText}>
                              {recipe.difficulty}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsEmoji}>🍽️</Text>
                  <Text style={styles.noResultsText}>
                    Không tìm thấy công thức nào
                  </Text>
                  <Text style={styles.noResultsSubtext}>
                    Thử thêm nguyên liệu khác nhé!
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[
            styles.suggestButton,
            selectedIngredients.length === 0 && styles.suggestButtonDisabled,
          ]}
          onPress={handleSearch}
          disabled={selectedIngredients.length === 0 || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.suggestButtonEmoji}>🍳</Text>
              <Text style={styles.suggestButtonText}>Gợi ý món ngay</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

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
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowRecipeModal(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>

              {/* Recipe Image */}
              <Image
                source={{ uri: selectedRecipe.image }}
                style={styles.modalImage}
                contentFit="cover"
              />

              {/* Recipe Info */}
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedRecipe.name}</Text>
                <Text style={styles.modalDescription}>{selectedRecipe.description}</Text>

                {/* Quick Info */}
                <View style={styles.quickInfo}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoIcon}>⏱️</Text>
                    <Text style={styles.infoValue}>{selectedRecipe.time} phút</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoIcon}>👨‍🍳</Text>
                    <Text style={styles.infoValue}>{selectedRecipe.author}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoIcon}>⭐</Text>
                    <Text style={styles.infoValue}>{selectedRecipe.rating}</Text>
                  </View>
                </View>

                {/* Ingredients */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Nguyên liệu</Text>
                  <View style={styles.ingredientsList}>
                    {selectedRecipe.ingredients?.map((ing, index) => (
                      <View key={index} style={styles.ingredientItem}>
                        <Text style={styles.ingredientBullet}>•</Text>
                        <Text style={styles.ingredientItemText}>{ing}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Steps */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Các bước</Text>
                  {selectedRecipe.steps?.map((step, index) => (
                    <View key={index} style={styles.stepItem}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  question: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
  selectedSection: {
    marginBottom: 16,
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C',
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: 20,
    gap: 6,
  },
  selectedTagText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  removeIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  ingredientsSection: {
    marginBottom: 20,
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 14,
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ingredientChip: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  ingredientChipSelected: {
    backgroundColor: '#FFF7ED',
    borderColor: '#EA580C',
  },
  ingredientText: {
    fontSize: 14,
    color: '#6B7280',
  },
  ingredientTextSelected: {
    color: '#EA580C',
    fontWeight: '600',
  },
  resultsSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  difficultyBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    color: '#6B7280',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  bottomPadding: {
    height: 100,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  suggestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EA580C',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  suggestButtonDisabled: {
    backgroundColor: '#FCD9C4',
    shadowOpacity: 0,
    elevation: 0,
  },
  suggestButtonEmoji: {
    fontSize: 20,
  },
  suggestButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  // Modal styles
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
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 22,
  },
  quickInfo: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoIcon: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  ingredientsList: {
    gap: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  ingredientBullet: {
    fontSize: 14,
    color: '#EA580C',
    fontWeight: '700',
  },
  ingredientItemText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EA580C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 22,
  },
});

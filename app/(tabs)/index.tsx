import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { RecipeDetailModal } from '../../components/RecipeDetailModal';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ALL_CATEGORIES = [
  { id: 'all', name: 'Tất cả', emoji: '🍽️', color: '#6B7280' },
  { id: 'mon-viet', name: 'Món Việt', emoji: '🍜', color: '#FF6B6B' },
  { id: 'mon-a', name: 'Món Á', emoji: '🍱', color: '#4ECDC4' },
  { id: 'mon-au', name: 'Món Âu', emoji: '🍕', color: '#FFE66D' },
  { id: 'mon-nhat', name: 'Món Nhật', emoji: '🍣', color: '#FF9F43' },
  { id: 'mon-han', name: 'Món Hàn', emoji: '🥘', color: '#A55EEA' },
  { id: 'trang-mieng', name: 'Tráng miệng', emoji: '🍰', color: '#FF85B3' },
  { id: 'do-uong', name: 'Đồ uống', emoji: '🥤', color: '#26DE81' },
  { id: 'mon-chay', name: 'Món chay', emoji: '🌿', color: '#0FB9B1' },
];

interface Recipe {
  _id: string;
  name: string;
  description?: string;
  duration?: number;
  time?: number | string;
  rating?: number;
  author?: string;
  image?: string;
  thumbnail?: string;
  images?: string[];
  ingredients?: string[];
  price?: number;
  categoryId?: { _id: string; name: string; slug?: string };
  isActive?: boolean;
}

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, searchQuery, recipes]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const res = await api.getProducts('limit=100');
      const data = res.data?.data || res.data || [];
      setRecipes(data);
    } catch (e) {
      console.error('Load recipes error:', e);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...recipes];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(r => {
        const slug = r.categoryId?.slug || r.categoryId?.name?.toLowerCase().replace(/\s+/g, '-') || '';
        return slug.includes(selectedCategory);
      });
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.name?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.ingredients?.some(i => i.toLowerCase().includes(q))
      );
    }

    setFilteredRecipes(result);
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleRecipePress = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setDetailModalVisible(true);
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/Login');
  };

  const getImageUri = (recipe: Recipe) => {
    return recipe.thumbnail || recipe.image || recipe.images?.[0] || '';
  };

  const getDisplayTime = (recipe: Recipe) => {
    const t = recipe.duration || recipe.time;
    if (typeof t === 'number') return `${t} phút`;
    return t || '';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Xin chào!</Text>
            <Text style={styles.userName}>{user?.name || 'Khách'}</Text>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={() => router.push('/profile')}>
            <Text style={styles.avatarText}>
              {(user?.name ?? 'U').charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Hôm nay ăn gì?</Text>
            <Text style={styles.bannerSubtitle}>Khám phá 1000+ công thức</Text>
            <TouchableOpacity style={styles.bannerButton}
              onPress={() => setSelectedCategory('all')}>
              <Text style={styles.bannerButtonText}>Khám phá ngay</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.bannerEmoji}>🍳</Text>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Danh mục món ăn</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {ALL_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryCard,
                    isActive && { borderColor: cat.color, borderWidth: 2, backgroundColor: cat.color + '15' },
                  ]}
                  onPress={() => handleCategoryPress(cat.id)}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                    <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  </View>
                  <Text style={[styles.categoryName, isActive && { color: cat.color, fontWeight: '700' }]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Recipes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              🔥 {selectedCategory === 'all' ? 'Tất cả món' : ALL_CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Món ăn'}
              {loading ? '' : ` (${filteredRecipes.length})`}
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#EA580C" style={{ marginTop: 20 }} />
          ) : filteredRecipes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Không tìm thấy món phù hợp' : 'Chưa có món ăn nào'}
              </Text>
            </View>
          ) : (
            filteredRecipes.map((recipe) => (
              <TouchableOpacity
                key={recipe._id}
                style={styles.recipeCard}
                onPress={() => handleRecipePress(recipe)}
              >
                <Image
                  source={{ uri: getImageUri(recipe) }}
                  style={styles.recipeImage}
                  placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                  transition={200}
                />
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeName} numberOfLines={2}>{recipe.name}</Text>
                  {getDisplayTime(recipe) ? (
                    <Text style={styles.recipeMeta}>⏱ {getDisplayTime(recipe)}</Text>
                  ) : null}
                  {recipe.categoryId?.name ? (
                    <View style={styles.categoryBadgeSmall}>
                      <Text style={styles.categoryBadgeText}>{recipe.categoryId.name}</Text>
                    </View>
                  ) : null}
                  {recipe.ingredients && recipe.ingredients.length > 0 && (
                    <View style={styles.ingredientRow}>
                      {recipe.ingredients.slice(0, 2).map((ing, i) => (
                        <View key={i} style={styles.ingredientTagSmall}>
                          <Text style={styles.ingredientTagTextSmall}>{ing}</Text>
                        </View>
                      ))}
                      {recipe.ingredients.length > 2 && (
                        <Text style={styles.moreTag}>+{recipe.ingredients.length - 2}</Text>
                      )}
                    </View>
                  )}
                </View>
                <TouchableOpacity style={styles.saveButton}>
                  <Text style={styles.saveIcon}>🤍</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
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
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
  },
  greeting: { fontSize: 14, color: '#6B7280' },
  userName: { fontSize: 22, fontWeight: '700', color: '#1F2937' },
  avatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#EA580C',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', marginHorizontal: 20, marginVertical: 16,
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB',
  },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#1F2937' },
  banner: {
    flexDirection: 'row', backgroundColor: '#EA580C', marginHorizontal: 20, borderRadius: 16, padding: 20, alignItems: 'center',
  },
  bannerContent: { flex: 1 },
  bannerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  bannerSubtitle: { fontSize: 14, color: '#FFFFFFB3', marginBottom: 12 },
  bannerButton: {
    backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, alignSelf: 'flex-start',
  },
  bannerButtonText: { color: '#EA580C', fontWeight: '600', fontSize: 14 },
  bannerEmoji: { fontSize: 50, marginLeft: 10 },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  categoryScroll: { paddingRight: 20 },
  categoryCard: {
    alignItems: 'center', marginRight: 12, padding: 10, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#FFF',
    minWidth: 76,
  },
  categoryIcon: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  categoryEmoji: { fontSize: 26 },
  categoryName: { fontSize: 11, fontWeight: '500', color: '#6B7280', textAlign: 'center' },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 15, color: '#9CA3AF', textAlign: 'center' },
  recipeCard: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12,
    marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB',
  },
  recipeImage: { width: 90, height: 90, borderRadius: 12, backgroundColor: '#F3F4F6' },
  recipeInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  recipeName: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  recipeMeta: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  categoryBadgeSmall: {
    alignSelf: 'flex-start', backgroundColor: '#FFF3E0',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginBottom: 4,
  },
  categoryBadgeText: { fontSize: 11, color: '#E65100', fontWeight: '600' },
  ingredientRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 2 },
  ingredientTagSmall: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  ingredientTagTextSmall: { fontSize: 10, color: '#92400E' },
  moreTag: { fontSize: 10, color: '#9CA3AF', alignSelf: 'center' },
  saveButton: { justifyContent: 'center', paddingLeft: 8 },
  saveIcon: { fontSize: 22 },
  logoutButton: {
    marginHorizontal: 20, marginTop: 24, backgroundColor: '#FEE2E2',
    paddingVertical: 14, borderRadius: 12, alignItems: 'center',
  },
  logoutText: { color: '#DC2626', fontWeight: '600', fontSize: 16 },
  bottomPadding: { height: 100 },
});

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FilterModal } from '@/components/FilterModal';
import { RecipeCard } from '@/components/RecipeCard';
import { recipeService } from '@/services/api';

export default function ExploreScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme as 'light' | 'dark'];

  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  // Search by name
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        setRecipes([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await recipeService.searchByName(searchQuery);
      if (response.data.success) {
        setRecipes(response.data.data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = async (ingredients: string[]) => {
    setSelectedIngredients(ingredients);
    if (ingredients.length === 0) return;

    setLoading(true);
    try {
      const response = await recipeService.filterByIngredients(ingredients);
      if (response.data.success) {
        setRecipes(response.data.data);
      }
    } catch (error) {
      console.error('Filter error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Search Expert</Text>
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colorScheme === 'light' ? '#f0f0f0' : '#333' }]}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Search by recipe name..."
              placeholderTextColor={colors.icon}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <IconSymbol name="xmark.circle.fill" size={18} color={colors.icon} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: colors.tint }]}
            onPress={() => setModalVisible(true)}>
            <IconSymbol name="slider.horizontal.3" size={20} color="#fff" />
            {selectedIngredients.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{selectedIngredients.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.tint} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <RecipeCard recipe={item} onPress={(id) => console.log('Recipe details:', id)} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol
                name="magnifyingglass"
                size={80}
                color={colors.icon}
                style={{ opacity: 0.3 }}
              />
              <Text style={[styles.emptyText, { color: colors.icon }]}>
                {searchQuery || selectedIngredients.length > 0
                  ? 'No recipes found.'
                  : 'Search for recipes or filter by ingredients!'}
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <FilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onApply={handleFilterApply}
        selectedIngredients={selectedIngredients}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 48,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.6,
  },
});

import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface RecipeCardProps {
  recipe: {
    _id: string;
    name: string;
    thumbnail: string;
    ingredients: string[];
    price: number;
    description?: string;
  };
  onPress: (id: string) => void;
}

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme as 'light' | 'dark'];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colorScheme === 'light' ? '#fff' : '#1a1a1a' }]}
      onPress={() => onPress(recipe._id)}>
      <Image source={{ uri: recipe.thumbnail || 'https://via.placeholder.com/150' }} style={styles.image} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {recipe.name}
        </Text>
        <Text style={[styles.ingredients, { color: colors.icon }]} numberOfLines={2}>
          {recipe.ingredients.join(', ')}
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.price, { color: colors.tint }]}>${recipe.price.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ingredients: {
    fontSize: 14,
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

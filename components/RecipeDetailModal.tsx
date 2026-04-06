import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';

interface Recipe {
  _id?: string;
  id?: string | number;
  name: string;
  description?: string;
  duration?: number;
  time?: number | string;
  rating?: number;
  author?: string;
  image?: string;
  thumbnail?: string;
  ingredients?: string[];
  price?: number;
  categoryId?: { name: string };
}

interface Props {
  visible: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recipe: any;
}

export function RecipeDetailModal({ visible, onClose, recipe }: Props) {
  if (!recipe) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Image */}
            <Image
              source={{ uri: recipe.image || recipe.thumbnail || 'https://via.placeholder.com/400x250' }}
              style={styles.image}
              contentFit="cover"
            />

            <View style={styles.content}>
              {/* Title & Meta */}
              <Text style={styles.title}>{recipe.name}</Text>
              <View style={styles.metaRow}>
                {recipe.duration || recipe.time ? (
                  <Text style={styles.metaItem}>⏱ {recipe.duration || recipe.time} phút</Text>
                ) : null}
                {recipe.rating ? (
                  <Text style={styles.metaItem}>⭐ {recipe.rating}</Text>
                ) : null}
                {recipe.author ? (
                  <Text style={styles.metaItem}>👨‍🍳 {recipe.author}</Text>
                ) : null}
              </View>

              {/* Category */}
              {recipe.categoryId?.name ? (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{recipe.categoryId.name}</Text>
                </View>
              ) : null}

              {/* Price */}
              {recipe.price ? (
                <Text style={styles.price}>{Number(recipe.price).toLocaleString('vi-VN')} đ</Text>
              ) : null}

              {/* Description */}
              {recipe.description ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Mô tả</Text>
                  <Text style={styles.description}>{recipe.description}</Text>
                </View>
              ) : null}

              {/* Ingredients */}
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Nguyên liệu</Text>
                  <View style={styles.ingredientTags}>
                    {recipe.ingredients.map((ing: string, i: number) => (
                      <View key={i} style={styles.ingredientTag}>
                        <Text style={styles.ingredientText}>{ing}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              {/* CTA */}
              <TouchableOpacity style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>📖 Xem công thức chi tiết</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  image: { width: '100%', height: 250, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  metaItem: { fontSize: 14, color: '#6B7280' },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryText: { color: '#E65100', fontSize: 13, fontWeight: '600' },
  price: { fontSize: 20, fontWeight: '700', color: '#EA580C', marginBottom: 16 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  description: { fontSize: 14, color: '#6B7280', lineHeight: 22 },
  ingredientTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ingredientTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ingredientText: { color: '#92400E', fontSize: 13 },
  ctaButton: {
    backgroundColor: '#EA580C',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  ctaButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

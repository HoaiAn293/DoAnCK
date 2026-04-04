import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const MOCK_DISHES = [
  {
    id: '1',
    name: 'Salad Cá Hồi Keto',
    category: 'keto',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
    time: '15p',
    calories: '350 kcal',
    rating: '4.8',
  },
  {
    id: '2',
    name: 'Bún Gạo Lứt Chay',
    category: 'vegan',
    image: 'https://images.unsplash.com/photo-1511690078903-71dc5a49f5e3?w=500&q=80',
    time: '20p',
    calories: '280 kcal',
    rating: '4.9',
  },
  {
    id: '3',
    name: 'Ức Gà Nướng Tiêu',
    category: 'low_carb',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&q=80',
    time: '30p',
    calories: '410 kcal',
    rating: '4.7',
  },
  {
    id: '4',
    name: 'Cơm Canh Chua Cá',
    category: 'normal',
    image: 'https://images.unsplash.com/photo-1544025162-817ab4640578?w=500&q=80',
    time: '40p',
    calories: '650 kcal',
    rating: '4.5',
  },
  {
    id: '5',
    name: 'Đậu Hũ Tứ Xuyên (Chay)',
    category: 'vegan',
    image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=500&q=80',
    time: '25p',
    calories: '300 kcal',
    rating: '4.6',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'keto', label: 'Keto' },
  { id: 'vegan', label: 'Thuần chay' },
  { id: 'low_carb', label: 'Low Carb' },
];

export default function SuggestScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [likedDishes, setLikedDishes] = useState<string[]>([]);
  
  const filteredDishes = activeFilter === 'all' 
    ? MOCK_DISHES 
    : MOCK_DISHES.filter(dish => dish.category === activeFilter);

  const toggleLike = (id: string) => {
    if (likedDishes.includes(id)) {
      setLikedDishes(likedDishes.filter(item => item !== id));
    } else {
      setLikedDishes([...likedDishes, id]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Gợi ý thông minh</Text>
        <TouchableOpacity style={styles.settingsIcon}>
           <Ionicons name="options-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {CATEGORIES.map((cat) => {
            const isActive = activeFilter === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.filterChip,
                  { backgroundColor: isActive ? '#ff6b6b' : (colorScheme === 'dark' ? '#333' : '#eee') }
                ]}
                onPress={() => setActiveFilter(cat.id)}
              >
                <Text style={[styles.filterText, { color: isActive ? '#fff' : theme.text, fontWeight: isActive ? 'bold' : 'normal' }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
           <Ionicons name="bulb" size={24} color="#f39c12" />
           <Text style={styles.infoText}>Dựa trên sở thích bạn đã thiết lập, đây là các món ăn phù hợp với bạn hôm nay.</Text>
        </View>

        {filteredDishes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="fast-food-outline" size={48} color={theme.icon} />
            <Text style={{color: theme.text, marginTop: 12}}>Chưa có món nào phù hợp</Text>
          </View>
        ) : (
          filteredDishes.map((dish) => {
            const isLiked = likedDishes.includes(dish.id);
            return (
              <TouchableOpacity key={dish.id} style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#fff' }]} activeOpacity={0.8}>
                <Image source={{ uri: dish.image }} style={styles.cardImage} />
                <TouchableOpacity 
                  style={styles.heartButton} 
                  onPress={() => toggleLike(dish.id)}
                >
                  <Ionicons name={isLiked ? "heart" : "heart-outline"} size={22} color={isLiked ? "#ff6b6b" : "#fff"} />
                </TouchableOpacity>
                <View style={styles.cardContent}>
                  <View style={styles.cardTitleRow}>
                    <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>{dish.name}</Text>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={12} color="#f1c40f" />
                      <Text style={styles.ratingText}>{dish.rating}</Text>
                    </View>
                  </View>
                  <View style={styles.cardMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={14} color={theme.icon} />
                      <Text style={[styles.metaText, { color: theme.icon }]}>{dish.time}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="flame-outline" size={14} color={theme.icon} />
                      <Text style={[styles.metaText, { color: theme.icon }]}>{dish.calories}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsIcon: {
    padding: 8,
  },
  filterContainer: {
    marginBottom: 16,
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  filterText: {
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fffbe6',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#d35400',
    flex: 1,
    marginLeft: 8,
    lineHeight: 18,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 6,
  },
  cardContent: {
    padding: 14,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6e58d',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d3436',
    marginLeft: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  }
});

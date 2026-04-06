import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, FlatList, Modal, Alert, ActivityIndicator,
  Image, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Recipe {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  categoryId?: { _id: string; name: string };
  thumbnail?: string;
  images?: string[];
  ingredients: string[];
  isActive: boolean;
}

interface Category {
  _id: string;
  name: string;
}

export default function AdminRecipes() {
  const { token } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [ingredientText, setIngredientText] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);

  useEffect(() => {
    api.setToken(token);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [recipesRes, categoriesRes] = await Promise.all([
        api.getProducts('limit=100'),
        api.getCategories('limit=100'),
      ]);
      setRecipes(recipesRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (err: any) {
      Alert.alert('Lỗi', err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setDuration('');
    setCategoryId('');
    setIngredients([]);
    setIngredientText('');
    setEditingRecipe(null);
  };

  const openAdd = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEdit = (recipe: Recipe) => {
    setName(recipe.name);
    setDescription(recipe.description || '');
    setPrice(String(recipe.price));
    setDuration(String(recipe.duration));
    setCategoryId(recipe.categoryId?._id || '');
    setIngredients(recipe.ingredients || []);
    setEditingRecipe(recipe);
    setModalVisible(true);
  };

  const addIngredient = () => {
    const trimmed = ingredientText.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
    setIngredientText('');
  };

  const removeIngredient = (item: string) => {
    setIngredients(ingredients.filter(i => i !== item));
  };

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập tên món ăn');
    if (!price) return Alert.alert('Lỗi', 'Vui lòng nhập giá');
    if (!duration) return Alert.alert('Lỗi', 'Vui lòng nhập thời gian nấu');
    if (!categoryId) return Alert.alert('Lỗi', 'Vui lòng chọn danh mục');

    setSaving(true);
    try {
      const data = {
        name: name.trim(),
        description,
        price: Number(price),
        duration: Number(duration),
        categoryId,
        ingredients,
      };
      if (editingRecipe) {
        await api.updateProduct(editingRecipe._id, data);
        Alert.alert('Thành công', 'Cập nhật món ăn thành công!');
      } else {
        await api.createProduct(data);
        Alert.alert('Thành công', 'Thêm món ăn mới thành công!');
      }
      setModalVisible(false);
      resetForm();
      loadData();
    } catch (err: any) {
      Alert.alert('Lỗi', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (recipe: Recipe) => {
    Alert.alert(
      'Xóa món ăn',
      `Bạn có chắc muốn xóa "${recipe.name}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteProduct(recipe._id);
              loadData();
            } catch (err: any) {
              Alert.alert('Lỗi', err.message);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Recipe }) => (
    <View style={styles.card}>
      {item.thumbnail ? (
        <Image source={{ uri: item.thumbnail }} style={styles.cardImage} />
      ) : (
        <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
          <Text style={styles.placeholderEmoji}>🍲</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardMeta}>⏱ {item.duration} phút</Text>
        <Text style={styles.cardMeta}>📂 {item.categoryId?.name || '—'}</Text>
        <View style={styles.ingredientTags}>
          {(item.ingredients || []).slice(0, 3).map((ing, i) => (
            <View key={i} style={styles.tag}><Text style={styles.tagText}>{ing}</Text></View>
          ))}
          {(item.ingredients || []).length > 3 && (
            <Text style={styles.tagMore}>+{item.ingredients.length - 3}</Text>
          )}
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
          <Text style={styles.editBtnText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
          <Text style={styles.deleteBtnText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <Text style={styles.countText}>{recipes.length} món ăn</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+ Thêm món</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}><ActivityIndicator size="large" color="#EA580C" /></View>
      ) : recipes.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyEmoji}>🍽️</Text>
          <Text style={styles.emptyText}>Chưa có món ăn nào</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={openAdd}>
            <Text style={styles.emptyBtnText}>Thêm món đầu tiên</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal Add/Edit */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {editingRecipe ? 'Sửa món ăn' : 'Thêm món ăn mới'}
              </Text>

              <Text style={styles.label}>Tên món ăn *</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName}
                placeholder="VD: Phở Bò Hà Nội" placeholderTextColor="#9CA3AF" />

              <Text style={styles.label}>Mô tả</Text>
              <TextInput style={[styles.input, { height: 80 }]} value={description}
                onChangeText={setDescription} multiline numberOfLines={3}
                placeholder="Mô tả công thức..." placeholderTextColor="#9CA3AF" />

              <Text style={styles.label}>Giá (VNĐ) *</Text>
              <TextInput style={styles.input} value={price} onChangeText={setPrice}
                keyboardType="numeric" placeholder="VD: 50000" placeholderTextColor="#9CA3AF" />

              <Text style={styles.label}>Thời gian nấu (phút) *</Text>
              <TextInput style={styles.input} value={duration} onChangeText={setDuration}
                keyboardType="numeric" placeholder="VD: 45" placeholderTextColor="#9CA3AF" />

              <Text style={styles.label}>Danh mục *</Text>
              <View style={styles.categoryPicker}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat._id}
                    style={[styles.catChip, categoryId === cat._id && styles.catChipActive]}
                    onPress={() => setCategoryId(cat._id)}
                  >
                    <Text style={[styles.catChipText, categoryId === cat._id && styles.catChipTextActive]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Nguyên liệu</Text>
              <View style={styles.ingredientRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  value={ingredientText}
                  onChangeText={setIngredientText}
                  placeholder="Thêm nguyên liệu..."
                  placeholderTextColor="#9CA3AF"
                  onSubmitEditing={addIngredient}
                />
                <TouchableOpacity style={styles.addIngBtn} onPress={addIngredient}>
                  <Text style={styles.addIngBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.ingredientTags2}>
                {ingredients.map((ing, i) => (
                  <View key={i} style={styles.ingredientTag}>
                    <Text style={styles.ingredientTagText}>{ing}</Text>
                    <TouchableOpacity onPress={() => removeIngredient(ing)}>
                      <Text style={styles.removeIng}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => { setModalVisible(false); resetForm(); }}>
                  <Text style={styles.cancelBtnText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.saveBtn, saving && styles.saveBtnDisabled]} onPress={handleSave} disabled={saving}>
                  <Text style={styles.saveBtnText}>{saving ? 'Đang lưu...' : 'Lưu'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  countText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  addBtn: { backgroundColor: '#EA580C', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addBtnText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 16, color: '#6B7280', marginBottom: 20 },
  emptyBtn: { backgroundColor: '#EA580C', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25 },
  emptyBtnText: { color: '#FFF', fontWeight: '600' },
  listContent: { padding: 16, paddingTop: 0 },
  card: { backgroundColor: '#FFF', borderRadius: 16, marginBottom: 14, flexDirection: 'row', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardImage: { width: 100, height: 100 },
  cardImagePlaceholder: { backgroundColor: '#FFF3E0', justifyContent: 'center', alignItems: 'center' },
  placeholderEmoji: { fontSize: 36 },
  cardContent: { flex: 1, padding: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  cardMeta: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  ingredientTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  tag: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  tagText: { fontSize: 11, color: '#92400E' },
  tagMore: { fontSize: 11, color: '#9CA3AF', alignSelf: 'center' },
  cardActions: { justifyContent: 'center', gap: 6, padding: 8 },
  editBtn: { backgroundColor: '#DBEAFE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  editBtnText: { color: '#1D4ED8', fontWeight: '600', fontSize: 12 },
  deleteBtn: { backgroundColor: '#FEE2E2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  deleteBtnText: { color: '#DC2626', fontWeight: '600', fontSize: 12 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#1F2937', marginBottom: 12 },
  categoryPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  catChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
  catChipActive: { backgroundColor: '#EA580C', borderColor: '#EA580C' },
  catChipText: { fontSize: 13, color: '#6B7280' },
  catChipTextActive: { color: '#FFF', fontWeight: '600' },
  ingredientRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  addIngBtn: { backgroundColor: '#EA580C', width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  addIngBtnText: { color: '#FFF', fontSize: 22, fontWeight: '600', lineHeight: 26 },
  ingredientTags2: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  ingredientTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
  ingredientTagText: { fontSize: 13, color: '#92400E', marginRight: 6 },
  removeIng: { fontSize: 12, color: '#DC2626', fontWeight: '700' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 10 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: '#E5E7EB', alignItems: 'center' },
  cancelBtnText: { color: '#6B7280', fontWeight: '600', fontSize: 15 },
  saveBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#EA580C', alignItems: 'center' },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});

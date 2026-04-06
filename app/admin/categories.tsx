import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, FlatList, Modal, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export default function AdminCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    api.setToken(token);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await api.getCategories('limit=100&parentId=');
      setCategories(res.data || []);
    } catch (err: any) {
      Alert.alert('Lỗi', err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setEditingItem(null);
  };

  const openAdd = () => { resetForm(); setModalVisible(true); };

  const openEdit = (item: Category) => {
    setName(item.name);
    setDescription(item.description || '');
    setEditingItem(item);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục');

    setSaving(true);
    try {
      const data = { name: name.trim(), description };
      if (editingItem) {
        await api.updateCategory(editingItem._id, data);
        Alert.alert('Thành công', 'Cập nhật danh mục thành công!');
      } else {
        await api.createCategory(data);
        Alert.alert('Thành công', 'Thêm danh mục mới thành công!');
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

  const handleDelete = (item: Category) => {
    Alert.alert(
      'Xóa danh mục',
      `Bạn có chắc xóa "${item.name}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: async () => {
          try {
            await api.deleteCategory(item._id);
            loadData();
          } catch (err: any) {
            Alert.alert('Lỗi', err.message);
          }
        }},
      ]
    );
  };

  const getCategoryColor = (index: number) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F43', '#A55EEA', '#26DE81', '#FD9644', '#45AAF2'];
    return colors[index % colors.length];
  };

  const getCategoryEmoji = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('việt') || lower.includes('nam')) return '🍜';
    if (lower.includes('nhật') || lower.includes('japan')) return '🍣';
    if (lower.includes('hàn') || lower.includes('korea')) return '🥘';
    if (lower.includes('â') || lower.includes('west')) return '🍕';
    if (lower.includes('á')) return '🍱';
    if (lower.includes('tráng') || lower.includes('dessert')) return '🍰';
    if (lower.includes('canh') || lower.includes('soup')) return '🍲';
    return '📂';
  };

  const renderItem = ({ item, index }: { item: Category; index: number }) => {
    const color = getCategoryColor(index);
    return (
      <View style={styles.card}>
        <View style={[styles.colorBar, { backgroundColor: color }]} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.emoji}>{getCategoryEmoji(item.name)}</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSlug}>{item.slug}</Text>
            </View>
          </View>
          {item.description ? (
            <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
          ) : null}
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.countText}>{categories.length} danh mục</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+ Thêm</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}><ActivityIndicator size="large" color="#1565C0" /></View>
      ) : categories.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyEmoji}>📂</Text>
          <Text style={styles.emptyText}>Chưa có danh mục nào</Text>
          <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: '#1565C0' }]} onPress={openAdd}>
            <Text style={styles.emptyBtnText}>Thêm danh mục đầu tiên</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Sửa danh mục' : 'Thêm danh mục mới'}
            </Text>

            <Text style={styles.label}>Tên danh mục *</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName}
              placeholder="VD: Món Việt" placeholderTextColor="#9CA3AF" />

            <Text style={styles.label}>Mô tả</Text>
            <TextInput style={[styles.input, { height: 80 }]} value={description}
              onChangeText={setDescription} multiline numberOfLines={3}
              placeholder="Mô tả danh mục..." placeholderTextColor="#9CA3AF" />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setModalVisible(false); resetForm(); }}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: '#1565C0' }, saving && styles.saveBtnDisabled]}
                onPress={handleSave} disabled={saving}>
                <Text style={styles.saveBtnText}>{saving ? 'Đang lưu...' : 'Lưu'}</Text>
              </TouchableOpacity>
            </View>
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
  addBtn: { backgroundColor: '#1565C0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addBtnText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 16, color: '#6B7280', marginBottom: 20 },
  emptyBtn: { backgroundColor: '#1565C0', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25 },
  emptyBtnText: { color: '#FFF', fontWeight: '600' },
  listContent: { padding: 16, paddingTop: 0 },
  card: { backgroundColor: '#FFF', borderRadius: 16, marginBottom: 12, flexDirection: 'row', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  colorBar: { width: 6 },
  cardContent: { flex: 1, padding: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  emoji: { fontSize: 32, marginRight: 12 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  cardSlug: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  cardDesc: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  cardActions: { justifyContent: 'center', gap: 6, padding: 8 },
  editBtn: { backgroundColor: '#DBEAFE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  editBtnText: { color: '#1D4ED8', fontWeight: '600', fontSize: 12 },
  deleteBtn: { backgroundColor: '#FEE2E2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  deleteBtnText: { color: '#DC2626', fontWeight: '600', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#1F2937', marginBottom: 12 },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 12 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: '#E5E7EB', alignItems: 'center' },
  cancelBtnText: { color: '#6B7280', fontWeight: '600', fontSize: 15 },
  saveBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});
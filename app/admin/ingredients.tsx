import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, FlatList, Modal, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Ingredient {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  minStock: number;
  supplier?: string;
  purchasePrice?: number;
}

export default function AdminIngredients() {
  const { token } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Ingredient | null>(null);
  const [saving, setSaving] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [minStock, setMinStock] = useState('');
  const [supplier, setSupplier] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');

  useEffect(() => {
    api.setToken(token);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await api.getInventory('limit=100');
      setIngredients(res.data || []);
    } catch (err: any) {
      Alert.alert('Lỗi', err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName(''); setSku(''); setQuantity('');
    setUnit(''); setMinStock(''); setSupplier('');
    setPurchasePrice('');
    setEditingItem(null);
  };

  const openAdd = () => { resetForm(); setModalVisible(true); };

  const openEdit = (item: Ingredient) => {
    setName(item.name);
    setSku(item.sku);
    setQuantity(String(item.quantity));
    setUnit(item.unit || '');
    setMinStock(String(item.minStock));
    setSupplier(item.supplier || '');
    setPurchasePrice(item.purchasePrice ? String(item.purchasePrice) : '');
    setEditingItem(item);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập tên nguyên liệu');
    if (!sku.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập mã SKU');
    if (!quantity) return Alert.alert('Lỗi', 'Vui lòng nhập số lượng');

    setSaving(true);
    try {
      const data = {
        productName: name.trim(),
        sku: sku.trim(),
        quantity: Number(quantity),
        unit: unit.trim() || 'cái',
        minStock: Number(minStock) || 10,
        supplier: supplier.trim(),
        price: Number(purchasePrice) || 0,
      };
      if (editingItem) {
        await api.updateInventoryItem(editingItem._id, data);
        Alert.alert('Thành công', 'Cập nhật nguyên liệu thành công!');
      } else {
        await api.createInventoryItem(data);
        Alert.alert('Thành công', 'Thêm nguyên liệu mới thành công!');
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

  const handleDelete = (item: Ingredient) => {
    Alert.alert(
      'Xóa nguyên liệu',
      `Bạn có chắc xóa "${item.name}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: async () => {
          try {
            await api.deleteInventoryItem(item._id);
            loadData();
          } catch (err: any) {
            Alert.alert('Lỗi', err.message);
          }
        }},
      ]
    );
  };

  const getStockColor = (qty: number, min: number) => {
    if (qty <= min * 0.5) return '#DC2626';
    if (qty <= min) return '#F59E0B';
    return '#10B981';
  };

  const renderItem = ({ item }: { item: Ingredient }) => {
    const stockColor = getStockColor(item.quantity, item.minStock);
    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardEmoji}>🥬</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSku}>SKU: {item.sku}</Text>
          <View style={styles.stockRow}>
            <Text style={styles.stockLabel}>Tồn kho:</Text>
            <View style={[styles.stockBadge, { backgroundColor: stockColor + '20' }]}>
              <Text style={[styles.stockBadgeText, { color: stockColor }]}>
                {item.quantity} {item.unit}
              </Text>
            </View>
            <Text style={styles.minStock}> (tối thiểu: {item.minStock})</Text>
          </View>
          {item.supplier ? (
            <Text style={styles.supplier}>🏭 {item.supplier}</Text>
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
        <Text style={styles.countText}>{ingredients.length} nguyên liệu</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+ Thêm</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}><ActivityIndicator size="large" color="#10B981" /></View>
      ) : ingredients.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyEmoji}>🥗</Text>
          <Text style={styles.emptyText}>Chưa có nguyên liệu nào</Text>
          <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: '#10B981' }]} onPress={openAdd}>
            <Text style={styles.emptyBtnText}>Thêm nguyên liệu đầu tiên</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={ingredients}
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
              {editingItem ? 'Sửa nguyên liệu' : 'Thêm nguyên liệu mới'}
            </Text>

            <Text style={styles.label}>Tên nguyên liệu *</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName}
              placeholder="VD: Thịt bò" placeholderTextColor="#9CA3AF" />

            <Text style={styles.label}>Mã SKU *</Text>
            <TextInput style={styles.input} value={sku} onChangeText={setSku}
              placeholder="VD: BEEF001" placeholderTextColor="#9CA3AF" autoCapitalize="characters" />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Số lượng *</Text>
                <TextInput style={styles.input} value={quantity} onChangeText={setQuantity}
                  keyboardType="numeric" placeholder="0" placeholderTextColor="#9CA3AF" />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Đơn vị</Text>
                <TextInput style={styles.input} value={unit} onChangeText={setUnit}
                  placeholder="kg, g, l..." placeholderTextColor="#9CA3AF" />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Tồn kho tối thiểu</Text>
                <TextInput style={styles.input} value={minStock} onChangeText={setMinStock}
                  keyboardType="numeric" placeholder="10" placeholderTextColor="#9CA3AF" />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Giá nhập (VNĐ)</Text>
                <TextInput style={styles.input} value={purchasePrice} onChangeText={setPurchasePrice}
                  keyboardType="numeric" placeholder="0" placeholderTextColor="#9CA3AF" />
              </View>
            </View>

            <Text style={styles.label}>Nhà cung cấp</Text>
            <TextInput style={styles.input} value={supplier} onChangeText={setSupplier}
              placeholder="VD: Co.opmart" placeholderTextColor="#9CA3AF" />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setModalVisible(false); resetForm(); }}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: '#10B981' }, saving && styles.saveBtnDisabled]}
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
  addBtn: { backgroundColor: '#10B981', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addBtnText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 16, color: '#6B7280', marginBottom: 20 },
  emptyBtn: { backgroundColor: '#10B981', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25 },
  emptyBtnText: { color: '#FFF', fontWeight: '600' },
  listContent: { padding: 16, paddingTop: 0 },
  card: { backgroundColor: '#FFF', borderRadius: 16, marginBottom: 12, flexDirection: 'row', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardLeft: { width: 56, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' },
  cardEmoji: { fontSize: 28 },
  cardContent: { flex: 1, padding: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  cardSku: { fontSize: 12, color: '#9CA3AF', marginBottom: 6 },
  stockRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  stockLabel: { fontSize: 12, color: '#6B7280', marginRight: 6 },
  stockBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  stockBadgeText: { fontSize: 12, fontWeight: '700' },
  minStock: { fontSize: 11, color: '#9CA3AF' },
  supplier: { fontSize: 12, color: '#6B7280', marginTop: 2 },
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
  row: { flexDirection: 'row', gap: 12 },
  halfInput: { flex: 1 },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 12 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: '#E5E7EB', alignItems: 'center' },
  cancelBtnText: { color: '#6B7280', fontWeight: '600', fontSize: 15 },
  saveBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});

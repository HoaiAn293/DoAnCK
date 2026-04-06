import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  {
    title: 'Quản lý món ăn',
    subtitle: 'Thêm, sửa, xóa công thức nấu ăn',
    emoji: '🍲',
    bg: '#FFF3E0',
    color: '#E65100',
    route: '/admin/recipes',
  },
  {
    title: 'Quản lý nguyên liệu',
    subtitle: 'Thêm, sửa, xóa nguyên liệu',
    emoji: '🥬',
    bg: '#E8F5E9',
    color: '#2E7D32',
    route: '/admin/ingredients',
  },
  {
    title: 'Quản lý danh mục',
    subtitle: 'Thêm, sửa, xóa loại món ăn',
    emoji: '📂',
    bg: '#E3F2FD',
    color: '#1565C0',
    route: '/admin/categories',
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.role !== 'admin') {
      Alert.alert('Không có quyền', 'Bạn không phải admin', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (e) {
              console.log('Logout error:', e);
            }
            router.replace('/Login');
          },
        },
      ]
    );
  };

  const handleMenuPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>👑 ADMIN</Text>
          </View>
          <Text style={styles.welcomeText}>Xin chào, {user?.name || 'Admin'}!</Text>
          <Text style={styles.subText}>{user?.email}</Text>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuCard, { backgroundColor: item.bg }]}
              onPress={() => handleMenuPress(item.route)}
              activeOpacity={0.8}
            >
              <Text style={styles.menuEmoji}>{item.emoji}</Text>
              <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, { color: item.color }]}>
                  {item.title}
                </Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={[styles.menuArrow, { color: item.color }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { padding: 20 },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  adminBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  adminBadgeText: {
    color: '#D97706',
    fontWeight: '700',
    fontSize: 13,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: '#6B7280',
  },
  menuContainer: {
    gap: 14,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  menuEmoji: { fontSize: 36, marginRight: 16 },
  menuTextContainer: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  menuSubtitle: { fontSize: 13, color: '#6B7280' },
  menuArrow: { fontSize: 28, fontWeight: '300' },
  logoutButton: {
    marginTop: 30,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  logoutText: { color: '#EF4444', fontWeight: '600', fontSize: 15 },
});

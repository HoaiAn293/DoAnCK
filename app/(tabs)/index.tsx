import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFD700', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      
      {/* Header Section */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Chào bạn, Nhóm trưởng!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedText style={styles.subtitle}>
        Hôm nay bạn muốn quản lý thực đơn hay tìm nguồn cảm hứng nấu ăn?
      </ThemedText>

      {/* Main Feature: Mood Spinner (Banner) */}
      <TouchableOpacity activeOpacity={0.9} style={styles.bannerContainer}>
        <Link href="/spinner" asChild>
          <View style={styles.bannerContent}>
            <View style={styles.bannerTextSection}>
              <Text style={styles.bannerTitle}>Vòng quay món ăn</Text>
              <Text style={styles.bannerSub}>Hãy để tâm trạng quyết định!</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Thử ngay</Text>
              </View>
            </View>
            <View style={styles.bannerIconWrapper}>
              <Ionicons name="color-palette" size={60} color="#FFF" />
            </View>
          </View>
        </Link>
      </TouchableOpacity>

      {/* Quick Actions Grid */}
      <View style={styles.gridContainer}>
        <View style={styles.gridRow}>
          <ActionCard icon="restaurant-outline" label="Thực đơn" color="#FF6F61" />
          <ActionCard icon="heart-outline" label="Yêu thích" color="#FF4500" />
        </View>
        <View style={styles.gridRow}>
          <ActionCard icon="list-outline" label="Sổ tay" color="#4682B4" />
          <ActionCard icon="settings-outline" label="Cài đặt" color="#666" />
        </View>
      </View>

      {/* Footer Info */}
      <ThemedView style={styles.footerContainer}>
        <ThemedText type="defaultSemiBold">Báo cáo Đồ án cuối kỳ</ThemedText>
        <ThemedText style={{fontSize: 12, color: '#888'}}>
          Học phần: Công cụ và môi trường phát triển phần mềm
        </ThemedText>
      </ThemedView>

    </ParallaxScrollView>
  );
}

const ActionCard = ({ icon, label, color }: { icon: any, label: string, color: string }) => (
  <TouchableOpacity style={styles.card}>
    <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={28} color={color} />
    </View>
    <Text style={styles.cardLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  bannerContainer: {
    backgroundColor: '#FF6F61',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    elevation: 8,
    shadowColor: '#FF6F61',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerTextSection: {
    flex: 1,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  bannerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  badgeText: {
    color: '#FF6F61',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  bannerIconWrapper: {
    marginLeft: 10,
    opacity: 0.9,
  },
  gridContainer: {
    gap: 15,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 15,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  footerContainer: {
    marginTop: 40,
    alignItems: 'center',
    paddingBottom: 20,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

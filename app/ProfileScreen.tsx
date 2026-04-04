import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeInDown
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  rightElement?: React.ReactNode;
  isDestructive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  onPress,
  rightElement,
  isDestructive,
}) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuItemLeft}>
      <View
        style={[
          styles.iconContainer,
          isDestructive && styles.destructiveIconBg,
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={isDestructive ? "#FF4B4B" : "#FF6A00"}
        />
      </View>
      <Text
        style={[styles.menuItemText, isDestructive && styles.destructiveText]}
      >
        {title}
      </Text>
    </View>
    {rightElement ? (
      rightElement
    ) : (
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    )}
  </TouchableOpacity>
);

const ProfileScreen: React.FC = () => {
  // State giả lập dữ liệu người dùng
  const [userData, setUserData] = useState({
    name: "Nguyễn Văn A",
    email: "vana.it.hutech@gmail.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", // Ảnh đại diện ngẫu nhiên
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn thoát ứng dụng không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => console.log("User Logged Out"),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF6A00"
          />
        }
      >
        {/* 1. Profile Header */}
        <Animated.View
          entering={FadeInDown.duration(800)}
          style={styles.header}
        >
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: userData.avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.editBadge}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>

          <TouchableOpacity style={styles.editProfileBtn}>
            <Text style={styles.editProfileText}>Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* 2. Profile Actions List */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Cá nhân</Text>
          <View style={styles.card}>
            <MenuItem
              icon="heart-outline"
              title="Món ăn yêu thích"
              onPress={() => console.log("Favorites")}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="restaurant-outline"
              title="Công thức của tôi"
              onPress={() => console.log("Recipes")}
            />
          </View>

          <Text style={styles.sectionTitle}>Cài đặt</Text>
          <View style={styles.card}>
            <MenuItem
              icon="notifications-outline"
              title="Thông báo"
              onPress={() => console.log("Notifications")}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="moon-outline"
              title="Chế độ tối"
              onPress={() => {}}
              rightElement={
                <Switch
                  value={isDarkMode}
                  onValueChange={setIsDarkMode}
                  trackColor={{ false: "#EEE", true: "#FF6A00" }}
                />
              }
            />
            <View style={styles.divider} />
            <MenuItem
              icon="language-outline"
              title="Ngôn ngữ"
              onPress={() => console.log("Language")}
              rightElement={<Text style={styles.langValue}>Tiếng Việt</Text>}
            />
          </View>

          <Text style={styles.sectionTitle}>Hỗ trợ</Text>
          <View style={styles.card}>
            <MenuItem
              icon="help-circle-outline"
              title="Trợ giúp & Hỗ trợ"
              onPress={() => console.log("Support")}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="log-out-outline"
              title="Đăng xuất"
              onPress={handleLogout}
              isDestructive
            />
          </View>
        </View>

        <Text style={styles.versionText}>Phiên bản 1.0.2 (Beta)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#FFFBE6",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 5,
    backgroundColor: "#FF6A00",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF",
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  userEmail: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  editProfileBtn: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFBE6",
    borderWidth: 1,
    borderColor: "#FFE58F",
  },
  editProfileText: {
    color: "#D48806",
    fontWeight: "600",
    fontSize: 13,
  },
  menuSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#AAA",
    marginBottom: 10,
    marginLeft: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 5,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFF5F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  destructiveIconBg: {
    backgroundColor: "#FFF1F0",
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  destructiveText: {
    color: "#FF4B4B",
  },
  langValue: {
    fontSize: 14,
    color: "#AAA",
    marginRight: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginLeft: 70,
  },
  versionText: {
    textAlign: "center",
    color: "#CCC",
    fontSize: 12,
    marginBottom: 30,
  },
});

export default ProfileScreen;

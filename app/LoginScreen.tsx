import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.9);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
    scaleAnim.value = withSpring(1);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: scaleAnim.value }],
  }));

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ Username và Password!");
      return;
    }
    Alert.alert("Thành công", `Chào mừng ${username} quay trở lại!`);
  };

  const handleSocialLogin = (platform: string) => {
    Alert.alert("Thông báo", `Đang kết nối với ${platform}...`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.innerContainer, animatedStyle]}>
            {/* 1. Top Illustration */}
            <View style={styles.illustrationWrapper}>
              <View style={styles.circleBg} />
              <Image
                source={require('../assets/images/icon.png')}
                style={styles.image}
                contentFit="contain"
              />
            </View>

            <Text style={styles.welcomeText}>Đăng Nhập</Text>

            {/* 2. Input Section */}
            <View style={styles.inputSection}>
              {/* Username Input */}
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#AAA"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#AAA"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.inputIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              {/* 3. Forgot Password */}
              <TouchableOpacity
                style={styles.forgotBtn}
                onPress={() =>
                  Alert.alert(
                    "Quên mật khẩu",
                    "Hệ thống khôi phục mật khẩu sẽ sớm ra mắt.",
                  )
                }
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* 4. Login Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>LOGIN</Text>
            </TouchableOpacity>

            {/* 5. Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>

            {/* 6. Social Login */}
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => handleSocialLogin("Google")}
              >
                <Ionicons name="logo-google" size={24} color="#DB4437" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => handleSocialLogin("Apple")}
              >
                <Ionicons name="logo-apple" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
  innerContainer: {
    paddingHorizontal: 30,
    alignItems: "center",
  },
  illustrationWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  circleBg: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#FFFBE6",
  },
  image: {
    width: 150,
    height: 150,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 30,
  },
  inputSection: {
    width: "100%",
    marginBottom: 25,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#F0F0F0",
    marginBottom: 20,
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: "#000",
    paddingRight: 10,
  },
  inputIcon: {
    padding: 5,
  },
  forgotBtn: {
    alignSelf: "flex-start",
    marginTop: -5,
  },
  forgotText: {
    color: "#888",
    fontSize: 13,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#FF6A00",
    width: "100%",
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF6A00",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 30,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#EEE",
  },
  orText: {
    marginHorizontal: 15,
    color: "#BBB",
    fontSize: 12,
    fontWeight: "600",
  },
  socialContainer: {
    flexDirection: "row",
    gap: 20,
  },
  socialBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
});

export default LoginScreen;

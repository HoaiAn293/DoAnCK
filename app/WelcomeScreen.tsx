import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  withRepeat,
  withSequence
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const WelcomeScreen: React.FC = () => {

  const illustrationScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const floatingValue = useSharedValue(0);

  useEffect(() => {

    illustrationScale.value = withSpring(1);
    
    
    contentOpacity.value = withDelay(500, withSpring(1));

    
    floatingValue.value = withRepeat(
      withSequence(
        withSpring(10, { damping: 2 }),
        withSpring(0, { damping: 2 })
      ),
      -1,
      true
    );
  }, []);

  const animatedIllustrationStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: illustrationScale.value },
      { translateY: floatingValue.value }
    ],
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: withSpring(contentOpacity.value ? 0 : 20) }]
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 1. Top Illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.circleBackground} />
        <Animated.View style={animatedIllustrationStyle}>
          <Image
            source={require('../assets/images/icon.png')} // Đường dẫn đúng từ thư mục app/ ra ngoài
            style={styles.image}
            contentFit="contain"
          />
        </Animated.View>
      </View>

      {/* Content Section */}
      <Animated.View style={[styles.contentContainer, animatedContentStyle]}>
        {/* 2. Title */}
        <Text style={styles.title}>Chào mừng bạn !</Text>

        {/* 3. Subtitle */}
        <Text style={styles.subtitle}>
          Tìm kiếm món ngon & nấu ăn mỗi ngày
        </Text>

        {/* 4. Primary Button */}
        <TouchableOpacity 
          activeOpacity={0.8}
          style={styles.googleButton}
          onPress={() => console.log('Login with Google')}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="logo-google" size={18} color="#FF6A00" />
          </View>
          <Text style={styles.buttonText}>Đăng nhập với Google</Text>
        </TouchableOpacity>

        {/* 5. Secondary Action */}
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => console.log('Skip')}
        >
          <Text style={styles.skipText}>Bỏ qua</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.5,
    width: '100%',
  },
  circleBackground: {
    position: 'absolute',
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: (width * 0.75) / 2,
    backgroundColor: '#FFFBE6',
    shadowColor: '#FF6A00',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
  },
  contentContainer: {
    flex: 0.4,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6A00',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    // Shadow cho nút
    shadowColor: '#FF6A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: 34,
  },
  skipButton: {
    marginTop: 20,
    padding: 10,
  },
  skipText: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default WelcomeScreen;
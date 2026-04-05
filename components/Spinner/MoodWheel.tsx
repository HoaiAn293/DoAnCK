import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing, 
  runOnJS,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = width * 0.8;

interface MoodItem {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  foods: string[];
}

interface MoodWheelProps {
  items: MoodItem[];
  onResult: (item: MoodItem) => void;
  isSpinning: boolean;
  setIsSpinning: (val: boolean) => void;
}

const MoodWheel: React.FC<MoodWheelProps> = ({ items, onResult, isSpinning, setIsSpinning }) => {
  const rotation = useSharedValue(0);
  const numItems = items.length;
  const anglePerItem = 360 / numItems;

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // Choose a random index
    const randomIndex = Math.floor(Math.random() * numItems);
    
    // Calculate final rotation logic:
    // Full spins + offset to land on the selected item
    // The arrow is at the top (0 deg), so we need to rotate the wheel
    // so the item's segment is at the top.
    const fullSpins = 5 + Math.floor(Math.random() * 5); // 5 to 10 full spins
    const targetAngle = fullSpins * 360 + (randomIndex * anglePerItem);
    
    rotation.value = withTiming(targetAngle, {
      duration: 4000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }, (finished) => {
      if (finished) {
        runOnJS(onResult)(items[randomIndex]);
        runOnJS(setIsSpinning)(false);
      }
    });
  };

  useEffect(() => {
    if (isSpinning) {
        // Handled by the button trigger, but this could be automated
    }
  }, [isSpinning]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Target Arrow */}
      <View style={styles.arrowContainer}>
        <MaterialCommunityIcons name="menu-down" size={50} color="#FF6F61" />
      </View>

      <Animated.View style={[styles.wheel, animatedStyle]}>
        {items.map((item, index) => {
          const rotationAngle = (index * anglePerItem);
          return (
            <View 
              key={item.id} 
              style={[
                styles.segment, 
                { 
                  transform: [
                    { rotate: `${rotationAngle}deg` },
                    { translateY: -WHEEL_SIZE / 4 }
                  ],
                  backgroundColor: item.color 
                }
              ]}
            >
              <MaterialCommunityIcons name={item.icon} size={30} color="#FFF" style={{ transform: [{ rotate: `0deg` }]}} />
            </View>
          );
        })}
      </Animated.View>

      <TouchableOpacity 
        style={[styles.spinButton, isSpinning && styles.disabledButton]} 
        onPress={spin}
        disabled={isSpinning}
      >
        <Text style={styles.spinButtonText}>{isSpinning ? 'Đang quay...' : 'QUAY NGAY'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  arrowContainer: {
    zIndex: 10,
    marginBottom: -25,
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    borderWidth: 8,
    borderColor: '#F0F0F0',
    backgroundColor: '#FFF',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  segment: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  spinButton: {
    marginTop: 40,
    backgroundColor: '#FF6F61',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  spinButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default MoodWheel;

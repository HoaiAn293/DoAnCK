import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Animated as RNAnimated, Dimensions, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MoodWheel from '@/components/Spinner/MoodWheel';
import { LinearGradient } from 'expo-linear-gradient'; // Ensure this is installed, if not, I'll use simple View

const { width } = Dimensions.get('window');

const MOODS = [
  { id: '1', label: 'Hào hứng', icon: 'emoticon-excited-outline' as any, color: '#FFD700', foods: ['Pizza Hải Sản', 'Lẩu Thái Cay', 'Bò Bít Tết'] },
  { id: '2', label: 'Buồn bã', icon: 'emoticon-sad-outline' as any, color: '#6A5ACD', foods: ['Kem Chocolate', 'Bánh Gấu', 'Trà Sữa Khoai Môn'] },
  { id: '3', label: 'Mệt mỏi', icon: 'emoticon-confused-outline' as any, color: '#4682B4', foods: ['Cháo Gà Bổ Dưỡng', 'Súp Cua', 'Yến Chưng'] },
  { id: '4', label: 'Chill', icon: 'emoticon-cool-outline' as any, color: '#20B2AA', foods: ['Cà Phê Muối', 'Bánh Croissant', 'Sinh Tố Trái Cây'] },
  { id: '5', label: 'Nổi loạn', icon: 'emoticon-dead-outline' as any, color: '#FF4500', foods: ['Mì Cay Cấp Độ 7', 'Gà Rán Sốt Cay', 'Bún Đậu Mắm Tôm'] },
];

const SpinnerScreen = () => {
    const [selectedMood, setSelectedMood] = useState(MOODS[0]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState<{ label: string, food: string } | null>(null);
    const router = useRouter();

    const handleResult = (item: any) => {
        const randomFood = item.foods[Math.floor(Math.random() * item.foods.length)];
        setResult({ label: item.label, food: randomFood });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ 
                title: 'Vòng quay món ăn',
                headerTransparent: true,
                headerTintColor: '#FFF',
                headerTitleStyle: { fontWeight: 'bold' },
            }} />
            
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Bạn đang cảm thấy thế nào?</Text>
                    <Text style={styles.subtitle}>Hãy chọn tâm trạng và để vòng quay quyết định món ăn hôm nay của bạn!</Text>
                </View>

                {/* Mood Selection */}
                <View style={styles.moodGrid}>
                    {MOODS.map((mood) => (
                        <TouchableOpacity 
                            key={mood.id} 
                            style={[
                                styles.moodCard, 
                                selectedMood.id === mood.id && { borderColor: mood.color, backgroundColor: mood.color + '20' }
                            ]}
                            onPress={() => setSelectedMood(mood)}
                            disabled={isSpinning}
                        >
                            <MaterialCommunityIcons 
                                name={mood.icon} 
                                size={32} 
                                color={selectedMood.id === mood.id ? mood.color : '#666'} 
                            />
                            <Text style={[
                                styles.moodLabel, 
                                selectedMood.id === mood.id && { color: mood.color, fontWeight: 'bold' }
                            ]}>
                                {mood.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* The Spinner */}
                <MoodWheel 
                    items={MOODS} 
                    onResult={handleResult} 
                    isSpinning={isSpinning} 
                    setIsSpinning={setIsSpinning} 
                />

                {/* Result Display */}
                {result && !isSpinning && (
                    <View style={styles.resultContainer}>
                        <MaterialCommunityIcons name="silverware-fork-knife" size={40} color="#FF6F61" />
                        <Text style={styles.resultText}>Với tâm trạng <Text style={{fontWeight: '900'}}>{result.label}</Text></Text>
                        <Text style={styles.resultSub}>Bạn nên thử ngay:</Text>
                        <Text style={styles.foodResult}>{result.food}</Text>
                        
                        <TouchableOpacity style={styles.detailButton}>
                            <Text style={styles.detailButtonText}>Xem chi tiết món ăn</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollContent: {
        paddingTop: 100,
        paddingHorizontal: 20,
        paddingBottom: 40,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#BBB',
        textAlign: 'center',
        lineHeight: 20,
    },
    moodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
    },
    moodCard: {
        width: (width - 60) / 3,
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#333',
        backgroundColor: '#1E1E1E',
    },
    moodLabel: {
        color: '#888',
        marginTop: 5,
        fontSize: 12,
    },
    resultContainer: {
        marginTop: 40,
        padding: 30,
        backgroundColor: '#FFF',
        borderRadius: 25,
        alignItems: 'center',
        width: '100%',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    resultText: {
        fontSize: 18,
        color: '#333',
        marginTop: 15,
    },
    resultSub: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    foodResult: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FF6F61',
        marginVertical: 15,
        textAlign: 'center',
    },
    detailButton: {
        backgroundColor: '#FF6F61',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 10,
    },
    detailButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default SpinnerScreen;

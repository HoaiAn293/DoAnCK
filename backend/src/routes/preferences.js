const express = require('express');
const router = express.Router();

// Mock user preferences storage
const userPreferences = new Map();

// Diet types
const dietTypes = [
  { id: 'keto', name: 'Keto', icon: '🥑', description: 'Ít carb, nhiều chất béo' },
  { id: 'vegan', name: 'Thuần Chay', icon: '🥬', description: 'Không sản phẩm động vật' },
  { id: 'vegetarian', name: 'Chay', icon: '🌿', description: 'Không thịt cá' },
  { id: 'lowfat', name: ' Ít Chất Béo', icon: '🥗', description: 'Giảm chất béo' },
  { id: 'glutenfree', name: 'Không Gluten', icon: '🌾', description: 'Cho người dị ứng gluten' },
  { id: 'diabetes', name: 'Tiểu Đường', icon: '🩺', description: 'Kiểm soát đường huyết' },
];

// Allergy types
const allergyTypes = [
  { id: 'peanut', name: 'Đậu phộng', icon: '🥜' },
  { id: 'seafood', name: 'Hải sản', icon: '🦐' },
  { id: 'egg', name: 'Trứng', icon: '🥚' },
  { id: 'milk', name: 'Sữa', icon: '🥛' },
  { id: 'soy', name: 'Đậu nành', icon: '🫘' },
  { id: 'wheat', name: 'Lúa mì', icon: '🌾' },
];

// Taste preferences
const tasteOptions = [
  { id: 'spicy', name: 'Cay 🌶️', icon: '🌶️' },
  { id: 'sweet', name: 'Ngọt 🍯', icon: '🍯' },
  { id: 'sour', name: 'Chua 🍋', icon: '🍋' },
  { id: 'salty', name: 'Mặn 🧂', icon: '🧂' },
  { id: 'umami', name: 'Umami 🍄', icon: '🍄' },
];

// Cooking time preferences
const cookingTimeOptions = [
  { id: 'quick', name: 'Nhanh (< 30p)', maxTime: 30 },
  { id: 'medium', name: 'Trung bình (30-60p)', maxTime: 60 },
  { id: 'long', name: 'Lâu (> 60p)', maxTime: 999 },
];

// Get all preference options
router.get('/options', (req, res) => {
  res.json({
    success: true,
    dietTypes,
    allergyTypes,
    tasteOptions,
    cookingTimeOptions,
  });
});

// Get user preferences
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const prefs = userPreferences.get(userId);

  if (!prefs) {
    return res.json({
      success: true,
      preferences: null,
      isNewUser: true,
    });
  }

  res.json({
    success: true,
    preferences: prefs,
    isNewUser: false,
  });
});

// Save user preferences
router.post('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { dietType, allergies, tastes, cookingTime, calorieGoal, saveToProfile } = req.body;

    const preferences = {
      dietType,
      allergies: allergies || [],
      tastes: tastes || [],
      cookingTime,
      calorieGoal,
      saveToProfile,
      updatedAt: new Date().toISOString(),
    };

    userPreferences.set(userId, preferences);

    res.json({
      success: true,
      message: 'Đã lưu sở thích thành công',
      preferences,
    });
  } catch (error) {
    console.error('Save preferences error:', error);
    res.status(500).json({ error: 'Lỗi khi lưu sở thích' });
  }
});

// Get smart recommendations based on preferences
router.get('/recommendations/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const prefs = userPreferences.get(userId);

    // Import recipes from recipes routes (simple approach)
    const recipes = require('../routes/recipes');
    const allRecipes = require('./recipes').recipes || [];

    // If no preferences, return random recipes
    if (!prefs) {
      const shuffled = [...allRecipes].sort(() => 0.5 - Math.random());
      return res.json({
        success: true,
        recommendations: shuffled.slice(0, 6),
        reason: 'Gợi ý cho bạn',
      });
    }

    // Filter recipes based on preferences
    let filtered = [...allRecipes];

    // Filter by diet type
    if (prefs.dietType) {
      filtered = filtered.filter(r => {
        // Simple matching - in production would be more sophisticated
        return r.tags.some(tag =>
          tag.toLowerCase().includes(prefs.dietType.toLowerCase()) ||
          r.category.toLowerCase().includes(prefs.dietType.toLowerCase())
        );
      });
    }

    // Filter by allergies
    if (prefs.allergies && prefs.allergies.length > 0) {
      filtered = filtered.filter(r => {
        return !prefs.allergies.some(allergy =>
          r.ingredients.some(ing =>
            ing.toLowerCase().includes(allergy.toLowerCase())
          )
        );
      });
    }

    // Filter by cooking time
    if (prefs.cookingTime) {
      const timeOption = cookingTimeOptions.find(t => t.id === prefs.cookingTime);
      if (timeOption) {
        filtered = filtered.filter(r => r.time <= timeOption.maxTime);
      }
    }

    // Sort by preferences match
    if (prefs.tastes && prefs.tastes.length > 0) {
      filtered.sort((a, b) => {
        const aScore = prefs.tastes.filter(taste => {
          return a.tags.some(tag => tag.toLowerCase().includes(taste));
        }).length;
        const bScore = prefs.tastes.filter(taste => {
          return b.tags.some(tag => tag.toLowerCase().includes(taste));
        }).length;
        return bScore - aScore;
      });
    }

    res.json({
      success: true,
      recommendations: filtered.slice(0, 6),
      preferences: prefs,
      matchCount: filtered.length,
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Lỗi khi lấy gợi ý' });
  }
});

module.exports = router;

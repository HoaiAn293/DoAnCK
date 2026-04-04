const express = require('express');
const router = express.Router();

// Recipes data (same as recipes.js for reference)
const recipes = require('./recipes').recipes || [];

// Smart recommendation engine
router.get('/smart', (req, res) => {
  try {
    const { ingredients, diet, exclude, time, count = 6 } = req.query;

    let filtered = [...recipes];

    // Filter by ingredients (must have at least one)
    if (ingredients) {
      const ingredientList = ingredients.split(',').map(i => i.trim().toLowerCase());
      filtered = filtered.filter(recipe => {
        const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase());
        return ingredientList.some(searchIng =>
          recipeIngredients.some(recipeIng =>
            recipeIng.includes(searchIng) || searchIng.includes(recipeIng)
          )
        );
      }).map(recipe => {
        // Calculate match score
        const matchCount = ingredientList.filter(searchIng =>
          recipe.ingredients.some(ing => ing.toLowerCase().includes(searchIng))
        ).length;
        return { ...recipe, matchScore: matchCount };
      }).sort((a, b) => b.matchScore - a.matchScore);
    }

    // Filter by diet
    if (diet) {
      filtered = filtered.filter(r =>
        r.tags.some(tag => tag.toLowerCase().includes(diet.toLowerCase()))
      );
    }

    // Exclude ingredients (allergies)
    if (exclude) {
      const excludeList = exclude.split(',').map(i => i.trim().toLowerCase());
      filtered = filtered.filter(recipe => {
        return !excludeList.some(exIng =>
          recipe.ingredients.some(ing => ing.toLowerCase().includes(exIng))
        );
      });
    }

    // Filter by max time
    if (time) {
      const maxTime = parseInt(time);
      filtered = filtered.filter(r => r.time <= maxTime);
    }

    res.json({
      success: true,
      count: filtered.length,
      recipes: filtered.slice(0, parseInt(count)),
    });
  } catch (error) {
    console.error('Smart recommendations error:', error);
    res.status(500).json({ error: 'Lỗi khi lấy gợi ý thông minh' });
  }
});

// Get recipe with shopping list
router.get('/recipe/:id/shopping', (req, res) => {
  try {
    const { id } = req.params;
    const recipe = recipes.find(r => r.id === id);

    if (!recipe) {
      return res.status(404).json({ error: 'Không tìm thấy công thức' });
    }

    // Create shopping list from ingredients
    const shoppingList = recipe.ingredients.map(ing => ({
      name: ing,
      checked: false,
      quantity: getQuantity(ing),
      unit: getUnit(ing),
    }));

    // Group by category
    const groupedList = groupByCategory(shoppingList);

    // Get nearby stores (mock data)
    const nearbyStores = [
      { id: 1, name: 'Co.opmart', distance: '500m', icon: '🛒' },
      { id: 2, name: 'Vinmart', distance: '800m', icon: '🏪' },
      { id: 3, name: 'Bách Hóa Xanh', distance: '1.2km', icon: '🏬' },
    ];

    res.json({
      success: true,
      recipe: {
        id: recipe.id,
        name: recipe.name,
        image: recipe.image,
        servings: recipe.servings,
      },
      shoppingList,
      groupedList,
      nearbyStores,
    });
  } catch (error) {
    console.error('Shopping list error:', error);
    res.status(500).json({ error: 'Lỗi khi tạo danh sách mua sắm' });
  }
});

// Helper: Get quantity for ingredient
function getQuantity(ingredient) {
  const quantities = ['100g', '200g', '1 quả', '2 tép', '1/2 cốc', '1 muỗng', '2 lát', '1 miếng'];
  return quantities[Math.floor(Math.random() * quantities.length)];
}

// Helper: Get unit for ingredient
function getUnit(ingredient) {
  const meat = ['thịt', 'gà', 'bò', 'heo', 'cá', 'tôm'];
  const veg = ['cà chua', 'cà rốt', 'dưa', 'hành', 'tỏi', 'ớt'];
  const other = ['nước', 'dầu', 'sữa', 'bơ'];

  if (meat.some(m => ingredient.includes(m))) return 'g';
  if (veg.some(v => ingredient.includes(v))) return 'g';
  if (other.some(o => ingredient.includes(o))) return 'ml';
  return 'g';
}

// Helper: Group items by category
function groupByCategory(items) {
  const groups = {
    'Thịt & Hải sản': [],
    'Rau củ': [],
    'Gia vị': [],
    'Khác': [],
  };

  const meatKeywords = ['thịt', 'gà', 'bò', 'heo', 'cá', 'tôm', 'mực', 'ngan'];
  const vegKeywords = ['cà chua', 'cà rốt', 'dưa', 'bắp', 'nấm', 'đậu', 'bông', 'xà lách'];
  const spiceKeywords = ['hành', 'tỏi', 'ớt', 'tiêu', 'gia vị', 'muối', 'đường', 'nước mắm'];

  items.forEach(item => {
    if (meatKeywords.some(k => item.name.includes(k))) {
      groups['Thịt & Hải sản'].push(item);
    } else if (vegKeywords.some(k => item.name.includes(k))) {
      groups['Rau củ'].push(item);
    } else if (spiceKeywords.some(k => item.name.includes(k))) {
      groups['Gia vị'].push(item);
    } else {
      groups['Khác'].push(item);
    }
  });

  // Remove empty groups
  Object.keys(groups).forEach(key => {
    if (groups[key].length === 0) delete groups[key];
  });

  return groups;
}

// Mood-based recommendations
router.get('/mood/:mood', (req, res) => {
  try {
    const { mood } = req.params;

    const moodMappings = {
      'happy': {
        icon: '😊',
        message: 'Hôm nay bạn vui quá! Thử món gì đặc biệt nhé!',
        tags: ['Chiên', 'Pizza', 'Nhanh', 'Tráng miệng'],
      },
      'sad': {
        icon: '😢',
        message: 'Đừng buồn nữa! Một chén phở nóng hổi sẽ làm bạn vui hơn!',
        tags: ['Phở', 'Việt Nam', 'Nước', 'Nóng'],
      },
      'stressed': {
        icon: '😰',
        message: 'Căng thẳng quá? Nấu ăn giúp bạn thư giãn đấy!',
        tags: ['Trà', 'Healthy', 'Salad', 'Dễ'],
      },
      'lazy': {
        icon: '😴',
        message: 'Lười quá hả? Thử món nhanh và dễ này nhé!',
        tags: ['Chiên', 'Trứng', 'Nhanh', 'Mì'],
      },
      'romantic': {
        icon: '💕',
        message: 'Tối nay lãng mạn quá! Nấu món ngọt ngào nào!',
        tags: ['Pizza', 'Tráng miệng', 'Ý', 'Sushi'],
      },
      'energetic': {
        icon: '💪',
        message: 'Năng lượng dồi dào! Thử món cầu kỳ hơn nhé!',
        tags: ['Sushi', 'Pizza', 'Trung bình', 'Nhiều bước'],
      },
    };

    const moodData = moodMappings[mood] || moodMappings['happy'];

    // Find recipes matching mood tags
    const matchedRecipes = recipes.filter(r =>
      moodData.tags.some(tag =>
        r.tags.some(recipeTag =>
          recipeTag.toLowerCase().includes(tag.toLowerCase()) ||
          tag.toLowerCase().includes(recipeTag.toLowerCase())
        )
      )
    ).slice(0, 4);

    // Add random suggestions if not enough
    if (matchedRecipes.length < 3) {
      const others = recipes
        .filter(r => !matchedRecipes.includes(r))
        .sort(() => 0.5 - Math.random())
        .slice(0, 3 - matchedRecipes.length);
      matchedRecipes.push(...others);
    }

    res.json({
      success: true,
      mood,
      moodData,
      recommendations: matchedRecipes,
    });
  } catch (error) {
    console.error('Mood recommendations error:', error);
    res.status(500).json({ error: 'Lỗi khi lấy gợi ý theo tâm trạng' });
  }
});

// Get all available moods
router.get('/moods', (req, res) => {
  const moods = [
    { id: 'happy', name: 'Vui vẻ', icon: '😊', color: '#FFD700' },
    { id: 'sad', name: 'Buồn', icon: '😢', color: '#4169E1' },
    { id: 'stressed', name: 'Căng thẳng', icon: '😰', color: '#9370DB' },
    { id: 'lazy', name: 'Lười biếng', icon: '😴', color: '#90EE90' },
    { id: 'romantic', name: 'Lãng mạn', icon: '💕', color: '#FF69B4' },
    { id: 'energetic', name: 'Năng động', icon: '💪', color: '#FF6347' },
  ];

  res.json({
    success: true,
    moods,
  });
});

module.exports = router;

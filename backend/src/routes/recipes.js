const express = require('express');
const router = express.Router();

// Mock Recipe Data
const recipes = [
  {
    id: '1',
    name: 'Phở Bò Hà Nội',
    description: 'Phở bò truyền thống với nước dùng đậm đà',
    time: 45,
    servings: 4,
    rating: 4.8,
    reviews: 234,
    author: 'Chef Nguyễn',
    difficulty: 'Trung bình',
    image: 'https://images.unsplash.com/photo-1583224964978-2257b1c1c8e4?w=600',
    ingredients: ['thịt bò', 'bánh phở', 'hành', 'gừng', 'thảo quả', 'hoa hồi', 'nước mắm', 'đường', 'hành tây'],
    steps: [
      'Hầm xương bò với gừng, hành, thảo quả, hoa hồi trong 4-6 tiếng',
      'Thái thịt bò mỏng',
      'Chần bánh phở trong nước sôi',
      'Nấu nước dùng với gia vị',
      'Cho bánh phở vào tô, xếp thịt bò lên trên',
      'Rưới nước dùng nóng hổi',
      'Thêm hành phi, rau thơm và thưởng thức'
    ],
    tags: ['Việt Nam', 'Món nước', 'Bò'],
    calories: 450,
    category: 'Món Việt'
  },
  {
    id: '2',
    name: 'Gà Chiên Giòn',
    description: 'Gà chiên giòn rụm với lớp vằn nước mắm thơm phức',
    time: 30,
    servings: 3,
    rating: 4.6,
    reviews: 189,
    author: 'Mama Kitchen',
    difficulty: 'Dễ',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600',
    ingredients: ['thịt gà', 'bột chiên giòn', 'tỏi', 'nước mắm', 'đường', 'dầu ăn'],
    steps: [
      'Sơ chế và tẩm ướp gà với gia vị',
      'Lăn gà qua bột chiên giòn',
      'Chiên ngập dầu ở lửa vừa đến vàng giòn',
      'Làm nước mắm pha chua ngọt',
      'Thưởng thức nóng hổi'
    ],
    tags: ['Chiên', 'Gà', 'Nhanh'],
    calories: 380,
    category: 'Món Việt'
  },
  {
    id: '3',
    name: 'Salad Rau Trộn',
    description: 'Salad tươi mát với rau củ và sốt mè rang',
    time: 15,
    servings: 2,
    rating: 4.5,
    reviews: 98,
    author: 'Healthy Food',
    difficulty: 'Dễ',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
    ingredients: ['xà lách', 'cà chua', 'dưa chuột', 'hành tây', 'cà rốt', 'trứng', 'mè rang', 'dầu giấm'],
    steps: [
      'Rửa và cắt rau củ',
      'Trộn đều các loại rau',
      'Làm sốt mè rang',
      'Rưới sốt và trộn đều',
      'Trang trí với trứng cắt lát'
    ],
    tags: ['Salad', 'Rau', 'Healthy', 'Dễ'],
    calories: 120,
    category: 'Món Âu'
  },
  {
    id: '4',
    name: 'Mì Trộn Hàn Quốc',
    description: 'Mì trộn Hàn Quốc với sốt gochujang Cay Hàn Quốc',
    time: 25,
    servings: 2,
    rating: 4.7,
    reviews: 156,
    author: 'Korean Food',
    difficulty: 'Dễ',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600',
    ingredients: ['mì Hàn Quốc', 'thịt heo', 'trứng', 'cà rốt', 'dưa leo', 'hành tây', 'gochujang', 'mè rang'],
    steps: [
      'Luộc mì và xả lạnh',
      'Xào thịt heo với gia vị',
      'Làm sốt gochujang',
      'Trộn mì với sốt và rau',
      'Thêm thịt, trứng và mè rang'
    ],
    tags: ['Hàn Quốc', 'Mì', 'Trộn'],
    calories: 420,
    category: 'Món Hàn'
  },
  {
    id: '5',
    name: 'Sushi Cá Hồi',
    description: 'Sushi Nhật Bản với cá hồi tươi',
    time: 40,
    servings: 4,
    rating: 4.9,
    reviews: 278,
    author: 'Sushi Master',
    difficulty: 'Trung bình',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600',
    ingredients: ['cơm sushi', 'cá hồi', 'rong biển', 'dưa leo', 'avocado', 'giấm sushi', 'wasabi', 'gừng'],
    steps: [
      'Nấu cơm và pha giấm sushi',
      'Vo và nén cơm thành miếng',
      'Cắt cá hồi thành lát mỏng',
      'Đặt cá lên cơm',
      'Thêm rau và cuộn với rong biển'
    ],
    tags: ['Nhật Bản', 'Sushi', 'Cá'],
    calories: 280,
    category: 'Món Nhật'
  },
  {
    id: '6',
    name: 'Cơm Chiên Trứng',
    description: 'Cơm chiên trứng giòn rụm đơn giản mà ngon',
    time: 15,
    servings: 2,
    rating: 4.4,
    reviews: 312,
    author: 'Home Cook',
    difficulty: 'Dễ',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600',
    ingredients: ['cơm nguội', 'trứng', 'hành', 'tỏi', 'nước mắm', 'dầu ăn', 'hành phi'],
    steps: [
      'Đập trứng và khuấy đều',
      'Phi thơm hành tỏi',
      'Cho cơm vào chiên với lửa lớn',
      'Đổ trứng vào và chiên đều',
      'Nêm nước mắm, thêm hành phi'
    ],
    tags: ['Chiên', 'Trứng', 'Nhanh', 'Tiết kiệm'],
    calories: 350,
    category: 'Món Việt'
  },
  {
    id: '7',
    name: 'Bún Bò Huế',
    description: 'Bún bò Huế thơm nồng với sả và mắc khén',
    time: 50,
    servings: 4,
    rating: 4.8,
    reviews: 198,
    author: 'Huế Cuisine',
    difficulty: 'Trung bình',
    image: 'https://images.unsplash.com/photo-1576577445504-6af96477db52?w=600',
    ingredients: ['thịt bò', 'bún', 'sả', 'mắc khén', 'hành', 'tỏi', 'đường', 'nước mắm', 'ớt'],
    steps: [
      'Hầm xương với sả và mắc khén',
      'Nấu nước dùng với các loại thịt bò',
      'Luộc bún và xếp vào tô',
      'Thêm thịt, hành phi',
      'Rưới nước dùng nóng'
    ],
    tags: ['Việt Nam', 'Bún', 'Bò', 'Huế'],
    calories: 480,
    category: 'Món Việt'
  },
  {
    id: '8',
    name: 'Pizza Margherita',
    description: 'Pizza Ý truyền thống với cà chua, mozzarella và basil',
    time: 45,
    servings: 4,
    rating: 4.7,
    reviews: 245,
    author: 'Italian Chef',
    difficulty: 'Trung bình',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600',
    ingredients: ['bột pizza', 'cà chua', 'mozzarella', 'basil', 'dầu olive', 'tỏi', 'muối'],
    steps: [
      'Nhào bột và ủ trong 1 giờ',
      'Làm sốt cà chua',
      'Cán bột thành đế pizza',
      'Phết sốt, rải mozzarella',
      'Nướng ở 220°C trong 12-15 phút',
      'Thêm basil tươi trước khi ăn'
    ],
    tags: ['Ý', 'Pizza', 'Phô mai'],
    calories: 520,
    category: 'Món Âu'
  }
];

// Search recipes by ingredients
router.get('/search', (req, res) => {
  try {
    const { ingredients } = req.query;

    if (!ingredients) {
      // Return all recipes if no ingredients specified
      return res.json({
        success: true,
        count: recipes.length,
        recipes: recipes
      });
    }

    // Parse ingredients (comma-separated)
    const searchIngredients = ingredients
      .toLowerCase()
      .split(',')
      .map(i => i.trim());

    // Filter recipes that contain any of the search ingredients
    const matchedRecipes = recipes.filter(recipe => {
      const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase());
      return searchIngredients.some(searchIng =>
        recipeIngredients.some(recipeIng =>
          recipeIng.includes(searchIng) || searchIng.includes(recipeIng)
        )
      );
    });

    // Sort by number of matching ingredients
    matchedRecipes.sort((a, b) => {
      const aMatches = searchIngredients.filter(searchIng =>
        a.ingredients.some(ing => ing.toLowerCase().includes(searchIng))
      ).length;
      const bMatches = searchIngredients.filter(searchIng =>
        b.ingredients.some(ing => ing.toLowerCase().includes(searchIng))
      ).length;
      return bMatches - aMatches;
    });

    res.json({
      success: true,
      count: matchedRecipes.length,
      searchIngredients: searchIngredients,
      recipes: matchedRecipes
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Lỗi khi tìm kiếm công thức' });
  }
});

// Get all recipes
router.get('/', (req, res) => {
  try {
    const { category, difficulty, limit = 20 } = req.query;

    let filteredRecipes = [...recipes];

    // Filter by category
    if (category) {
      filteredRecipes = filteredRecipes.filter(r =>
        r.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by difficulty
    if (difficulty) {
      filteredRecipes = filteredRecipes.filter(r =>
        r.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    // Limit results
    filteredRecipes = filteredRecipes.slice(0, parseInt(limit));

    res.json({
      success: true,
      count: filteredRecipes.length,
      recipes: filteredRecipes
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách công thức' });
  }
});

// Get recipe by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const recipe = recipes.find(r => r.id === id);

    if (!recipe) {
      return res.status(404).json({ error: 'Không tìm thấy công thức' });
    }

    res.json({
      success: true,
      recipe
    });
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ error: 'Lỗi khi lấy công thức' });
  }
});

// Get trending recipes
router.get('/trending/list', (req, res) => {
  try {
    const trending = [...recipes]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    res.json({
      success: true,
      recipes: trending
    });
  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({ error: 'Lỗi khi lấy công thức trending' });
  }
});

// Get categories
router.get('/meta/categories', (req, res) => {
  try {
    const categories = [...new Set(recipes.map(r => r.category))];
    const difficulties = [...new Set(recipes.map(r => r.difficulty))];

    res.json({
      success: true,
      categories,
      difficulties
    });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Lỗi khi lấy danh mục' });
  }
});

module.exports = router;

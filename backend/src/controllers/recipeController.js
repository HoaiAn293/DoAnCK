const Product = require('../models/Product');

/**
 * @desc    Search products by name
 * @route   GET /api/products/search
 */
exports.searchByName = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const products = await Product.find({
      name: { $regex: q, $options: 'i' },
      isActive: true
    }).populate('categoryId');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Filter products by ingredients ("In the fridge")
 * @route   POST /api/products/filter
 */
exports.filterByIngredients = async (req, res) => {
  try {
    const { ingredients } = req.body; // Array of ingredient names
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ success: false, message: 'Ingredients list is required' });
    }

    // Find products that contain ALL of the specified ingredients
    // Or products where ALL ingredients are contained within the search list?
    // Usually "What's in my fridge" means: What can I cook with THESE?
    // So: product.ingredients should be a subset of the provided list.
    
    // For simplicity, let's find products that contain AT LEAST one of these ingredients
    // or specify "Exact Match" / "Subset Match".
    // Let's go with "Match at least one" for better discovery.
    const products = await Product.find({
      ingredients: { $in: ingredients },
      isActive: true
    }).populate('categoryId');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all unique ingredients from database
 * @route   GET /api/products/ingredients
 */
exports.getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Product.distinct('ingredients', { isActive: true });
    res.status(200).json({
      success: true,
      data: ingredients.sort()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

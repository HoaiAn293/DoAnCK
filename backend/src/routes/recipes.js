const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// @route   GET /api/recipes/search
router.get('/search', recipeController.searchByName);

// @route   POST /api/recipes/filter
router.post('/filter', recipeController.filterByIngredients);

// @route   GET /api/recipes/ingredients
router.get('/ingredients', recipeController.getAllIngredients);

module.exports = router;

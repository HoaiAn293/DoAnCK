// Recipe Service - Kết nối với Backend
import api from './api';

class RecipeService {
  // Search recipes by ingredients
  async searchByIngredients(ingredients) {
    if (!ingredients || ingredients.length === 0) {
      return this.getAllRecipes();
    }

    const ingredientsString = ingredients.join(',');
    return api.request(`/recipes/search?ingredients=${encodeURIComponent(ingredientsString)}`);
  }

  // Get all recipes
  async getAllRecipes(limit = 20) {
    return api.request(`/recipes?limit=${limit}`);
  }

  // Get recipe by ID
  async getRecipeById(id) {
    return api.request(`/recipes/${id}`);
  }

  // Get trending recipes
  async getTrendingRecipes() {
    return api.request('/recipes/trending/list');
  }

  // Get recipes by category
  async getRecipesByCategory(category, limit = 20) {
    return api.request(`/recipes?category=${encodeURIComponent(category)}&limit=${limit}`);
  }

  // Get recipes by difficulty
  async getRecipesByDifficulty(difficulty, limit = 20) {
    return api.request(`/recipes?difficulty=${encodeURIComponent(difficulty)}&limit=${limit}`);
  }

  // Get categories and meta info
  async getMeta() {
    return api.request('/recipes/meta/categories');
  }
}

export const recipeService = new RecipeService();
export default recipeService;

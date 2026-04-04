import axios from 'axios';
import { Platform } from 'react-native';

// For Android Emulator, localhost is 10.0.2.2
// For iOS Simulator, it's localhost
// For physical devices, use your computer's IP address
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const recipeService = {
  searchByName: (query: string) => api.get(`/recipes/search?q=${query}`),
  filterByIngredients: (ingredients: string[]) => api.post('/recipes/filter', { ingredients }),
  getIngredients: () => api.get('/recipes/ingredients'),
};

export default api;

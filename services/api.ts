import { Platform } from 'react-native';

const getApiBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }
  return 'http://172.29.32.1:5000/api';
};

const api = {
  baseUrl: getApiBaseUrl(),
  token: null as string | null,

  setToken(t: string | null) {
    this.token = t;
  },

  clearToken() {
    this.token = null;
  },

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // ============ AUTH ============
  async register(email: string, password: string, name: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, confirmPassword: password }),
    });
  },

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async googleAuth(idToken: string) {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  },

  async getProfile() {
    return this.request('/auth/profile');
  },

  async updateProfile(data: Record<string, unknown>) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // ============ INGREDIENTS ============
  async getIngredients() {
    return this.request('/recipes/ingredients');
  },

  // ============ PRODUCTS / RECIPES ============
  async getProducts(params?: string) {
    return this.request(`/products${params ? '?' + params : ''}`);
  },

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  },

  async createProduct(data: Record<string, unknown>) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id: string, data: Record<string, unknown>) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, { method: 'DELETE' });
  },

  async searchProducts(q: string) {
    return this.request(`/products/search?q=${encodeURIComponent(q)}`);
  },

  async filterByIngredients(ingredients: string[]) {
    return this.request('/products/filter', {
      method: 'POST',
      body: JSON.stringify({ ingredients }),
    });
  },

  // ============ CATEGORIES ============
  async getCategories(params?: string) {
    return this.request(`/categories${params ? '?' + params : ''}`);
  },

  async createCategory(data: Record<string, unknown>) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCategory(id: string, data: Record<string, unknown>) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteCategory(id: string) {
    return this.request(`/categories/${id}`, { method: 'DELETE' });
  },

  // ============ INVENTORY / INGREDIENTS ============
  async getInventory(params?: string) {
    return this.request(`/inventory${params ? '?' + params : ''}`);
  },

  async createInventoryItem(data: Record<string, unknown>) {
    return this.request('/inventory', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateInventoryItem(id: string, data: Record<string, unknown>) {
    return this.request(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteInventoryItem(id: string) {
    return this.request(`/inventory/${id}`, { method: 'DELETE' });
  },

  async adjustStock(id: string, quantity: number) {
    return this.request(`/inventory/${id}/adjust-stock`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },
};

export default api;

import { proxy } from 'valtio';

const authStore = proxy({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  loading: false,
  error: null,
});

// API base URL
const API_URL = 'http://localhost:8080/api/auth';

// Helper to set auth headers
const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
    ...(authStore.token && { Authorization: `Bearer ${authStore.token}` }),
  };
};

// Sign up
export const signup = async (name, email, password) => {
  authStore.loading = true;
  authStore.error = null;

  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    authStore.user = { _id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin };
    authStore.token = data.token;
    authStore.isAuthenticated = true;
    localStorage.setItem('token', data.token);

    return { success: true };
  } catch (error) {
    authStore.error = error.message;
    return { success: false, error: error.message };
  } finally {
    authStore.loading = false;
  }
};

// Sign in
export const signin = async (email, password) => {
  authStore.loading = true;
  authStore.error = null;

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    authStore.user = { _id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin };
    authStore.token = data.token;
    authStore.isAuthenticated = true;
    localStorage.setItem('token', data.token);

    return { success: true };
  } catch (error) {
    authStore.error = error.message;
    return { success: false, error: error.message };
  } finally {
    authStore.loading = false;
  }
};

// Sign out
export const signout = () => {
  authStore.user = null;
  authStore.token = null;
  authStore.isAuthenticated = false;
  localStorage.removeItem('token');

  // Clear cart on logout
  if (typeof window !== 'undefined') {
    const { clearCart } = require('./cartStore');
    clearCart();
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  authStore.loading = true;
  authStore.error = null;

  try {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return { success: true, message: data.message };
  } catch (error) {
    authStore.error = error.message;
    return { success: false, error: error.message };
  } finally {
    authStore.loading = false;
  }
};

// Get current user
export const getCurrentUser = async () => {
  if (!authStore.token) return;

  authStore.loading = true;

  try {
    const response = await fetch(`${API_URL}/me`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user');
    }

    authStore.user = data;
    authStore.isAuthenticated = true;
  } catch (error) {
    signout();
  } finally {
    authStore.loading = false;
  }
};

export default authStore;

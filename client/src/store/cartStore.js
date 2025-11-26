import { proxy } from "valtio";

// Cart store
export const cartStore = proxy({
  items: [], // { id, name, model, image, price, quantity, size, color }
  isCartOpen: false,
  totalItems: 0,
  totalPrice: 0,
});

// Add item to cart
export const addToCart = (product) => {
  const existingItem = cartStore.items.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartStore.items.push({
      ...product,
      quantity: 1,
      price: product.price || 8999, // Default price in PKR
    });
  }

  updateCartTotals();
};

// Remove item from cart
export const removeFromCart = (productId) => {
  cartStore.items = cartStore.items.filter(item => item.id !== productId);
  updateCartTotals();
};

// Update item quantity
export const updateQuantity = (productId, quantity) => {
  const item = cartStore.items.find(item => item.id === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
    updateCartTotals();
  }
};

// Clear cart
export const clearCart = () => {
  cartStore.items = [];
  updateCartTotals();
};

// Toggle cart visibility
export const toggleCart = () => {
  cartStore.isCartOpen = !cartStore.isCartOpen;
};

// Update totals
const updateCartTotals = () => {
  cartStore.totalItems = cartStore.items.reduce((sum, item) => sum + item.quantity, 0);
  cartStore.totalPrice = cartStore.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export default cartStore;

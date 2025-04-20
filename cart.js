// Cart Management Script (cart.js)
// This script manages the shopping cart functionality across pages

// Cart Class
class ShoppingCart {
  constructor() {
    // Initialize cart from localStorage or empty array
    this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
    this.currency = localStorage.getItem('cartCurrency') || 'CFA';
    this.exchangeRate = 655.957; // 1 USD = 655.957 CFA Francs (fixed rate for Euro zone)
    
    // DOM Elements - will be set in the init method
    this.cartButton = null;
    this.cartSection = null;
    this.cartItems = null;
    this.cartCount = null;
    this.cartTotal = null;
    this.checkoutBtn = null;
    
    // Bind methods
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.updateCartDisplay = this.updateCartDisplay.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.checkout = this.checkout.bind(this);
    this.showToast = this.showToast.bind(this);
  }
  
  // Initialize the cart functionality
  init() {
    // Get DOM elements
    this.cartButton = document.getElementById('cart-button');
    this.cartSection = document.getElementById('cart');
    this.cartItems = document.getElementById('cart-items');
    this.cartCount = document.getElementById('cart-count');
    this.cartTotal = document.getElementById('cart-total');
    this.checkoutBtn = document.getElementById('checkout-btn');
    this.addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Set up event listeners
    if (this.cartButton) {
      this.cartButton.addEventListener('click', () => {
        const mainSections = document.querySelectorAll('main > section');
        mainSections.forEach(section => {
          if (section.id !== 'cart') {
            section.style.display = 'none';
          }
        });
        this.cartSection.style.display = 'block';
      });
    }
    
    // Add to cart buttons
    this.addToCartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        const productName = card.querySelector('h3').textContent;
        let productPrice = card.querySelector('.price').textContent;
        let priceValue = parseFloat(productPrice.replace(/[^\d.]/g, ''));
        
        // If the displayed price is in CFA but the internal storage is in USD
        if (productPrice.includes('CFA')) {
          priceValue = priceValue / this.exchangeRate;
        }
        
        this.addItem(productName, priceValue);
      });
    });
    
    // Checkout button
    if (this.checkoutBtn) {
      this.checkoutBtn.addEventListener('click', this.checkout);
    }
    
    // Update cart display with current items
    this.updateCartDisplay();
    this.updateCartCount();
  }
  
  // Format price according to currency
  formatPrice(price) {
    if (this.currency === 'CFA') {
      return `${Math.round(price * this.exchangeRate).toLocaleString()} CFA`;
    }
    return `$${price.toFixed(2)}`;
  }
  
  // Add item to cart
  addItem(name, price) {
    this.items.push({
      name: name,
      price: price
    });
    
    // Save to localStorage
    this.saveCart();
    
    // Update UI
    this.updateCartCount();
    this.updateCartDisplay();
    
    // Show toast notification
    this.showToast(`${name} added to cart!`, 'success');
  }
  
  // Remove item from cart
  removeItem(index) {
    const removedItem = this.items[index];
    this.items.splice(index, 1);
    
    // Save to localStorage
    this.saveCart();
    
    // Update UI
    this.updateCartCount();
    this.updateCartDisplay();
    
    // Show toast notification
    this.showToast(`Item removed from cart!`, 'success');
  }
  
  // Update cart count badge
  updateCartCount() {
    if (this.cartCount) {
      this.cartCount.textContent = this.items.length;
    }
  }
  
  // Update cart display
  updateCartDisplay() {
    if (!this.cartItems) return;
    
    // Clear current items
    this.cartItems.innerHTML = '';
    
    // Calculate total
    let total = 0;
    
    // Add each item to the display
    this.items.forEach((item, index) => {
      total += item.price;
      
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <p>${item.name}</p>
        <div>
          <span>${this.formatPrice(item.price)}</span>
          <button class="btn btn-danger remove-item" data-index="${index}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      this.cartItems.appendChild(cartItem);
    });
    
    // Update total
    if (this.cartTotal) {
      this.cartTotal.textContent = this.formatPrice(total);
    }
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        this.removeItem(index);
      });
    });
  }
  
  // Save cart to localStorage
  saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(this.items));
    localStorage.setItem('cartCurrency', this.currency);
  }
  
  // Clear cart
  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateCartCount();
    this.updateCartDisplay();
  }
  
  // Checkout functionality - redirect to WhatsApp with order details
  checkout() {
    if (this.items.length === 0) {
      this.showToast('Your cart is empty!', 'error');
      return;
    }
    
    // Create WhatsApp message
    let message = "Bonjour, J'aimerais passer commande suivante:\n\n";
    
    let total = 0;
    this.items.forEach(item => {
      total += item.price;
      message += `• ${item.name}: ${this.formatPrice(item.price)}\n`;
    });
    
    message += `\nTotal: ${this.formatPrice(total)}`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp phone number
    const phoneNumber = "221703019074";
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
    
    // Clear cart after order is placed
    this.clearCart();
    this.showToast('Commande transmise vers WhatsApp!', 'success');
  }
  
  // Toggle currency between USD and CFA
  toggleCurrency() {
    this.currency = this.currency === 'USD' ? 'CFA' : 'USD';
    this.saveCart();
    this.updateCartDisplay();
    this.showToast(`Currency changed to ${this.currency}`, 'success');
    
    // Update product prices display
    this.updateProductPricesDisplay();
  }
  
  // Update the display of prices on product cards
  updateProductPricesDisplay() {
    const priceElements = document.querySelectorAll('.price');
    
    priceElements.forEach(element => {
      let price = element.textContent;
      let priceValue = parseFloat(price.replace(/[^\d.]/g, ''));
      
      // If currently showing USD and we want CFA
      if (price.includes('$') && this.currency === 'CFA') {
        element.textContent = `${Math.round(priceValue * this.exchangeRate).toLocaleString()} CFA`;
      } 
      // If currently showing CFA and we want USD
      else if (price.includes('CFA') && this.currency === 'USD') {
        element.textContent = `$${(priceValue / this.exchangeRate).toFixed(2)}`;
      }
    });
  }
  
  // Toast notification
  showToast(message, type = '') {
    // Check if toast container exists, if not create it
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.className = 'toast';
    
    if (type) {
      toast.classList.add(type);
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

// Create and initialize the cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create global cart instance
  window.cart = new ShoppingCart();
  
  // Initialize cart
  window.cart.init();
  
  // Set initial product price display
  window.cart.updateProductPricesDisplay();
  
  // Add currency toggle button if it exists
  const currencyToggle = document.getElementById('currency-toggle');
  if (currencyToggle) {
    currencyToggle.addEventListener('click', () => {
      window.cart.toggleCurrency();
    });
  }
});

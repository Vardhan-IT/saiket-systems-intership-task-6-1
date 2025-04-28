// DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchCategory = document.getElementById('search-category');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElement = document.getElementById('cart-count');
const sidebarCartCount = document.getElementById('sidebar-cart-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const checkoutBtn = document.getElementById('checkout-btn');
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
const loginModal = document.getElementById('login-modal');
const loginOverlay = document.getElementById('login-overlay');
const signInBtn = document.getElementById('sign-in-btn');
const closeLoginBtn = document.getElementById('close-login');
const loginForm = document.getElementById('login-form');
const createAccountLink = document.getElementById('create-account-link');
const backToTopBtn = document.getElementById('back-to-top');

// Slider Elements
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');

// Shopping Cart
let cart = [];
let currentSlide = 0;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Amazon-like website loaded successfully!');
    
    // Load cart from localStorage if available
    loadCart();
    
    // Start the slider
    startSlider();
});

// Toggle mobile menu
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Search functionality
if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const category = searchCategory.value;
    
    if (searchTerm === '') return;
    
    // Get all product cards
    const productCards = document.querySelectorAll('.product-card');
    
    // Filter products based on search term and category
    productCards.forEach(card => {
        const productTitle = card.querySelector('.product-title').textContent.toLowerCase();
        const productCategory = card.dataset.category;
        
        // Check if product matches search criteria
        const matchesSearch = productTitle.includes(searchTerm);
        const matchesCategory = category === 'all' || productCategory === category;
        
        // Show or hide product based on search results
        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show search results message
    alert(`Showing results for "${searchTerm}" in ${category === 'all' ? 'all categories' : category}`);
}

// Image Slider functionality
function startSlider() {
    // Set initial slide
    showSlide(currentSlide);
    
    // Auto advance slides every 5 seconds
    setInterval(() => {
        nextSlide();
    }, 5000);
    
    // Add event listeners for slider buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
        });
    }
}

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show the current slide
    slides[index].classList.add('active');
}

function nextSlide() {
    currentSlide++;
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide--;
    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    showSlide(currentSlide);
}

// Shopping Cart functionality
function loadCart() {
    const savedCart = localStorage.getItem('amastore-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem('amastore-cart', JSON.stringify(cart));
}

function addToCart(productId) {
    // Find the product card
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
    
    if (!productCard) return;
    
    // Get product details
    const productTitle = productCard.querySelector('.product-title').textContent;
    const productPrice = productCard.querySelector('.price-current').textContent;
    const productImage = productCard.querySelector('.product-image img').src;
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Increment quantity if already in cart
        existingItem.quantity += 1;
    } else {
        // Add new item to cart
        cart.push({
            id: productId,
            title: productTitle,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    // Save cart and update UI
    saveCart();
    updateCartUI();
    
    // Show cart sidebar
    openCart();
}

function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    sidebarCartCount.textContent = `(${totalItems})`;
    
    // Update cart items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        cartSubtotal.textContent = '$0.00';
        return;
    }
    
    // Calculate subtotal
    let subtotal = 0;
    
    // Add each item to cart
    cart.forEach(item => {
        // Extract numeric price from string (e.g., "$19.99" -> 19.99)
        const priceValue = parseFloat(item.price.replace('$', ''));
        const itemTotal = priceValue * item.quantity;
        subtotal += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${item.price}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">Remove</button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Update subtotal
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    
    // Add event listeners for quantity buttons and remove buttons
    document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', () => decreaseQuantity(btn.dataset.id));
    });
    
    document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', () => increaseQuantity(btn.dataset.id));
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
    });
}

function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += 1;
        saveCart();
        updateCartUI();
    }
}

function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity -= 1;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
}

// Add to cart button event listeners
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const productId = btn.dataset.id;
        addToCart(productId);
    });
});

// Cart open/close event listeners
if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
}

if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
}

document.querySelectorAll('.cart-container').forEach(container => {
    container.addEventListener('click', openCart);
});

// Login Modal functionality
function openLoginModal() {
    loginModal.classList.add('active');
    loginOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLoginModal() {
    loginModal.classList.remove('active');
    loginOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
}

if (signInBtn) {
    signInBtn.addEventListener('click', openLoginModal);
}

if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', closeLoginModal);
}

if (loginOverlay) {
    loginOverlay.addEventListener('click', closeLoginModal);
}

// Login form submission
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Simple validation
        if (email && password) {
            // Simulate login success
            alert('Login successful!');
            closeLoginModal();
        } else {
            alert('Please enter both email and password');
        }
    });
}

// Create account link
if (createAccountLink) {
    createAccountLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Create account functionality would be implemented here');
    });
}

// Back to top button
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Checkout button
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }
        
        alert('Proceeding to checkout...');
        // In a real application, this would redirect to a checkout page
    });
}

// Product hover effects
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    });
});
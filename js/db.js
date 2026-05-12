// Local Storage Database for Yatri Luggege

const defaultProducts = [
    {
        id: 1,
        name: "Yatri Pro-Traveler Trolley",
        category: "Trolley Bags",
        price: 4999,
        originalPrice: 6249,
        image: "assets/products/trolley-1.jpg",
        description: "Experience effortless travel with the Yatri Pro-Traveler. Crafted with a premium polycarbonate hardshell, this trolley features multi-directional silent spinner wheels, a secure TSA-approved lock, and an expandable design that provides up to 25% more packing space. Ideal for international vacations and long journeys.",
        rating: 4.8,
        reviews: 124,
        isTrending: true,
        features: ["Polycarbonate Shell", "Expandable", "Water Resistant"]
    },
    {
        id: 2,
        name: "Classic Leather Laptop Bag",
        category: "Laptop Bags",
        price: 2499,
        originalPrice: 2999,
        image: "assets/products/laptop-1.jpg",
        description: "Elevate your professional style with our Classic Leather Laptop Bag. Made from high-grade synthetic leather, it features a dedicated padded compartment for laptops up to 15.6 inches, multiple organizational pockets for your accessories, and a comfortable detachable shoulder strap. Perfect for business meetings and daily office use.",
        rating: 4.5,
        reviews: 85,
        isTrending: true,
        features: ["Premium Finish", "Padded Sleeve", "Multi-pockets"]
    },
    {
        id: 3,
        name: "Yatri Explorer Backpack",
        category: "Backpacks",
        price: 1899,
        originalPrice: 2499,
        image: "assets/products/backpack-1.jpg",
        description: "The ultimate companion for your outdoor adventures. The Yatri Explorer Backpack offers a massive 40L capacity, ergonomic breathable mesh shoulder straps, and a built-in rain cover. Its rugged water-resistant fabric and multiple compression straps make it ideal for hiking, camping, and weekend getaways.",
        rating: 4.7,
        reviews: 210,
        isTrending: true,
        features: ["Rain Cover", "Ergonomic Design", "40L Capacity"]
    },
    {
        id: 4,
        name: "Adventure Duffel Bag",
        category: "Travel Duffel Bags",
        price: 1599,
        originalPrice: 1999,
        image: "assets/products/duffel-1.jpg",
        description: "Versatile and spacious, the Adventure Duffel Bag is designed for the active traveler. It features a ventilated shoe compartment to keep your clean clothes separate, a large main opening for easy packing, and high-tensile fabric for long-lasting durability. Great for the gym, sports, or short trips.",
        rating: 4.6,
        reviews: 98,
        isTrending: false,
        features: ["Shoe Pocket", "Durable Fabric", "Foldable"]
    },
    {
        id: 5,
        name: "Compact Carry-On Suitcase",
        category: "Trolley Bags",
        price: 3499,
        originalPrice: 4399,
        image: "assets/products/trolley-2.jpg",
        description: "Navigate busy airports with ease using our Compact Carry-On Suitcase. Specifically designed to meet most airline overhead bin requirements, this lightweight trolley offers smooth-glide wheels and a telescopic handle for maximum maneuverability. A must-have for frequent flyers and weekend travelers.",
        rating: 4.9,
        reviews: 156,
        isTrending: true,
        features: ["Ultra-Light", "Compact", "Silent Wheels"]
    },
    {
        id: 6,
        name: "Urban Daily Backpack",
        category: "Backpacks",
        price: 1299,
        originalPrice: 1599,
        image: "assets/products/backpack-2.jpg",
        description: "The Urban Daily Backpack combines minimalist design with modern functionality. Featuring a hidden anti-theft pocket, a convenient USB charging port, and organized compartments for your tech essentials, it's the perfect choice for college students and city commuters who value both style and security.",
        rating: 4.4,
        reviews: 320,
        isTrending: false,
        features: ["Minimalist", "USB Charging Port", "Hidden Pocket"]
    }
];

// Initialize Database
function initDB() {
    if (!localStorage.getItem('yatri_products')) {
        localStorage.setItem('yatri_products', JSON.stringify(defaultProducts));
    }
    if (!localStorage.getItem('yatri_cart')) {
        localStorage.setItem('yatri_cart', JSON.stringify([]));
    }
    if (!localStorage.getItem('yatri_orders')) {
        localStorage.setItem('yatri_orders', JSON.stringify([]));
    }
}

// Get All Products
function getProducts() {
    return JSON.parse(localStorage.getItem('yatri_products'));
}

// Get Product By ID
function getProductById(id) {
    const products = getProducts();
    return products.find(p => p.id === parseInt(id));
}

// Get Trending Products
function getTrendingProducts() {
    const products = getProducts();
    return products.filter(p => p.isTrending);
}

// Add to Cart
function addToCart(productId, quantity = 1) {
    const cart = JSON.parse(localStorage.getItem('yatri_cart'));
    const product = getProductById(productId);
    
    const existingItem = cart.find(item => item.id === parseInt(productId));
    if (existingItem) {
        existingItem.quantity += parseInt(quantity);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: parseInt(quantity)
        });
    }
    
    localStorage.setItem('yatri_cart', JSON.stringify(cart));
    updateCartCount();
}

// Update Cart Count UI
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('yatri_cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const countElements = document.querySelectorAll('.cart-count');
    countElements.forEach(el => el.textContent = count);
}

// Initialize on load
initDB();
window.addEventListener('DOMContentLoaded', updateCartCount);

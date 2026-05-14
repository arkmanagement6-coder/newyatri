// Local Storage Database for Yatri Luggege

const defaultProducts = [

    {
        id: 2,
        name: "Classic Leather Laptop Bag",
        category: "Laptop Bags",
        price: 2499,
        originalPrice: 2999,
        image: "assets/products/laptop-1.jpg",
        rating: 4.5,
        reviews: 85,
        isTrending: true,
        features: ["Premium Finish", "Padded Sleeve", "Multi-pockets"],
        description: `
<div class="detailed-description">
    <h3>Overview</h3>
    <p>Elevate your professional style with our Classic Leather Laptop Bag. Made from high-grade synthetic leather, it features a dedicated padded compartment for laptops up to 15.6 inches, multiple organizational pockets, and a comfortable detachable shoulder strap. Perfect for business meetings and daily office use.</p>
    
    <h3>Key Features</h3>
    <ul>
        <li><strong>Premium Synthetic Leather:</strong> Cruelty-free, highly durable, and water-resistant.</li>
        <li><strong>Dedicated Laptop Compartment:</strong> Heavily padded to protect laptops up to 15.6".</li>
        <li><strong>Multi-Functional Pockets:</strong> Specific slots for pens, business cards, and smartphones.</li>
        <li><strong>Travel Ready:</strong> Features a luggage strap to slide over your rolling suitcase.</li>
    </ul>

    <h3>Specifications</h3>
    <p><strong>Dimensions:</strong> 40cm x 30cm x 10cm | <strong>Weight:</strong> 1.1 kg</p>
    <p><strong>Material:</strong> PU Leather exterior, polyester interior | <strong>Warranty:</strong> 1-year limited</p>
</div>
`
    },
    {
        id: 3,
        name: "Yatri Explorer Backpack",
        category: "Backpacks",
        price: 1899,
        originalPrice: 2499,
        image: "assets/products/backpack-1.jpg",
        rating: 4.7,
        reviews: 210,
        isTrending: true,
        features: ["Rain Cover", "Ergonomic Design", "40L Capacity"],
        description: `
<div class="detailed-description">
    <h3>Overview</h3>
    <p>The ultimate companion for your outdoor adventures. The Yatri Explorer Backpack offers a massive 40L capacity, ergonomic breathable mesh shoulder straps, and a built-in rain cover. Its rugged water-resistant fabric makes it ideal for hiking, camping, and weekend getaways.</p>
    
    <h3>Key Features</h3>
    <ul>
        <li><strong>Massive 40L Capacity:</strong> Ample space for clothing, gear, and supplies for multi-day trips.</li>
        <li><strong>Built-in Rain Cover:</strong> Stowed away in a dedicated bottom pocket for sudden downpours.</li>
        <li><strong>Ergonomic Support:</strong> Breathable mesh back panel and heavily padded shoulder straps.</li>
        <li><strong>Hydration Compatible:</strong> Internal sleeve and port for a hydration tube.</li>
    </ul>

    <h3>Specifications</h3>
    <p><strong>Dimensions:</strong> 52cm x 33cm x 22cm | <strong>Weight:</strong> 1.2 kg</p>
    <p><strong>Material:</strong> High-density Ripstop Nylon | <strong>Warranty:</strong> 3-year adventure warranty</p>
</div>
`
    },


    {
        id: 6,
        name: "Urban Daily Backpack",
        category: "Backpacks",
        price: 1299,
        originalPrice: 1599,
        image: "assets/products/backpack-2.jpg",
        rating: 4.4,
        reviews: 320,
        isTrending: false,
        features: ["Minimalist", "USB Charging Port", "Hidden Pocket"],
        description: `
<div class="detailed-description">
    <h3>Overview</h3>
    <p>The Urban Daily Backpack combines minimalist design with modern functionality. Featuring a hidden anti-theft pocket, a convenient USB charging port, and organized compartments for your tech essentials, it's the perfect choice for college students and city commuters who value style and security.</p>
    
    <h3>Key Features</h3>
    <ul>
        <li><strong>USB Charging Port:</strong> Built-in external USB port with an interior charging cable.</li>
        <li><strong>Anti-Theft Hidden Pocket:</strong> Discreet zippered pocket on the back panel for valuables.</li>
        <li><strong>Padded Tech Sleeve:</strong> Safely stores laptops up to 15.6 inches and a tablet.</li>
        <li><strong>Water-Repellent Material:</strong> High-density oxford fabric protects against light rain.</li>
    </ul>

    <h3>Specifications</h3>
    <p><strong>Dimensions:</strong> 45cm x 30cm x 15cm | <strong>Weight:</strong> 0.7 kg</p>
    <p><strong>Material:</strong> Oxford fabric | <strong>Capacity:</strong> 20 Liters | <strong>Warranty:</strong> 1-year limited</p>
</div>
`
    }
];

// Initialize Database
function initDB() {
    if (!localStorage.getItem('yatri_products') || !localStorage.getItem('yatri_v4')) {
        localStorage.setItem('yatri_products', JSON.stringify(defaultProducts));
        localStorage.setItem('yatri_v4', 'true');
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

// Buy Now
function buyNow(productId, quantity = 1) {
    addToCart(productId, quantity);
    window.location.href = 'checkout.html';
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

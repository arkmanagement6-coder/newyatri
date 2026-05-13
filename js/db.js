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
    <p>Elevate your professional style with our Classic Leather Laptop Bag. Made from high-grade synthetic leather, it features a dedicated padded compartment for laptops up to 15.6 inches, multiple organizational pockets for your accessories, and a comfortable detachable shoulder strap. Perfect for business meetings and daily office use.</p>
    
    <h3>In-Depth Features</h3>
    <ul>
        <li><strong>Premium Synthetic Leather:</strong> Offers the luxurious look and feel of real leather while being cruelty-free and highly durable.</li>
        <li><strong>Dedicated Laptop Compartment:</strong> Heavily padded sleeve designed specifically to protect laptops up to 15.6 inches from bumps and scratches.</li>
        <li><strong>Multi-Functional Pockets:</strong> Includes specific slots for pens, business cards, smartphones, and notebooks.</li>
        <li><strong>Detachable Shoulder Strap:</strong> Adjustable strap with a comfortable shoulder pad for easy carrying.</li>
        <li><strong>Sturdy Leather Handles:</strong> Reinforced for comfortable hand-carrying when the shoulder strap is detached.</li>
        <li><strong>Water-Resistant Exterior:</strong> Protects your valuable electronics from unexpected light rain or spills.</li>
        <li><strong>Smooth Metal Zippers:</strong> High-quality hardware that ensures smooth opening and closing.</li>
        <li><strong>Luggage Strap:</strong> Convenient trolley sleeve allows the bag to slide securely over the handle of your rolling suitcase.</li>
        <li><strong>Minimalist Professional Design:</strong> Makes a strong impression in any corporate environment.</li>
        <li><strong>Spacious Main Compartment:</strong> Enough room for your laptop, charger, documents, and other daily essentials.</li>
    </ul>

    <h3>Specifications</h3>
    <p><strong>Dimensions:</strong> 40cm x 30cm x 10cm</p>
    <p><strong>Weight:</strong> 1.1 kg</p>
    <p><strong>Material:</strong> Premium PU Leather exterior, Soft polyester interior lining</p>
    <p><strong>Laptop Compatibility:</strong> Up to 15.6-inch screens</p>
    <p><strong>Hardware:</strong> Rust-resistant metal alloy</p>
    
    <h3>Care and Maintenance</h3>
    <p>Keep your Classic Leather Laptop Bag looking pristine with these care instructions:</p>
    <ol>
        <li>Clean the exterior with a soft, slightly damp cloth.</li>
        <li>For tougher stains on the synthetic leather, use a mild leather cleaner.</li>
        <li>Do not machine wash or submerge in water.</li>
        <li>Avoid prolonged exposure to direct sunlight or extreme heat, which can cause fading or cracking.</li>
        <li>Store in a dust bag when not in use for extended periods.</li>
    </ol>
    
    <h3>Warranty Information</h3>
    <p>This product includes a 1-year limited warranty covering manufacturing defects such as broken zippers, faulty stitching, or hardware failures under normal use conditions.</p>
    
    <h3>Perfect For Every Professional</h3>
    <p>Whether you're heading to an important client meeting, working from a local coffee shop, or commuting to the office daily, the Classic Leather Laptop Bag is designed to meet the demands of modern professionals. It combines timeless aesthetics with the functional organization needed in today's fast-paced world.</p>
    
    <h3>What Our Customers Say</h3>
    <blockquote>"The perfect blend of professional style and practicality. The pockets keep everything organized, and the laptop sleeve is very secure." - David L.</blockquote>
    <blockquote>"Looks much more expensive than it is. I get compliments on this bag all the time at the office." - Jessica M.</blockquote>
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
    <p>The ultimate companion for your outdoor adventures. The Yatri Explorer Backpack offers a massive 40L capacity, ergonomic breathable mesh shoulder straps, and a built-in rain cover. Its rugged water-resistant fabric and multiple compression straps make it ideal for hiking, camping, and weekend getaways.</p>
    
    <h3>In-Depth Features</h3>
    <ul>
        <li><strong>Massive 40L Capacity:</strong> Ample space for clothing, gear, and supplies for multi-day trips.</li>
        <li><strong>Built-in Rain Cover:</strong> Stowed away in a dedicated bottom pocket, ready to deploy during sudden downpours.</li>
        <li><strong>Ergonomic Back Panel:</strong> Breathable mesh design with deep channels to promote airflow and keep your back cool.</li>
        <li><strong>Adjustable Straps:</strong> Heavily padded shoulder straps, a sternum strap, and a waist belt for optimal weight distribution.</li>
        <li><strong>Rugged Ripstop Fabric:</strong> Highly resistant to tears and abrasions, ensuring durability in harsh environments.</li>
        <li><strong>Hydration System Compatible:</strong> Features an internal sleeve and a port for a hydration tube (bladder not included).</li>
        <li><strong>Multiple Compartments:</strong> Includes a spacious main compartment, a front organizational pocket, and dual side mesh pockets for water bottles.</li>
        <li><strong>Compression Straps:</strong> Side straps allow you to cinch down the load for better stability when the pack isn't full.</li>
        <li><strong>Trekking Pole Attachments:</strong> Dedicated loops for securing trekking poles or ice axes.</li>
        <li><strong>Reflective Accents:</strong> Enhances visibility and safety in low-light conditions.</li>
    </ul>

    <h3>Specifications</h3>
    <p><strong>Dimensions:</strong> 52cm x 33cm x 22cm</p>
    <p><strong>Weight:</strong> 1.2 kg</p>
    <p><strong>Capacity:</strong> 40 Liters</p>
    <p><strong>Material:</strong> High-density Ripstop Nylon</p>
    <p><strong>Zippers:</strong> Heavy-duty SBS zippers</p>
    
    <h3>Care and Maintenance</h3>
    <p>Keep your backpack adventure-ready:</p>
    <ol>
        <li>Brush off loose dirt and debris after every use.</li>
        <li>Hand wash with warm water and mild soap when heavily soiled. Do not machine wash.</li>
        <li>Rinse thoroughly to remove all soap residue.</li>
        <li>Hang dry in a shaded, well-ventilated area. Avoid direct sunlight while drying.</li>
        <li>Ensure the backpack is completely dry before storing to prevent mold and odors.</li>
    </ol>
    
    <h3>Warranty Information</h3>
    <p>The Yatri Explorer Backpack is backed by a 3-year adventure warranty, covering defects in materials and craftsmanship. We guarantee that the seams and zippers will hold up to rigorous outdoor use.</p>
    
    <h3>Designed for the Wild</h3>
    <p>We understand that outdoor gear needs to be reliable. That's why the Explorer Backpack was tested in various terrains, from dense forests to rocky mountainsides, ensuring it meets the demands of serious hikers and casual campers alike.</p>
    
    <h3>Adventure Stories</h3>
    <blockquote>"Took this pack on a 3-day trek in the Himalayas. It held everything I needed, the weight distributed perfectly, and the rain cover saved my gear during an unexpected storm." - Arun K.</blockquote>
    <blockquote>"Incredibly durable and surprisingly comfortable even when fully loaded. The best hiking backpack I've owned at this price point." - Priya S.</blockquote>
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
    <p>The Urban Daily Backpack combines minimalist design with modern functionality. Featuring a hidden anti-theft pocket, a convenient USB charging port, and organized compartments for your tech essentials, it's the perfect choice for college students and city commuters who value both style and security.</p>
    
    <h3>In-Depth Features</h3>
    <ul>
        <li><strong>Integrated USB Charging Port:</strong> Built-in external USB port with an interior charging cable. Connect your power bank inside and easily charge your phone while walking. (Power bank not included).</li>
        <li><strong>Anti-Theft Hidden Pocket:</strong> A discreet zippered pocket located on the back panel, keeping your wallet, passport, and phone secure against your back and safe from pickpockets.</li>
        <li><strong>Padded Tech Sleeve:</strong> Safely stores laptops up to 15.6 inches and features a separate slot for a tablet or e-reader.</li>
        <li><strong>Minimalist Aesthetics:</strong> A sleek, clean design with no unnecessary dangling straps or bulky pockets, perfect for professional or academic settings.</li>
        <li><strong>Water-Repellent Material:</strong> Made from high-density oxford fabric that protects your belongings from light rain and accidental spills.</li>
        <li><strong>Ergonomic Support:</strong> Features padded, S-curve shoulder straps and a breathable back panel to reduce strain on your shoulders and back.</li>
        <li><strong>Smart Organization:</strong> Includes multiple interior slip pockets, pen loops, and a key clip to keep your everyday carry items neatly organized.</li>
        <li><strong>Luggage Strap:</strong> Allows the backpack to be securely mounted onto the handle of a rolling suitcase for easier transit through airports.</li>
        <li><strong>Durable Zippers:</strong> Dual-access main zippers designed for smooth operation and longevity.</li>
        <li><strong>Side Pockets:</strong> Low-profile side pockets ideal for a slim water bottle or compact umbrella.</li>
    </ul>

    <h3>Specifications</h3>
    <p><strong>Dimensions:</strong> 45cm x 30cm x 15cm</p>
    <p><strong>Weight:</strong> 0.7 kg</p>
    <p><strong>Capacity:</strong> 20 Liters</p>
    <p><strong>Material:</strong> Water-repellent Oxford fabric</p>
    <p><strong>Laptop Capacity:</strong> Up to 15.6 inches</p>
    <p><strong>Charging Port:</strong> USB Type-A</p>
    
    <h3>Care and Maintenance</h3>
    <p>Keep your Urban Daily Backpack looking sharp:</p>
    <ol>
        <li>Spot clean exterior stains immediately with a damp cloth.</li>
        <li>Do not machine wash or immerse in water due to the integrated USB charging cable.</li>
        <li>Clean the interior by shaking out dust and wiping with a lightly damp cloth.</li>
        <li>Allow the bag to air dry completely if it gets wet in the rain.</li>
        <li>Keep the USB port covered when not in use to prevent dust accumulation.</li>
    </ol>
    
    <h3>Warranty Information</h3>
    <p>Comes with a 1-year warranty covering manufacturing defects such as zipper malfunctions, strap tearing, and issues with the USB port connection.</p>
    
    <h3>Designed for the Modern Commute</h3>
    <p>The Urban Daily Backpack was created specifically for the challenges of city living. It balances the need for tech organization with security features and a low-profile design that won't bump into people on crowded trains or buses.</p>
    
    <h3>What Users Say</h3>
    <blockquote>"The design is incredibly sleek. The USB port is a lifesaver when my phone battery gets low during my commute. The hidden pocket gives me great peace of mind." - Rohan D.</blockquote>
    <blockquote>"Perfect bag for college. It holds my laptop, notebooks, and chargers without looking bulky. Very comfortable to wear all day." - Simran K.</blockquote>
</div>
`
    }
];

// Initialize Database
function initDB() {
    if (!localStorage.getItem('yatri_products') || !localStorage.getItem('yatri_v3')) {
        localStorage.setItem('yatri_products', JSON.stringify(defaultProducts));
        localStorage.setItem('yatri_v3', 'true');
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

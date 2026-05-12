// Shop Logic for Yatri Luggege

document.addEventListener('DOMContentLoaded', () => {
    const productDisplay = document.getElementById('product-display');
    const categoryFilters = document.querySelectorAll('#category-filters input');
    const priceFilters = document.querySelectorAll('#price-filters input');
    const sortBy = document.getElementById('sort-by');
    const productCountText = document.getElementById('product-count');

    // Get URL parameters for initial category or search
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('category');
    const searchQuery = urlParams.get('search');

    if (initialCategory) {
        categoryFilters.forEach(cb => {
            if (cb.value === initialCategory) cb.checked = true;
        });
    }

    function renderProducts() {
        let products = getProducts();

        // 1. Filter by Search
        if (searchQuery) {
            products = products.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                p.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // 2. Filter by Category
        const selectedCategories = Array.from(categoryFilters)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        if (selectedCategories.length > 0) {
            products = products.filter(p => selectedCategories.includes(p.category));
        }

        // 3. Filter by Price
        const selectedPrice = Array.from(priceFilters).find(rb => rb.checked).value;
        if (selectedPrice !== 'all') {
            const [min, max] = selectedPrice.split('-').map(Number);
            products = products.filter(p => p.price >= min && p.price <= max);
        }

        // 4. Sort
        const sortVal = sortBy.value;
        if (sortVal === 'low-high') {
            products.sort((a, b) => a.price - b.price);
        } else if (sortVal === 'high-low') {
            products.sort((a, b) => b.price - a.price);
        } else if (sortVal === 'rating') {
            products.sort((a, b) => b.rating - a.rating);
        }

        // 5. Display
        productDisplay.innerHTML = '';
        if (products.length === 0) {
            productDisplay.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No products found matching your criteria.</p>';
        } else {
            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <div class="product-img">
                        <img src="${product.image}" alt="${product.name}" onclick="location.href='product-detail.html?id=${product.id}'">
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-card-description">${product.description}</p>
                        <div class="product-price">
                            <span class="curr-price">${formatPrice(product.price)}</span>
                            <span class="old-price">${formatPrice(product.originalPrice)}</span>
                        </div>
                        <div class="product-rating" style="margin-bottom: 15px; color: #ffc107;">
                            ${renderRating(product.rating)} 
                            <span style="color: #666; font-size: 12px;">(${product.reviews})</span>
                        </div>
                        <button class="btn btn-primary" style="width: 100%" onclick="addToCart(${product.id}, 1)">Add to Cart</button>
                    </div>
                `;
                productDisplay.appendChild(card);
            });
        }
        productCountText.textContent = `Showing ${products.length} products`;
    }

    function renderRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    // Event Listeners
    categoryFilters.forEach(cb => cb.addEventListener('change', renderProducts));
    priceFilters.forEach(rb => rb.addEventListener('change', renderProducts));
    sortBy.addEventListener('change', renderProducts);

    // Initial render
    renderProducts();
});

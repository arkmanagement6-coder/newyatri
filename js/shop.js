// Shop Logic for Yatri Luggege

document.addEventListener('DOMContentLoaded', () => {
    const productDisplay = document.getElementById('product-display');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const categoryPillsContainer = document.getElementById('shop-category-pills');
    const priceFilters = document.querySelectorAll('#price-filters input');
    const sortBy = document.getElementById('sort-by');
    const productCountText = document.getElementById('product-count');

    // Get URL parameters for initial category (supports single or comma-separated multiple) or search
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategoryParam = urlParams.get('category');
    const searchQuery = urlParams.get('search');
    const initialCategories = initialCategoryParam
        ? initialCategoryParam.split(',').map(c => c.trim().toLowerCase())
        : [];

    // Dynamically populate categories in sidebar
    const categories = getCategories();
    if (categoryFiltersContainer) {
        categoryFiltersContainer.innerHTML = categories.map(cat => {
            const isChecked = initialCategories.includes(cat.name.toLowerCase());
            return `
                <label>
                    <input type="checkbox" value="${cat.name}" ${isChecked ? 'checked' : ''}>
                    <span>${cat.name} <small style="color: #888;">(${cat.count})</small></span>
                </label>
            `;
        }).join('');
    }

    function getCategoryCheckboxes() {
        return Array.from(document.querySelectorAll('#category-filters input[type="checkbox"]'));
    }

    function renderCategoryPills() {
        if (!categoryPillsContainer) return;
        const selected = getCategoryCheckboxes().filter(cb => cb.checked).map(cb => cb.value);

        const allActive = selected.length === 0;
        let pillsHtml = `<button class="category-pill ${allActive ? 'active' : ''}" data-cat="ALL">All Categories</button>`;
        pillsHtml += categories.map(cat => `
            <button class="category-pill ${selected.includes(cat.name) ? 'active' : ''}" data-cat="${cat.name}">
                ${cat.name} (${cat.count})
            </button>
        `).join('');

        categoryPillsContainer.innerHTML = pillsHtml;

        categoryPillsContainer.querySelectorAll('.category-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                const cat = pill.getAttribute('data-cat');
                const checkboxes = getCategoryCheckboxes();
                if (cat === 'ALL') {
                    checkboxes.forEach(cb => { cb.checked = false; });
                } else {
                    const targetCb = checkboxes.find(cb => cb.value === cat);
                    if (targetCb) targetCb.checked = !targetCb.checked;
                }
                renderProducts();
            });
        });
    }

    function renderProducts() {
        let products = getProducts();

        // 1. Filter by Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            products = products.filter(p =>
                p.name.toLowerCase().includes(q) ||
                (p.category || '').toLowerCase().includes(q) ||
                getCardSummary(p).toLowerCase().includes(q)
            );
        }

        // 2. Filter by Category (supports multiple selected categories)
        const selectedCategories = getCategoryCheckboxes()
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        if (selectedCategories.length > 0) {
            products = products.filter(p => selectedCategories.includes(p.category));
        }

        // 3. Filter by Price
        const selectedPriceInput = Array.from(priceFilters).find(rb => rb.checked);
        const selectedPrice = selectedPriceInput ? selectedPriceInput.value : 'all';
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

        // Update quick category pills UI
        renderCategoryPills();

        // 5. Display
        productDisplay.innerHTML = '';
        if (products.length === 0) {
            productDisplay.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No products found matching your criteria.</p>';
        } else {
            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                const discountPct = product.originalPrice > product.price
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : 0;
                const badgeLabel = product.badge || (discountPct >= 20 ? `Save ${discountPct}%` : '');
                const isDigital = product.category === 'Digital';

                card.innerHTML = `
                    ${badgeLabel ? `<span class="product-badge">${badgeLabel}</span>` : ''}
                    <div class="product-img ${isDigital ? 'digital-img' : ''}" onclick="location.href='product-detail.html?id=${product.id}'">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h3 class="product-name" onclick="location.href='product-detail.html?id=${product.id}'">${product.name}</h3>
                        <p class="product-card-description">${getCardSummary(product)}</p>
                        <div class="product-price" style="margin-top: auto;">
                            <span class="curr-price">${formatPrice(product.price)}</span>
                            ${product.originalPrice ? `<span class="old-price">${formatPrice(product.originalPrice)}</span>` : ''}
                        </div>
                        <div class="product-rating" style="margin-bottom: 15px; color: #ffc107;">
                            ${renderRating(product.rating)}
                            <span style="color: #666; font-size: 12px;">(${product.reviews})</span>
                        </div>
                        <div style="display: flex; gap: 10px; width: 100%;">
                            <button class="btn btn-primary" style="flex: 1; padding: 10px 12px; font-size: 14px;" onclick="addToCart('${product.id}', 1)">Add to Cart</button>
                            <button class="btn btn-secondary" style="flex: 1; padding: 10px 12px; font-size: 14px;" onclick="buyNow('${product.id}', 1)">Buy Now</button>
                        </div>
                    </div>
                `;
                productDisplay.appendChild(card);
            });
        }
        productCountText.textContent = `Showing ${products.length} ${products.length === 1 ? 'product' : 'products'}`;
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
    getCategoryCheckboxes().forEach(cb => cb.addEventListener('change', renderProducts));
    priceFilters.forEach(rb => rb.addEventListener('change', renderProducts));
    sortBy.addEventListener('change', renderProducts);

    // Initial render
    renderProducts();
});

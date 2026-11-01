// BloomCart — Frontend functionality

const productGrid = document.getElementById("productGrid");
const cartButton = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const searchInput = document.getElementById("searchInput");
const searchContainer = document.getElementById("searchContainer");
const searchToggle = document.getElementById("searchToggle");
const closeSearch = document.getElementById("closeSearch");

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

let cart = [];
let activeCategory = "All";
let searchTerm = "";

// Format prices
function formatPrice(price) {
    return `Rs. ${price.toLocaleString("en-PK")}`;
}

// Render products
function renderProducts() {
    const sortValue = document.getElementById("sortSelect").value;

    let filteredProducts = products.filter(product => {
        const matchesCategory =
            activeCategory === "All" ||
            product.category === activeCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    if (sortValue === "low-high") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === "high-low") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortValue === "name") {
        filteredProducts.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    productGrid.innerHTML = "";

    document.getElementById("emptyMessage").classList.toggle(
        "hidden",
        filteredProducts.length !== 0
    );

    filteredProducts.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <span class="product-badge">${product.badge}</span>
            </div>

            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3>${product.name}</h3>
                <div class="product-rating">★ ${product.rating}</div>

                <div class="product-bottom">
                    <strong>${formatPrice(product.price)}</strong>
                    <button class="add-to-cart" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;

        productGrid.appendChild(card);
    });
}

// Category filters
function setCategory(category) {
    activeCategory = category;

    document.querySelectorAll("#filterButtons .filter-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.category === category
        );
    });

    renderProducts();
}

document.querySelectorAll("[data-category]").forEach(button => {
    button.addEventListener("click", () => {
        setCategory(button.dataset.category);

        document.getElementById("shop").scrollIntoView({
            behavior: "smooth"
        });
    });
});

// Search products
searchInput.addEventListener("input", event => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderProducts();
});

// Open search
searchToggle.addEventListener("click", () => {
    searchContainer.classList.toggle("hidden");

    if (!searchContainer.classList.contains("hidden")) {
        searchInput.focus();
    }
});

// Close search
closeSearch.addEventListener("click", () => {
    searchContainer.classList.add("hidden");
    searchInput.value = "";
    searchTerm = "";
    renderProducts();
});

// Sort products
document.getElementById("sortSelect").addEventListener(
    "change",
    renderProducts
);

// Add products to cart
productGrid.addEventListener("click", event => {
    const button = event.target.closest(".add-to-cart");

    if (!button) return;

    const productId = Number(button.dataset.productId);
    const product = products.find(item => item.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    renderCart();
    openCart();
});

// Render shopping cart
function renderCart() {
    cartItemsContainer.innerHTML = "";

    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML =
            '<p class="cart-empty">Your cart is currently empty.</p>';
    }

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${formatPrice(item.price)}</p>

                <div class="quantity-controls">
                    <button data-action="decrease" data-id="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button data-action="increase" data-id="${item.id}">+</button>
                </div>
            </div>

            <button class="remove-item" data-action="remove" data-id="${item.id}">
                Remove
            </button>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    cartCount.textContent = count;
    cartTotal.textContent = formatPrice(total);
}

// Cart quantity and remove controls
cartItemsContainer.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");

    if (!button) return;

    const productId = Number(button.dataset.id);
    const action = button.dataset.action;
    const item = cart.find(product => product.id === productId);

    if (!item) return;

    if (action === "increase") {
        item.quantity++;
    } else if (action === "decrease") {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(product => product.id !== productId);
        }
    } else if (action === "remove") {
        cart = cart.filter(product => product.id !== productId);
    }

    renderCart();
});

// Open and close cart
function openCart() {
    cartPanel.classList.add("open");
    cartOverlay.classList.remove("hidden");
}

function closeCart() {
    cartPanel.classList.remove("open");
    cartOverlay.classList.add("hidden");
}

cartButton.addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// Keyboard Escape
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
        searchContainer.classList.add("hidden");
        navMenu.classList.remove("open");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    }
});

// Mobile hamburger menu
menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");

    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );
});

// Close mobile menu after clicking a link
navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

// Newsletter
document.getElementById("newsletterForm").addEventListener(
    "submit",
    event => {
        event.preventDefault();

        const emailInput = document.getElementById("newsletterEmail");

        if (!emailInput.checkValidity()) {
            emailInput.reportValidity();
            return;
        }

        document.getElementById("newsletterMessage").textContent =
            "Thank you for subscribing! This is a frontend demo.";

        emailInput.value = "";
    }
);

// Demo checkout
document.getElementById("checkoutButton").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty. Add a product first.");
        return;
    }

    alert(
        "Thank you for shopping with BloomCart! Checkout is a frontend demo only."
    );
});

// Initial setup
renderProducts();
renderCart();
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Swiper for review slider
    var swiper = new Swiper('.review-slider', {
        loop: true,
        grabCursor: true,
        spaceBetween: 20,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            991: { slidesPerView: 3 },
        },
    });

    // Mobile menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const navbar = document.querySelector('.header .navbar');
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('fa-times');
        navbar.classList.toggle('active');
    });

    // Cart Functionality
    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

    // Update cart count in header
    const updateCartCount = () => {
        const cartCount = document.getElementById('cart-count');
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    };
    updateCartCount();

    // Add to Cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productBox = button.closest('.box');
            const product = {
                id: productBox.dataset.id,
                name: productBox.dataset.name,
                price: parseFloat(productBox.dataset.price),
                image: productBox.dataset.image,
                quantity: 1
            };

            const existingItem = cart.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push(product);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
        });
    });

    // Cart Icon Navigation
    document.querySelector('.cart-icon').addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const navbar = document.querySelector('.header .navbar');
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('fa-times');
        navbar.classList.toggle('active');
    });

    // Cart Functionality
    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

    // Update Cart
    const updateCart = () => {
        const cartItems = document.getElementById('cart-items');
        const cartTotalPrice = document.getElementById('cart-total-price');
        const cartCount = document.getElementById('cart-count');
        let total = 0;

        cartItems.innerHTML = '';
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            cartItems.innerHTML += `
                <tr>
                    <td><img src="${item.image}" alt="${item.name}"></td>
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td><input type="number" value="${item.quantity}" data-id="${item.id}" min="0"></td>
                    <td>$${itemTotal.toFixed(2)}</td>
                    <td><button class="btn remove-item" data-id="${item.id}">Remove</button></td>
                </tr>
            `;
        });

        cartTotalPrice.textContent = total.toFixed(2);
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    };
    updateCart();

    // Update Quantity
    document.getElementById('cart-items').addEventListener('change', (e) => {
        if (e.target.type === 'number') {
            const id = e.target.dataset.id;
            const quantity = parseInt(e.target.value);
            const item = cart.find(item => item.id === id);
            if (quantity > 0) {
                item.quantity = quantity;
            } else {
                cart = cart.filter(item => item.id !== id);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
            updateInvoice();
        }
    });

    // Remove Item
    document.getElementById('cart-items').addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const id = e.target.dataset.id;
            cart = cart.filter(item => item.id !== id);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
            updateInvoice();
        }
    });

    // Clear Cart
    document.getElementById('clear-cart-btn').addEventListener('click', () => {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        updateInvoice();
    });

    // Checkout (Placeholder)
    document.getElementById('checkout-btn').addEventListener('click', () => {
        alert('Proceeding to checkout...');
        // Add actual checkout logic here (e.g., redirect to payment gateway)
    });

    // Invoice Generation
    const updateInvoice = () => {
        const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        const date = new Date().toLocaleString();
        const customerName = document.getElementById('customer-name').value || 'Guest';
        let total = 0;

        // Update invoice details
        document.getElementById('invoice-order-id').textContent = orderId;
        document.getElementById('invoice-date').textContent = date;
        const invoiceItems = document.getElementById('invoice-items');
        invoiceItems.innerHTML = '';
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            invoiceItems.innerHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>$${itemTotal.toFixed(2)}</td>
                </tr>
            `;
        });
        document.getElementById('invoice-total').textContent = total.toFixed(2);

        // Generate QR Code
        const qrData = JSON.stringify({
            orderId: orderId,
            date: date,
            customer: customerName,
            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity
            })),
            total: total.toFixed(2)
        });
        const qrCodeDiv = document.getElementById('qrcode');
        qrCodeDiv.innerHTML = '';
        if (cart.length > 0) {
            new QRCode(qrCodeDiv, {
                text: qrData,
                width: 150,
                height: 150,
                colorDark: '#443',
                colorLight: '#ffffff'
            });
        }
    };

    // Generate Invoice on Form Submit
    document.getElementById('invoice-form').addEventListener('submit', (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        updateInvoice();
    });

    // Download Invoice
    document.getElementById('download-invoice-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        const orderId = document.getElementById('invoice-order-id').textContent;
        const date = document.getElementById('invoice-date').textContent;
        const customerName = document.getElementById('customer-name').value || 'Guest';
        const total = document.getElementById('invoice-total').textContent;
        let invoiceText = `Coffee Shop Invoice\n\nOrder ID: ${orderId}\nDate: ${date}\nCustomer: ${customerName}\n\nItems:\n`;
        cart.forEach(item => {
            invoiceText += `${item.name} - Quantity: ${item.quantity} - Price: $${item.price.toFixed(2)} - Total: $${(item.price * item.quantity).toFixed(2)}\n`;
        });
        invoiceText += `\nTotal Amount: $${total}\n`;
        const blob = new Blob([invoiceText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${orderId}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    });

    // Cart Icon Navigation (redundant on cart page, but included for consistency)
    document.querySelector('.cart-icon').addEventListener('click', () => {
        window.location.href = 'cart.html';
    });

    // Initialize invoice on page load if cart is not empty
    if (cart.length > 0) {
        updateInvoice();
    }
});
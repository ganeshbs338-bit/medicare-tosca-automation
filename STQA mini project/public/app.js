/**
 * MediCare - Healthcare & Online Pharmacy Application
 * Client-Side Application Core Architecture
 * Optimized for Tricentis Tosca XScan Automation Testing
 */

(function () {
    // Application State
    const state = {
        currentView: 'home',
        currentUser: JSON.parse(localStorage.getItem('medicare_user') || 'null'),
        token: localStorage.getItem('medicare_token') || null,
        medicines: [],
        filteredMedicines: [],
        searchQuery: '',
        selectedCategory: 'All',
        sortBy: 'default',
        cart: JSON.parse(localStorage.getItem('medicare_cart') || '[]'),
        selectedMedicine: null,
        lastOrder: JSON.parse(localStorage.getItem('medicare_last_order') || 'null'),
        orders: [],
        prescriptions: [],
        adminStats: null,
        couponCode: '',
        couponApplied: false,
        couponDiscountRate: 0,
        toastMessage: null,
        toastType: 'info'
    };

    // DOM Elements Cache
    const appRoot = document.getElementById('app-root');

    // Utility: Show Toast Notification
    function showToast(message, type = 'info') {
        state.toastMessage = message;
        state.toastType = type;
        renderToast();
        setTimeout(() => {
            state.toastMessage = null;
            renderToast();
        }, 4000);
    }

    function renderToast() {
        let toastEl = document.getElementById('medicare-toast');
        if (!state.toastMessage) {
            if (toastEl) toastEl.remove();
            return;
        }
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.id = 'medicare-toast';
            toastEl.className = 'fixed bottom-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-white font-semibold transition-all transform duration-300';
            document.body.appendChild(toastEl);
        }
        toastEl.className = `fixed bottom-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-white font-semibold ${
            state.toastType === 'success' ? 'bg-emerald-600' :
            state.toastType === 'error' ? 'bg-rose-600' : 'bg-sky-600'
        }`;
        toastEl.innerHTML = `
            <span>${state.toastType === 'success' ? '✓' : state.toastType === 'error' ? '⚠' : 'ℹ'}</span>
            <span>${state.toastMessage}</span>
        `;
    }

    // Save Cart to LocalStorage
    function saveCart() {
        localStorage.setItem('medicare_cart', JSON.stringify(state.cart));
        updateNavCartBadge();
    }

    function updateNavCartBadge() {
        const badge = document.getElementById('nav-cart-count');
        if (badge) {
            const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
            badge.innerText = count;
            badge.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }

    // API Helpers
    async function apiRequest(endpoint, options = {}) {
        try {
            const res = await fetch(endpoint, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(state.token ? { 'Authorization': `Bearer ${state.token}` } : {})
                },
                ...options
            });
            return await res.json();
        } catch (err) {
            console.error('API Error:', err);
            return { success: false, error: 'Network or server communication failure.' };
        }
    }

    // Fetch Initial Medicines
    async function fetchMedicines() {
        const params = new URLSearchParams();
        if (state.searchQuery) params.append('search', state.searchQuery);
        if (state.selectedCategory && state.selectedCategory !== 'All') params.append('category', state.selectedCategory);
        if (state.sortBy && state.sortBy !== 'default') params.append('sort', state.sortBy);

        const data = await apiRequest(`/api/medicines?${params.toString()}`);
        if (data.success) {
            state.medicines = data.medicines;
            state.filteredMedicines = data.medicines;
        }
    }

    // Navigation Switcher
    window.navigate = async function (view, extraParam = null) {
        state.currentView = view;
        if (view === 'catalogue') {
            await fetchMedicines();
        } else if (view === 'patient-dashboard') {
            if (!state.currentUser) {
                navigate('login');
                return;
            }
            await fetchPatientOrders();
            await fetchPatientPrescriptions();
        } else if (view === 'admin-dashboard') {
            if (!state.currentUser || state.currentUser.role !== 'admin') {
                navigate('login');
                return;
            }
            await fetchAdminData();
        } else if (view === 'details' && extraParam) {
            state.selectedMedicine = extraParam;
        }

        renderApp();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // User Authentication
    window.handleLoginSubmit = async function (e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const errorEl = document.getElementById('login-error');

        errorEl.classList.add('hidden');
        errorEl.innerText = '';

        if (!email || !password) {
            errorEl.innerText = 'Please enter both email address and password.';
            errorEl.classList.remove('hidden');
            return;
        }

        const data = await apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (!data.success) {
            errorEl.innerText = data.error || 'Invalid credentials.';
            errorEl.classList.remove('hidden');
        } else {
            state.currentUser = data.user;
            state.token = data.token;
            localStorage.setItem('medicare_user', JSON.stringify(data.user));
            localStorage.setItem('medicare_token', data.token);
            showToast(`Welcome back, ${data.user.name}!`, 'success');

            if (data.user.role === 'admin') {
                navigate('admin-dashboard');
            } else {
                navigate('patient-dashboard');
            }
        }
    };

    window.handleLogout = function () {
        state.currentUser = null;
        state.token = null;
        localStorage.removeItem('medicare_user');
        localStorage.removeItem('medicare_token');
        showToast('You have been logged out successfully.', 'info');
        navigate('home');
    };

    // Pre-fill demo credentials for Tosca / QA examiner convenience
    window.prefillCredentials = function (role) {
        const emailInput = document.getElementById('login-email');
        const passInput = document.getElementById('login-password');
        if (role === 'patient') {
            emailInput.value = 'patient@medicare.com';
            passInput.value = 'Patient@123';
        } else {
            emailInput.value = 'admin@medicare.com';
            passInput.value = 'Admin@123';
        }
    };

    // Registration Handler
    window.handleRegistrationSubmit = async function (e) {
        e.preventDefault();
        const name = document.getElementById('registration-name').value.trim();
        const email = document.getElementById('registration-email').value.trim();
        const phone = document.getElementById('registration-phone').value.trim();
        const age = document.getElementById('registration-age').value.trim();
        const password = document.getElementById('registration-password').value.trim();
        const confirmPassword = document.getElementById('registration-confirm-password').value.trim();
        const errorEl = document.getElementById('registration-error');

        errorEl.classList.add('hidden');
        errorEl.innerText = '';

        // Client-side validations per ECP / BVA specs
        if (!name) {
            errorEl.innerText = 'Full name is required.';
            errorEl.classList.remove('hidden');
            return;
        }
        if (!email || !email.includes('@') || !email.includes('.')) {
            errorEl.innerText = 'Please enter a valid email address.';
            errorEl.classList.remove('hidden');
            return;
        }
        if (!/^\d{10}$/.test(phone)) {
            errorEl.innerText = 'Phone number must be exactly 10 digits.';
            errorEl.classList.remove('hidden');
            return;
        }
        const numAge = parseInt(age, 10);
        if (isNaN(numAge) || numAge < 18 || numAge > 100) {
            errorEl.innerText = 'Age must be between 18 and 100 years.';
            errorEl.classList.remove('hidden');
            return;
        }
        if (password.length < 8 || password.length > 20) {
            errorEl.innerText = 'Password length must be between 8 and 20 characters.';
            errorEl.classList.remove('hidden');
            return;
        }
        if (password !== confirmPassword) {
            errorEl.innerText = 'Passwords do not match.';
            errorEl.classList.remove('hidden');
            return;
        }

        const data = await apiRequest('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, phone, age: numAge, password, confirmPassword })
        });

        if (!data.success) {
            errorEl.innerText = data.error || 'Registration failed.';
            errorEl.classList.remove('hidden');
        } else {
            showToast('Account created successfully! Please login.', 'success');
            navigate('login');
        }
    };

    // Cart Management
    window.addToCart = function (medicineId, quantity = 1) {
        const med = state.medicines.find(m => m.id === medicineId);
        if (!med) return;

        if (med.stock <= 0) {
            showToast(`Sorry, ${med.name} is currently out of stock.`, 'error');
            return;
        }

        const existingItem = state.cart.find(item => item.id === medicineId);
        if (existingItem) {
            const newQty = existingItem.quantity + quantity;
            if (newQty > 10) {
                showToast('Maximum quantity allowed per item is 10.', 'error');
                return;
            }
            if (newQty > med.stock) {
                showToast(`Cannot add more than available stock (${med.stock}).`, 'error');
                return;
            }
            existingItem.quantity = newQty;
        } else {
            if (quantity > med.stock) {
                showToast(`Cannot add more than available stock (${med.stock}).`, 'error');
                return;
            }
            state.cart.push({
                id: med.id,
                name: med.name,
                category: med.category,
                price: med.price,
                stock: med.stock,
                requires_prescription: med.requires_prescription,
                image_url: med.image_url,
                quantity: quantity
            });
        }

        saveCart();
        showToast(`Added ${med.name} to cart.`, 'success');
        if (state.currentView === 'cart') renderApp();
    };

    window.updateCartQuantity = function (medicineId, delta) {
        const item = state.cart.find(i => i.id === medicineId);
        if (!item) return;

        const newQty = item.quantity + delta;
        if (newQty < 1) {
            removeFromCart(medicineId);
            return;
        }
        if (newQty > 10) {
            showToast('Maximum quantity per medicine is 10.', 'error');
            return;
        }
        if (newQty > item.stock) {
            showToast(`Only ${item.stock} units available in stock.`, 'error');
            return;
        }

        item.quantity = newQty;
        saveCart();
        renderApp();
    };

    window.removeFromCart = function (medicineId) {
        state.cart = state.cart.filter(i => i.id !== medicineId);
        saveCart();
        showToast('Item removed from cart.', 'info');
        renderApp();
    };

    // Calculate Discount (Calls White-box endpoint)
    async function computeOrderFinancials() {
        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (subtotal <= 0) return { subtotal: 0, discountPercent: 0, discountAmount: 0, finalAmount: 0 };

        const isMember = state.currentUser ? Boolean(state.currentUser.is_member) : true;
        const res = await apiRequest('/api/cart/calculate-discount', {
            method: 'POST',
            body: JSON.stringify({
                subtotal,
                isMember,
                couponCode: state.couponApplied ? state.couponCode : ''
            })
        });

        if (res.valid) {
            return res;
        }
        return { subtotal, discountPercent: 0, discountAmount: 0, finalAmount: subtotal };
    }

    // Coupon Handler
    window.applyCoupon = function () {
        const input = document.getElementById('coupon-code');
        const code = input ? input.value.trim().toUpperCase() : '';
        const msgEl = document.getElementById('coupon-message');

        if (!code) {
            if (msgEl) msgEl.innerText = 'Please enter a coupon code.';
            return;
        }

        if (code === 'MEDICARE5') {
            state.couponCode = code;
            state.couponApplied = true;
            showToast('Coupon MEDICARE5 applied successfully! (Extra 5% off)', 'success');
            renderApp();
        } else {
            state.couponApplied = false;
            if (msgEl) {
                msgEl.innerText = 'Invalid coupon code. Try MEDICARE5';
                msgEl.className = 'text-xs text-rose-600 mt-1 font-semibold';
            }
            showToast('Invalid coupon code.', 'error');
        }
    };

    // Checkout Submission
    window.handleCheckoutSubmit = async function (e) {
        e.preventDefault();
        const address = document.getElementById('delivery-address').value.trim();
        const phone = document.getElementById('delivery-phone').value.trim();
        const errorEl = document.getElementById('checkout-error');

        errorEl.classList.add('hidden');
        errorEl.innerText = '';

        if (!address || address.length < 10) {
            errorEl.innerText = 'Please enter a complete delivery address (minimum 10 characters).';
            errorEl.classList.remove('hidden');
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            errorEl.innerText = 'Please enter a valid 10-digit phone number.';
            errorEl.classList.remove('hidden');
            return;
        }

        if (state.cart.length === 0) {
            errorEl.innerText = 'Your shopping cart is empty.';
            errorEl.classList.remove('hidden');
            return;
        }

        const patientName = state.currentUser ? state.currentUser.name : 'Rahul Sharma';
        const userId = state.currentUser ? state.currentUser.id : 1;
        const isMember = state.currentUser ? Boolean(state.currentUser.is_member) : true;

        const data = await apiRequest('/api/orders', {
            method: 'POST',
            body: JSON.stringify({
                userId,
                patientName,
                deliveryAddress: address,
                phone,
                paymentMethod: 'Cash on Delivery',
                items: state.cart,
                couponCode: state.couponApplied ? state.couponCode : 'NONE',
                isMember
            })
        });

        if (!data.success) {
            errorEl.innerText = data.error || 'Failed to place order.';
            errorEl.classList.remove('hidden');
        } else {
            state.lastOrder = {
                orderId: data.orderId,
                items: [...state.cart],
                subtotal: data.subtotal,
                discount: data.discount,
                total: data.total,
                deliveryAddress: address,
                phone: phone,
                patientName: patientName,
                status: 'Placed',
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            };
            localStorage.setItem('medicare_last_order', JSON.stringify(state.lastOrder));

            // Clear Cart
            state.cart = [];
            saveCart();
            showToast('Order placed successfully!', 'success');
            navigate('confirmation');
        }
    };

    // Prescription Upload Handler
    window.handlePrescriptionSubmit = async function (e) {
        e.preventDefault();
        const fileInput = document.getElementById('prescription-file');
        const notesInput = document.getElementById('prescription-notes');
        const errorEl = document.getElementById('prescription-error');
        const successEl = document.getElementById('prescription-success');

        errorEl.classList.add('hidden');
        successEl.classList.add('hidden');

        if (!fileInput.files || fileInput.files.length === 0) {
            errorEl.innerText = 'Please select a prescription file (PDF, JPG, PNG).';
            errorEl.classList.remove('hidden');
            return;
        }

        const file = fileInput.files[0];
        const validExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
        const fileName = file.name.toLowerCase();
        const isValidExt = validExtensions.some(ext => fileName.endsWith(ext));

        if (!isValidExt) {
            errorEl.innerText = 'Invalid file format. Accepted formats are: .PDF, .JPG, .PNG';
            errorEl.classList.remove('hidden');
            return;
        }

        // 5 MB max limit
        if (file.size > 5 * 1024 * 1024) {
            errorEl.innerText = 'File size exceeds 5MB limit. Please upload a smaller file.';
            errorEl.classList.remove('hidden');
            return;
        }

        const res = await apiRequest('/api/prescriptions/upload', {
            method: 'POST',
            body: JSON.stringify({
                userId: state.currentUser ? state.currentUser.id : 1,
                patientName: state.currentUser ? state.currentUser.name : 'Rahul Sharma',
                filename: file.name,
                fileType: file.type || 'application/pdf',
                fileSize: file.size,
                notes: notesInput ? notesInput.value.trim() : ''
            })
        });

        if (!res.success) {
            errorEl.innerText = res.error || 'Prescription upload failed.';
            errorEl.classList.remove('hidden');
        } else {
            successEl.innerText = `Prescription "${file.name}" uploaded successfully! Status: PENDING clinical verification.`;
            successEl.classList.remove('hidden');
            fileInput.value = '';
            if (notesInput) notesInput.value = '';
            showToast('Prescription submitted for pharmacist verification.', 'success');
            if (state.currentUser) await fetchPatientPrescriptions();
        }
    };

    // Patient Data Fetchers
    async function fetchPatientOrders() {
        if (!state.currentUser) return;
        const data = await apiRequest(`/api/orders?userId=${state.currentUser.id}&role=patient`);
        if (data.success) {
            state.orders = data.orders;
        }
    }

    async function fetchPatientPrescriptions() {
        if (!state.currentUser) return;
        const data = await apiRequest(`/api/prescriptions?userId=${state.currentUser.id}&role=patient`);
        if (data.success) {
            state.prescriptions = data.prescriptions;
        }
    }

    // Admin Data Fetchers & Handlers
    async function fetchAdminData() {
        const statsRes = await apiRequest('/api/admin/stats');
        if (statsRes.success) state.adminStats = statsRes.stats;

        const ordersRes = await apiRequest('/api/orders?role=admin');
        if (ordersRes.success) state.orders = ordersRes.orders;

        const prescRes = await apiRequest('/api/prescriptions?role=admin');
        if (prescRes.success) state.prescriptions = prescRes.prescriptions;

        await fetchMedicines();
    }

    window.adminUpdateOrderStatus = async function (orderId) {
        const selectEl = document.getElementById(`order-status-select-${orderId}`);
        if (!selectEl) return;
        const newStatus = selectEl.value;

        const res = await apiRequest(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus })
        });

        if (res.success) {
            showToast(`Order ${orderId} updated to ${newStatus}.`, 'success');
            await fetchAdminData();
            renderApp();
        } else {
            showToast(res.error || 'Failed to update order status.', 'error');
        }
    };

    window.adminUpdatePrescriptionStatus = async function (prescId, status) {
        const res = await apiRequest(`/api/prescriptions/${prescId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, reviewedBy: 'Dr. A. Mehta (Chief Pharmacist)' })
        });

        if (res.success) {
            showToast(`Prescription #${prescId} marked as ${status}.`, 'success');
            await fetchAdminData();
            renderApp();
        } else {
            showToast(res.error || 'Failed to update prescription.', 'error');
        }
    };

    window.adminAddMedicineSubmit = async function (e) {
        e.preventDefault();
        const name = document.getElementById('admin-med-name').value.trim();
        const category = document.getElementById('admin-med-category').value.trim();
        const price = parseFloat(document.getElementById('admin-med-price').value);
        const stock = parseInt(document.getElementById('admin-med-stock').value, 10);
        const desc = document.getElementById('admin-med-desc').value.trim();
        const rx = document.getElementById('admin-med-rx').checked;

        if (!name || !category || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) {
            showToast('Please provide valid medicine name, category, price and stock.', 'error');
            return;
        }

        const res = await apiRequest('/api/medicines', {
            method: 'POST',
            body: JSON.stringify({
                name,
                category,
                price,
                stock,
                description: desc,
                requires_prescription: rx
            })
        });

        if (res.success) {
            showToast(`Medicine "${name}" added to catalogue!`, 'success');
            document.getElementById('admin-add-med-form').reset();
            await fetchMedicines();
            await fetchAdminData();
            renderApp();
        } else {
            showToast(res.error || 'Failed to add medicine.', 'error');
        }
    };

    window.adminDeleteMedicine = async function (medId) {
        if (!confirm('Are you sure you want to delete this medicine?')) return;
        const res = await apiRequest(`/api/medicines/${medId}`, { method: 'DELETE' });
        if (res.success) {
            showToast('Medicine deleted successfully.', 'info');
            await fetchMedicines();
            await fetchAdminData();
            renderApp();
        } else {
            showToast(res.error || 'Failed to delete medicine.', 'error');
        }
    };

    // Filter and Search Handlers
    window.handleSearchChange = function (e) {
        state.searchQuery = e.target.value;
    };

    window.triggerSearch = async function (e) {
        if (e) e.preventDefault();
        await fetchMedicines();
        if (state.currentView !== 'catalogue') {
            state.currentView = 'catalogue';
        }
        renderApp();
    };

    window.handleCategoryFilter = async function (e) {
        state.selectedCategory = e.target.value;
        await fetchMedicines();
        renderApp();
    };

    window.handleSortChange = async function (e) {
        state.sortBy = e.target.value;
        await fetchMedicines();
        renderApp();
    };

    // -------------------------------------------------------------
    // VIEW TEMPLATES (React-Style Functional Renderers)
    // -------------------------------------------------------------

    // 1. Navigation Bar
    function renderNavbar() {
        const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        return `
        <nav class="medicare-navbar">
            <div class="nav-container">
                <div class="logo-wrapper" onclick="navigate('home')">
                    <div class="logo-icon">+</div>
                    <div class="logo-text">Medi<span>Care</span></div>
                </div>

                <ul class="nav-menu">
                    <li class="nav-item ${state.currentView === 'home' ? 'active' : ''}" onclick="navigate('home')" id="nav-home">
                        Home
                    </li>
                    <li class="nav-item ${state.currentView === 'catalogue' ? 'active' : ''}" onclick="navigate('catalogue')" id="nav-medicines">
                        Medicines
                    </li>
                    <li class="nav-item ${state.currentView === 'prescription' ? 'active' : ''}" onclick="navigate('prescription')" id="nav-prescription">
                        Upload Rx
                    </li>
                    <li class="nav-item ${state.currentView === 'cart' ? 'active' : ''}" onclick="navigate('cart')" id="nav-cart-btn">
                        <span>Cart</span>
                        <span class="nav-badge" id="nav-cart-count" style="${cartCount > 0 ? '' : 'display:none;'}">${cartCount}</span>
                    </li>
                    ${state.currentUser ? `
                        ${state.currentUser.role === 'admin' ? `
                            <li class="nav-item ${state.currentView === 'admin-dashboard' ? 'active' : ''}" onclick="navigate('admin-dashboard')" id="nav-admin">
                                Admin Portal
                            </li>
                        ` : `
                            <li class="nav-item ${state.currentView === 'patient-dashboard' ? 'active' : ''}" onclick="navigate('patient-dashboard')" id="nav-dashboard">
                                Dashboard
                            </li>
                        `}
                        <li class="nav-item">
                            <button id="logout-button" data-testid="logout-button" class="btn btn-outline btn-sm" onclick="handleLogout()">Logout</button>
                        </li>
                    ` : `
                        <li class="nav-item">
                            <button id="nav-login" data-testid="nav-login" class="btn btn-outline btn-sm" onclick="navigate('login')">Login</button>
                        </li>
                        <li class="nav-item">
                            <button id="nav-register" data-testid="nav-register" class="btn btn-primary btn-sm" onclick="navigate('register')">Register</button>
                        </li>
                    `}
                </ul>
            </div>
        </nav>
        `;
    }

    // 2. Home View (Module 1)
    function renderHomeView() {
        return `
        <section class="hero-banner">
            <div class="hero-content">
                <h1 class="hero-title">Your Trusted Partner in Modern Healthcare & Pharmacy</h1>
                <p class="hero-subtitle">
                    Order authentic prescription and OTC medicines online with rapid doorstep delivery. Certified by licensed healthcare professionals and verified clinical standards.
                </p>
                <div class="flex gap-4">
                    <button class="btn btn-secondary" onclick="navigate('catalogue')">Browse Medicines</button>
                    <button class="btn btn-outline" style="background: white; color: var(--primary);" onclick="navigate('prescription')">Upload Prescription</button>
                </div>
                <div class="hero-badges">
                    <div class="hero-pill">✓ 100% Genuine Medicines</div>
                    <div class="hero-pill">✓ Licensed Pharmacists</div>
                    <div class="hero-pill">✓ Safe & Fast Delivery</div>
                </div>
            </div>
        </section>

        <!-- Quick Search Bar -->
        <div class="search-container">
            <div class="search-input-group">
                <label for="medicine-search" class="sr-only">Search Medicines</label>
                <input 
                    type="text" 
                    id="medicine-search" 
                    data-testid="medicine-search"
                    class="form-control" 
                    placeholder="Search by medicine name (e.g., Paracetamol, Amoxicillin, Atorvastatin)..."
                    value="${state.searchQuery}"
                    oninput="handleSearchChange(event)"
                    onkeypress="if(event.key==='Enter') triggerSearch(event)"
                />
            </div>
            <button class="btn btn-primary" onclick="triggerSearch(event)">Search</button>
        </div>

        <!-- Featured Medical Categories -->
        <div class="mb-12">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-slate-800">Featured Healthcare Categories</h2>
                    <p class="text-slate-500 text-sm">Curated pharmaceutical products across all primary therapeutic divisions</p>
                </div>
                <button class="text-sky-600 font-semibold hover:underline" onclick="navigate('catalogue')">View All →</button>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition" onclick="state.selectedCategory='Pain Relief'; navigate('catalogue');">
                    <div class="text-3xl mb-2 text-sky-600">💊</div>
                    <div class="font-bold text-slate-800">Pain Relief</div>
                    <div class="text-xs text-slate-500">Paracetamol, Ibuprofen</div>
                </div>
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition" onclick="state.selectedCategory='Antibiotics'; navigate('catalogue');">
                    <div class="text-3xl mb-2 text-teal-600">🛡️</div>
                    <div class="font-bold text-slate-800">Antibiotics</div>
                    <div class="text-xs text-slate-500">Amoxicillin, Azithromycin</div>
                </div>
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition" onclick="state.selectedCategory='Cardiac Care'; navigate('catalogue');">
                    <div class="text-3xl mb-2 text-rose-600">❤️</div>
                    <div class="font-bold text-slate-800">Cardiac Care</div>
                    <div class="text-xs text-slate-500">Atorvastatin, Losartan</div>
                </div>
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition" onclick="state.selectedCategory='Diabetes Care'; navigate('catalogue');">
                    <div class="text-3xl mb-2 text-indigo-600">🩺</div>
                    <div class="font-bold text-slate-800">Diabetes Care</div>
                    <div class="text-xs text-slate-500">Metformin, Glimepiride</div>
                </div>
            </div>
        </div>

        <!-- Healthcare Services & Features -->
        <div class="grid md:grid-cols-3 gap-6 mb-12">
            <div class="bg-white p-6 rounded-xl border border-slate-200">
                <div class="w-12 h-12 bg-sky-100 text-sky-700 rounded-lg flex items-center justify-center font-bold text-xl mb-4">🩺</div>
                <h3 class="text-lg font-bold text-slate-800 mb-2">Simulated Prescription Review</h3>
                <p class="text-slate-600 text-sm">Upload digital prescriptions (PDF, JPG, PNG) verified by certified medical officers before medicine dispatch.</p>
            </div>
            <div class="bg-white p-6 rounded-xl border border-slate-200">
                <div class="w-12 h-12 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center font-bold text-xl mb-4">💰</div>
                <h3 class="text-lg font-bold text-slate-800 mb-2">Smart Checkout Discounts</h3>
                <p class="text-slate-600 text-sm">Automated white-box discount engine: 10% on orders ≥ ₹1000, 5% membership discount, and promotional voucher support.</p>
            </div>
            <div class="bg-white p-6 rounded-xl border border-slate-200">
                <div class="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center font-bold text-xl mb-4">🎯</div>
                <h3 class="text-lg font-bold text-slate-800 mb-2">Tricentis Tosca Automation Ready</h3>
                <p class="text-slate-600 text-sm">Architected with stable DOM selectors, explicit IDs, testids, and standard HTML structures optimized for Tosca XScan.</p>
            </div>
        </div>

        <!-- About Us & Compliance -->
        <div class="bg-slate-100 p-8 rounded-2xl border border-slate-200 text-center">
            <h2 class="text-2xl font-bold text-slate-800 mb-3">About MediCare Academic Demonstration Project</h2>
            <p class="max-w-3xl mx-auto text-slate-600 text-sm leading-relaxed mb-4">
                MediCare is an enterprise-grade academic simulation developed for the course <strong>Software Testing & Quality Assurance</strong>. It demonstrates end-to-end test automation utilizing <strong>Tricentis Tosca Commander & XScan</strong>, complemented by formal Black-Box test design (Equivalence Class Partitioning, Boundary Value Analysis) and code-level White-Box Basis Path Testing.
            </p>
            <div class="inline-flex gap-4">
                <button class="btn btn-primary btn-sm" onclick="navigate('catalogue')">Start Ordering Demo</button>
                <button class="btn btn-outline btn-sm" onclick="navigate('login')">Test Login Scenarios</button>
            </div>
        </div>
        `;
    }

    // 3. Medicine Catalogue View (Modules 5, 6, 7)
    function renderCatalogueView() {
        const categories = ['All', 'Pain Relief', 'Antibiotics', 'Cardiac Care', 'Diabetes Care', 'Vitamins & Supplements', 'Respiratory Care', 'Gastrointestinal', 'First Aid'];

        return `
        <div class="mb-8">
            <h1 class="text-3xl font-extrabold text-slate-800 mb-2">Medicine Catalogue</h1>
            <p class="text-slate-600 text-sm">Explore our certified inventory of over 12 essential pharmaceuticals</p>
        </div>

        <!-- Search and Filter Controls -->
        <div class="search-container">
            <div class="search-input-group">
                <label for="medicine-search" class="form-label text-xs uppercase text-slate-500 font-bold">Search Medicine</label>
                <input 
                    type="text" 
                    id="medicine-search" 
                    data-testid="medicine-search"
                    class="form-control" 
                    placeholder="Search by name or disease..."
                    value="${state.searchQuery}"
                    oninput="handleSearchChange(event)"
                    onkeypress="if(event.key==='Enter') triggerSearch(event)"
                />
            </div>

            <div>
                <label for="medicine-category" class="form-label text-xs uppercase text-slate-500 font-bold">Category</label>
                <select id="medicine-category" data-testid="medicine-category" class="form-select" onchange="handleCategoryFilter(event)">
                    ${categories.map(cat => `<option value="${cat}" ${state.selectedCategory === cat ? 'selected' : ''}>${cat}</option>`).join('')}
                </select>
            </div>

            <div>
                <label for="medicine-sort" class="form-label text-xs uppercase text-slate-500 font-bold">Sort By</label>
                <select id="medicine-sort" data-testid="medicine-sort" class="form-select" onchange="handleSortChange(event)">
                    <option value="default" ${state.sortBy === 'default' ? 'selected' : ''}>Default</option>
                    <option value="price-asc" ${state.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
                    <option value="price-desc" ${state.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
                    <option value="name-asc" ${state.sortBy === 'name-asc' ? 'selected' : ''}>Name: A to Z</option>
                </select>
            </div>

            <div class="pt-5">
                <button class="btn btn-secondary" onclick="triggerSearch(event)">Apply Filter</button>
            </div>
        </div>

        <!-- Medicine Grid -->
        ${state.filteredMedicines.length === 0 ? `
            <div id="no-results-message" data-testid="no-results-message" class="bg-white p-12 text-center rounded-xl border border-slate-200 shadow-sm">
                <div class="text-5xl mb-4">🔍</div>
                <h3 class="text-xl font-bold text-slate-800 mb-2">No Medicines Found</h3>
                <p class="text-slate-500 text-sm mb-4">No pharmaceuticals matched your search criteria: "${state.searchQuery}".</p>
                <button class="btn btn-outline btn-sm" onclick="state.searchQuery=''; state.selectedCategory='All'; triggerSearch();">Reset Filters</button>
            </div>
        ` : `
            <div class="medicine-grid" id="medicine-list">
                ${state.filteredMedicines.map(med => `
                    <div class="medicine-card" id="medicine-card-${med.id}" data-testid="medicine-card-${med.id}">
                        <div class="card-image-box">
                            <img src="${med.image_url}" alt="${med.name}" />
                            ${med.requires_prescription ? `
                                <span class="badge-prescription" title="Prescription Required">Rx Required</span>
                            ` : `
                                <span class="badge-otc" title="Over The Counter">OTC Safe</span>
                            `}
                        </div>
                        <div class="card-body">
                            <div class="medicine-category-tag">${med.category}</div>
                            <h3 class="medicine-title">${med.name}</h3>
                            <p class="medicine-desc">${med.description}</p>
                            
                            <div class="card-footer-info">
                                <div class="medicine-price">₹${med.price.toFixed(2)}</div>
                                <div class="medicine-stock ${med.stock < 20 ? 'low-stock' : ''}">
                                    ${med.stock > 0 ? `In Stock (${med.stock})` : 'Out of Stock'}
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-2 mt-2">
                                <button 
                                    id="medicine-details-${med.id}" 
                                    data-testid="medicine-details" 
                                    class="btn btn-outline btn-sm" 
                                    onclick='navigate("details", ${JSON.stringify(med).replace(/'/g, "&#39;")})'
                                >
                                    Details
                                </button>
                                <button 
                                    id="add-to-cart-${med.id}" 
                                    data-testid="add-to-cart" 
                                    class="btn btn-primary btn-sm" 
                                    ${med.stock <= 0 ? 'disabled' : ''}
                                    onclick="addToCart(${med.id}, 1)"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `}
        `;
    }

    // 4. Medicine Details Modal / View (Module 7)
    function renderDetailsView() {
        const med = state.selectedMedicine;
        if (!med) {
            navigate('catalogue');
            return '';
        }

        return `
        <div class="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md p-8">
            <button class="text-sky-600 font-semibold mb-6 flex items-center gap-1 hover:underline" onclick="navigate('catalogue')">
                ← Back to Catalogue
            </button>

            <div class="grid md:grid-cols-2 gap-8 items-center" id="medicine-details">
                <div class="bg-slate-50 p-6 rounded-xl border border-slate-200 flex items-center justify-center">
                    <img src="${med.image_url}" alt="${med.name}" class="max-h-64 object-contain" />
                </div>

                <div>
                    <div class="flex items-center gap-3 mb-2">
                        <span class="text-sm font-bold uppercase tracking-wider text-teal-600">${med.category}</span>
                        ${med.requires_prescription ? `
                            <span class="badge-prescription">Prescription Required (Rx)</span>
                        ` : `
                            <span class="badge-otc">Over The Counter (OTC)</span>
                        `}
                    </div>

                    <h1 class="text-3xl font-extrabold text-slate-800 mb-3">${med.name}</h1>
                    <p class="text-slate-600 text-sm mb-6 leading-relaxed">${med.description}</p>

                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-slate-500 font-medium">Standard Dosage:</span>
                            <span class="text-slate-800 font-bold">${med.dosage || '1 tablet daily as advised'}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-500 font-medium">Manufacturer:</span>
                            <span class="text-slate-800 font-bold">${med.manufacturer || 'MediCare Approved Labs'}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-500 font-medium">Stock Availability:</span>
                            <span class="font-bold ${med.stock > 0 ? 'text-emerald-700' : 'text-rose-600'}">
                                ${med.stock > 0 ? `${med.stock} units available` : 'Out of Stock'}
                            </span>
                        </div>
                    </div>

                    <div class="flex items-baseline justify-between mb-6">
                        <div>
                            <span class="text-xs text-slate-500 block">Retail Price (Inclusive of all taxes)</span>
                            <span class="text-3xl font-extrabold text-sky-700">₹${med.price.toFixed(2)}</span>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <button 
                            id="add-to-cart" 
                            data-testid="add-to-cart" 
                            class="btn btn-primary flex-1 py-3 text-base" 
                            ${med.stock <= 0 ? 'disabled' : ''}
                            onclick="addToCart(${med.id}, 1)"
                        >
                            Add to Shopping Cart
                        </button>
                        <button class="btn btn-secondary py-3" onclick="addToCart(${med.id}, 1); navigate('cart');">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    // 5. Shopping Cart View (Module 8)
    async function renderCartView() {
        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const financials = await computeOrderFinancials();

        return `
        <div class="mb-8">
            <h1 class="text-3xl font-extrabold text-slate-800 mb-2">Shopping Cart</h1>
            <p class="text-slate-600 text-sm">Review your selected medicines and manage quantities before checkout</p>
        </div>

        ${state.cart.length === 0 ? `
            <div class="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto">
                <div class="text-5xl mb-4">🛒</div>
                <h3 class="text-2xl font-bold text-slate-800 mb-2">Your Cart is Currently Empty</h3>
                <p class="text-slate-500 text-sm mb-6">Browse our medicine catalogue to add healthcare products to your cart.</p>
                <button class="btn btn-primary" onclick="navigate('catalogue')">Explore Medicines Catalogue</button>
            </div>
        ` : `
            <div class="grid lg:grid-cols-3 gap-8">
                <!-- Cart Items Table -->
                <div class="lg:col-span-2">
                    <div class="data-table-wrapper">
                        <table class="data-table" id="cart-table">
                            <thead>
                                <tr>
                                    <th>Medicine</th>
                                    <th>Price</th>
                                    <th class="text-center">Quantity (1-10)</th>
                                    <th>Subtotal</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.cart.map(item => `
                                    <tr id="cart-item-${item.id}">
                                        <td>
                                            <div class="flex items-center gap-3">
                                                <img src="${item.image_url}" alt="${item.name}" class="w-12 h-12 object-contain bg-slate-50 p-1 rounded border border-slate-200" />
                                                <div>
                                                    <div class="font-bold text-slate-800">${item.name}</div>
                                                    <div class="text-xs text-slate-500">${item.category}</div>
                                                    ${item.requires_prescription ? '<span class="text-xs text-rose-600 font-bold">[Rx Required]</span>' : ''}
                                                </div>
                                            </div>
                                        </td>
                                        <td class="font-semibold text-slate-700">₹${item.price.toFixed(2)}</td>
                                        <td>
                                            <div class="flex items-center justify-center gap-2">
                                                <button 
                                                    class="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold" 
                                                    onclick="updateCartQuantity(${item.id}, -1)"
                                                >
                                                    -
                                                </button>
                                                <input 
                                                    type="number" 
                                                    id="cart-quantity-${item.id}"
                                                    data-testid="cart-quantity" 
                                                    class="w-12 text-center border border-slate-300 rounded font-bold text-sm py-1" 
                                                    value="${item.quantity}" 
                                                    min="1" 
                                                    max="10" 
                                                    readonly
                                                />
                                                <button 
                                                    class="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold" 
                                                    onclick="updateCartQuantity(${item.id}, 1)"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td class="font-bold text-sky-800">₹${(item.price * item.quantity).toFixed(2)}</td>
                                        <td>
                                            <button 
                                                id="cart-remove-${item.id}" 
                                                data-testid="cart-remove" 
                                                class="text-rose-600 hover:text-rose-800 font-bold text-sm" 
                                                onclick="removeFromCart(${item.id})"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Order Summary & White-box Discount -->
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
                    <h3 class="text-lg font-bold text-slate-800 mb-4 border-b pb-3">Order Financial Summary</h3>
                    
                    <!-- Coupon Voucher Input -->
                    <div class="mb-5">
                        <label for="coupon-code" class="form-label text-xs uppercase font-bold text-slate-500">Promotional Voucher</label>
                        <div class="flex gap-2">
                            <input 
                                type="text" 
                                id="coupon-code" 
                                data-testid="coupon-code"
                                class="form-control text-sm py-2" 
                                placeholder="Code: MEDICARE5" 
                                value="${state.couponCode}"
                            />
                            <button id="apply-coupon" data-testid="apply-coupon" class="btn btn-outline btn-sm font-bold" onclick="applyCoupon()">
                                Apply
                            </button>
                        </div>
                        <div id="coupon-message" class="text-xs text-slate-400 mt-1">Try voucher code: <strong>MEDICARE5</strong> (Extra 5% off)</div>
                    </div>

                    <div class="space-y-3 text-sm mb-6 border-b pb-4">
                        <div class="flex justify-between">
                            <span class="text-slate-600">Cart Subtotal:</span>
                            <span class="font-bold text-slate-800" id="cart-subtotal" data-testid="cart-subtotal">₹${financials.subtotal.toFixed(2)}</span>
                        </div>

                        ${financials.discountAmount > 0 ? `
                            <div class="flex justify-between text-emerald-700 font-semibold">
                                <span>Applied Discount (${financials.discountPercent}%):</span>
                                <span>-₹${financials.discountAmount.toFixed(2)}</span>
                            </div>
                        ` : ''}

                        <div class="flex justify-between text-slate-600">
                            <span>Delivery Fee:</span>
                            <span class="font-bold text-emerald-600">FREE</span>
                        </div>
                    </div>

                    <div class="flex justify-between items-baseline mb-6">
                        <span class="text-base font-bold text-slate-800">Final Order Total:</span>
                        <span class="text-2xl font-extrabold text-sky-700" id="cart-total" data-testid="cart-total">₹${financials.finalAmount.toFixed(2)}</span>
                    </div>

                    <button 
                        id="checkout-button" 
                        data-testid="checkout-button" 
                        class="btn btn-primary w-full py-3 text-base font-bold" 
                        onclick="navigate('checkout')"
                    >
                        Proceed to Checkout →
                    </button>
                </div>
            </div>
        `}
        `;
    }

    // 6. Checkout View (Module 10)
    async function renderCheckoutView() {
        if (state.cart.length === 0) {
            navigate('cart');
            return '';
        }

        const financials = await computeOrderFinancials();
        const defaultName = state.currentUser ? state.currentUser.name : 'Rahul Sharma';
        const defaultPhone = state.currentUser ? state.currentUser.phone : '9876543210';

        return `
        <div class="max-w-3xl mx-auto">
            <button class="text-sky-600 font-semibold mb-6 flex items-center gap-1 hover:underline" onclick="navigate('cart')">
                ← Return to Cart
            </button>

            <div class="bg-white rounded-2xl border border-slate-200 shadow-md p-8">
                <h1 class="text-2xl font-extrabold text-slate-800 mb-2">Secure Patient Checkout</h1>
                <p class="text-slate-600 text-sm mb-6">Complete your delivery address and contact information to finalize medicine dispatch.</p>

                <div id="checkout-error" data-testid="checkout-error" class="form-error hidden"></div>

                <form onsubmit="handleCheckoutSubmit(event)">
                    <div class="form-group">
                        <label for="checkout-name" class="form-label">Patient Full Name</label>
                        <input 
                            type="text" 
                            id="checkout-name" 
                            class="form-control bg-slate-50" 
                            value="${defaultName}" 
                            readonly 
                        />
                    </div>

                    <div class="form-group">
                        <label for="delivery-address" class="form-label">Delivery Address (House/Flat, Street, Area, City, Pincode) *</label>
                        <textarea 
                            id="delivery-address" 
                            data-testid="delivery-address"
                            rows="3" 
                            class="form-control" 
                            placeholder="Enter detailed delivery address (min 10 characters)..."
                            required
                        >Flat 402, Green Glen Layout, Bellandur, Bengaluru - 560103</textarea>
                    </div>

                    <div class="form-group">
                        <label for="delivery-phone" class="form-label">Contact Phone Number (10 Digits) *</label>
                        <input 
                            type="text" 
                            id="delivery-phone" 
                            data-testid="delivery-phone"
                            class="form-control" 
                            value="${defaultPhone}" 
                            maxlength="10" 
                            required 
                        />
                    </div>

                    <div class="form-group">
                        <label for="payment-method" class="form-label">Payment Mode</label>
                        <select id="payment-method" data-testid="payment-method" class="form-select w-full">
                            <option value="Cash on Delivery" selected>Cash on Delivery (Simulated)</option>
                            <option value="Online Health Card">MediCare Health Card (Demo)</option>
                        </select>
                    </div>

                    <!-- Summary Box -->
                    <div class="bg-slate-50 p-5 rounded-xl border border-slate-200 my-6">
                        <h4 class="font-bold text-slate-800 text-sm mb-3">Order Final Calculation</h4>
                        <div class="space-y-1 text-sm">
                            <div class="flex justify-between text-slate-600">
                                <span>Total Medicines:</span>
                                <span>${state.cart.length} item(s)</span>
                            </div>
                            <div class="flex justify-between text-slate-600">
                                <span>Subtotal:</span>
                                <span>₹${financials.subtotal.toFixed(2)}</span>
                            </div>
                            ${financials.discountAmount > 0 ? `
                                <div class="flex justify-between text-emerald-700 font-bold">
                                    <span>Discount (${financials.discountPercent}%):</span>
                                    <span>-₹${financials.discountAmount.toFixed(2)}</span>
                                </div>
                            ` : ''}
                            <div class="flex justify-between text-base font-extrabold text-sky-800 pt-2 border-t mt-2">
                                <span>Payable Total:</span>
                                <span>₹${financials.finalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        id="place-order" 
                        data-testid="place-order" 
                        class="btn btn-primary w-full py-3.5 text-base font-bold shadow-lg"
                    >
                        Place Order (Cash on Delivery)
                    </button>
                </form>
            </div>
        </div>
        `;
    }

    // 7. Order Confirmation View (Module 10, 11)
    function renderConfirmationView() {
        const order = state.lastOrder;
        if (!order) {
            navigate('catalogue');
            return '';
        }

        return `
        <div class="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center" id="order-confirmation" data-testid="order-confirmation">
            <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 font-bold">
                ✓
            </div>
            
            <h1 class="text-3xl font-extrabold text-slate-800 mb-2">Order Confirmed!</h1>
            <p class="text-slate-600 text-sm mb-6">Thank you for ordering with MediCare. Your medicine package has been scheduled for dispatch.</p>

            <div class="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left mb-6 space-y-3">
                <div class="flex justify-between pb-3 border-b border-slate-200">
                    <span class="text-slate-500 font-medium">Unique Order ID:</span>
                    <span class="font-extrabold text-sky-700" id="order-id" data-testid="order-id">${order.orderId}</span>
                </div>
                <div class="flex justify-between pb-3 border-b border-slate-200">
                    <span class="text-slate-500 font-medium">Order Status:</span>
                    <span class="status-badge status-${order.status}" id="order-status" data-testid="order-status">${order.status}</span>
                </div>
                <div class="flex justify-between pb-3 border-b border-slate-200">
                    <span class="text-slate-500 font-medium">Patient Name:</span>
                    <span class="font-bold text-slate-800">${order.patientName}</span>
                </div>
                <div class="flex justify-between pb-3 border-b border-slate-200">
                    <span class="text-slate-500 font-medium">Delivery Address:</span>
                    <span class="font-semibold text-slate-800 max-w-xs text-right">${order.deliveryAddress}</span>
                </div>
                <div class="flex justify-between text-base pt-2">
                    <span class="font-bold text-slate-800">Total Amount:</span>
                    <span class="font-extrabold text-sky-800">₹${order.total.toFixed(2)}</span>
                </div>
            </div>

            <div class="flex gap-4 justify-center">
                <button class="btn btn-outline" onclick="navigate('catalogue')">Order More Medicines</button>
                <button class="btn btn-primary" onclick="navigate('patient-dashboard')">View in Order History</button>
            </div>
        </div>
        `;
    }

    // 8. Prescription Upload View (Module 9)
    function renderPrescriptionView() {
        return `
        <div class="max-w-2xl mx-auto">
            <div class="mb-8 text-center">
                <h1 class="text-3xl font-extrabold text-slate-800 mb-2">Simulated Prescription Upload</h1>
                <p class="text-slate-600 text-sm">Upload a doctor's digital prescription for verification before dispensing restricted medicines</p>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200 shadow-md p-8">
                <div id="prescription-error" data-testid="prescription-error" class="form-error hidden"></div>
                <div id="prescription-success" data-testid="prescription-success" class="form-success hidden"></div>

                <form onsubmit="handlePrescriptionSubmit(event)">
                    <div class="form-group">
                        <label for="prescription-file" class="form-label">Select Prescription File (.PDF, .JPG, .PNG - Max 5MB) *</label>
                        <input 
                            type="file" 
                            id="prescription-file" 
                            data-testid="prescription-file"
                            class="form-control" 
                            accept=".pdf, .jpg, .jpeg, .png" 
                            required 
                        />
                        <span class="text-xs text-slate-500 mt-1 block">Valid extensions: PDF, JPG, PNG. Maximum file size: 5 Megabytes.</span>
                    </div>

                    <div class="form-group">
                        <label for="prescription-notes" class="form-label">Doctor's Name / Consultation Notes (Optional)</label>
                        <textarea 
                            id="prescription-notes" 
                            data-testid="prescription-notes"
                            rows="3" 
                            class="form-control" 
                            placeholder="e.g., Prescribed by Dr. A. Mehta for quarterly cardiac management..."
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        id="prescription-upload-button" 
                        data-testid="prescription-upload-button" 
                        class="btn btn-primary w-full py-3 font-bold"
                    >
                        Upload Prescription for Verification
                    </button>
                </form>

                <div class="mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500 space-y-1">
                    <p class="font-bold text-slate-700">Notice for Testing & Academic Evaluation:</p>
                    <p>• This is a simulated prescription module for Software Quality Assurance validation.</p>
                    <p>• Tricentis Tosca tests TC18 validates file type rejection and successful upload status.</p>
                    <p>• Uploaded files receive initial status: <strong>Pending</strong>, and can be reviewed in the Admin Portal.</p>
                </div>
            </div>
        </div>
        `;
    }

    // 9. Patient Dashboard & Order History (Module 4, 11)
    function renderPatientDashboardView() {
        const user = state.currentUser || { name: 'Rahul Sharma', email: 'patient@medicare.com', phone: '9876543210', age: 28 };

        return `
        <div class="mb-8">
            <h1 class="text-3xl font-extrabold text-slate-800 mb-2">Patient Dashboard</h1>
            <p class="text-slate-600 text-sm">Welcome back, <strong>${user.name}</strong> (${user.email})</p>
        </div>

        <!-- Patient Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon bg-sky-100 text-sky-700">📦</div>
                <div>
                    <div class="stat-value">${state.orders.length}</div>
                    <div class="stat-label">Total Orders Placed</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon bg-teal-100 text-teal-700">📋</div>
                <div>
                    <div class="stat-value">${state.prescriptions.length}</div>
                    <div class="stat-label">Uploaded Prescriptions</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon bg-indigo-100 text-indigo-700">💳</div>
                <div>
                    <div class="stat-value">Active</div>
                    <div class="stat-label">Membership Tier (5% Off)</div>
                </div>
            </div>
        </div>

        <!-- Order History Table (Module 11) -->
        <div class="mb-12">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold text-slate-800" id="order-history" data-testid="order-history">Order History</h2>
                <button class="btn btn-outline btn-sm" onclick="navigate('catalogue')">Order New Medicines</button>
            </div>

            ${state.orders.length === 0 ? `
                <div class="bg-white p-8 text-center rounded-xl border border-slate-200">
                    <p class="text-slate-500">No past orders found for this account.</p>
                </div>
            ` : `
                <div class="data-table-wrapper">
                    <table class="data-table" id="order-history-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Delivered To</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.orders.map(ord => `
                                <tr id="order-row-${ord.order_id}">
                                    <td class="font-extrabold text-sky-700">${ord.order_id}</td>
                                    <td class="text-slate-600 text-xs">${ord.created_at ? ord.created_at.substring(0, 10) : 'Recent'}</td>
                                    <td class="text-slate-700 text-xs max-w-xs truncate">${ord.delivery_address}</td>
                                    <td class="font-bold text-slate-800">₹${ord.total.toFixed(2)}</td>
                                    <td>
                                        <span class="status-badge status-${ord.status}">${ord.status}</span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        </div>

        <!-- Prescription History -->
        <div>
            <h2 class="text-xl font-bold text-slate-800 mb-4">Prescription Submissions</h2>
            ${state.prescriptions.length === 0 ? `
                <div class="bg-white p-8 text-center rounded-xl border border-slate-200">
                    <p class="text-slate-500">No prescriptions uploaded yet.</p>
                </div>
            ` : `
                <div class="data-table-wrapper">
                    <table class="data-table" id="prescription-history-table">
                        <thead>
                            <tr>
                                <th>Document Filename</th>
                                <th>Uploaded On</th>
                                <th>Review Status</th>
                                <th>Pharmacist Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.prescriptions.map(p => `
                                <tr>
                                    <td class="font-semibold text-slate-800">${p.filename}</td>
                                    <td class="text-slate-500 text-xs">${p.uploaded_at ? p.uploaded_at.substring(0, 10) : 'Recent'}</td>
                                    <td>
                                        <span class="status-badge status-${p.status}" id="prescription-status-badge-${p.id}">${p.status}</span>
                                    </td>
                                    <td class="text-xs text-slate-600">${p.reviewed_by ? `Verified by: ${p.reviewed_by}` : 'Awaiting clinical review'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        </div>
        `;
    }

    // 10. Admin Dashboard (Module 12)
    function renderAdminDashboardView() {
        const stats = state.adminStats || { totalPatients: 4, totalMedicines: 16, totalOrders: 4, pendingOrders: 2, totalRevenue: 3042.5 };

        return `
        <div class="mb-8">
            <h1 class="text-3xl font-extrabold text-slate-800 mb-2">Administrator Management Portal</h1>
            <p class="text-slate-600 text-sm">Full administrative control over medicine stock, customer orders, and clinical prescriptions</p>
        </div>

        <!-- Admin Stats -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon bg-sky-100 text-sky-700">👥</div>
                <div>
                    <div class="stat-value">${stats.totalPatients}</div>
                    <div class="stat-label">Total Registered Patients</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon bg-teal-100 text-teal-700">💊</div>
                <div>
                    <div class="stat-value">${stats.totalMedicines}</div>
                    <div class="stat-label">Medicines in Catalogue</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon bg-amber-100 text-amber-700">⏳</div>
                <div>
                    <div class="stat-value">${stats.pendingOrders}</div>
                    <div class="stat-label">Pending Orders</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon bg-emerald-100 text-emerald-700">₹</div>
                <div>
                    <div class="stat-value">₹${stats.totalRevenue.toFixed(2)}</div>
                    <div class="stat-label">Gross Pharmacy Revenue</div>
                </div>
            </div>
        </div>

        <!-- Manage Customer Orders (Module 12) -->
        <div class="mb-12">
            <h2 class="text-xl font-bold text-slate-800 mb-4">Customer Orders & Status Management</h2>
            <div class="data-table-wrapper">
                <table class="data-table" id="admin-orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Patient Name</th>
                            <th>Total Amount</th>
                            <th>Current Status</th>
                            <th>Update Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.orders.map(ord => `
                            <tr>
                                <td class="font-extrabold text-sky-700">${ord.order_id}</td>
                                <td class="font-semibold text-slate-800">${ord.patient_name}</td>
                                <td class="font-bold text-slate-800">₹${ord.total.toFixed(2)}</td>
                                <td>
                                    <span class="status-badge status-${ord.status}">${ord.status}</span>
                                </td>
                                <td>
                                    <div class="flex items-center gap-2">
                                        <select id="order-status-select-${ord.order_id}" class="form-select py-1 text-xs">
                                            <option value="Placed" ${ord.status === 'Placed' ? 'selected' : ''}>Placed</option>
                                            <option value="Processing" ${ord.status === 'Processing' ? 'selected' : ''}>Processing</option>
                                            <option value="Shipped" ${ord.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                                            <option value="Delivered" ${ord.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                                            <option value="Cancelled" ${ord.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                                        </select>
                                        <button 
                                            id="update-order-status-${ord.order_id}"
                                            data-testid="update-order-status" 
                                            class="btn btn-primary btn-sm py-1 text-xs font-bold" 
                                            onclick="adminUpdateOrderStatus('${ord.order_id}')"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Add New Medicine Form (Module 12) -->
        <div class="mb-12 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 class="text-xl font-bold text-slate-800 mb-4" id="add-medicine" data-testid="add-medicine">Add New Medicine to Catalogue</h2>
            <form id="admin-add-med-form" onsubmit="adminAddMedicineSubmit(event)" class="grid md:grid-cols-3 gap-4">
                <div>
                    <label for="admin-med-name" class="form-label text-xs font-bold uppercase">Medicine Name *</label>
                    <input type="text" id="admin-med-name" class="form-control" placeholder="e.g. Dolo 650mg" required />
                </div>
                <div>
                    <label for="admin-med-category" class="form-label text-xs font-bold uppercase">Category *</label>
                    <select id="admin-med-category" class="form-select w-full" required>
                        <option value="Pain Relief">Pain Relief</option>
                        <option value="Antibiotics">Antibiotics</option>
                        <option value="Cardiac Care">Cardiac Care</option>
                        <option value="Diabetes Care">Diabetes Care</option>
                        <option value="Vitamins & Supplements">Vitamins & Supplements</option>
                        <option value="Respiratory Care">Respiratory Care</option>
                    </select>
                </div>
                <div>
                    <label for="admin-med-price" class="form-label text-xs font-bold uppercase">Price (₹) *</label>
                    <input type="number" step="0.5" id="admin-med-price" class="form-control" placeholder="e.g. 45.00" required />
                </div>
                <div>
                    <label for="admin-med-stock" class="form-label text-xs font-bold uppercase">Available Stock *</label>
                    <input type="number" id="admin-med-stock" class="form-control" placeholder="e.g. 100" required />
                </div>
                <div class="md:col-span-2">
                    <label for="admin-med-desc" class="form-label text-xs font-bold uppercase">Clinical Description</label>
                    <input type="text" id="admin-med-desc" class="form-control" placeholder="Enter clinical usage and indications..." />
                </div>
                <div class="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="admin-med-rx" class="w-4 h-4 text-sky-600 rounded" />
                    <label for="admin-med-rx" class="text-sm font-semibold text-slate-700">Requires Prescription (Rx)</label>
                </div>
                <div class="md:col-span-2 flex justify-end">
                    <button type="submit" class="btn btn-primary font-bold">Add Medicine</button>
                </div>
            </form>
        </div>

        <!-- Simulated Prescription Verification -->
        <div class="mb-12">
            <h2 class="text-xl font-bold text-slate-800 mb-4">Review Simulated Prescription Requests</h2>
            <div class="data-table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Filename</th>
                            <th>Status</th>
                            <th>Clinical Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.prescriptions.map(p => `
                            <tr>
                                <td class="font-bold text-slate-800">${p.patient_name}</td>
                                <td class="font-semibold text-sky-700">${p.filename}</td>
                                <td>
                                    <span class="status-badge status-${p.status}">${p.status}</span>
                                </td>
                                <td>
                                    <div class="flex gap-2">
                                        <button class="btn btn-primary btn-sm py-1 text-xs" onclick="adminUpdatePrescriptionStatus(${p.id}, 'Approved')">Approve</button>
                                        <button class="btn btn-danger btn-sm py-1 text-xs" onclick="adminUpdatePrescriptionStatus(${p.id}, 'Rejected')">Reject</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        `;
    }

    // 11. Patient / Admin Login View (Module 3)
    function renderLoginView() {
        return `
        <div class="form-card">
            <div class="text-center mb-6">
                <div class="w-12 h-12 bg-sky-100 text-sky-700 font-bold text-2xl rounded-xl flex items-center justify-center mx-auto mb-2">+</div>
                <h1 class="text-2xl font-extrabold text-slate-800">MediCare Login</h1>
                <p class="text-slate-500 text-xs">Enter your credentials to access your patient or administrative account</p>
            </div>

            <div id="login-error" data-testid="login-error" class="form-error hidden"></div>

            <form onsubmit="handleLoginSubmit(event)">
                <div class="form-group">
                    <label for="login-email" class="form-label">Email Address *</label>
                    <input 
                        type="email" 
                        id="login-email" 
                        data-testid="login-email"
                        class="form-control" 
                        placeholder="patient@medicare.com" 
                        required 
                    />
                </div>

                <div class="form-group">
                    <label for="login-password" class="form-label">Password *</label>
                    <input 
                        type="password" 
                        id="login-password" 
                        data-testid="login-password"
                        class="form-control" 
                        placeholder="••••••••" 
                        required 
                    />
                </div>

                <button 
                    type="submit" 
                    id="login-button" 
                    data-testid="login-button"
                    class="btn btn-primary w-full py-3 font-bold text-base mb-4"
                >
                    Sign In
                </button>
            </form>

            <!-- Quick Demo Credential Autofill (Convenience for QA Evaluator / Tosca Testing) -->
            <div class="pt-4 border-t border-slate-200">
                <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Demo Quick Credentials (Course Testing)</p>
                <div class="grid grid-cols-2 gap-2">
                    <button class="btn btn-outline btn-sm text-xs font-semibold" onclick="prefillCredentials('patient')">
                        Fill Patient Login
                    </button>
                    <button class="btn btn-outline btn-sm text-xs font-semibold" onclick="prefillCredentials('admin')">
                        Fill Admin Login
                    </button>
                </div>
            </div>

            <div class="mt-6 text-center text-xs text-slate-500">
                Don't have an account yet? 
                <a href="javascript:void(0)" class="text-sky-600 font-bold hover:underline" onclick="navigate('register')">Register as a New Patient</a>
            </div>
        </div>
        `;
    }

    // 12. Patient Registration View (Module 2)
    function renderRegisterView() {
        return `
        <div class="form-card max-w-lg">
            <div class="text-center mb-6">
                <h1 class="text-2xl font-extrabold text-slate-800">New Patient Registration</h1>
                <p class="text-slate-500 text-xs">Create your personal MediCare account with full validation</p>
            </div>

            <div id="registration-error" data-testid="registration-error" class="form-error hidden"></div>

            <form onsubmit="handleRegistrationSubmit(event)">
                <div class="form-group">
                    <label for="registration-name" class="form-label">Full Name *</label>
                    <input 
                        type="text" 
                        id="registration-name" 
                        data-testid="registration-name"
                        class="form-control" 
                        placeholder="e.g. Rahul Sharma" 
                        required 
                    />
                </div>

                <div class="form-group">
                    <label for="registration-email" class="form-label">Email Address *</label>
                    <input 
                        type="email" 
                        id="registration-email" 
                        data-testid="registration-email"
                        class="form-control" 
                        placeholder="e.g. rahul.sharma@example.com" 
                        required 
                    />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="form-group">
                        <label for="registration-phone" class="form-label">Phone (10 Digits) *</label>
                        <input 
                            type="text" 
                            id="registration-phone" 
                            data-testid="registration-phone"
                            class="form-control" 
                            placeholder="9876543210" 
                            maxlength="10" 
                            required 
                        />
                    </div>

                    <div class="form-group">
                        <label for="registration-age" class="form-label">Age (18-100) *</label>
                        <input 
                            type="number" 
                            id="registration-age" 
                            data-testid="registration-age"
                            class="form-control" 
                            placeholder="28" 
                            min="18" 
                            max="100" 
                            required 
                        />
                    </div>
                </div>

                <div class="form-group">
                    <label for="registration-password" class="form-label">Password (8-20 Characters) *</label>
                    <input 
                        type="password" 
                        id="registration-password" 
                        data-testid="registration-password"
                        class="form-control" 
                        placeholder="••••••••" 
                        minlength="8" 
                        maxlength="20" 
                        required 
                    />
                </div>

                <div class="form-group">
                    <label for="registration-confirm-password" class="form-label">Confirm Password *</label>
                    <input 
                        type="password" 
                        id="registration-confirm-password" 
                        data-testid="registration-confirm-password"
                        class="form-control" 
                        placeholder="••••••••" 
                        required 
                    />
                </div>

                <button 
                    type="submit" 
                    id="registration-submit" 
                    data-testid="registration-submit"
                    class="btn btn-primary w-full py-3 font-bold text-base"
                >
                    Complete Registration
                </button>
            </form>

            <div class="mt-6 text-center text-xs text-slate-500">
                Already registered? 
                <a href="javascript:void(0)" class="text-sky-600 font-bold hover:underline" onclick="navigate('login')">Sign in here</a>
            </div>
        </div>
        `;
    }

    // Main Router & Renderer
    async function renderApp() {
        let contentHtml = '';

        switch (state.currentView) {
            case 'home':
                contentHtml = renderHomeView();
                break;
            case 'catalogue':
                contentHtml = renderCatalogueView();
                break;
            case 'details':
                contentHtml = renderDetailsView();
                break;
            case 'cart':
                contentHtml = await renderCartView();
                break;
            case 'checkout':
                contentHtml = await renderCheckoutView();
                break;
            case 'confirmation':
                contentHtml = renderConfirmationView();
                break;
            case 'prescription':
                contentHtml = renderPrescriptionView();
                break;
            case 'patient-dashboard':
                contentHtml = renderPatientDashboardView();
                break;
            case 'admin-dashboard':
                contentHtml = renderAdminDashboardView();
                break;
            case 'login':
                contentHtml = renderLoginView();
                break;
            case 'register':
                contentHtml = renderRegisterView();
                break;
            default:
                contentHtml = renderHomeView();
        }

        appRoot.innerHTML = `
            ${renderNavbar()}
            <main class="main-wrapper">
                ${contentHtml}
            </main>
            <footer class="medicare-footer">
                <div class="footer-container">
                    <div>
                        <div class="logo-wrapper mb-3">
                            <div class="logo-icon">+</div>
                            <div class="logo-text text-white">Medi<span>Care</span></div>
                        </div>
                        <p class="text-xs text-slate-400 leading-relaxed mb-4">
                            End-to-End Healthcare & Online Pharmacy Application architected for Tricentis Tosca Automation Testing. Software Testing & Quality Assurance mini-project.
                        </p>
                        <div class="text-xs text-slate-500">
                            Demo Accounts: <br />
                            Patient: <code class="text-sky-400">patient@medicare.com</code> / <code class="text-sky-400">Patient@123</code><br />
                            Admin: <code class="text-teal-400">admin@medicare.com</code> / <code class="text-teal-400">Admin@123</code>
                        </div>
                    </div>
                    <div>
                        <h4 class="footer-title">Pharmacy Modules</h4>
                        <ul class="footer-links text-xs space-y-1">
                            <li><a href="javascript:void(0)" onclick="navigate('catalogue')">Medicine Catalogue</a></li>
                            <li><a href="javascript:void(0)" onclick="navigate('prescription')">Prescription Upload</a></li>
                            <li><a href="javascript:void(0)" onclick="navigate('cart')">Shopping Cart</a></li>
                            <li><a href="javascript:void(0)" onclick="navigate('patient-dashboard')">Patient Orders</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="footer-title">STQA QA Verification</h4>
                        <ul class="footer-links text-xs space-y-1">
                            <li><a href="javascript:void(0)">Tricentis Tosca XScan</a></li>
                            <li><a href="javascript:void(0)">Equivalence Class Partitioning</a></li>
                            <li><a href="javascript:void(0)">Boundary Value Analysis</a></li>
                            <li><a href="javascript:void(0)">Cyclomatic Complexity V(G)=5</a></li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <div>© 2026 MediCare Healthcare Automation System. All rights reserved.</div>
                    <div class="flex gap-4">
                        <span class="tosca-pill">Tricentis Tosca Ready</span>
                        <span class="tosca-pill">SQLite 3</span>
                        <span class="tosca-pill">RESTful APIs</span>
                    </div>
                </div>
            </footer>
        `;

        updateNavCartBadge();
    }

    // Initialize App on DOM Ready
    window.addEventListener('DOMContentLoaded', async () => {
        await fetchMedicines();
        await renderApp();
    });

})();

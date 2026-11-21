/**
 * MediCare - Healthcare & Online Pharmacy
 * Backend Server: Node.js + Express.js + SQLite3
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { calculateDiscount } = require('./white_box_testing/discount_calculator');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'database', 'medicare.db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Failed to connect to SQLite:', err.message);
    } else {
        console.log('Connected to SQLite database at:', DB_PATH);
    }
});

// Helper for Promisified Queries
const queryAll = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
    });
});

const queryGet = (sql, params = []) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
    });
});

const queryRun = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
    });
});

// ----------------- API ROUTES -----------------

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', app: 'MediCare', time: new Date().toISOString() });
});

// 1. Patient Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, phone, age: ageRaw, password, confirmPassword } = req.body;
        const trimmedName = String(name || '').trim();
        const trimmedEmail = String(email || '').trim();
        const trimmedPhone = String(phone || '').trim();
        const trimmedPassword = String(password || '').trim();
        const trimmedConfirm = String(confirmPassword || '').trim();

        if (!trimmedName) {
            return res.status(400).json({ success: false, error: 'Full name is required.' });
        }
        if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
            return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
        }
        if (!/^\d{10}$/.test(trimmedPhone)) {
            return res.status(400).json({ success: false, error: 'Phone number must be exactly 10 digits.' });
        }
        const age = parseInt(ageRaw, 10);
        if (isNaN(age) || age < 18 || age > 100) {
            return res.status(400).json({ success: false, error: 'Age must be between 18 and 100 years.' });
        }
        if (trimmedPassword.length < 8 || trimmedPassword.length > 20) {
            return res.status(400).json({ success: false, error: 'Password length must be between 8 and 20 characters.' });
        }
        if (trimmedPassword !== trimmedConfirm) {
            return res.status(400).json({ success: false, error: 'Passwords do not match.' });
        }

        const existing = await queryGet('SELECT id FROM users WHERE LOWER(email) = LOWER(?)', [trimmedEmail]);
        if (existing) {
            return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
        }

        const result = await queryRun(
            'INSERT INTO users (name, email, phone, age, password, role, is_member) VALUES (?, ?, ?, ?, ?, "patient", 1)',
            [trimmedName, trimmedEmail, trimmedPhone, age, trimmedPassword]
        );

        res.status(201).json({
            success: true,
            message: 'Patient registration successful! You can now log in.',
            user: { id: result.lastID, name: trimmedName, email: trimmedEmail, role: 'patient' }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2. Patient / Admin Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const trimmedEmail = String(email || '').trim();
        const trimmedPassword = String(password || '').trim();

        if (!trimmedEmail || !trimmedPassword) {
            return res.status(400).json({ success: false, error: 'Email and password are required.' });
        }

        const user = await queryGet('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [trimmedEmail]);
        if (!user || user.password !== trimmedPassword) {
            return res.status(401).json({ success: false, error: 'Invalid email or password. Please verify your credentials.' });
        }

        delete user.password;
        res.json({
            success: true,
            message: `Welcome back, ${user.name}!`,
            user,
            token: `medicare-token-${user.id}-${user.role}`
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 3. Medicine Catalogue & Search/Filter
app.get('/api/medicines', async (req, res) => {
    try {
        const { search = '', category = '', sort = '' } = req.query;
        let sql = 'SELECT * FROM medicines WHERE 1=1';
        const params = [];

        if (search) {
            sql += ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)';
            params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
        }
        if (category && category !== 'All') {
            sql += ' AND category = ?';
            params.push(category);
        }
        if (sort === 'price-asc') sql += ' ORDER BY price ASC';
        else if (sort === 'price-desc') sql += ' ORDER BY price DESC';
        else if (sort === 'name-asc') sql += ' ORDER BY name ASC';
        else sql += ' ORDER BY id ASC';

        const medicines = await queryAll(sql, params);
        res.json({ success: true, count: medicines.length, medicines });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/medicines/:id', async (req, res) => {
    try {
        const med = await queryGet('SELECT * FROM medicines WHERE id = ?', [req.params.id]);
        if (!med) return res.status(404).json({ success: false, error: 'Medicine not found' });
        res.json({ success: true, medicine: med });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Admin Add Medicine
app.post('/api/medicines', async (req, res) => {
    try {
        const { name, category, description, price, stock, requires_prescription, dosage, manufacturer } = req.body;
        if (!name || !category || price <= 0 || stock < 0) {
            return res.status(400).json({ success: false, error: 'Invalid medicine details. Provide valid name, category, price and stock.' });
        }

        const result = await queryRun(
            `INSERT INTO medicines (name, category, description, price, stock, requires_prescription, dosage, manufacturer, image_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, category, description || '', price, stock, requires_prescription ? 1 : 0, dosage || 'As prescribed', manufacturer || 'MediCare Pharma', '/assets/medicine-default.svg']
        );

        res.status(201).json({ success: true, message: 'Medicine added successfully!', medicineId: result.lastID });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Admin Update Medicine
app.put('/api/medicines/:id', async (req, res) => {
    try {
        const { name, category, description, price, stock, requires_prescription } = req.body;
        await queryRun(
            `UPDATE medicines SET name = ?, category = ?, description = ?, price = ?, stock = ?, requires_prescription = ? WHERE id = ?`,
            [name, category, description, price, stock, requires_prescription ? 1 : 0, req.params.id]
        );
        res.json({ success: true, message: 'Medicine updated successfully!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Admin Delete Medicine
app.delete('/api/medicines/:id', async (req, res) => {
    try {
        await queryRun('DELETE FROM medicines WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Medicine deleted successfully!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 4. White-Box Discount Calculation
app.post('/api/cart/calculate-discount', (req, res) => {
    const { subtotal = 0, isMember = false, couponCode = '' } = req.body;
    const result = calculateDiscount(parseFloat(subtotal), Boolean(isMember), String(couponCode).toUpperCase());
    res.json(result);
});

// 5. Checkout & Order Placement
app.post('/api/orders', async (req, res) => {
    try {
        const { userId = 1, patientName, deliveryAddress, phone, paymentMethod = 'Cash on Delivery', items = [], couponCode = '', isMember = true } = req.body;

        if (!patientName) return res.status(400).json({ success: false, error: 'Patient name is required for checkout.' });
        if (!deliveryAddress || deliveryAddress.length < 10) return res.status(400).json({ success: false, error: 'Please enter a valid, complete delivery address (min 10 characters).' });
        if (!/^\d{10}$/.test(phone)) return res.status(400).json({ success: false, error: 'Delivery contact phone number must be 10 digits.' });
        if (!items || items.length === 0) return res.status(400).json({ success: false, error: 'Cart is empty. Add medicines before placing an order.' });

        let subtotal = 0;
        const verifiedItems = [];

        for (const itm of items) {
            const qty = parseInt(itm.quantity, 10);
            if (qty < 1 || qty > 10) {
                return res.status(400).json({ success: false, error: `Quantity for ${itm.name} must be between 1 and 10.` });
            }
            const med = await queryGet('SELECT id, name, price, stock FROM medicines WHERE id = ?', [itm.id]);
            if (!med) return res.status(400).json({ success: false, error: `Medicine ID ${itm.id} not found.` });
            if (med.stock < qty) return res.status(400).json({ success: false, error: `Insufficient stock for '${med.name}'. Available: ${med.stock}, Requested: ${qty}.` });

            subtotal += med.price * qty;
            verifiedItems.push({ medicine_id: med.id, name: med.name, price: med.price, quantity: qty });
        }

        const discCalc = calculateDiscount(subtotal, isMember, couponCode.toUpperCase());
        const orderId = `MED-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

        await queryRun(
            `INSERT INTO orders (order_id, user_id, patient_name, delivery_address, phone, payment_method, subtotal, discount, coupon_code, total, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Placed')`,
            [orderId, userId, patientName, deliveryAddress, phone, paymentMethod, subtotal, discCalc.discountAmount, couponCode || 'NONE', discCalc.finalAmount]
        );

        for (const vItem of verifiedItems) {
            await queryRun(
                `INSERT INTO order_items (order_id, medicine_id, medicine_name, price, quantity) VALUES (?, ?, ?, ?, ?)`,
                [orderId, vItem.medicine_id, vItem.name, vItem.price, vItem.quantity]
            );
            await queryRun(`UPDATE medicines SET stock = stock - ? WHERE id = ?`, [vItem.quantity, vItem.medicine_id]);
        }

        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            orderId,
            subtotal,
            discount: discCalc.discountAmount,
            total: discCalc.finalAmount,
            status: 'Placed'
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Orders List
app.get('/api/orders', async (req, res) => {
    try {
        const { userId = 1, role = 'patient' } = req.query;
        let orders;
        if (role === 'admin') {
            orders = await queryAll('SELECT * FROM orders ORDER BY created_at DESC');
        } else {
            orders = await queryAll('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        }

        for (const order of orders) {
            order.items = await queryAll('SELECT * FROM order_items WHERE order_id = ?', [order.order_id]);
        }
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const allowed = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!allowed.includes(status)) return res.status(400).json({ success: false, error: `Invalid status. Allowed: ${allowed}` });

        await queryRun('UPDATE orders SET status = ? WHERE order_id = ?', [status, req.params.id]);
        res.json({ success: true, message: `Order ${req.params.id} updated to ${status}.` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 6. Simulated Prescription Upload
app.post('/api/prescriptions/upload', async (req, res) => {
    try {
        const { userId = 1, patientName = 'Rahul Sharma', filename = '', fileType = '', fileSize = 0, notes = '' } = req.body;
        const validExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
        const hasValidExt = validExtensions.some(ext => filename.toLowerCase().endsWith(ext));

        if (!filename || !hasValidExt) {
            return res.status(400).json({ success: false, error: 'Invalid file type. Only PDF, JPG, and PNG files are accepted.' });
        }
        if (fileSize <= 0 || fileSize > 5242880) {
            return res.status(400).json({ success: false, error: 'File size exceeds limit. Maximum permitted size is 5 MB.' });
        }

        const result = await queryRun(
            `INSERT INTO prescriptions (user_id, patient_name, filename, file_type, file_size, notes, status) VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
            [userId, patientName, filename, fileType, fileSize, notes]
        );

        res.status(201).json({
            success: true,
            message: 'Prescription uploaded successfully and queued for clinical verification.',
            prescriptionId: result.lastID,
            status: 'Pending',
            filename
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/prescriptions', async (req, res) => {
    try {
        const { userId = 1, role = 'patient' } = req.query;
        let prescs;
        if (role === 'admin') {
            prescs = await queryAll('SELECT * FROM prescriptions ORDER BY uploaded_at DESC');
        } else {
            prescs = await queryAll('SELECT * FROM prescriptions WHERE user_id = ? ORDER BY uploaded_at DESC', [userId]);
        }
        res.json({ success: true, prescriptions: prescs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/prescriptions/:id/status', async (req, res) => {
    try {
        const { status, reviewedBy = 'Dr. A. Mehta (Medical Officer)' } = req.body;
        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Status must be Pending, Approved, or Rejected.' });
        }
        await queryRun('UPDATE prescriptions SET status = ?, reviewed_by = ? WHERE id = ?', [status, reviewedBy, req.params.id]);
        res.json({ success: true, message: `Prescription #${req.params.id} updated to ${status}.` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 7. Admin Stats
app.get('/api/admin/stats', async (req, res) => {
    try {
        const patRow = await queryGet("SELECT COUNT(*) AS count FROM users WHERE role = 'patient'");
        const medRow = await queryGet("SELECT COUNT(*) AS count FROM medicines");
        const ordRow = await queryGet("SELECT COUNT(*) AS count FROM orders");
        const pendRow = await queryGet("SELECT COUNT(*) AS count FROM orders WHERE status IN ('Placed', 'Processing')");
        const revRow = await queryGet("SELECT COALESCE(SUM(total), 0) AS total_revenue FROM orders WHERE status != 'Cancelled'");
        const prescRow = await queryGet("SELECT COUNT(*) AS count FROM prescriptions WHERE status = 'Pending'");

        res.json({
            success: true,
            stats: {
                totalPatients: patRow.count,
                totalMedicines: medRow.count,
                totalOrders: ordRow.count,
                pendingOrders: pendRow.count,
                pendingPrescriptions: prescRow.count,
                totalRevenue: Math.round(revRow.total_revenue * 100) / 100
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`MediCare Express server listening on http://localhost:${PORT}`);
});

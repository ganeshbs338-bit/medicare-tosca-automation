"""
MediCare - Full-Stack Healthcare & Online Pharmacy Backend Server
Zero-Dependency Python 3.10 Implementation
Provides REST APIs and serves the React/HTML5 Frontend
"""

import http.server
import socketserver
import urllib.parse
import json
import sqlite3
import os
import mimetypes
import re
from datetime import datetime

PORT = 5000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database", "medicare.db")
PUBLIC_DIR = os.path.join(BASE_DIR, "public")

# Import the White-Box Discount Calculator
import sys
sys.path.insert(0, os.path.join(BASE_DIR, "white_box_testing"))
from discount_calculator import calculate_discount

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

class MediCareRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # API Routes
        if path == "/api/health":
            self.send_json({"status": "healthy", "app": "MediCare", "time": datetime.now().isoformat()})
            return

        elif path == "/api/medicines":
            self.handle_get_medicines(query)
            return

        elif re.match(r"^/api/medicines/(\d+)$", path):
            med_id = int(re.match(r"^/api/medicines/(\d+)$", path).group(1))
            self.handle_get_medicine_by_id(med_id)
            return

        elif path == "/api/orders":
            self.handle_get_orders(query)
            return

        elif re.match(r"^/api/orders/([\w-]+)$", path):
            order_id = re.match(r"^/api/orders/([\w-]+)$", path).group(1)
            self.handle_get_order_by_id(order_id)
            return

        elif path == "/api/prescriptions":
            self.handle_get_prescriptions(query)
            return

        elif path == "/api/admin/stats":
            self.handle_get_admin_stats()
            return

        # Serve static files from public/ directory
        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        try:
            body = json.loads(post_data.decode('utf-8')) if content_length > 0 else {}
        except Exception:
            body = {}

        if path == "/api/auth/register":
            self.handle_register(body)
        elif path == "/api/auth/login":
            self.handle_login(body)
        elif path == "/api/cart/calculate-discount":
            self.handle_calculate_discount(body)
        elif path == "/api/orders":
            self.handle_create_order(body)
        elif path == "/api/medicines":
            self.handle_add_medicine(body)
        elif path == "/api/prescriptions/upload":
            self.handle_upload_prescription(body)
        else:
            self.send_json({"error": "Endpoint not found"}, status=404)

    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        try:
            body = json.loads(post_data.decode('utf-8')) if content_length > 0 else {}
        except Exception:
            body = {}

        if re.match(r"^/api/orders/([\w-]+)/status$", path):
            order_id = re.match(r"^/api/orders/([\w-]+)/status$", path).group(1)
            self.handle_update_order_status(order_id, body)
        elif re.match(r"^/api/medicines/(\d+)$", path):
            med_id = int(re.match(r"^/api/medicines/(\d+)$", path).group(1))
            self.handle_update_medicine(med_id, body)
        elif re.match(r"^/api/prescriptions/(\d+)/status$", path):
            presc_id = int(re.match(r"^/api/prescriptions/(\d+)/status$", path).group(1))
            self.handle_update_prescription_status(presc_id, body)
        else:
            self.send_json({"error": "Endpoint not found"}, status=404)

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        if re.match(r"^/api/medicines/(\d+)$", path):
            med_id = int(re.match(r"^/api/medicines/(\d+)$", path).group(1))
            self.handle_delete_medicine(med_id)
        else:
            self.send_json({"error": "Endpoint not found"}, status=404)

    # ---------------- AUTH HANDLERS ----------------
    def handle_register(self, body):
        name = str(body.get("name", "")).strip()
        email = str(body.get("email", "")).strip()
        phone = str(body.get("phone", "")).strip()
        age_raw = body.get("age", "")
        password = str(body.get("password", "")).strip()
        confirm_password = str(body.get("confirmPassword", "")).strip()

        # Validation per ECP and BVA specifications
        if not name:
            self.send_json({"success": False, "error": "Full name is required."}, 400)
            return

        if not email or "@" not in email or "." not in email:
            self.send_json({"success": False, "error": "Please enter a valid email address."}, 400)
            return

        if not re.match(r"^\d{10}$", phone):
            self.send_json({"success": False, "error": "Phone number must be exactly 10 digits."}, 400)
            return

        try:
            age = int(age_raw)
            if age < 18 or age > 100:
                self.send_json({"success": False, "error": "Age must be between 18 and 100 years."}, 400)
                return
        except (ValueError, TypeError):
            self.send_json({"success": False, "error": "Age must be a valid numeric value."}, 400)
            return

        if len(password) < 8 or len(password) > 20:
            self.send_json({"success": False, "error": "Password length must be between 8 and 20 characters."}, 400)
            return

        if password != confirm_password:
            self.send_json({"success": False, "error": "Passwords do not match."}, 400)
            return

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE LOWER(email) = LOWER(?)", (email,))
        if cursor.fetchone():
            conn.close()
            self.send_json({"success": False, "error": "An account with this email already exists."}, 400)
            return

        cursor.execute("""
        INSERT INTO users (name, email, phone, age, password, role, is_member)
        VALUES (?, ?, ?, ?, ?, 'patient', 1)
        """, (name, email, phone, age, password))
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()

        self.send_json({
            "success": True,
            "message": "Patient registration successful! You can now log in.",
            "user": {"id": user_id, "name": name, "email": email, "role": "patient"}
        }, 201)

    def handle_login(self, body):
        email = str(body.get("email", "")).strip()
        password = str(body.get("password", "")).strip()

        if not email or not password:
            self.send_json({"success": False, "error": "Email and password are required."}, 400)
            return

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
        SELECT id, name, email, phone, age, password, role, is_member
        FROM users WHERE LOWER(email) = LOWER(?)
        """, (email,))
        user = cursor.fetchone()
        conn.close()

        if not user or user["password"] != password:
            self.send_json({"success": False, "error": "Invalid email or password. Please verify your credentials."}, 401)
            return

        user_dict = dict(user)
        del user_dict["password"]
        self.send_json({
            "success": True,
            "message": f"Welcome back, {user_dict['name']}!",
            "user": user_dict,
            "token": f"medicare-token-{user_dict['id']}-{user_dict['role']}"
        })

    # ---------------- MEDICINES HANDLERS ----------------
    def handle_get_medicines(self, query):
        search = query.get("search", [""])[0].strip().lower()
        category = query.get("category", [""])[0].strip()
        sort = query.get("sort", [""])[0].strip()

        conn = get_db_connection()
        cursor = conn.cursor()

        sql = "SELECT * FROM medicines WHERE 1=1"
        params = []

        if search:
            sql += " AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)"
            params.extend([f"%{search}%", f"%{search}%"])

        if category and category != "All":
            sql += " AND category = ?"
            params.append(category)

        if sort == "price-asc":
            sql += " ORDER BY price ASC"
        elif sort == "price-desc":
            sql += " ORDER BY price DESC"
        elif sort == "name-asc":
            sql += " ORDER BY name ASC"
        else:
            sql += " ORDER BY id ASC"

        cursor.execute(sql, params)
        medicines = [dict(row) for row in cursor.fetchall()]
        conn.close()

        self.send_json({"success": True, "count": len(medicines), "medicines": medicines})

    def handle_get_medicine_by_id(self, med_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM medicines WHERE id = ?", (med_id,))
        med = cursor.fetchone()
        conn.close()
        if not med:
            self.send_json({"success": False, "error": "Medicine not found"}, 404)
        else:
            self.send_json({"success": True, "medicine": dict(med)})

    def handle_add_medicine(self, body):
        name = str(body.get("name", "")).strip()
        category = str(body.get("category", "")).strip()
        description = str(body.get("description", "")).strip()
        price = float(body.get("price", 0))
        stock = int(body.get("stock", 0))
        requires_prescription = 1 if body.get("requires_prescription") else 0
        dosage = str(body.get("dosage", "As directed by physician")).strip()
        manufacturer = str(body.get("manufacturer", "MediCare Certified Pharma")).strip()
        image_url = str(body.get("image_url", "/assets/medicine-default.svg")).strip()

        if not name or not category or price <= 0 or stock < 0:
            self.send_json({"success": False, "error": "Invalid medicine details. Provide valid name, category, price and stock."}, 400)
            return

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO medicines (name, category, description, price, stock, requires_prescription, dosage, manufacturer, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (name, category, description, price, stock, requires_prescription, dosage, manufacturer, image_url))
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()

        self.send_json({"success": True, "message": "Medicine added successfully!", "medicineId": new_id}, 201)

    def handle_update_medicine(self, med_id, body):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM medicines WHERE id = ?", (med_id,))
        if not cursor.fetchone():
            conn.close()
            self.send_json({"success": False, "error": "Medicine not found"}, 404)
            return

        name = str(body.get("name", "")).strip()
        category = str(body.get("category", "")).strip()
        description = str(body.get("description", "")).strip()
        price = float(body.get("price", 0))
        stock = int(body.get("stock", 0))
        requires_prescription = 1 if body.get("requires_prescription") else 0

        cursor.execute("""
        UPDATE medicines
        SET name = ?, category = ?, description = ?, price = ?, stock = ?, requires_prescription = ?
        WHERE id = ?
        """, (name, category, description, price, stock, requires_prescription, med_id))
        conn.commit()
        conn.close()

        self.send_json({"success": True, "message": "Medicine updated successfully!"})

    def handle_delete_medicine(self, med_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM medicines WHERE id = ?", (med_id,))
        conn.commit()
        conn.close()
        self.send_json({"success": True, "message": "Medicine deleted successfully!"})

    # ---------------- DISCOUNT & ORDER HANDLERS ----------------
    def handle_calculate_discount(self, body):
        subtotal = float(body.get("subtotal", 0))
        is_member = bool(body.get("isMember", False))
        coupon_code = str(body.get("couponCode", "")).strip().upper()

        result = calculate_discount(subtotal, is_member, coupon_code)
        self.send_json(result)

    def handle_create_order(self, body):
        user_id = body.get("userId", 1)
        patient_name = str(body.get("patientName", "")).strip()
        delivery_address = str(body.get("deliveryAddress", "")).strip()
        phone = str(body.get("phone", "")).strip()
        payment_method = str(body.get("paymentMethod", "Cash on Delivery")).strip()
        items = body.get("items", [])
        coupon_code = str(body.get("couponCode", "")).strip().upper()
        is_member = bool(body.get("isMember", True))

        if not patient_name:
            self.send_json({"success": False, "error": "Patient name is required for checkout."}, 400)
            return

        if not delivery_address or len(delivery_address) < 10:
            self.send_json({"success": False, "error": "Please enter a valid, complete delivery address (min 10 characters)."}, 400)
            return

        if not re.match(r"^\d{10}$", phone):
            self.send_json({"success": False, "error": "Delivery contact phone number must be 10 digits."}, 400)
            return

        if not items or len(items) == 0:
            self.send_json({"success": False, "error": "Cart is empty. Add medicines before placing an order."}, 400)
            return

        # Calculate Subtotal & Check Stock Availability
        conn = get_db_connection()
        cursor = conn.cursor()

        subtotal = 0.0
        verified_items = []
        for item in items:
            med_id = item.get("id")
            qty = int(item.get("quantity", 1))

            if qty < 1 or qty > 10:
                conn.close()
                self.send_json({"success": False, "error": f"Quantity for {item.get('name')} must be between 1 and 10."}, 400)
                return

            cursor.execute("SELECT id, name, price, stock FROM medicines WHERE id = ?", (med_id,))
            med = cursor.fetchone()
            if not med:
                conn.close()
                self.send_json({"success": False, "error": f"Medicine ID {med_id} does not exist."}, 400)
                return

            if med["stock"] < qty:
                conn.close()
                self.send_json({"success": False, "error": f"Insufficient stock for '{med['name']}'. Available: {med['stock']}, Requested: {qty}."}, 400)
                return

            item_price = float(med["price"])
            subtotal += item_price * qty
            verified_items.append({
                "medicine_id": med["id"],
                "name": med["name"],
                "price": item_price,
                "quantity": qty
            })

        # Apply Discount calculation using white-box algorithm
        discount_calc = calculate_discount(subtotal, is_member, coupon_code)
        discount_amount = discount_calc["discount_amount"]
        final_total = discount_calc["final_amount"]

        # Generate Unique Order ID
        import random
        random_suffix = random.randint(1000, 9999)
        order_id = f"MED-ORD-{random_suffix}"

        # Insert Order
        cursor.execute("""
        INSERT INTO orders (order_id, user_id, patient_name, delivery_address, phone, payment_method, subtotal, discount, coupon_code, total, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Placed')
        """, (order_id, user_id, patient_name, delivery_address, phone, payment_method, subtotal, discount_amount, coupon_code or 'NONE', final_total))

        # Insert Order Items and Deduct Stock
        for itm in verified_items:
            cursor.execute("""
            INSERT INTO order_items (order_id, medicine_id, medicine_name, price, quantity)
            VALUES (?, ?, ?, ?, ?)
            """, (order_id, itm["medicine_id"], itm["name"], itm["price"], itm["quantity"]))

            cursor.execute("""
            UPDATE medicines SET stock = stock - ? WHERE id = ?
            """, (itm["quantity"], itm["medicine_id"]))

        conn.commit()
        conn.close()

        self.send_json({
            "success": True,
            "message": "Order placed successfully!",
            "orderId": order_id,
            "subtotal": subtotal,
            "discount": discount_amount,
            "total": final_total,
            "status": "Placed"
        }, 201)

    def handle_get_orders(self, query):
        user_id = query.get("userId", [None])[0]
        role = query.get("role", ["patient"])[0]

        conn = get_db_connection()
        cursor = conn.cursor()

        if role == "admin":
            cursor.execute("SELECT * FROM orders ORDER BY created_at DESC")
        else:
            cursor.execute("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", (user_id if user_id else 1,))

        orders_list = [dict(row) for row in cursor.fetchall()]

        for order in orders_list:
            cursor.execute("SELECT * FROM order_items WHERE order_id = ?", (order["order_id"],))
            order["items"] = [dict(item) for item in cursor.fetchall()]

        conn.close()
        self.send_json({"success": True, "orders": orders_list})

    def handle_get_order_by_id(self, order_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM orders WHERE order_id = ?", (order_id,))
        order = cursor.fetchone()
        if not order:
            conn.close()
            self.send_json({"success": False, "error": "Order not found"}, 404)
            return

        order_dict = dict(order)
        cursor.execute("SELECT * FROM order_items WHERE order_id = ?", (order_id,))
        order_dict["items"] = [dict(item) for item in cursor.fetchall()]
        conn.close()
        self.send_json({"success": True, "order": order_dict})

    def handle_update_order_status(self, order_id, body):
        new_status = str(body.get("status", "")).strip()
        allowed_statuses = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"]

        if new_status not in allowed_statuses:
            self.send_json({"success": False, "error": f"Invalid status. Allowed: {allowed_statuses}"}, 400)
            return

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE orders SET status = ? WHERE order_id = ?", (new_status, order_id))
        conn.commit()
        conn.close()

        self.send_json({"success": True, "message": f"Order {order_id} status updated to {new_status}."})

    # ---------------- PRESCRIPTION HANDLERS ----------------
    def handle_upload_prescription(self, body):
        user_id = body.get("userId", 1)
        patient_name = str(body.get("patientName", "Rahul Sharma")).strip()
        filename = str(body.get("filename", "")).strip()
        file_type = str(body.get("fileType", "")).strip().lower()
        file_size = int(body.get("fileSize", 0))
        notes = str(body.get("notes", "")).strip()

        # Validation per Module 9 specs:
        # File type validation
        allowed_types = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
        valid_extensions = [".pdf", ".jpg", ".jpeg", ".png"]
        has_valid_ext = any(filename.lower().endswith(ext) for ext in valid_extensions)

        if not filename or not has_valid_ext:
            self.send_json({"success": False, "error": "Invalid file type. Only PDF, JPG, and PNG files are accepted."}, 400)
            return

        # File size validation: max 5MB (5242880 bytes)
        if file_size <= 0 or file_size > 5242880:
            self.send_json({"success": False, "error": "File size exceeds limit. Maximum permitted size is 5 MB."}, 400)
            return

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO prescriptions (user_id, patient_name, filename, file_type, file_size, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, 'Pending')
        """, (user_id, patient_name, filename, file_type, file_size, notes))
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()

        self.send_json({
            "success": True,
            "message": "Prescription uploaded successfully and queued for clinical verification.",
            "prescriptionId": new_id,
            "status": "Pending",
            "filename": filename
        }, 201)

    def handle_get_prescriptions(self, query):
        user_id = query.get("userId", [None])[0]
        role = query.get("role", ["patient"])[0]

        conn = get_db_connection()
        cursor = conn.cursor()
        if role == "admin":
            cursor.execute("SELECT * FROM prescriptions ORDER BY uploaded_at DESC")
        else:
            cursor.execute("SELECT * FROM prescriptions WHERE user_id = ? ORDER BY uploaded_at DESC", (user_id if user_id else 1,))
        prescs = [dict(row) for row in cursor.fetchall()]
        conn.close()

        self.send_json({"success": True, "prescriptions": prescs})

    def handle_update_prescription_status(self, presc_id, body):
        status = str(body.get("status", "")).strip()
        reviewed_by = str(body.get("reviewedBy", "Dr. A. Mehta (Medical Officer)")).strip()

        if status not in ["Pending", "Approved", "Rejected"]:
            self.send_json({"success": False, "error": "Status must be Pending, Approved, or Rejected."}, 400)
            return

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
        UPDATE prescriptions SET status = ?, reviewed_by = ? WHERE id = ?
        """, (status, reviewed_by, presc_id))
        conn.commit()
        conn.close()

        self.send_json({"success": True, "message": f"Prescription #{presc_id} status updated to {status}."})

    # ---------------- ADMIN STATS ----------------
    def handle_get_admin_stats(self):
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) AS count FROM users WHERE role = 'patient'")
        total_patients = cursor.fetchone()["count"]

        cursor.execute("SELECT COUNT(*) AS count FROM medicines")
        total_medicines = cursor.fetchone()["count"]

        cursor.execute("SELECT COUNT(*) AS count FROM orders")
        total_orders = cursor.fetchone()["count"]

        cursor.execute("SELECT COUNT(*) AS count FROM orders WHERE status IN ('Placed', 'Processing')")
        pending_orders = cursor.fetchone()["count"]

        cursor.execute("SELECT COALESCE(SUM(total), 0) AS total_revenue FROM orders WHERE status != 'Cancelled'")
        total_revenue = cursor.fetchone()["total_revenue"]

        cursor.execute("SELECT COUNT(*) AS count FROM prescriptions WHERE status = 'Pending'")
        pending_prescriptions = cursor.fetchone()["count"]

        conn.close()

        self.send_json({
            "success": True,
            "stats": {
                "totalPatients": total_patients,
                "totalMedicines": total_medicines,
                "totalOrders": total_orders,
                "pendingOrders": pending_orders,
                "pendingPrescriptions": pending_prescriptions,
                "totalRevenue": round(total_revenue, 2)
            }
        })

def run(port=PORT):
    socketserver.TCPServer.allow_reuse_address = True
    server_address = ('127.0.0.1', port)
    httpd = socketserver.TCPServer(server_address, MediCareRequestHandler)
    print(f"================================================================")
    print(f" MediCare Healthcare & Online Pharmacy Server is Running!      ")
    print(f" URL: http://localhost:{port}                                  ")
    print(f" SQLite Database: {DB_PATH}                                     ")
    print(f" Ready for Tricentis Tosca Automation & XScan Testing!         ")
    print(f"================================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping MediCare server...")
        httpd.server_close()

if __name__ == "__main__":
    run()

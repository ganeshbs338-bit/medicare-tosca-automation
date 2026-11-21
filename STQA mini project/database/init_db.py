"""
MediCare - Database Initialization and Seeding Script
Database: SQLite
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "medicare.db")

def init_database():
    if os.path.exists(DB_PATH):
        try:
            os.remove(DB_PATH)
            print(f"Removed existing database at {DB_PATH}")
        except Exception as e:
            print(f"Notice: {e}")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        age INTEGER NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'patient',
        is_member INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 2. Medicines Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS medicines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL,
        requires_prescription INTEGER NOT NULL DEFAULT 0,
        dosage TEXT NOT NULL,
        manufacturer TEXT NOT NULL,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 3. Orders Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT UNIQUE NOT NULL,
        user_id INTEGER NOT NULL,
        patient_name TEXT NOT NULL,
        delivery_address TEXT NOT NULL,
        phone TEXT NOT NULL,
        payment_method TEXT NOT NULL DEFAULT 'Cash on Delivery',
        subtotal REAL NOT NULL,
        discount REAL NOT NULL DEFAULT 0.0,
        coupon_code TEXT DEFAULT 'NONE',
        total REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'Placed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    """)

    # 4. Order Items Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT NOT NULL,
        medicine_id INTEGER NOT NULL,
        medicine_name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (order_id)
    )
    """)

    # 5. Prescriptions Table (Simulated Prescription Upload)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS prescriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        patient_name TEXT NOT NULL,
        filename TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'Pending',
        reviewed_by TEXT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    """)

    # Seed Default Users (Requirement Demo Credentials)
    users = [
        ("Rahul Sharma", "patient@medicare.com", "9876543210", 28, "Patient@123", "patient", 1),
        ("MediCare Administrator", "admin@medicare.com", "9123456789", 35, "Admin@123", "admin", 1),
        ("Priya Patel", "priya.patel@medicare.com", "9823456781", 32, "Priya@1234", "patient", 0),
        ("Amit Verma", "amit.verma@medicare.com", "9845123456", 45, "Amit@1234", "patient", 1)
    ]
    cursor.executemany("""
    INSERT INTO users (name, email, phone, age, password, role, is_member)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, users)

    # Seed Sample Medicines (16 Medicines covering multiple medical categories)
    medicines = [
        (
            "Paracetamol 650mg",
            "Pain Relief",
            "Effective antipyretic and analgesic for fast relief from fever, headache, body ache, and mild arthritis.",
            35.00,
            150,
            0,
            "1 tablet every 6 hours as needed (Max 4/day)",
            "Apex Healthcare Labs",
            "/assets/paracetamol.svg"
        ),
        (
            "Amoxicillin 500mg",
            "Antibiotics",
            "Broad-spectrum penicillin antibiotic used to treat bacterial infections of ear, nose, throat, and chest.",
            120.00,
            45,
            1,
            "1 capsule three times daily after food",
            "Biocare Pharmaceuticals",
            "/assets/amoxicillin.svg"
        ),
        (
            "Atorvastatin 20mg",
            "Cardiac Care",
            "Lipid-lowering medication (statin) used to reduce cholesterol and cardiovascular risk.",
            185.00,
            60,
            1,
            "1 tablet once daily at bedtime",
            "CardioLife Sciences",
            "/assets/atorvastatin.svg"
        ),
        (
            "Metformin 500mg",
            "Diabetes Care",
            "First-line biguanide oral medication for type 2 diabetes mellitus to regulate blood glucose levels.",
            95.00,
            80,
            1,
            "1 tablet with or after meals twice daily",
            "Glycemia Health",
            "/assets/metformin.svg"
        ),
        (
            "Vitamin C 500mg Chewable",
            "Vitamins & Supplements",
            "Ascorbic acid chewable tablets with zinc for daily immunity boost, collagen synthesis, and antioxidant protection.",
            75.00,
            200,
            0,
            "1 chewable tablet daily after breakfast",
            "Vitality Nutrition",
            "/assets/vitaminc.svg"
        ),
        (
            "Cetirizine 10mg",
            "Respiratory Care",
            "Second-generation antihistamine for seasonal allergic rhinitis, watery eyes, sneezing, and hives.",
            45.00,
            120,
            0,
            "1 tablet at night before sleeping",
            "RespiClean Pharma",
            "/assets/cetirizine.svg"
        ),
        (
            "Omeprazole 20mg",
            "Gastrointestinal",
            "Proton pump inhibitor (PPI) that decreases stomach acid production for acidity, heartburn, and GERD.",
            85.00,
            90,
            0,
            "1 capsule 30 minutes before morning meal",
            "GastroWell Solutions",
            "/assets/omeprazole.svg"
        ),
        (
            "Azithromycin 500mg",
            "Antibiotics",
            "Macrolide antibiotic for upper and lower respiratory tract infections and soft tissue infections.",
            140.00,
            35,
            1,
            "1 tablet daily for 3 consecutive days",
            "Biocare Pharmaceuticals",
            "/assets/azithromycin.svg"
        ),
        (
            "Ibuprofen 400mg",
            "Pain Relief",
            "Non-steroidal anti-inflammatory drug (NSAID) for relief from muscular pain, toothache, and sprains.",
            55.00,
            110,
            0,
            "1 tablet twice daily after meals",
            "Apex Healthcare Labs",
            "/assets/ibuprofen.svg"
        ),
        (
            "Losartan Potassium 50mg",
            "Cardiac Care",
            "Angiotensin II receptor blocker (ARB) for management of hypertension and kidney protection.",
            115.00,
            50,
            1,
            "1 tablet once daily in the morning",
            "CardioLife Sciences",
            "/assets/losartan.svg"
        ),
        (
            "Glimepiride 2mg",
            "Diabetes Care",
            "Sulfonylurea antidiabetic medicine that stimulates pancreatic insulin secretion.",
            130.00,
            40,
            1,
            "1 tablet before breakfast daily",
            "Glycemia Health",
            "/assets/glimepiride.svg"
        ),
        (
            "Multivitamin Daily Formula",
            "Vitamins & Supplements",
            "Comprehensive essential vitamins (A, B-Complex, C, D3, E) plus trace minerals for everyday vigor.",
            220.00,
            75,
            0,
            "1 tablet daily after food",
            "Vitality Nutrition",
            "/assets/multivitamin.svg"
        ),
        (
            "Cough Relief Herbal Syrup 100ml",
            "Respiratory Care",
            "Soothing herbal syrup with tulsi, honey, and vasaka for dry and wet cough relief without drowsiness.",
            105.00,
            65,
            0,
            "10ml twice daily with warm water",
            "RespiClean Pharma",
            "/assets/coughsyrup.svg"
        ),
        (
            "Antiseptic Healing Cream 30g",
            "First Aid",
            "Topical antibacterial ointment for cuts, scrapes, minor burns, and superficial skin abrasions.",
            60.00,
            95,
            0,
            "Apply thin layer to affected area 2 times daily",
            "MediHeal Derm",
            "/assets/antiseptic.svg"
        ),
        (
            "Pantoprazole 40mg",
            "Gastrointestinal",
            "Delayed-release PPI for acute gastric ulcers, erosive esophagitis, and hypersecretory states.",
            110.00,
            70,
            1,
            "1 tablet daily before breakfast",
            "GastroWell Solutions",
            "/assets/pantoprazole.svg"
        ),
        (
            "Zincovit Tablets 30s",
            "Vitamins & Supplements",
            "Balanced zinc, multivitamin, and mineral formulation to reinforce cellular immunity and recovery.",
            115.00,
            85,
            0,
            "1 tablet daily with milk or water",
            "Apex Healthcare Labs",
            "/assets/zincovit.svg"
        )
    ]
    cursor.executemany("""
    INSERT INTO medicines (name, category, description, price, stock, requires_prescription, dosage, manufacturer, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, medicines)

    # Seed Initial Orders
    orders = [
        ("MED-ORD-1001", 1, "Rahul Sharma", "Flat 402, Green Glen Layout, Bellandur, Bengaluru", "9876543210", "Cash on Delivery", 550.0, 0.0, "NONE", 550.0, "Delivered"),
        ("MED-ORD-1002", 1, "Rahul Sharma", "Flat 402, Green Glen Layout, Bellandur, Bengaluru", "9876543210", "Cash on Delivery", 1250.0, 187.5, "MEDICARE5", 1062.5, "Shipped"),
        ("MED-ORD-1003", 3, "Priya Patel", "House #12, 5th Cross, Indiranagar, Bengaluru", "9823456781", "Cash on Delivery", 340.0, 0.0, "NONE", 340.0, "Processing"),
        ("MED-ORD-1004", 4, "Amit Verma", "B-301, Palm Meadows, Whitefield, Bengaluru", "9845123456", "Cash on Delivery", 890.0, 44.5, "NONE", 845.5, "Placed")
    ]
    cursor.executemany("""
    INSERT INTO orders (order_id, user_id, patient_name, delivery_address, phone, payment_method, subtotal, discount, coupon_code, total, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, orders)

    # Seed Order Items
    order_items = [
        ("MED-ORD-1001", 1, "Paracetamol 650mg", 35.0, 2),
        ("MED-ORD-1001", 5, "Vitamin C 500mg Chewable", 75.0, 4),
        ("MED-ORD-1001", 12, "Multivitamin Daily Formula", 220.0, 1),

        ("MED-ORD-1002", 3, "Atorvastatin 20mg", 185.0, 2),
        ("MED-ORD-1002", 4, "Metformin 500mg", 95.0, 3),
        ("MED-ORD-1002", 12, "Multivitamin Daily Formula", 220.0, 2),

        ("MED-ORD-1003", 7, "Omeprazole 20mg", 85.0, 4),

        ("MED-ORD-1004", 2, "Amoxicillin 500mg", 120.0, 2),
        ("MED-ORD-1004", 8, "Azithromycin 500mg", 140.0, 3),
        ("MED-ORD-1004", 14, "Antiseptic Healing Cream 30g", 60.0, 2)
    ]
    cursor.executemany("""
    INSERT INTO order_items (order_id, medicine_id, medicine_name, price, quantity)
    VALUES (?, ?, ?, ?, ?)
    """, order_items)

    # Seed Simulated Prescriptions
    prescriptions = [
        (1, "Rahul Sharma", "Cardiology_Prescription_DrMehta.pdf", "application/pdf", 245760, "Routine quarterly cardiology checkup for Atorvastatin refill.", "Approved", "Dr. A. Mehta (Cardiologist)"),
        (3, "Priya Patel", "Prescription_DrRao_ENT.jpg", "image/jpeg", 512000, "Severe seasonal sinus and allergy prescription.", "Pending", None),
        (4, "Amit Verma", "General_Clinic_Slip_Old.pdf", "application/pdf", 180240, "Handwritten slip from 2024 without doctor registration number.", "Rejected", "Admin Compliance Officer")
    ]
    cursor.executemany("""
    INSERT INTO prescriptions (user_id, patient_name, filename, file_type, file_size, notes, status, reviewed_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, prescriptions)

    conn.commit()
    conn.close()
    print(f"MediCare Database initialized and seeded successfully at: {DB_PATH}")

if __name__ == "__main__":
    init_database()

# MediCare: Healthcare & Online Pharmacy
## Course: Software Testing & Quality Assurance (STQA)
### Comprehensive Module Descriptions & Tosca Identifier Catalog

---

## Overview

The **MediCare** software suite comprises twelve discrete, interconnected functional modules. To satisfy the core objective of seamless Model-Based Test Automation using **Tricentis Tosca**, each module has been engineered with fixed, collision-free HTML `id` and `data-testid` attributes.

---

### Module 1: Homepage & Navigation
- **Objective**: Serves as the primary public entry point for patients, providing clinical category navigation, search bar triggers, service summaries, and authentication entry buttons.
- **Key UI Elements & Tosca Identifiers**:
  - Logo Button: `id="nav-logo"`, redirects to home.
  - Search Input: `id="medicine-search"`, `data-testid="medicine-search"`.
  - Search Button: `id="search-button"`.
  - Catalogue Link: `id="nav-catalogue"`.
  - Prescription Link: `id="nav-prescription"`.
  - Cart Link & Badge: `id="nav-cart-btn"`, `id="nav-cart-count"`.
  - Login Button: `id="nav-login"`.
  - Register Button: `id="nav-register"`.

---

### Module 2: Patient Registration
- **Objective**: Captures and validates new patient demographic records, enforcing strict data integrity rules before persistence in `users` table.
- **Validation Rules**:
  - Full Name: Mandatory non-empty string.
  - Email: Standard RFC-compliant format containing `@` and `.`.
  - Phone: Exactly 10 digits (`^[0-9]{10}$`).
  - Age: Numeric integer strictly within $[18, 100]$.
  - Password: Length between 8 and 20 characters ($[8, 20]$).
  - Confirm Password: Must match password character-by-character.
- **Key UI Elements & Tosca Identifiers**:
  - Name Field: `id="registration-name"`, `data-testid="registration-name"`
  - Email Field: `id="registration-email"`, `data-testid="registration-email"`
  - Phone Field: `id="registration-phone"`, `data-testid="registration-phone"`
  - Age Field: `id="registration-age"`, `data-testid="registration-age"`
  - Password Field: `id="registration-password"`, `data-testid="registration-password"`
  - Confirm Password: `id="registration-confirm-password"`, `data-testid="registration-confirm-password"`
  - Submit Button: `id="registration-submit"`, `data-testid="registration-submit"`
  - Error Notification Container: `id="registration-error"`, `data-testid="registration-error"`

---

### Module 3: Patient & Admin Login
- **Objective**: Handles secure credential authentication and role-based redirection to Patient Dashboard or Administrator Portal.
- **Demo Credentials**:
  - Patient: `patient@medicare.com` / `Patient@123`
  - Admin: `admin@medicare.com` / `Admin@123`
- **Key UI Elements & Tosca Identifiers**:
  - Email Field: `id="login-email"`, `data-testid="login-email"`
  - Password Field: `id="login-password"`, `data-testid="login-password"`
  - Sign In Button: `id="login-button"`, `data-testid="login-button"`
  - Login Error Container: `id="login-error"`, `data-testid="login-error"`
  - Logout Button: `id="logout-button"`, `data-testid="logout-button"`

---

### Module 4: Patient Dashboard
- **Objective**: Provides personalized analytics for logged-in patients, displaying profile information, total orders, uploaded prescriptions, and quick navigation.
- **Key UI Elements & Tosca Identifiers**:
  - Metric Cards: `#total-orders-stat`, `#total-prescriptions-stat`, `#membership-stat`
  - Order History Section: `id="order-history"`, `data-testid="order-history"`
  - Order History Table: `id="order-history-table"`

---

### Module 5: Pharmaceutical Catalogue
- **Objective**: Renders 16 authentic formulary medicines across diverse therapeutic categories (Pain Relief, Antibiotics, Cardiac Care, Diabetes Care, Vitamins, Respiratory, Gastrointestinal, First Aid).
- **Attributes per Medicine**: Name, Category, Clinical Description, Price, Stock, Dosage, Manufacturer, Prescription Requirement indicator (`badge-prescription` vs. `badge-otc`).
- **Key UI Elements & Tosca Identifiers**:
  - Medicine Cards: `id="medicine-card-{id}"`, `data-testid="medicine-card-{id}"`
  - Details Trigger: `id="medicine-details-{id}"`, `data-testid="medicine-details"`
  - Add to Cart Trigger: `id="add-to-cart-{id}"`, `data-testid="add-to-cart"`

---

### Module 6: Medicine Search & Filtering
- **Objective**: Enables instantaneous filtering of pharmaceutical catalogue by drug name, therapeutic category, and price/alphabetical sorting.
- **Key UI Elements & Tosca Identifiers**:
  - Search Input: `id="medicine-search"`, `data-testid="medicine-search"`
  - Category Dropdown: `id="medicine-category"`, `data-testid="medicine-category"`
  - Sort Dropdown: `id="medicine-sort"`, `data-testid="medicine-sort"`
  - No Results Warning Container: `id="no-results-message"`, `data-testid="no-results-message"`

---

### Module 7: Medicine Clinical Details
- **Objective**: Displays comprehensive clinical monograph including indications, standard dosage schedules, manufacturer credentials, real-time stock levels, and cart addition controls.
- **Key UI Elements & Tosca Identifiers**:
  - Details Container: `id="medicine-details"`, `data-testid="medicine-details"`
  - Add to Cart Button: `id="add-to-cart"`, `data-testid="add-to-cart"`

---

### Module 8: Shopping Cart
- **Objective**: Manages order item staging, subtotal calculation, quantity adjustment strictly bounded within $[1, 10]$ units, and enforcement of stock ceiling limits.
- **Key UI Elements & Tosca Identifiers**:
  - Cart Table: `id="cart-table"`
  - Quantity Input: `id="cart-quantity-{id}"`, `data-testid="cart-quantity"`
  - Remove Button: `id="cart-remove-{id}"`, `data-testid="cart-remove"`
  - Subtotal Display: `id="cart-subtotal"`, `data-testid="cart-subtotal"`
  - Final Total Display: `id="cart-total"`, `data-testid="cart-total"`
  - Coupon Input: `id="coupon-code"`, `data-testid="coupon-code"`
  - Apply Coupon Button: `id="apply-coupon"`, `data-testid="apply-coupon"`
  - Checkout Proceed Button: `id="checkout-button"`, `data-testid="checkout-button"`

---

### Module 9: Simulated Prescription Upload
- **Objective**: Simulates the clinical validation required for controlled drugs by allowing patients to upload digital prescriptions (`.pdf`, `.jpg`, `.png`, $\le 5\text{MB}$) and tracking verification status (`Pending`, `Approved`, `Rejected`).
- **Key UI Elements & Tosca Identifiers**:
  - File Input: `id="prescription-file"`, `data-testid="prescription-file"`
  - Notes Input: `id="prescription-notes"`, `data-testid="prescription-notes"`
  - Upload Button: `id="prescription-upload-button"`, `data-testid="prescription-upload-button"`
  - Error Container: `id="prescription-error"`, `data-testid="prescription-error"`
  - Success Container: `id="prescription-success"`, `data-testid="prescription-success"`
  - Status Badges: `id="prescription-status-badge-{id}"`

---

### Module 10: Patient Checkout
- **Objective**: Collects recipient shipping details, verifies phone formatting, applies the automated discount algorithm, and processes the order via simulated Cash on Delivery.
- **Key UI Elements & Tosca Identifiers**:
  - Delivery Address: `id="delivery-address"`, `data-testid="delivery-address"`
  - Delivery Phone: `id="delivery-phone"`, `data-testid="delivery-phone"`
  - Payment Method: `id="payment-method"`, `data-testid="payment-method"`
  - Place Order Button: `id="place-order"`, `data-testid="place-order"`
  - Checkout Error Container: `id="checkout-error"`, `data-testid="checkout-error"`

---

### Module 11: Order Management & Confirmation
- **Objective**: Confirms order completion with an immutable unique Order ID (`MED-ORD-XXXX`), records transaction items in SQLite, deducts stock, and displays full order status lifecycle (`Placed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
- **Key UI Elements & Tosca Identifiers**:
  - Confirmation Card: `id="order-confirmation"`, `data-testid="order-confirmation"`
  - Order ID Display: `id="order-id"`, `data-testid="order-id"`
  - Order Status Display: `id="order-status"`, `data-testid="order-status"`
  - Historical Table: `id="order-history-table"`

---

### Module 12: Admin Dashboard & Inventory Steering
- **Objective**: Empowers clinical administrators to oversee registered patients, monitor gross pharmacy revenues, manage inventory (add, edit, delete drugs), review prescription uploads, and update order dispatch states.
- **Key UI Elements & Tosca Identifiers**:
  - Admin Email & Pass: `id="admin-email"`, `id="admin-password"`
  - Admin Login Trigger: `id="admin-login-button"`
  - Add Medicine Section: `id="add-medicine"`, `data-testid="add-medicine"`
  - Add Medicine Form: `id="admin-add-med-form"`
  - Orders Table: `id="admin-orders-table"`
  - Update Order Status Select & Button: `id="order-status-select-{orderId}"`, `id="update-order-status-{orderId}"`, `data-testid="update-order-status"`

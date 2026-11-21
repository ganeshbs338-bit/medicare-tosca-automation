# MediCare: Healthcare & Online Pharmacy
## Course: Software Testing & Quality Assurance (STQA)
### Tricentis Tosca Automation Test Scenarios (TC01 – TC20)

---

## Overview

This specification establishes the twenty end-to-end automation test scenarios designed for **Tricentis Tosca**. Each test case incorporates technical steering attributes, precise **ActionModes** (`Input`, `Verify`, `Buffer`, `WaitOn`), and verified assertions.

*Status Legend: [Planned for Execution upon Tosca Setup]*

---

### TC01: Verify Patient Registration with Valid Details
- **Test Case ID**: `TC01`
- **Test Case Name**: Verify Patient Registration with Valid Details
- **Test Objective**: Validate that a new patient can register successfully when providing valid demographic inputs adhering to all ECP and BVA specifications.
- **Preconditions**: MediCare application is accessible at `http://localhost:5000`. User is on the Registration view.
- **Test Data**:
  - Full Name: `"Kiran Kumar"`
  - Email: `"kiran.kumar{RND[100,999]}@example.com"`
  - Phone: `"9876501234"`
  - Age: `29`
  - Password: `"Kiran@2026!"`
  - Confirm Password: `"Kiran@2026!"`
- **Tosca Module Required**: `MOD_02_Registration`
- **Test Steps**:
  1. Open MediCare Registration URL.
  2. Input valid demographic values into form controls.
  3. Click `#registration-submit`.
  4. Verify redirect or success notification.
- **TestStepValues**:
  - `registration-name`: `"Kiran Kumar"` | `ActionMode: Input`
  - `registration-email`: `"kiran.kumar{RND[100,999]}@example.com"` | `ActionMode: Input`
  - `registration-phone`: `"9876501234"` | `ActionMode: Input`
  - `registration-age`: `"29"` | `ActionMode: Input`
  - `registration-password`: `"Kiran@2026!"` | `ActionMode: Input`
  - `registration-confirm-password`: `"Kiran@2026!"` | `ActionMode: Input`
  - `registration-submit`: `x` | `ActionMode: Input`
  - `registration-error`: `""` | `ActionMode: Verify` (Check not visible / empty)
- **Expected Result**: System displays success notification: *"Account created successfully! Please login."* and redirects to login view.
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

---

### TC02: Verify Registration with Invalid Email
- **Test Case ID**: `TC02`
- **Test Case Name**: Verify Registration with Invalid Email
- **Test Objective**: Verify that registration is rejected with an appropriate error message when the email lacks standard RFC formatting (missing `@` and domain).
- **Preconditions**: User is on the Registration view.
- **Test Data**:
  - Full Name: `"Vikram Singh"`
  - Email: `"vikram.singh.medicare"` (Invalid ECP partition)
  - Phone: `"9876543210"`
  - Age: `30`
  - Password: `"Vikram@123"`
  - Confirm Password: `"Vikram@123"`
- **Tosca Module Required**: `MOD_02_Registration`
- **Test Steps**:
  1. Input demographic details with malformed email.
  2. Click `#registration-submit`.
  3. Verify error container `#registration-error`.
- **TestStepValues**:
  - `registration-name`: `"Vikram Singh"` | `ActionMode: Input`
  - `registration-email`: `"vikram.singh.medicare"` | `ActionMode: Input`
  - `registration-phone`: `"9876543210"` | `ActionMode: Input`
  - `registration-age`: `"30"` | `ActionMode: Input`
  - `registration-password`: `"Vikram@123"` | `ActionMode: Input`
  - `registration-confirm-password`: `"Vikram@123"` | `ActionMode: Input`
  - `registration-submit`: `x` | `ActionMode: Input`
  - `registration-error`: `"Please enter a valid email address."` | `ActionMode: Verify`
- **Expected Result**: Submission blocked. Container `#registration-error` displays: *"Please enter a valid email address."*
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

---

### TC03: Verify Registration with Age Below the Minimum Bound
- **Test Case ID**: `TC03`
- **Test Case Name**: Verify Registration with Age Below the Minimum Bound
- **Test Objective**: Verify that patient registration is rejected when age is set to 17 ($\text{Min}-1$ boundary value).
- **Preconditions**: User is on the Registration view.
- **Test Data**:
  - Full Name: `"Minor Patient"`
  - Email: `"minor.test@example.com"`
  - Phone: `"9876543210"`
  - Age: `17` (BVA $\text{Min}-1$ vector)
  - Password: `"Patient@123"`
  - Confirm Password: `"Patient@123"`
- **Tosca Module Required**: `MOD_02_Registration`
- **Test Steps**:
  1. Input registration details with `Age = 17`.
  2. Click `#registration-submit`.
  3. Verify validation error message in `#registration-error`.
- **TestStepValues**:
  - `registration-age`: `"17"` | `ActionMode: Input`
  - `registration-submit`: `x` | `ActionMode: Input`
  - `registration-error`: `"Age must be between 18 and 100 years."` | `ActionMode: Verify`
- **Expected Result**: System rejects registration and displays: *"Age must be between 18 and 100 years."*
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

---

### TC04: Verify Registration with Age Above the Maximum Bound
- **Test Case ID**: `TC04`
- **Test Case Name**: Verify Registration with Age Above the Maximum Bound
- **Test Objective**: Verify that patient registration is rejected when age is set to 101 ($\text{Max}+1$ boundary value).
- **Preconditions**: User is on the Registration view.
- **Test Data**:
  - Full Name: `"Super Centenarian"`
  - Email: `"centenarian@example.com"`
  - Phone: `"9876543210"`
  - Age: `101` (BVA $\text{Max}+1$ vector)
  - Password: `"Patient@123"`
  - Confirm Password: `"Patient@123"`
- **Tosca Module Required**: `MOD_02_Registration`
- **Test Steps**:
  1. Input registration details with `Age = 101`.
  2. Click `#registration-submit`.
  3. Verify validation error message in `#registration-error`.
- **TestStepValues**:
  - `registration-age`: `"101"` | `ActionMode: Input`
  - `registration-submit`: `x` | `ActionMode: Input`
  - `registration-error`: `"Age must be between 18 and 100 years."` | `ActionMode: Verify`
- **Expected Result**: System rejects registration and displays: *"Age must be between 18 and 100 years."*
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

---

### TC05: Verify Successful Patient Login
- **Test Case ID**: `TC05`
- **Test Case Name**: Verify Successful Patient Login
- **Test Objective**: Validate that an active patient can log in with valid credentials and is redirected to their Dashboard.
- **Preconditions**: User is on the Login view (`MOD_01_Login`).
- **Test Data**:
  - Email: `"patient@medicare.com"`
  - Password: `"Patient@123"`
- **Tosca Module Required**: `MOD_01_Login`, `MOD_04_PatientDashboard`
- **Test Steps**:
  1. Enter email and password.
  2. Click `#login-button`.
  3. Wait on dashboard load and verify logout button presence.
- **TestStepValues**:
  - `login-email`: `"patient@medicare.com"` | `ActionMode: Input`
  - `login-password`: `"Patient@123"` | `ActionMode: Input`
  - `login-button`: `x` | `ActionMode: Input`
  - `logout-button`: `""` | `ActionMode: WaitOn` (Exists == True)
  - `order-history`: `"Order History"` | `ActionMode: Verify`
- **Expected Result**: User successfully authenticated and redirected to Patient Dashboard; `#logout-button` is visible.
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

---

### TC06: Verify Invalid Login Credentials
- **Test Case ID**: `TC06`
- **Test Case Name**: Verify Invalid Login Credentials
- **Test Objective**: Validate that authentication fails with an explicit error message when supplied with incorrect password credentials.
- **Preconditions**: User is on the Login view.
- **Test Data**:
  - Email: `"patient@medicare.com"`
  - Password: `"WrongPassword#999"`
- **Tosca Module Required**: `MOD_01_Login`
- **Test Steps**:
  1. Enter valid email and incorrect password.
  2. Click `#login-button`.
  3. Verify `#login-error` contains expected error message.
- **TestStepValues**:
  - `login-email`: `"patient@medicare.com"` | `ActionMode: Input`
  - `login-password`: `"WrongPassword#999"` | `ActionMode: Input`
  - `login-button`: `x` | `ActionMode: Input`
  - `login-error`: `"Invalid email or password. Please verify your credentials."` | `ActionMode: Verify`
- **Expected Result**: Access denied. Container `#login-error` renders: *"Invalid email or password. Please verify your credentials."*
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

---

### TC07: Verify Medicine Search by Name
- **Test Case ID**: `TC07`
- **Test Case Name**: Verify Medicine Search by Name
- **Test Objective**: Verify that typing a search query dynamically filters the medicine catalogue to matching items.
- **Preconditions**: User is on the Medicine Catalogue view.
- **Test Data**:
  - Search Query: `"Paracetamol"`
- **Tosca Module Required**: `MOD_03_Catalogue`
- **Test Steps**:
  1. Enter `"Paracetamol"` in `#medicine-search`.
  2. Trigger search.
  3. Verify that medicine card containing `"Paracetamol 650mg"` is displayed.
- **TestStepValues**:
  - `medicine-search`: `"Paracetamol"` | `ActionMode: Input`
  - `medicine-card-1`: `""` | `ActionMode: Verify` (Exists == True)
- **Expected Result**: The catalogue filters dynamically to display Paracetamol 650mg.
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

---

### TC08: Verify Medicine Category Filtering
- **Test Case ID**: `TC08`
- **Test Case Name**: Verify Medicine Category Filtering
- **Test Objective**: Verify that selecting a therapeutic category dropdown filters medicines strictly to that category.
- **Preconditions**: User is on the Medicine Catalogue view.
- **Test Data**:
  - Category Selection: `"Cardiac Care"`
- **Tosca Module Required**: `MOD_03_Catalogue`
- **Test Steps**:
  1. Select `"Cardiac Care"` from `#medicine-category`.
  2. Verify that displayed medicines belong to Cardiac Care (e.g., Atorvastatin, Losartan).
- **TestStepValues**:
  - `medicine-category`: `"Cardiac Care"` | `ActionMode: Input`
  - `medicine-card-3`: `""` | `ActionMode: Verify` (Atorvastatin visible)
  - `medicine-card-10`: `""` | `ActionMode: Verify` (Losartan visible)
- **Expected Result**: Catalogue updates to show only cardiac medications.
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

---

### TC09: Verify Medicine Clinical Details Display
- **Test Case ID**: `TC09`
- **Test Case Name**: Verify Medicine Clinical Details Display
- **Test Objective**: Verify that clicking *Details* opens the expanded clinical view with indications, dosage, manufacturer, and pricing.
- **Preconditions**: User is on the Medicine Catalogue view.
- **Test Data**:
  - Target Medicine: Medicine ID `1` (Paracetamol 650mg)
- **Tosca Module Required**: `MOD_03_Catalogue`, `MOD_04_MedicineDetails`
- **Test Steps**:
  1. Click `#medicine-details-1`.
  2. Verify details container `#medicine-details` displays clinical information.
- **TestStepValues**:
  - `medicine-details-1`: `x` | `ActionMode: Input`
  - `medicine-details`: `""` | `ActionMode: WaitOn` (Exists == True)
  - `add-to-cart`: `""` | `ActionMode: Verify` (Enabled == True)
- **Expected Result**: Expanded clinical details screen renders dosage guidelines, stock levels, and active *Add to Cart* button.
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

---

### TC10: Verify Adding Medicine to Shopping Cart
- **Test Case ID**: `TC10`
- **Test Case Name**: Verify Adding Medicine to Shopping Cart
- **Test Objective**: Validate that clicking *Add to Cart* increments the navigation cart counter and adds the item to the user's cart.
- **Preconditions**: User is on the Medicine Catalogue view. Cart is empty.
- **Test Data**:
  - Medicine ID: `1` (Paracetamol 650mg)
- **Tosca Module Required**: `MOD_03_Catalogue`
- **Test Steps**:
  1. Click `#add-to-cart-1`.
  2. Verify navigation badge `#nav-cart-count` updates to `1`.
- **TestStepValues**:
  - `add-to-cart-1`: `x` | `ActionMode: Input`
  - `nav-cart-count`: `"1"` | `ActionMode: Verify`
- **Expected Result**: Toast confirms addition and `#nav-cart-count` displays `1`.
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

---

### TC11: Verify Updating Cart Item Quantity
- **Test Case ID**: `TC11`
- **Test Case Name**: Verify Updating Cart Item Quantity
- **Test Objective**: Validate that updating item quantity recalculates item subtotal and overall cart total.
- **Preconditions**: Item ID `1` is present in Shopping Cart with quantity `1`.
- **Test Data**:
  - Quantity Increment: Click `+` to change quantity to `3`.
- **Tosca Module Required**: `MOD_05_ShoppingCart`
- **Test Steps**:
  1. Open Cart view.
  2. Increment item quantity to `3`.
  3. Verify recalculated subtotal (`3 * ₹35.00 = ₹105.00`).
- **TestStepValues**:
  - `cart-quantity-1`: `"3"` | `ActionMode: Verify`
  - `cart-subtotal`: `"₹105.00"` | `ActionMode: Verify`
- **Expected Result**: Quantity reflects `3` and `#cart-subtotal` displays `₹105.00`.
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

---

### TC12: Verify Removing Medicine from Cart
- **Test Case ID**: `TC12`
- **Test Case Name**: Verify Removing Medicine from Cart
- **Test Objective**: Validate that clicking *Remove* deletes the medicine from the shopping cart and updates cart metrics.
- **Preconditions**: Item ID `1` is present in Shopping Cart.
- **Test Data**:
  - Target Item: `cart-remove-1`
- **Tosca Module Required**: `MOD_05_ShoppingCart`
- **Test Steps**:
  1. Click `#cart-remove-1`.
  2. Verify cart displays empty cart notification.
- **TestStepValues**:
  - `cart-remove-1`: `x` | `ActionMode: Input`
  - `cart-table`: `""` | `ActionMode: Verify` (Does not exist)
- **Expected Result**: Item deleted. UI displays: *"Your Cart is Currently Empty"*.
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

---

### TC13: Verify Checkout with Valid Delivery Information
- **Test Case ID**: `TC13`
- **Test Case Name**: Verify Checkout with Valid Delivery Information
- **Test Objective**: Validate that complete shipping address and valid 10-digit phone number are accepted during checkout.
- **Preconditions**: User has items in cart and is on Checkout view.
- **Test Data**:
  - Delivery Address: `"Flat 402, Green Glen Layout, Bellandur, Bengaluru - 560103"`
  - Phone: `"9876543210"`
- **Tosca Module Required**: `MOD_06_Checkout`
- **Test Steps**:
  1. Enter address and phone.
  2. Select payment method *"Cash on Delivery"*.
  3. Verify form validation passes.
- **TestStepValues**:
  - `delivery-address`: `"Flat 402, Green Glen Layout, Bellandur, Bengaluru - 560103"` | `ActionMode: Input`
  - `delivery-phone`: `"9876543210"` | `ActionMode: Input`
  - `checkout-error`: `""` | `ActionMode: Verify` (Hidden)
- **Expected Result**: Form inputs accepted with zero validation errors.
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

---

### TC14: Verify Checkout with Invalid Delivery Information
- **Test Case ID**: `TC14`
- **Test Case Name**: Verify Checkout with Invalid Delivery Information
- **Test Objective**: Verify that checkout submission is blocked when address is truncated ($< 10$ characters) or phone is non-10-digit.
- **Preconditions**: User is on Checkout view.
- **Test Data**:
  - Delivery Address: `"Road"` (Truncated $< 10$ characters)
  - Phone: `"12345"` (Invalid non-10-digit phone)
- **Tosca Module Required**: `MOD_06_Checkout`
- **Test Steps**:
  1. Enter truncated address.
  2. Click `#place-order`.
  3. Verify error displayed in `#checkout-error`.
- **TestStepValues**:
  - `delivery-address`: `"Road"` | `ActionMode: Input`
  - `delivery-phone`: `"12345"` | `ActionMode: Input`
  - `place-order`: `x` | `ActionMode: Input`
  - `checkout-error`: `"Please enter a valid, complete delivery address (min 10 characters)."` | `ActionMode: Verify`
- **Expected Result**: Order blocked. Container `#checkout-error` displays validation error message.
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

---

### TC15: Verify Successful Order Placement (Cash on Delivery)
- **Test Case ID**: `TC15`
- **Test Case Name**: Verify Successful Order Placement (Cash on Delivery)
- **Test Objective**: Validate end-to-end checkout execution, order persistence, cart clearance, and redirection to Order Confirmation.
- **Preconditions**: Patient is logged in; cart contains at least 1 item; valid shipping details entered.
- **Test Data**:
  - Address: `"House #12, 5th Cross, Indiranagar, Bengaluru - 560038"`
  - Phone: `"9823456781"`
- **Tosca Module Required**: `MOD_06_Checkout`, `MOD_07_OrderConfirmation`
- **Test Steps**:
  1. Click `#place-order`.
  2. Wait on confirmation screen.
  3. Verify confirmation banner.
- **TestStepValues**:
  - `place-order`: `x` | `ActionMode: Input`
  - `order-confirmation`: `""` | `ActionMode: WaitOn` (Exists == True)
  - `order-status`: `"Placed"` | `ActionMode: Verify`
- **Expected Result**: Order processed successfully; order status reflects *"Placed"*; shopping cart cleared.
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

---

### TC16: Verify Order Confirmation and Unique Order ID Generation
- **Test Case ID**: `TC16`
- **Test Case Name**: Verify Order Confirmation and Unique Order ID Generation
- **Test Objective**: Verify that a unique Order ID (`MED-ORD-XXXX`) is generated and buffered in Tosca runtime memory.
- **Preconditions**: Order placed in TC15; user is on Order Confirmation screen.
- **Test Data**:
  - Dynamic Buffer Variable: `{B[GeneratedOrderID]}`
- **Tosca Module Required**: `MOD_07_OrderConfirmation`
- **Test Steps**:
  1. Inspect element `#order-id`.
  2. Buffer the generated Order ID text.
  3. Verify pattern matches `MED-ORD-`.
- **TestStepValues**:
  - `order-id`: `-> {B[GeneratedOrderID]}` | `ActionMode: Buffer`
  - `order-id`: `"MED-ORD-*"` | `ActionMode: Verify`
- **Expected Result**: Unique Order ID captured into Tosca Buffer `{B[GeneratedOrderID]}` matching the regex pattern.
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

---

### TC17: Verify Order History in Patient Dashboard
- **Test Case ID**: `TC17`
- **Test Case Name**: Verify Order History in Patient Dashboard
- **Test Objective**: Validate that the placed order appears in the patient's Order History table with correct ID and status.
- **Preconditions**: User is logged in as `patient@medicare.com`; Order ID buffered in `{B[GeneratedOrderID]}`.
- **Test Data**:
  - Target Order ID: `{B[GeneratedOrderID]}`
- **Tosca Module Required**: `MOD_04_PatientDashboard`
- **Test Steps**:
  1. Navigate to Patient Dashboard (`#order-history`).
  2. Verify table `#order-history-table` contains buffered Order ID row.
- **TestStepValues**:
  - `order-history-table`: `Row with Cell "{B[GeneratedOrderID]}" exists` | `ActionMode: Verify`
- **Expected Result**: Placed order is listed in the historical records table.
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

---

### TC18: Verify Simulated Prescription File Validation
- **Test Case ID**: `TC18`
- **Test Case Name**: Verify Simulated Prescription File Validation
- **Test Objective**: Verify that invalid file types (e.g., `.exe`, `.txt`) are rejected and valid files (`.pdf`) receive `Pending` status.
- **Preconditions**: User is on the Prescription Upload view.
- **Test Data**:
  - File: `"prescription_sample.pdf"` (Valid PDF)
  - Notes: `"Quarterly prescription for cardiology consultation"`
- **Tosca Module Required**: `MOD_09_PrescriptionUpload`
- **Test Steps**:
  1. Select valid file.
  2. Click `#prescription-upload-button`.
  3. Verify success message and `Pending` status.
- **TestStepValues**:
  - `prescription-file`: `"C:\TestData\prescription_sample.pdf"` | `ActionMode: Input`
  - `prescription-notes`: `"Quarterly prescription for cardiology consultation"` | `ActionMode: Input`
  - `prescription-upload-button`: `x` | `ActionMode: Input`
  - `prescription-success`: `"Prescription \"prescription_sample.pdf\" uploaded successfully! Status: PENDING clinical verification."` | `ActionMode: Verify`
- **Expected Result**: Prescription upload accepted and queued with status `Pending`.
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

---

### TC19: Verify Administrator Adding a New Medicine
- **Test Case ID**: `TC19`
- **Test Case Name**: Verify Administrator Adding a New Medicine
- **Test Objective**: Validate that an administrator can add a new medicine to the catalogue through the Admin Portal.
- **Preconditions**: Logged in as `admin@medicare.com`; on Admin Dashboard.
- **Test Data**:
  - Name: `"Dolo 650mg"`
  - Category: `"Pain Relief"`
  - Price: `32.00`
  - Stock: `150`
  - Description: `"Paracetamol 650mg tablets for fever and mild arthritis"`
- **Tosca Module Required**: `MOD_08_AdminDashboard`
- **Test Steps**:
  1. Complete Add Medicine form controls.
  2. Submit form.
  3. Verify success notification.
- **TestStepValues**:
  - `admin-med-name`: `"Dolo 650mg"` | `ActionMode: Input`
  - `admin-med-category`: `"Pain Relief"` | `ActionMode: Input`
  - `admin-med-price`: `"32.00"` | `ActionMode: Input`
  - `admin-med-stock`: `"150"` | `ActionMode: Input`
  - `admin-med-desc`: `"Paracetamol 650mg tablets for fever"` | `ActionMode: Input`
- **Expected Result**: System confirms addition and appends medicine to inventory catalogue.
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

---

### TC20: Verify Administrator Updating Order Status
- **Test Case ID**: `TC20`
- **Test Case Name**: Verify Administrator Updating Order Status
- **Test Objective**: Validate that an administrator can transition an order's status from `Placed` to `Shipped` or `Delivered`.
- **Preconditions**: Logged in as `admin@medicare.com`; Order ID buffered in `{B[GeneratedOrderID]}`.
- **Test Data**:
  - New Status: `"Shipped"`
- **Tosca Module Required**: `MOD_08_AdminDashboard`
- **Test Steps**:
  1. Locate order row in `#admin-orders-table`.
  2. Select status `"Shipped"`.
  3. Click `#update-order-status`.
  4. Verify updated status badge reflects `Shipped`.
- **TestStepValues**:
  - `order-status-select`: `"Shipped"` | `ActionMode: Input`
  - `update-order-status`: `x` | `ActionMode: Input`
  - `order-status-badge`: `"Shipped"` | `ActionMode: Verify`
- **Expected Result**: Order status successfully updated to `Shipped` in SQLite database and UI table.
- **Actual Result**: `[Pending Execution in Tosca Commander]`
- **Status (Pass/Fail)**: `[PLANNED]`

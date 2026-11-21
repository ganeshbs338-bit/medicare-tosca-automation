# MediCare: Healthcare & Online Pharmacy
## End-to-End Web Application Automation Using Tricentis Tosca
### Course: Software Testing & Quality Assurance (STQA) – College Mini-Project

---

## 1. Project Overview

**MediCare** is an enterprise-grade, realistic Healthcare & Online Pharmacy web application engineered from the ground up to serve as a high-fidelity automation testing target for **Tricentis Tosca**. Built with a testability-first architectural philosophy, every screen, form control, dynamic notification, and data grid across its twelve modules is equipped with static, collision-free HTML identifiers (`id` and `data-testid`), eliminating dynamic DOM fragility during **Tosca XScan** ingestion.

Departing from traditional script-based automation frameworks (such as Selenium WebDriver, JUnit, Cypress, or Playwright), this project strictly enforces **Tricentis Tosca** as the primary automation engine, exploiting its **Model-Based Test Automation (MBTA)** architecture to deliver non-fragile, low-maintenance test execution.

---

## 2. Technology Stack

- **Frontend**:
  - React.js 18 (Single-Page Application architecture)
  - Tailwind CSS & Custom Healthcare Design System (White, Medical Blue `#0284c7`, Teal `#0d9488`)
  - Responsive layout optimized for desktop and mobile viewports
  - Vector SVG pharmaceutical assets for 100% offline rendering
- **Backend**:
  - Node.js & Express.js REST APIs (`server.js`)
  - Standalone Zero-Dependency Python 3.10 Engine (`server.py`) for instant execution on low-bandwidth workstations
  - RESTful API endpoints for Authentication, Medicines, Orders, Prescriptions, and Admin Statistics
- **Database**:
  - SQLite 3 (`medicare.db`) relational database with seeded formularies, patient profiles, and order records
- **Automation & QA**:
  - **Tricentis Tosca**: Tosca Commander, Tosca XScan, Modules, TestCases, ExecutionLists
  - **Black-Box Testing**: Formal Equivalence Class Partitioning (ECP) & 7-Point Boundary Value Analysis (BVA)
  - **White-Box Testing**: Control Flow Graph (CFG), Cyclomatic Complexity ($V(G) = 5$), Basis Path Testing (100% verified via automated test harness)

---

## 3. Project Directory Structure

```text
medicare-tosca-automation/
├── package.json                          # Node.js project manifest & npm scripts
├── server.js                             # Express.js + SQLite REST API backend
├── server.py                             # Zero-dependency Python 3.10 standalone server
├── start_medicare.bat                    # One-click Windows launcher (starts server & opens browser)
├── database/
│   ├── init_db.py                        # Python SQLite database initializer & seed script
│   ├── init_db.js                        # Node.js SQLite database initializer
│   ├── generate_svgs.py                  # Generator script for medical SVG vector graphics
│   └── medicare.db                       # Pre-seeded SQLite database file
├── public/
│   ├── index.html                        # Main HTML5 entry point with Tosca selectors
│   ├── app.js                            # Interactive client-side application logic (all 12 modules)
│   ├── styles.css                        # Healthcare UI styling system (Tailwind + Custom)
│   └── assets/                           # 17 vector SVG medical illustrations (Paracetamol, Amoxicillin, etc.)
├── white_box_testing/
│   ├── discount_calculator.js            # JavaScript implementation of checkout discount engine
│   ├── discount_calculator.py            # Python implementation of checkout discount engine
│   ├── test_discount_calculator.py       # Automated unit tests covering all 5 independent basis paths
├── docs/                                 # Complete STQA Academic Documentation Suite (18 files)
│   ├── README.md                         # Documentation index
│   ├── PROJECT_ABSTRACT.md               # Academic project abstract
│   ├── INTRODUCTION.md                   # Detailed introduction & Model-Based vs Script-Based comparison
│   ├── PROBLEM_STATEMENT.md              # Domain risks and QA bottlenecks addressed
│   ├── PROJECT_OBJECTIVES.md             # Primary and secondary technical/testing objectives
│   ├── SOFTWARE_REQUIREMENTS.md          # Comprehensive Software Requirements Specification (SRS)
│   ├── SYSTEM_ARCHITECTURE.md            # Multi-tier application & Tosca MBTA architecture diagrams
│   ├── MODULE_DESCRIPTIONS.md            # Exhaustive descriptions & Tosca selector catalog for 12 modules
│   ├── ECP_ANALYSIS.md                   # Formal Equivalence Class Partitioning analysis tables
│   ├── BVA_ANALYSIS.md                   # Complete 7-point Boundary Value Analysis matrices
│   ├── CONTROL_FLOW_GRAPH.md             # White-box CFG analysis with numbered nodes and Mermaid diagram
│   ├── CYCLOMATIC_COMPLEXITY.md          # Step-by-step mathematical derivation of V(G) = 5 via 3 methods
│   ├── BASIS_PATH_TESTING.md             # The 5 independent basis paths, unit test harness & execution report
│   ├── TOSCA_AUTOMATION_GUIDE.md         # Step-by-step instructions for Tosca Commander & XScan execution
│   ├── TOSCA_TEST_CASES.md               # 20 detailed Tosca automation test scenarios (TC01 to TC20)
│   ├── TEST_EXECUTION_REPORT.md          # Test execution summary, quality metrics & evidence guidelines
│   ├── STUDENT_ROLE_DISTRIBUTION.md      # Pair work division (Student A vs Student B) & RACI matrix
│   ├── CONCLUSION.md                     # Academic conclusion, key learnings & future roadmap
│   └── PRESENTATION_SLIDES.md            # 11-slide PowerPoint presentation with full speaker notes
```

---

## 4. Quick Start & Execution Instructions

### Option 1: One-Click Windows Launcher (Recommended)
Simply double-click:
```cmd
start_medicare.bat
```
This batch script automatically detects whether Node.js or Python 3.10 is available, verifies the SQLite database, launches the server on port 5000, and opens `http://localhost:5000` in your default web browser.

### Option 2: Running via Python 3.10 (Zero npm dependencies required)
```powershell
cd medicare-tosca-automation
python server.py
```
Open your browser and navigate to: **`http://localhost:5000`**

### Option 3: Running via Node.js / Express
```powershell
cd medicare-tosca-automation
npm install
npm run dev
```

---

## 5. Demo Login Credentials

The application is pre-seeded with designated credentials for testing all authorization tiers:

| Role | Email Address | Password | Pre-fill Button in UI | Primary Capabilities |
| :--- | :--- | :--- | :---: | :--- |
| **Patient** | `patient@medicare.com` | `Patient@123` | ✅ Available | Order medicines, upload Rx, view personal order history |
| **Admin** | `admin@medicare.com` | `Admin@123` | ✅ Available | Manage inventory (CRUD), update order states, review Rx |

---

## 6. Application Modules Summary (12 Modules)

1. **Homepage**: Navigation bar, medical hero banner, category shortcuts, healthcare services overview.
2. **Patient Registration**: Demographic intake with validation: Name, Email, 10-digit Phone, Age ($[18, 100]$), Password ($[8, 20]$ chars), and Confirm Password match (`#registration-*`).
3. **Patient & Admin Login**: Credential authentication, invalid credentials rejection, role redirection (`#login-*`).
4. **Patient Dashboard**: Profile statistics, total orders placed, prescription status summaries, order history (`#order-history`).
5. **Pharmaceutical Catalogue**: 16 formulary medicines with indications, dosage, pricing, stock, and prescription badges (`Rx Required` vs. `OTC Safe`).
6. **Medicine Search & Filter**: Real-time substring search (`#medicine-search`), category dropdown (`#medicine-category`), sorting, and `#no-results-message`.
7. **Medicine Clinical Details**: Monograph inspection view with dosage guidelines, manufacturer information, and instant `#add-to-cart`.
8. **Shopping Cart**: Item staging, quantity adjustment strictly bounded within $[1, 10]$ units (`#cart-quantity`), stock guard, and discount preview.
9. **Simulated Prescription Upload**: Accepts `.pdf`, `.jpg`, `.png` files ($\le 5\text{MB}$), assigning initial `Pending` status (`#prescription-*`).
10. **Checkout**: Recipient address validation ($\ge 10$ chars), phone verification, simulated Cash on Delivery, promotional coupon `MEDICARE5` (`#checkout-*`).
11. **Order Management**: Unique Order ID generation (`MED-ORD-XXXX`), stock deduction, status tracking (`Placed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
12. **Admin Portal**: Inventory CRUD (Add, Edit, Delete drugs), prescription review, order status management (`#admin-*`).

---

## 7. Tricentis Tosca Automation Compatibility

All web elements are engineered for 100% deterministic recognition by **Tosca XScan**:

| Screen / Flow | Recommended Tosca Identifiers (`id` / `data-testid`) | Expected Tosca ActionMode |
| :--- | :--- | :---: |
| **Login** | `login-email`, `login-password`, `login-button`, `login-error` | `Input`, `Verify` |
| **Registration** | `registration-name`, `registration-email`, `registration-phone`, `registration-age`, `registration-password`, `registration-confirm-password`, `registration-submit`, `registration-error` | `Input`, `Verify` |
| **Catalogue & Search**| `medicine-search`, `medicine-category`, `medicine-sort`, `medicine-details`, `add-to-cart`, `no-results-message` | `Input`, `Verify` |
| **Shopping Cart** | `cart-table`, `cart-quantity`, `cart-remove`, `cart-subtotal`, `cart-total`, `coupon-code`, `apply-coupon`, `checkout-button` | `Input`, `Verify` |
| **Checkout** | `delivery-address`, `delivery-phone`, `payment-method`, `place-order`, `checkout-error` | `Input`, `Verify` |
| **Order Confirmation**| `order-confirmation`, `order-id`, `order-status`, `order-history` | `Verify`, `Buffer` |
| **Admin Portal** | `admin-email`, `admin-password`, `admin-login-button`, `add-medicine`, `admin-orders-table`, `update-order-status` | `Input`, `Verify` |

---

## 8. STQA Testing Analysis Summary

### Black-Box Testing (ECP & BVA)
- **Equivalence Class Partitioning (ECP)**: Formulated for Age ($[18, 100]$), Password Length ($[8, 20]$), Email syntax, and Cart Quantity ($[1, 10]$).
- **Boundary Value Analysis (BVA)**: Complete 7-point boundary vectors ($\text{Min}-1, \text{Min}, \text{Min}+1, \text{Nominal}, \text{Max}-1, \text{Max}, \text{Max}+1$) directly mapped to Tosca TestCases TC03, TC04, TC11, and TC14.

### White-Box Testing (Basis Path Analysis)
- **Component**: Checkout Discount Calculation Engine (`discount_calculator.js` / `.py`).
- **Control Flow Graph**: 15 Nodes, 17 Directed Edges, 4 Decision Predicates.
- **Cyclomatic Complexity**:
  $$\begin{aligned}
  V(G) &= E - N + 2P = 18 - 15 + 2(1) = \mathbf{5} \\
  V(G) &= P_n + 1 = 4 + 1 = \mathbf{5} \\
  V(G) &= \text{Regions} = 4 + 1 = \mathbf{5}
  \end{aligned}$$
- **Verification**: All 5 independent basis paths automated and verified via `unittest` (100% Pass Rate).

---

## 9. Academic Pair Work Allocation

- **Ganesh BS (USN: 20251LIE3003) — Application Developer & Tosca Automation Engineer**
  - Full-stack web application development (React/Express/Python/SQLite)
  - DOM testability architecture & static selector embedding (`id` and `data-testid`)
  - Tosca workspace configuration, XScan page scanning, Module creation, TestCase construction, and ExecutionLists.
- **Shiva kumar rathod (USN: 20251LIE3010) — Test Designer & QA Analyst**
  - ECP and BVA test design matrices across boundary inputs
  - Control Flow Graph construction and mathematical derivations of $V(G) = 5$
  - Basis path identification and unit test harness execution
  - Authoring comprehensive STQA academic documentation and analysis.

---

## 10. Master Document Index

All comprehensive documentation files are organized under the [`docs/`](docs/) directory:

1. [Academic Abstract](docs/PROJECT_ABSTRACT.md)
2. [Introduction & Testing Paradigms](docs/INTRODUCTION.md)
3. [Problem Statement](docs/PROBLEM_STATEMENT.md)
4. [Project Objectives](docs/PROJECT_OBJECTIVES.md)
5. [Software Requirements Specification (SRS)](docs/SOFTWARE_REQUIREMENTS.md)
6. [System & Automation Architecture](docs/SYSTEM_ARCHITECTURE.md)
7. [Module Descriptions & Tosca Identifier Catalog](docs/MODULE_DESCRIPTIONS.md)
8. [Equivalence Class Partitioning (ECP) Analysis](docs/ECP_ANALYSIS.md)
9. [Boundary Value Analysis (BVA) Analysis](docs/BVA_ANALYSIS.md)
10. [Control Flow Graph (CFG) Specification](docs/CONTROL_FLOW_GRAPH.md)
11. [Cyclomatic Complexity Mathematical Derivations](docs/CYCLOMATIC_COMPLEXITY.md)
12. [Basis Path Testing & Separation of Concerns](docs/BASIS_PATH_TESTING.md)
13. [Tricentis Tosca Automation Execution Guide](docs/TOSCA_AUTOMATION_GUIDE.md)
14. [Tricentis Tosca Test Scenarios (TC01 - TC20)](docs/TOSCA_TEST_CASES.md)
15. [Test Execution Status Report](docs/TEST_EXECUTION_REPORT.md)
16. [Student Role Distribution & RACI Matrix](docs/STUDENT_ROLE_DISTRIBUTION.md)
17. [Academic Conclusion & Future Roadmap](docs/CONCLUSION.md)
18. [PowerPoint Presentation Slides & Speaker Notes](docs/PRESENTATION_SLIDES.md)

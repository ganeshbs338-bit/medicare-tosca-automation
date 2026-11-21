# MediCare: Healthcare & Online Pharmacy
## Course: Software Testing & Quality Assurance (STQA)
### Software Requirements Specification (SRS)

---

## 1. Introduction

This Software Requirements Specification (SRS) establishes the complete functional and non-functional requirements for the **MediCare** web application. It specifies runtime constraints, interface dependencies, data persistence models, and test automation interfaces tailored for **Tricentis Tosca**.

---

## 2. Functional Requirements (FR)

| Req ID | Module | Functional Specification |
| :--- | :--- | :--- |
| **FR-01** | Homepage | The system shall render a clinical navigation bar, hero banner, search bar, medical category shortcuts, healthcare services overview, about section, and authentication triggers. |
| **FR-02** | Registration | The system shall accept patient registration including full name, email, 10-digit phone number, age ($[18, 100]$), and password ($[8, 20]$ characters) with confirm password match validation. |
| **FR-03** | Authentication | The system shall authenticate patients (`patient@medicare.com` / `Patient@123`) and administrators (`admin@medicare.com` / `Admin@123`), reject invalid credentials with specific error messages, and support secure session termination. |
| **FR-04** | Patient Dashboard | The system shall display patient profile details, total order counts, prescription submission metrics, and a historical table of placed orders. |
| **FR-05** | Catalogue | The system shall display an inventory of at least 12 pharmaceutical products (seeded with 16) displaying title, medical image, therapeutic category, pricing, stock count, dosage instructions, and prescription badge (`Rx Required` vs. `OTC Safe`). |
| **FR-06** | Search & Filtering | The system shall filter medicines dynamically by name substring, therapeutic category, and sort ordering (price low-to-high, high-to-low, name A-Z), rendering a designated `#no-results-message` container when no records match. |
| **FR-07** | Medicine Details | The system shall render an expanded clinical details view with manufacturer information, standard dosage guidelines, stock levels, and an immediate `Add to Cart` action button. |
| **FR-08** | Shopping Cart | The system shall manage cart additions, deletions, and quantity increments/decrements bounded strictly between 1 and 10 units, while preventing quantities from exceeding available inventory stock. |
| **FR-09** | Prescription Upload | The system shall provide a simulated prescription upload interface supporting `.pdf`, `.jpg`, and `.png` file formats with file size bounded at 5MB, assigning an initial status of `Pending`. |
| **FR-10** | Checkout | The system shall capture delivery address ($\ge 10$ characters), 10-digit contact phone, calculate order subtotal, apply white-box discount algorithms (10% volume discount for subtotal $\ge ₹1000$, 5% member loyalty, 5% promotional coupon `MEDICARE5`), and process orders via simulated Cash on Delivery. |
| **FR-11** | Order Tracking | Upon order submission, the system shall generate an immutable, unique Order ID (e.g., `MED-ORD-XXXX`), deduct inventory stock, clear the shopping cart, and record the transaction in the database. |
| **FR-12** | Admin Portal | The system shall provide administrators with platform metrics, pharmaceutical inventory CRUD (Create, Read, Update, Delete medicines), prescription approval/rejection steering, and order lifecycle management (`Placed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`). |

---

## 3. Non-Functional Requirements (NFR)

| Req ID | Dimension | Specification |
| :--- | :--- | :--- |
| **NFR-01** | **Testability (Tosca)** | Every input, button, table, error container, and status indicator must maintain a unique, static `id` and `data-testid` attribute to facilitate 100% deterministic recognition by **Tosca XScan**. |
| **NFR-02** | **Performance** | API endpoints must respond in $< 200\text{ ms}$ under local testing environments; client-side view switching must occur within $< 50\text{ ms}$. |
| **NFR-03** | **Security & Integrity** | All demographic inputs must undergo dual client-side and server-side validation. Passwords must never be exposed in API payloads or client storage unmasked. |
| **NFR-04** | **Usability & UX** | Clinical healthcare aesthetics utilizing white, medical blue (`#0284c7`), and teal (`#0d9488`) color palettes with responsive layouts for desktop and mobile viewports. |
| **NFR-05** | **Offline Capability** | The system must be fully runnable locally without external internet dependencies via a zero-dependency runtime engine (`server.py`) and embedded SVG pharmaceutical assets. |

---

## 4. Hardware and Software Specifications

### Development & Host Environment
- **Operating System**: Microsoft Windows 10 / Windows 11 (64-bit)
- **Processor**: Intel Core i3 / AMD Ryzen 3 or higher
- **Memory**: Minimum 4 GB RAM (8 GB recommended for running Tosca Commander concurrently)
- **Storage**: Minimum 2 GB free disk space

### Software Runtimes & Frameworks
- **Frontend**: React.js 18, Tailwind CSS utility architecture, HTML5, CSS3, JavaScript (ES6+)
- **Backend Primary**: Node.js v16+ / v18+ / v20+, Express.js v4.19, `sqlite3` v5.1
- **Backend Zero-Dependency Engine**: Python 3.10+ (Standard Library `http.server`, `sqlite3`, `json`, `urllib`)
- **Database Engine**: SQLite 3 (`medicare.db`)

### Automation Testing Platform
- **Primary Tool**: **Tricentis Tosca** (Tosca Commander 14.x / 15.x / 16.x / 2023.x)
- **Scan Engine**: **Tosca XScan** (HTML Engine 3.0 / Web Extension)
- **Target Browsers**: Google Chrome (v100+), Microsoft Edge (Chromium v100+) with Tricentis Automation Extension enabled
- **Unit Test Runner**: Python `unittest` framework (for White-Box Basis Path testing)

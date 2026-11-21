# MediCare: Healthcare & Online Pharmacy
## Course: Software Testing & Quality Assurance (STQA)
### Project Objectives

---

## 1. Primary Objective

The overarching objective of this project is to develop and thoroughly test a realistic, production-ready Healthcare & Online Pharmacy web application named **MediCare**, engineered from the ground up to serve as a high-fidelity automation target for **Tricentis Tosca**. The application must authenticate patients, catalogue essential pharmaceuticals, handle prescriptions, enforce stock rules, and manage checkout transactions while maintaining full compliance with enterprise Model-Based Test Automation (MBTA) standards.

---

## 2. Specific Technical & Development Objectives

1. **Full-Stack Application Development**:
   - Construct a modern, responsive Single-Page Application (SPA) using React.js, Tailwind CSS, HTML5, and CSS3.
   - Implement an enterprise REST API backend using Node.js/Express.js, complemented by a zero-dependency Python 3.10 runtime engine to guarantee instant offline execution on low-bandwidth workstations.
   - Establish a relational database using SQLite (`medicare.db`) seeded with authentic pharmaceutical formularies, patient profiles, and administrative records.

2. **End-to-End Simulation of Patient & Admin Lifecycles**:
   - Deliver all 12 core application modules:
     - Module 1: Medical Homepage & Navigation
     - Module 2: Patient Registration with Demographics Validation
     - Module 3: Secure Patient & Admin Authentication
     - Module 4: Patient Dashboard & Analytics
     - Module 5: Pharmaceutical Formulary (16+ Medicines across 8 Therapeutic Categories)
     - Module 6: Real-Time Medicine Search, Filtering, and Sorting
     - Module 7: Medicine Clinical Details View (Dosage, Indications, Rx badges)
     - Module 8: Shopping Cart with Quantity Bounds ($[1, 10]$) and Stock Guard
     - Module 9: Simulated Doctor Prescription Upload & Verification
     - Module 10: Checkout with Automated Discount Computation
     - Module 11: Real-Time Order Management and Confirmation
     - Module 12: Comprehensive Admin Dashboard (Inventory CRUD & Order Steering)

3. **Tricentis Tosca Compatibility Engineering**:
   - Architect deterministic, collision-free HTML element identifiers (`id` and `data-testid`) for all input fields, buttons, tables, status indicators, and error containers.
   - Eliminate dynamic DOM volatility and unstable XPaths, enabling **Tosca XScan** to identify, parameterize, and map web elements into reusable **Modules** with zero locator ambiguity.

---

## 3. Specific Quality Assurance & Testing Objectives

1. **Formal Black-Box Test Design**:
   - Conduct **Equivalence Class Partitioning (ECP)** for core demographic and transactional inputs: Age ($[18, 100]$), Password Length ($[8, 20]$), RFC-compliant Email format, and Shopping Cart Quantity ($[1, 10]$).
   - Conduct **Boundary Value Analysis (BVA)** utilizing 7-point testing vectors ($\text{Min}-1, \text{Min}, \text{Min}+1, \text{Nominal}, \text{Max}-1, \text{Max}, \text{Max}+1$) to identify edge-case defects.

2. **Rigorous White-Box Testing**:
   - Isolate the business-critical checkout discount calculation algorithm into dedicated, verifiable source components.
   - Construct a formal **Control Flow Graph (CFG)** with numbered nodes, directed edges, decision predicates, and entry/exit nodes.
   - Calculate **Cyclomatic Complexity $V(G)$** via three independent mathematical methods ($E - N + 2P$, $P + 1$, and Region counting), proving $V(G) = 5$.
   - Identify all five linearly independent basis paths and automate their verification using an automated unit test harness.

3. **End-to-End Automation Scenario Suite**:
   - Define twenty comprehensive end-to-end automation test scenarios (TC01 to TC20) covering positive, negative, boundary, and administrative workflows.
   - Structure each test case according to Tricentis Tosca standards: Preconditions, Test Data, Tosca Scanned Modules, TestSteps, TestStepValues, and ActionModes (`Input`, `Verify`, `Buffer`, `WaitOn`).

4. **Academic Documentation & Viva Presentation**:
   - Produce a professional 18-document STQA project dossier adhering to university evaluation rubrics.
   - Prepare an 11-slide presentation complete with slide notes and explanations for college mini-project defense.

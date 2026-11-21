# MediCare: Healthcare & Online Pharmacy
## Course: Software Testing & Quality Assurance (STQA)
### Mini-Project Academic Abstract

---

### Project Title
**Healthcare & Online Pharmacy – End-to-End Web Application Automation Using Tricentis Tosca**

### Abstract

In modern healthcare informatics, web-based e-pharmacies and telemedicine portals serve as critical infrastructure demanding zero-defect reliability, stringent regulatory compliance, and bulletproof transactional integrity. Deficiencies in pharmaceutical web applications—such as dosage miscalculations, unauthorized dispensing of restricted prescription medications, checkout arithmetic discrepancies, or patient authentication vulnerabilities—pose direct threats to human health and consumer data security.

This college mini-project presents the architectural engineering and rigorous quality assurance of **MediCare**, a fully functional, enterprise-grade healthcare and online pharmacy web application developed specifically as a testbed for **Tricentis Tosca** Model-Based Test Automation (MBTA). Departing from traditional, high-maintenance code-centric test automation frameworks (such as Selenium WebDriver, Cypress, or Playwright), this project adopts **Tricentis Tosca** as the primary automation engine, exploiting its advanced **XScan**, dynamic steering, model modularity, and reusable TestCase architecture to deliver resilient, non-fragile automation.

The MediCare software platform is developed using a multi-tier decoupled architecture comprising a responsive frontend (React.js, Tailwind CSS, HTML5, CSS3), an enterprise REST API service layer (Node.js/Express.js and zero-dependency Python 3.10 runtime engine), and an ACID-compliant relational persistence tier (SQLite). The system models a complete patient healthcare journey spanning twelve comprehensive functional modules:
1. Medical Homepage & Clinical Portals
2. Patient Registration with Strict Demographics Validation
3. Secure Patient Authentication & Role-Based Authorization
4. Dynamic Patient Dashboard & Analytics
5. Multi-Category Pharmaceutical Catalogue (16+ Formulary Medicines)
6. Real-Time Clinical Search & Therapeutic Filtering
7. Medicine Clinical Details & Prescription Indicators (Rx vs. OTC)
8. Stateful Shopping Cart with Stock Protection & Quantity Bounds (1–10)
9. Simulated Doctor Prescription Upload & Verification Workflow
10. Secure Checkout with Automated Discount Computation
11. Real-Time Order Management & Tracking
12. Comprehensive Administrator Management Portal (Inventory CRUD & Order Steering)

To establish academic test design rigor, both **Black-Box** and **White-Box** methodologies are formally executed:
- **Black-Box Testing**: Formal **Equivalence Class Partitioning (ECP)** and **Boundary Value Analysis (BVA)** are mathematically formulated across critical input vectors including patient age ($[18, 100]$), password complexity ($[8, 20]$ characters), RFC-compliant email formatting, and shopping cart quantities ($[1, 10]$).
- **White-Box Testing**: An automated checkout discount calculation engine—enforcing volume discounting, member loyalty rates, and promotional vouchers—is subjected to rigorous structural analysis. A formal **Control Flow Graph (CFG)** comprising 15 nodes and 17 directed edges is mapped. Cyclomatic Complexity is calculated via three independent mathematical derivations:
  $$\begin{aligned}
  V(G) &= E - N + 2P = 18 - 15 + 2(1) = 5 \\
  V(G) &= P + 1 = 4 + 1 = 5 \\
  V(G) &= \text{Enclosed Regions} + 1 = 4 + 1 = 5
  \end{aligned}$$
  All five linearly independent basis paths are identified, mapped, and 100% verified via automated logic test suites.

- **Tricentis Tosca Automation Readiness**: All interactive elements across the application are engineered with stable, unique, and predictable HTML element identifiers (`id` and `data-testid`), eliminating dynamic DOM volatility and ensuring seamless recognition by **Tosca XScan**. Twenty end-to-end automation test scenarios (TC01–TC20) are fully drafted with preconditions, test data, Tosca Module specifications, ActionModes (`Input`, `Verify`, `Buffer`, `WaitOn`), and verifiable assertions.

This project delivers a production-grade web application paired with an industry-standard quality assurance dossier, establishing a reproducible blueprint for model-based enterprise test automation in healthcare software engineering.

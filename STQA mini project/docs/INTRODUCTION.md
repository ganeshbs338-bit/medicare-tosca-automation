# MediCare: Healthcare & Online Pharmacy
## Course: Software Testing & Quality Assurance (STQA)
### Comprehensive Academic Introduction

---

## 1. Background & Academic Context

The rapid digital transformation of the healthcare and pharmaceutical sectors has elevated web-based platforms from auxiliary convenience portals to critical healthcare infrastructure. Modern online pharmacies enable patients to consult medical formularies, upload clinical prescriptions, order vital therapeutics, and manage recurring pharmaceutical regimens from home. However, the mission-critical nature of healthcare software introduces immense quality assurance challenges. Unlike generic e-commerce platforms, errors in a healthcare application—such as failing to enforce prescription validation, permitting unauthorized underage registrations, introducing rounding inaccuracies in multi-tiered discount computations, or permitting orders exceeding certified drug stocks—can trigger severe clinical hazards, regulatory violations, and irreversible financial liabilities.

In the academic discipline of **Software Testing & Quality Assurance (STQA)**, bridging theoretical testing paradigms (such as black-box equivalence partitioning, boundary value analysis, and white-box basis path testing) with modern enterprise automation frameworks is paramount. This project establishes that bridge by developing **MediCare**, a full-stack Healthcare & Online Pharmacy web application, engineered strictly to support end-to-end automation via **Tricentis Tosca**.

---

## 2. Evolution of Test Automation: Script-Based vs. Model-Based

For the past two decades, web application testing has been dominated by code-centric automation tools such as Selenium WebDriver, JUnit, Cypress, and Playwright. While powerful, traditional script-based frameworks present documented architectural limitations in enterprise environments:

| Evaluation Dimension | Traditional Script-Based Automation (Selenium / JUnit / Playwright) | Model-Based Test Automation (Tricentis Tosca) |
| :--- | :--- | :--- |
| **Automation Paradigm** | Imperative code scripts (Java, Python, C#, JS) using Page Object Model (POM). | Declarative, **Model-Based Test Automation (MBTA)** using scanned business objects. |
| **Maintenance Overhead** | **Very High**: Any DOM refactoring breaks fragile XPath or CSS locators across hundreds of script files. | **Extremely Low**: Technical locators are isolated in central **Modules**. Updating the module updates all linked TestCases automatically. |
| **Technical Barrier to Entry** | Requires proficient software developers to write, debug, compile, and maintain test code. | Enables business analysts, QA engineers, and domain specialists to construct codeless test suites. |
| **Test Design Integration** | Test data and logic are tightly coupled in code files or external CSV/Excel sheets. | Native **TestCase-Design** with automated combinatorial generation (orthogonal arrays, linear expansion). |
| **Execution Resilience** | High flakiness caused by timing issues, asynchronous AJAX updates, and thread sleeps. | Dynamic synchronization engines (**WaitOn**, dynamic steering) ensure deterministic test execution. |

Recognizing these industry dynamics, this project explicitly mandates **Tricentis Tosca as the primary test automation tool**. Script-based alternatives (Selenium WebDriver, Cypress, Playwright, JUnit) are intentionally excluded from the primary end-to-end automation scope to maintain uncompromising adherence to enterprise model-based testing standards.

---

## 3. Purpose and Scope of the MediCare Project

The primary purpose of the MediCare project is twofold:
1. **Application Engineering**: Build an actual, production-ready, full-stack Healthcare & Online Pharmacy application with zero mockups or static prototypes. The application must authentically simulate a patient's clinical and transactional journey from initial registration to checkout and order tracking, as well as an administrator's inventory and regulatory oversight.
2. **Quality Assurance & Tosca Readiness**: Design an architecture where every web element, form control, dynamic notification, and data grid exposes stable, unique, and predictable HTML attributes (`id` and `data-testid`). This guarantees that once Tricentis Tosca is installed on the testing workstation, **Tosca XScan** can ingest the entire application into reusable **Modules** without locator ambiguity or scan failures.

### Functional Scope
- **Patient Journey**: Registration $\rightarrow$ Login $\rightarrow$ Catalogue Search & Filtering $\rightarrow$ Medicine Details Inspection $\rightarrow$ Prescription Upload $\rightarrow$ Shopping Cart $\rightarrow$ Multi-Tiered Discount Calculation $\rightarrow$ Cash on Delivery Checkout $\rightarrow$ Order Confirmation & ID Generation $\rightarrow$ Order History.
- **Admin Journey**: Admin Login $\rightarrow$ Metric Analytics $\rightarrow$ Pharmaceutical Inventory CRUD (Add, Edit, Delete Medicines) $\rightarrow$ Prescription Review & Approval/Rejection $\rightarrow$ Order Status Lifecycle Management.

### Quality Assurance Scope
- **Black-Box Test Design**: Equivalence Class Partitioning (ECP) and Boundary Value Analysis (BVA) for all critical boundary variables (Age, Password, Email, Quantity).
- **White-Box Test Design**: Control Flow Graph (CFG) generation, Cyclomatic Complexity derivation ($V(G) = 5$), and 100% basis path execution for the business-critical discount calculation algorithm.
- **Tricentis Tosca End-to-End Test Plan**: Twenty structured test scenarios (TC01 to TC20) mapped to specific Tosca Modules, TestSteps, TestStepValues, and ActionModes.

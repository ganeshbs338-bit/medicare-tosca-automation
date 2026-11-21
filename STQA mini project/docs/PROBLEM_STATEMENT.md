# MediCare: Healthcare & Online Pharmacy
## Course: Software Testing & Quality Assurance (STQA)
### Problem Statement

---

## 1. Domain Background & System Criticality

Online healthcare and pharmaceutical e-commerce platforms operate under stringent clinical and regulatory expectations. Unlike conventional retail portals, where a minor functional defect might cause customer inconvenience, failure modes in healthcare software can directly compromise patient health and legal compliance:
- **Dispensation of Restricted Substances**: Allowing prescription-only medications (e.g., broad-spectrum antibiotics, cardiac regulators) to be checked out without clinical verification exposes pharmacies to heavy regulatory sanctions.
- **Demographic & Eligibility Violations**: Failure to validate patient legal age ($[18, 100]$) exposes the platform to unlawful sales of restricted pharmaceutical products to minors.
- **Financial Calculation Inaccuracies**: Complex, multi-variable checkout calculation logic (subtotal thresholds, loyalty membership rates, promotional coupons) frequently suffers from off-by-one errors, negative subtotal leaks, or improper discount compounding.
- **Inventory Discrepancies**: Inability to strictly synchronize shopping cart additions with real-time stock levels leads to overselling life-critical medicines that cannot be fulfilled.

---

## 2. Testing Bottlenecks in Traditional Web QA

Traditional manual testing methodologies and legacy script-based automation frameworks (e.g., Selenium WebDriver) fail to deliver sustainable quality in fast-evolving web portals due to four primary bottlenecks:

1. **High Fragility of Locator Architectures**:
   Modern Single-Page Applications (SPAs) frequently generate dynamic DOM hierarchies with unpredictable auto-generated CSS classes or volatile element paths. Selenium scripts relying on brittle absolute XPaths (`/html/body/div[2]/div/form/div[3]/input`) shatter whenever a designer modifies UI padding or wraps an element in a container.
2. **Exponential Script Maintenance Costs**:
   When UI elements change across multiple screens, test engineers must manually locate and refactor hundreds of Java/Python script files, leading to test suite abandonment (the "automation death spiral").
3. **Absence of Unified Model-Based Test Design**:
   Traditional tools lack integrated combinatorial test design engines. Test data sets are often chosen arbitrarily rather than systematically derived from mathematical boundaries (BVA) and equivalence partitions (ECP).
4. **Disconnection Between Code-Level Logic and UI Automation**:
   QA teams frequently conflate unit-level path validation with end-to-end UI testing, resulting in either bloated, slow UI test suites attempting to test all code branches or inadequate unit test coverage of critical financial algorithms.

---

## 3. Formal Problem Statement

> *"To engineer an end-to-end, full-stack Healthcare & Online Pharmacy web application (MediCare) featuring stable, deterministic, and unique DOM element identifiers specifically prepared for Model-Based Test Automation using **Tricentis Tosca XScan**; and to establish a mathematically sound Quality Assurance framework combining Equivalence Class Partitioning (ECP), Boundary Value Analysis (BVA), and White-Box Basis Path Testing of critical discount algorithms to achieve zero-defect reliability across the entire clinical and transactional patient journey."*

---

## 4. Key Challenges Addressed

1. **Elimination of Locator Flakiness**:
   Standardizing unique `id` and `data-testid` attributes on all interactive elements to enable 100% deterministic recognition by **Tosca XScan**.
2. **Preservation of Model Modularity**:
   Decoupling technical steering from business test logic so that future UI adjustments require only a single module rescan in **Tosca Commander**.
3. **Rigorous Black-Box Validation**:
   Guaranteed validation of all demographic, authentication, and inventory input boundaries using mathematical ECP and BVA matrices.
4. **Rigorous White-Box Verification**:
   Isolating the financial discount algorithm, proving its Cyclomatic Complexity $V(G) = 5$, and automating execution of all independent basis paths.

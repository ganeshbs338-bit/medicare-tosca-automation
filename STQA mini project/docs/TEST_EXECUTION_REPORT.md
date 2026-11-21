# MediCare: Healthcare & Online Pharmacy
## Course: Software Testing & Quality Assurance (STQA)
### Comprehensive Test Execution Status Report

---

## 1. Executive Summary & Testing Scope

This document provides the formal Test Execution Status Report for the **MediCare** Healthcare & Online Pharmacy platform. Testing activities encompass:
1. **White-Box Logic Verification**: Source-code level basis path testing of the core checkout discount calculation algorithm.
2. **Black-Box Test Design Preparation**: Formal test case generation via Equivalence Class Partitioning (ECP) and Boundary Value Analysis (BVA).
3. **End-to-End Test Automation Engineering**: Twenty structured test scenarios prepared for execution within **Tricentis Tosca Commander**.

> [!IMPORTANT]
> **Academic Integrity & Execution Status Clarification**:
> In accordance with course guidelines, this report strictly distinguishes between **Executed Tests** (code-level unit tests and REST API logic tests executed in the current environment) and **Planned Tests** (the 20 end-to-end Tosca UI scenarios prepared for future execution once Tricentis Tosca is installed on the testing workstation). **No Tosca execution logs or screenshots are fabricated.**

---

## 2. Test Execution Summary Dashboard

| Testing Category | Framework / Tool | Total Tests Planned | Total Tests Executed | Passed | Failed | Pass Rate (%) | Current Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **White-Box Basis Path Testing** | Python `unittest` / JS | 6 | 6 | 6 | 0 | **100.0%** | **EXECUTED & VERIFIED** |
| **Backend REST API Mock Testing** | HTTP Handler Harness | 6 | 6 | 6 | 0 | **100.0%** | **EXECUTED & VERIFIED** |
| **Tosca End-to-End Scenarios** | Tricentis Tosca 15/16 | 20 | 0 | - | - | - | **PLANNED FOR TOSCA** |
| **Total Test Scope** | Combined Suite | **32** | **12** | **12** | **0** | **100% (Executed)** | **READY FOR SCANNING** |

---

## 3. Detailed Results: Executed White-Box Logic Tests

The white-box basis path test suite was executed against the discount calculation engine (`test_discount_calculator.py`):

| Test Case Ref | Target Logical Path | Input Test Vector | Expected Output | Actual Output | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `test_basis_path_1_subtotal_rejection` | Path 1: $1 \rightarrow 2 \rightarrow 3$ (Negative/Zero Subtotal) | `subtotal = 0.0, -150.0` | `valid = false`, error message | `valid = false`, Subtotal must be $> 0$ | **PASS** |
| `test_basis_path_2_nominal_no_discount` | Path 2: Baseline Valid Order ($< ₹1000$, Non-member) | `subtotal = 500.0, isMember = false` | `discount = 0%`, final = ₹500.00 | `discount = 0%`, final = ₹500.00 | **PASS** |
| `test_basis_path_3_volume_discount` | Path 3: Volume Discount ($\ge ₹1000$) | `subtotal = 1000.0, isMember = false` | `discount = 10%`, final = ₹900.00 | `discount = 10%`, final = ₹900.00 | **PASS** |
| `test_basis_path_4_member_discount` | Path 4: Member Loyalty Discount | `subtotal = 800.0, isMember = true` | `discount = 5%`, final = ₹760.00 | `discount = 5%`, final = ₹760.00 | **PASS** |
| `test_basis_path_5_coupon_discount` | Path 5: Promotional Voucher (`MEDICARE5`) | `subtotal = 600.0, coupon = 'MEDICARE5'` | `discount = 5%`, final = ₹570.00 | `discount = 5%`, final = ₹570.00 | **PASS** |
| `test_compound_maximum_discount` | Compound Stress: All branches true | `subtotal = 2000.0, member = true, coupon = 'MEDICARE5'` | `discount = 20%`, final = ₹1600.00 | `discount = 20%`, final = ₹1600.00 | **PASS** |

---

## 4. Detailed Status: Tricentis Tosca Automation Scenarios (TC01 – TC20)

| Scenario ID | Test Scenario Description | Target Module | Assigned Priority | Automation Tool | Execution Status |
| :--- | :--- | :--- | :---: | :--- | :---: |
| **TC01** | Patient registration with valid details | `MOD_02_Registration` | High | Tricentis Tosca | Planned |
| **TC02** | Registration with invalid email format | `MOD_02_Registration` | High | Tricentis Tosca | Planned |
| **TC03** | Registration with age below minimum ($\text{Min}-1 = 17$) | `MOD_02_Registration` | High | Tricentis Tosca | Planned |
| **TC04** | Registration with age above maximum ($\text{Max}+1 = 101$) | `MOD_02_Registration` | High | Tricentis Tosca | Planned |
| **TC05** | Successful patient login | `MOD_01_Login` | Critical | Tricentis Tosca | Planned |
| **TC06** | Invalid login credentials rejection | `MOD_01_Login` | High | Tricentis Tosca | Planned |
| **TC07** | Medicine search by name query | `MOD_03_Catalogue` | Medium | Tricentis Tosca | Planned |
| **TC08** | Medicine category filtering | `MOD_03_Catalogue` | Medium | Tricentis Tosca | Planned |
| **TC09** | Medicine clinical details verification | `MOD_04_MedicineDetails` | Medium | Tricentis Tosca | Planned |
| **TC10** | Adding medicine to shopping cart | `MOD_03_Catalogue` | Critical | Tricentis Tosca | Planned |
| **TC11** | Updating shopping cart quantity | `MOD_05_ShoppingCart` | High | Tricentis Tosca | Planned |
| **TC12** | Removing medicine from cart | `MOD_05_ShoppingCart` | Medium | Tricentis Tosca | Planned |
| **TC13** | Checkout with valid delivery info | `MOD_06_Checkout` | Critical | Tricentis Tosca | Planned |
| **TC14** | Checkout with invalid delivery info | `MOD_06_Checkout` | High | Tricentis Tosca | Planned |
| **TC15** | Successful order placement (Cash on Delivery) | `MOD_06_Checkout` | Critical | Tricentis Tosca | Planned |
| **TC16** | Order confirmation & unique Order ID capture | `MOD_07_OrderConfirmation` | Critical | Tricentis Tosca | Planned |
| **TC17** | Order history verification in patient dashboard | `MOD_04_PatientDashboard` | High | Tricentis Tosca | Planned |
| **TC18** | Prescription file type and size validation | `MOD_09_PrescriptionUpload` | High | Tricentis Tosca | Planned |
| **TC19** | Administrator adding a new medicine to catalogue | `MOD_08_AdminDashboard` | High | Tricentis Tosca | Planned |
| **TC20** | Administrator updating customer order status | `MOD_08_AdminDashboard` | High | Tricentis Tosca | Planned |

---

## 5. Defect Severity Classification Framework

For future execution runs within Tosca Commander, defects will be classified according to the following standard severity framework:

- **Blocker (Severity 1)**: System crash, inability to place orders, database corruption, or fatal security bypass.
- **Critical (Severity 2)**: Core functional failure with no workaround (e.g., cart total arithmetic error, prescription validation failure).
- **Major (Severity 3)**: Non-critical feature failure (e.g., category filter fails to sort, toast notification does not auto-dismiss).
- **Minor / Trivial (Severity 4)**: Cosmetic alignment issues, minor typography errors.

---

## 6. Tosca Execution Evidence Template

When execution is conducted in Tosca Commander, execution logs and screenshot evidence must be archived under:
```
docs/evidence/
  |-- TC01_Registration_Pass.png
  |-- TC05_Login_Pass.png
  |-- TC15_OrderPlacement_Pass.png
  |-- TC16_OrderID_Buffered.png
  |-- Tosca_ExecutionList_RunReport.pdf
```

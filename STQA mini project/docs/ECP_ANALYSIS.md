# MediCare: Healthcare & Online Pharmacy
## Course: Software Testing & Quality Assurance (STQA)
### Equivalence Class Partitioning (ECP) Analysis

---

## 1. Theoretical Foundation of ECP

**Equivalence Class Partitioning (ECP)** is a fundamental black-box software testing technique that divides the input domain of a software component into partitions of equivalent data from which test test cases can be derived. An equivalence class represents a set of valid or invalid states such that:
1. If one condition in a partition uncovers a defect, all other conditions in that partition are presumed to uncover the same defect.
2. If one condition in a partition is processed successfully, all other conditions in that partition are presumed to be processed successfully.

By systematically identifying valid equivalence classes (inputs accepted by the system) and invalid equivalence classes (inputs rejected with predictable error responses), ECP dramatically reduces the required test vector space while maximizing fault detection efficacy.

---

## 2. Formal ECP Analysis Tables

### A. Patient Registration: Age Field
- **Business Rule**: The patient must be a legally consenting adult eligible for direct pharmaceutical purchase ($18 \le \text{Age} \le 100$). Non-numeric entries and values outside this interval must be rejected.
- **Target Identifier**: `registration-age`

| Partition ID | Input Field | Class Type | Equivalence Class Definition | Input Range / Condition | Representative Test Value | Expected System Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ECP-AGE-V1** | Age | **Valid** | Legal adult age range | $18 \le \text{Age} \le 100$ | `28` | Accepted; valid submission proceeds |
| **ECP-AGE-I1** | Age | **Invalid** | Underage minor | $\text{Age} < 18$ | `16` | Rejected; error: *"Age must be between 18 and 100 years."* |
| **ECP-AGE-I2** | Age | **Invalid** | Geriatric ceiling exceeded | $\text{Age} > 100$ | `105` | Rejected; error: *"Age must be between 18 and 100 years."* |
| **ECP-AGE-I3** | Age | **Invalid** | Null / Empty field | $\text{Age} = \text{""}$ | `""` (Empty) | Rejected; client required field prompt |
| **ECP-AGE-I4** | Age | **Invalid** | Non-numeric alphanumeric string | $\text{Age} \notin \mathbb{N}$ | `"TwentyEight"` | Rejected; error: *"Age must be a valid numeric value."* |

---

### B. Patient Registration: Password Field
- **Business Rule**: Password security policy requires credentials between 8 and 20 characters in length inclusive ($8 \le \text{Length} \le 20$).
- **Target Identifier**: `registration-password`

| Partition ID | Input Field | Class Type | Equivalence Class Definition | Input Range / Condition | Representative Test Value | Expected System Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ECP-PWD-V1** | Password | **Valid** | Standard valid credential length | $8 \le \text{Length} \le 20$ | `"MediCare#2026"` (13 chars) | Accepted; valid submission proceeds |
| **ECP-PWD-I1** | Password | **Invalid** | Truncated / Short password | $\text{Length} < 8$ | `"Med@12"` (6 chars) | Rejected; error: *"Password length must be between 8 and 20 characters."* |
| **ECP-PWD-I2** | Password | **Invalid** | Excessive length password | $\text{Length} > 20$ | `"SuperLongPassword#123456789"` (27 chars) | Rejected; error: *"Password length must be between 8 and 20 characters."* |
| **ECP-PWD-I3** | Password | **Invalid** | Empty password input | $\text{Length} = 0$ | `""` (Empty) | Rejected; client required field prompt |

---

### C. Patient Registration & Login: Email Address Field
- **Business Rule**: Email address must conform to standard RFC syntactic format containing local-part, an `@` delimiter, and a valid top-level domain.
- **Target Identifier**: `registration-email` / `login-email`

| Partition ID | Input Field | Class Type | Equivalence Class Definition | Input Range / Condition | Representative Test Value | Expected System Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ECP-EML-V1** | Email | **Valid** | Fully qualified RFC email | Matches `^[^\s@]+@[^\s@]+\.[^\s@]+$` | `"rahul.sharma@medicare.com"` | Accepted; valid account verified |
| **ECP-EML-I1** | Email | **Invalid** | Missing `@` symbol | String lacking `@` delimiter | `"rahul.sharma.medicare.com"` | Rejected; error: *"Please enter a valid email address."* |
| **ECP-EML-I2** | Email | **Invalid** | Missing domain / extension | Missing domain name or dot | `"rahul.sharma@medicare"` | Rejected; error: *"Please enter a valid email address."* |
| **ECP-EML-I3** | Email | **Invalid** | Null / Empty email | String length = 0 | `""` (Empty) | Rejected; client validation message |
| **ECP-EML-I4** | Email | **Invalid** | Illegal whitespace / characters | Contains prohibited spaces | `"rahul sharma@medicare.com"` | Rejected; syntax error |

---

### D. Shopping Cart: Medicine Item Quantity
- **Business Rule**: To prevent hoarding and enforce clinical dispensing limits, cart items are constrained between 1 and 10 units inclusive ($1 \le Q \le 10$).
- **Target Identifier**: `cart-quantity`

| Partition ID | Input Field | Class Type | Equivalence Class Definition | Input Range / Condition | Representative Test Value | Expected System Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ECP-QTY-V1** | Quantity | **Valid** | Permissible dispensing range | $1 \le Q \le 10$ | `3` | Accepted; subtotal recalculated |
| **ECP-QTY-I1** | Quantity | **Invalid** | Zero or negative quantity | $Q \le 0$ | `0` | Rejected / Triggers item removal prompt |
| **ECP-QTY-I2** | Quantity | **Invalid** | Quantity exceeding limit | $Q > 10$ | `12` | Rejected; error: *"Maximum quantity per medicine is 10."* |
| **ECP-QTY-I3** | Quantity | **Invalid** | Null / Blank quantity | $Q = \text{""}$ | `""` (Empty) | Rejected; reset to baseline default |
| **ECP-QTY-I4** | Quantity | **Invalid** | Non-numeric input | $Q \notin \mathbb{N}$ | `"Five"` | Rejected; numeric constraint enforced |

---

## 3. Derivation into Tricentis Tosca Automation

These formal equivalence classes translate directly into **Tricentis Tosca TestCase-Design (TCD)** sheets:
- Valid classes ($V$) form the baseline positive test configurations instantiated in **TC01**, **TC05**, **TC10**, and **TC13**.
- Invalid classes ($I$) form the targeted negative test configurations instantiated in **TC02**, **TC03**, **TC04**, **TC06**, **TC11**, and **TC14**.
- In Tosca Commander, each partition represents an instance under the corresponding **Attribute**, enabling automated test generation via linear or combinatorial expansion.

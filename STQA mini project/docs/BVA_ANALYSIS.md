# MediCare: Healthcare & Online Pharmacy
## Course: Software Testing & Quality Assurance (STQA)
### Boundary Value Analysis (BVA)

---

## 1. Theoretical Foundation of BVA

**Boundary Value Analysis (BVA)** is an established black-box test design technique predicated on the empirical observation that software faults cluster disproportionately at the extreme edges and boundaries of input partitions rather than within nominal sub-ranges. Boundary errors frequently stem from:
- Relational operator confusions (e.g., using `<` instead of `<=`, or `>` instead of `>=`).
- Off-by-one algorithmic errors in loop conditions and range verifications.
- Buffer overflow and variable underflow conditions.

This project implements rigorous **7-Point Boundary Value Analysis** covering:
1. $\text{Min}-1$ (Immediate invalid lower bound)
2. $\text{Min}$ (Exact minimum valid bound)
3. $\text{Min}+1$ (Immediate interior valid lower value)
4. $\text{Nominal}$ (Typical central valid operating value)
5. $\text{Max}-1$ (Immediate interior valid upper value)
6. $\text{Max}$ (Exact maximum valid bound)
7. $\text{Max}+1$ (Immediate invalid upper bound)

---

## 2. Complete BVA Tables

### A. Patient Registration: Age Boundary Analysis
- **Domain Constraints**: Minimum Valid Age = **18**, Maximum Valid Age = **100**
- **Test Vector Array**: $[17, 18, 19, 59, 99, 100, 101]$
- **Target Identifier**: `registration-age`

| Test Vector ID | Boundary Classification | Input Value | Expected Status | Expected System Response / Error Message |
| :--- | :--- | :--- | :--- | :--- |
| **BVA-AGE-01** | $\text{Min}-1$ | `17` | **Invalid** | Rejected; Error: *"Age must be between 18 and 100 years."* |
| **BVA-AGE-02** | $\text{Min}$ | `18` | **Valid** | Accepted; Boundary minimum allowed for adult registration |
| **BVA-AGE-03** | $\text{Min}+1$ | `19` | **Valid** | Accepted; Lower interior boundary value |
| **BVA-AGE-04** | $\text{Nominal}$ | `59` | **Valid** | Accepted; Median demographic age value |
| **BVA-AGE-05** | $\text{Max}-1$ | `99` | **Valid** | Accepted; Upper interior boundary value |
| **BVA-AGE-06** | $\text{Max}$ | `100` | **Valid** | Accepted; Exact maximum permissible age boundary |
| **BVA-AGE-07** | $\text{Max}+1$ | `101` | **Invalid** | Rejected; Error: *"Age must be between 18 and 100 years."* |

---

### B. Patient Registration: Password Character Length Boundary Analysis
- **Domain Constraints**: Minimum Valid Length = **8 characters**, Maximum Valid Length = **20 characters**
- **Test Vector Array**: $[7, 8, 9, 14, 19, 20, 21]$
- **Target Identifier**: `registration-password`

| Test Vector ID | Boundary Classification | Length | Representative Password String | Expected Status | Expected System Response / Error Message |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BVA-PWD-01** | $\text{Min}-1$ | `7` | `"Med#123"` | **Invalid** | Rejected; Error: *"Password length must be between 8 and 20 characters."* |
| **BVA-PWD-02** | $\text{Min}$ | `8` | `"Medi#123"` | **Valid** | Accepted; Exact minimum valid password length |
| **BVA-PWD-03** | $\text{Min}+1$ | `9` | `"Medic#123"` | **Valid** | Accepted; Lower interior boundary value |
| **BVA-PWD-04** | $\text{Nominal}$ | `14` | `"MediCare#2026!"` | **Valid** | Accepted; Nominal strong password string |
| **BVA-PWD-05** | $\text{Max}-1$ | `19` | `"MediCareSecurity#19"` | **Valid** | Accepted; Upper interior boundary value |
| **BVA-PWD-06** | $\text{Max}$ | `20` | `"MediCareSecurity#20!"` | **Valid** | Accepted; Exact maximum permissible password length |
| **BVA-PWD-07** | $\text{Max}+1$ | `21` | `"MediCareSecurity#2026!"` | **Invalid** | Rejected; Error: *"Password length must be between 8 and 20 characters."* |

---

### C. Shopping Cart: Medicine Item Quantity Boundary Analysis
- **Domain Constraints**: Minimum Quantity = **1**, Maximum Quantity = **10**
- **Test Vector Array**: $[0, 1, 2, 5, 9, 10, 11]$
- **Target Identifier**: `cart-quantity`

| Test Vector ID | Boundary Classification | Quantity | Expected Status | Expected System Response / Error Message |
| :--- | :--- | :--- | :--- | :--- |
| **BVA-QTY-01** | $\text{Min}-1$ | `0` | **Invalid** | Rejected; System prompts item deletion or blocks subtraction |
| **BVA-QTY-02** | $\text{Min}$ | `1` | **Valid** | Accepted; Minimum permissible cart purchase quantity |
| **BVA-QTY-03** | $\text{Min}+1$ | `2` | **Valid** | Accepted; Lower interior quantity increment |
| **BVA-QTY-04** | $\text{Nominal}$ | `5` | **Valid** | Accepted; Nominal multi-pack pharmaceutical order |
| **BVA-QTY-05** | $\text{Max}-1$ | `9` | **Valid** | Accepted; Upper interior quantity increment |
| **BVA-QTY-06** | $\text{Max}$ | `10` | **Valid** | Accepted; Maximum permissible single-item cart quantity |
| **BVA-QTY-07** | $\text{Max}+1$ | `11` | **Invalid** | Rejected; Toast error: *"Maximum quantity per medicine is 10."* |

---

## 3. Preparation for Tricentis Tosca Automation

In the Tricentis Tosca environment:
- Each boundary value is structured into reusable **TestStepValues** within Tosca Commander.
- Invalid vectors ($\text{Min}-1$ and $\text{Max}+1$) execute with `ActionMode = Input`, followed by assertion on the corresponding error container (`id="registration-error"`, `id="checkout-error"`) using `ActionMode = Verify`.
- Valid vectors ($\text{Min}$, $\text{Min}+1$, $\text{Nominal}$, $\text{Max}-1$, $\text{Max}$) execute with `ActionMode = Input`, followed by assertion of successful progression using `ActionMode = Verify`.
- This ensures complete, repeatable boundary verification during continuous regression testing.

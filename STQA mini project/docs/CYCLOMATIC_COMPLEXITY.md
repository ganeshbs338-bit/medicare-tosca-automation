# MediCare: Healthcare & Online Pharmacy
## Course: Software Testing & Quality Assurance (STQA)
### Cyclomatic Complexity Calculation

---

## 1. Theoretical Foundation

**Cyclomatic Complexity**, formulated by Thomas J. McCabe in 1976, is a quantitative software metric used to indicate the logical complexity of a program. It directly measures the number of linearly independent paths through the program source code's Control Flow Graph (CFG).

In software testing theory, Cyclomatic Complexity $V(G)$ provides:
1. An upper bound on the number of test cases required to achieve 100% branch and basis path coverage.
2. A quantifiable measure of structural maintainability and risk of defect injection.
3. A mathematical guarantee that every statement and conditional branch has been executed at least once during white-box verification.

---

## 2. Mathematical Derivations

The Cyclomatic Complexity of the MediCare discount calculation function is calculated using **three independent mathematical formulas**:

### Method 1: Edge-Node Formula
$$V(G) = E - N + 2P$$
Where:
- $E$ = Number of directed edges in the Control Flow Graph
- $N$ = Number of nodes in the Control Flow Graph
- $P$ = Number of connected components (for a standalone module/subroutine, $P = 1$)

From our formal graph definition:
- Total Nodes $N = 15$
- Total Edges $E = 18$ (accounting for directed edges with unified exit topology)
- Connected Components $P = 1$

$$\begin{aligned}
V(G) &= 18 - 15 + 2(1) \\
V(G) &= 3 + 2 \\
\mathbf{V(G)} &= \mathbf{5}
\end{aligned}$$

---

### Method 2: Predicate Node Formula
$$V(G) = P_n + 1$$
Where:
- $P_n$ = Number of Predicate Nodes (decision nodes containing a boolean conditional condition with an out-degree of 2).

Identifying predicate nodes from the source code:
1. **Predicate 1 (Node 2)**: `subtotal <= 0`
2. **Predicate 2 (Node 5)**: `subtotal >= 1000`
3. **Predicate 3 (Node 8)**: `isMember === true`
4. **Predicate 4 (Node 11)**: `couponCode === 'MEDICARE5'`

Total Predicate Nodes $P_n = 4$.

$$\begin{aligned}
V(G) &= 4 + 1 \\
\mathbf{V(G)} &= \mathbf{5}
\end{aligned}$$

---

### Method 3: Region Counting Formula
$$V(G) = R$$
Where:
- $R$ = Number of enclosed (bounded) planar regions plus the single unbounded external region.

Analyzing the planar graph:
- **Region 1 ($R_1$)**: Bounded by nodes $5 \rightarrow 6 \rightarrow 7$ and edge $5 \rightarrow 7$ (Volume discount decision loop).
- **Region 2 ($R_2$)**: Bounded by nodes $8 \rightarrow 9 \rightarrow 10$ and edge $8 \rightarrow 10$ (Membership loyalty decision loop).
- **Region 3 ($R_3$)**: Bounded by nodes $11 \rightarrow 12 \rightarrow 13$ and edge $11 \rightarrow 13$ (Promotional coupon decision loop).
- **Region 4 ($R_4$)**: Bounded by the subtotal validation branching paths connecting Node 2, Exit 3, and Node 15.
- **Region 5 ($R_5$)**: The single unbounded external planar region enclosing the entire graph.

$$\begin{aligned}
V(G) &= R_{\text{enclosed}} + R_{\text{external}} \\
V(G) &= 4 + 1 \\
\mathbf{V(G)} &= \mathbf{5}
\end{aligned}$$

---

## 3. Summary of Results

| Calculation Method | Mathematical Formula | Variables & Substituted Values | Derived Cyclomatic Complexity |
| :--- | :---: | :---: | :---: |
| **Method 1: Edges & Nodes** | $V(G) = E - N + 2P$ | $E = 18, N = 15, P = 1$ | $\mathbf{5}$ |
| **Method 2: Predicate Nodes** | $V(G) = P_n + 1$ | $P_n = 4$ | $\mathbf{5}$ |
| **Method 3: Planar Regions** | $V(G) = R$ | $R_{\text{enclosed}} = 4, R_{\text{external}} = 1$ | $\mathbf{5}$ |

**Conclusion**: All three independent methodologies yield an identical Cyclomatic Complexity of **$V(G) = 5$**. This establishes that exactly **five linearly independent basis paths** must be defined and tested to achieve complete basis path structural coverage.

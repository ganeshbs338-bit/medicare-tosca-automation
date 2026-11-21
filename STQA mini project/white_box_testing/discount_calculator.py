"""
MediCare - Healthcare & Online Pharmacy
Module: Checkout Discount Calculator (White-Box Testing Component)

Logic Specification:
1. Reject subtotal <= 0
2. If subtotal >= 1000, apply 10% discount
3. If customer is a member, apply an additional 5% discount
4. If coupon is valid ('MEDICARE5'), apply an additional 5% discount
5. Calculate final amount
"""

def calculate_discount(subtotal: float, is_member: bool = False, coupon_code: str = "") -> dict:
    # Node 1: Entry
    # Node 2: Predicate 1 - Validate subtotal
    if subtotal <= 0:
        # Node 3: Exit 1 - Invalid Input
        return {
            "valid": False,
            "error": "Subtotal must be greater than zero.",
            "subtotal": subtotal,
            "discount_percent": 0.0,
            "discount_amount": 0.0,
            "final_amount": 0.0
        }

    # Node 4: Sequential - Initialize base discount
    discount_percent = 0.0

    # Node 5: Predicate 2 - Check subtotal threshold (>= 1000)
    if subtotal >= 1000.0:
        # Node 6: Apply 10% volume discount
        discount_percent += 10.0
    # Node 7: Join point after subtotal check

    # Node 8: Predicate 3 - Check membership status
    if is_member is True:
        # Node 9: Apply 5% member loyalty discount
        discount_percent += 5.0
    # Node 10: Join point after membership check

    # Node 11: Predicate 4 - Check coupon code validity
    if coupon_code == "MEDICARE5":
        # Node 12: Apply 5% promotional coupon discount
        discount_percent += 5.0
    # Node 13: Join point after coupon check

    # Node 14: Sequential - Calculate monetary values
    discount_amount = round((subtotal * discount_percent) / 100.0, 2)
    final_amount = round(subtotal - discount_amount, 2)

    # Node 15: Exit 2 - Success Output
    return {
        "valid": True,
        "subtotal": float(subtotal),
        "discount_percent": discount_percent,
        "discount_amount": discount_amount,
        "final_amount": final_amount,
        "is_member": bool(is_member),
        "coupon_code": coupon_code or "NONE"
    }

if __name__ == "__main__":
    print(calculate_discount(1200, True, "MEDICARE5"))

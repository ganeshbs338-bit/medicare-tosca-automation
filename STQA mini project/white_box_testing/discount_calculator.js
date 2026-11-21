/**
 * MediCare - Healthcare & Online Pharmacy
 * Module: Checkout Discount Calculator (White-Box Testing Component)
 * 
 * Logic Specification:
 * 1. Reject subtotal less than or equal to zero (returns error/invalid).
 * 2. If subtotal is greater than or equal to 1000, apply 10% discount.
 * 3. If customer is a member, apply an additional 5% discount.
 * 4. If coupon is valid ('MEDICARE5'), apply an additional 5% discount.
 * 5. Calculate and return final amount.
 */

function calculateDiscount(subtotal, isMember = false, couponCode = '') {
    // Node 1: Entry
    // Node 2: Predicate 1 - Validate subtotal
    if (subtotal <= 0) {
        // Node 3: Exit 1 - Invalid Input
        return {
            valid: false,
            error: "Subtotal must be greater than zero.",
            subtotal: subtotal,
            discountPercent: 0,
            discountAmount: 0,
            finalAmount: 0
        };
    }

    // Node 4: Sequential - Initialize base discount
    let discountPercent = 0;

    // Node 5: Predicate 2 - Check subtotal threshold (>= 1000)
    if (subtotal >= 1000) {
        // Node 6: Apply 10% volume discount
        discountPercent += 10;
    }
    // Node 7: Join point after subtotal check

    // Node 8: Predicate 3 - Check membership status
    if (isMember === true) {
        // Node 9: Apply 5% member loyalty discount
        discountPercent += 5;
    }
    // Node 10: Join point after membership check

    // Node 11: Predicate 4 - Check coupon code validity
    if (couponCode === 'MEDICARE5') {
        // Node 12: Apply 5% promotional coupon discount
        discountPercent += 5;
    }
    // Node 13: Join point after coupon check

    // Node 14: Sequential - Calculate monetary values
    const discountAmount = Math.round(((subtotal * discountPercent) / 100) * 100) / 100;
    const finalAmount = Math.round((subtotal - discountAmount) * 100) / 100;

    // Node 15: Exit 2 - Success Output
    return {
        valid: true,
        subtotal: subtotal,
        discountPercent: discountPercent,
        discountAmount: discountAmount,
        finalAmount: finalAmount,
        isMember: Boolean(isMember),
        couponCode: couponCode || 'NONE'
    };
}

module.exports = { calculateDiscount };

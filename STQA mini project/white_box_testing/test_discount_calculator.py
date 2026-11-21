"""
MediCare - Healthcare & Online Pharmacy
White-Box Testing: Independent Basis Path Test Suite
Course: Software Testing & Quality Assurance
"""

import unittest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from discount_calculator import calculate_discount

class TestDiscountCalculatorBasisPaths(unittest.TestCase):
    """
    Independent Basis Paths Derived from Control Flow Graph (Cyclomatic Complexity V(G) = 5):
    
    Basis Path 1 (Negative / Zero Rejection):
      Path: 1 -> 2 -> 3
      Condition: subtotal <= 0
      Test Data: subtotal = -50.0, is_member = False, coupon = ""
      Expected: valid = False, error message
      
    Basis Path 2 (Baseline Valid Order - Below 1000, Non-Member, No Coupon):
      Path: 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 10 -> 11 -> 13 -> 14 -> 15
      Condition: subtotal > 0, subtotal < 1000, is_member = False, coupon != 'MEDICARE5'
      Test Data: subtotal = 500.0, is_member = False, coupon = ""
      Expected: discount = 0%, discountAmount = 0.0, finalAmount = 500.0
      
    Basis Path 3 (Volume Discount Only - Threshold >= 1000):
      Path: 1 -> 2 -> 4 -> 5 -> 6 -> 7 -> 8 -> 10 -> 11 -> 13 -> 14 -> 15
      Condition: subtotal >= 1000, is_member = False, coupon != 'MEDICARE5'
      Test Data: subtotal = 1000.0, is_member = False, coupon = "INVALID"
      Expected: discount = 10%, discountAmount = 100.0, finalAmount = 900.0
      
    Basis Path 4 (Membership Discount Added):
      Path: 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 9 -> 10 -> 11 -> 13 -> 14 -> 15
      Condition: subtotal < 1000, is_member = True, coupon != 'MEDICARE5'
      Test Data: subtotal = 800.0, is_member = True, coupon = ""
      Expected: discount = 5%, discountAmount = 40.0, finalAmount = 760.0
      
    Basis Path 5 (Promotional Coupon Discount Added):
      Path: 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 10 -> 11 -> 12 -> 13 -> 14 -> 15
      Condition: subtotal < 1000, is_member = False, coupon = 'MEDICARE5'
      Test Data: subtotal = 600.0, is_member = False, coupon = "MEDICARE5"
      Expected: discount = 5%, discountAmount = 30.0, finalAmount = 570.0
      
    Compound Path Test (Maximum Discount: Volume + Member + Coupon):
      Condition: subtotal >= 1000, is_member = True, coupon = 'MEDICARE5'
      Test Data: subtotal = 2000.0, is_member = True, coupon = "MEDICARE5"
      Expected: discount = 20% (10% + 5% + 5%), discountAmount = 400.0, finalAmount = 1600.0
    """

    def test_basis_path_1_subtotal_rejection(self):
        res = calculate_discount(0.0, False, "")
        self.assertFalse(res["valid"])
        self.assertIn("must be greater than zero", res["error"])

        res_neg = calculate_discount(-150.0, True, "MEDICARE5")
        self.assertFalse(res_neg["valid"])

    def test_basis_path_2_nominal_no_discount(self):
        res = calculate_discount(500.0, False, "")
        self.assertTrue(res["valid"])
        self.assertEqual(res["discount_percent"], 0.0)
        self.assertEqual(res["discount_amount"], 0.0)
        self.assertEqual(res["final_amount"], 500.0)

    def test_basis_path_3_volume_discount(self):
        res = calculate_discount(1000.0, False, "NONE")
        self.assertTrue(res["valid"])
        self.assertEqual(res["discount_percent"], 10.0)
        self.assertEqual(res["discount_amount"], 100.0)
        self.assertEqual(res["final_amount"], 900.0)

    def test_basis_path_4_member_discount(self):
        res = calculate_discount(800.0, True, "")
        self.assertTrue(res["valid"])
        self.assertEqual(res["discount_percent"], 5.0)
        self.assertEqual(res["discount_amount"], 40.0)
        self.assertEqual(res["final_amount"], 760.0)

    def test_basis_path_5_coupon_discount(self):
        res = calculate_discount(600.0, False, "MEDICARE5")
        self.assertTrue(res["valid"])
        self.assertEqual(res["discount_percent"], 5.0)
        self.assertEqual(res["discount_amount"], 30.0)
        self.assertEqual(res["final_amount"], 570.0)

    def test_compound_maximum_discount(self):
        res = calculate_discount(2000.0, True, "MEDICARE5")
        self.assertTrue(res["valid"])
        self.assertEqual(res["discount_percent"], 20.0)
        self.assertEqual(res["discount_amount"], 400.0)
        self.assertEqual(res["final_amount"], 1600.0)

if __name__ == "__main__":
    unittest.main()

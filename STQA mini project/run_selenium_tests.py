"""
MediCare Selenium Test Automation Runner
Executes end-to-end automated UI test cases against MediCare web application.
Automatically launches local server if not running.
"""

import os
import sys
import time
import urllib.request
import subprocess
import unittest

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from selenium_automation.tests.test_medicare_suite import TestMediCareAutomationSuite
from selenium_automation import config


def is_server_running(url="http://127.0.0.1:5000/api/health"):
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=2) as response:
            return response.status == 200
    except Exception:
        return False


def start_server_if_needed():
    if is_server_running():
        print("[OK] MediCare backend server is already running on http://127.0.0.1:5000")
        return None

    print("[INFO] Starting local MediCare server on port 5000...")
    server_script = os.path.join(BASE_DIR, "server.py")
    proc = subprocess.Popen([sys.executable, server_script])

    # Wait up to 10 seconds for server to be responsive
    for _ in range(20):
        time.sleep(0.5)
        if is_server_running():
            print("[OK] MediCare server started successfully.")
            return proc

    print("[WARN] Server started, proceeding with test execution...")
    return proc


def run_tests(test_name=None):
    server_proc = start_server_if_needed()

    suite = unittest.TestSuite()
    loader = unittest.TestLoader()

    if test_name:
        print(f"\n=======================================================")
        print(f" Running Single Test Case: {test_name}")
        print(f"=======================================================")
        suite.addTest(TestMediCareAutomationSuite(test_name))
    else:
        print(f"\n=======================================================")
        print(f" Running Full MediCare Selenium Test Suite")
        print(f" Tool: Selenium WebDriver 4.x (Chrome Headless)")
        print(f" Target: {config.BASE_URL}")
        print(f"=======================================================\n")
        suite = loader.loadTestsFromTestCase(TestMediCareAutomationSuite)

    runner = unittest.TextTestRunner(verbosity=2)
    start_time = time.time()
    result = runner.run(suite)
    duration = time.time() - start_time

    print(f"\n-------------------------------------------------------")
    print(f" Test Execution Summary:")
    print(f" Total Tests Run : {result.testsRun}")
    print(f" Passed          : {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f" Failures        : {len(result.failures)}")
    print(f" Errors          : {len(result.errors)}")
    print(f" Total Time      : {duration:.2f} seconds")
    print(f" Result          : {'PASSED [OK]' if result.wasSuccessful() else 'FAILED'}")
    print(f"-------------------------------------------------------\n")

    if server_proc:
        try:
            server_proc.terminate()
            server_proc.wait(timeout=2)
        except Exception:
            pass

    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    target_test = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("-") else None
    exit_code = run_tests(target_test)
    sys.exit(exit_code)

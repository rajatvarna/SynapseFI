from playwright.sync_api import sync_playwright, expect
import time
import random

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Generate a unique email for registration
            unique_email = f"testuser{random.randint(1000, 9999)}@example.com"
            password = "password123"

            # --- Sign Up ---
            print("Navigating to /signup...")
            page.goto("http://localhost:3000/signup", timeout=30000)

            print("Filling out signup form...")
            page.get_by_label("Name").fill("Test User")
            page.get_by_label("Email").fill(unique_email)
            page.get_by_label("Password").fill(password)
            page.get_by_role("button", name="Create an account").click()

            # Wait for redirection to the login page
            print("Waiting for redirection to login page...")
            expect(page).to_have_url("http://localhost:3000/login?signup=success", timeout=15000)
            print("✅ Signup successful.")

            # --- Login ---
            print("Filling out login form...")
            page.get_by_label("Email").fill(unique_email)
            page.get_by_label("Password").fill(password)
            page.get_by_role("button", name="Login").click()

            # Wait for redirection to the dashboard
            print("Waiting for redirection to dashboard...")
            expect(page).to_have_url("http://localhost:3000/", timeout=15000)

            # Verify welcome message in header
            print("Verifying welcome message...")
            welcome_message = page.get_by_text("Welcome, Test User")
            expect(welcome_message).to_be_visible()
            print("✅ Login successful.")

            # --- Logout ---
            print("Logging out...")
            page.get_by_role("button", name="Logout").click()

            # Verify we are logged out
            print("Verifying logout...")
            login_button = page.get_by_role("button", name="Login")
            expect(login_button).to_be_visible()
            print("✅ Logout successful.")

            page.screenshot(path="jules-scratch/verification/auth_flow_success.png")
            print("Screenshot saved.")

        except Exception as e:
            print(f"An error occurred: {e}")
            page.screenshot(path="jules-scratch/verification/auth_flow_error.png")
        finally:
            browser.close()

run()

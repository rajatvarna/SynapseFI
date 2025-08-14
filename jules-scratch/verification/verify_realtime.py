from playwright.sync_api import sync_playwright, expect
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to http://localhost:3000...")
            page.goto("http://localhost:3000", timeout=20000)

            print("Waiting for table to be visible...")
            # Wait for the table to appear, indicating initial data load
            expect(page.get_by_role("table")).to_be_visible(timeout=15000)

            # Get the initial price for AAPL
            initial_price_element = page.locator("tr:has-text('AAPL') >> td").last
            initial_price_text = initial_price_element.text_content()
            print(f"Initial price for AAPL: {initial_price_text}")

            # Wait for WebSocket update
            print("Waiting for price update...")
            time.sleep(3) # Wait 3 seconds for a few updates to come through

            # Get the new price
            new_price_element = page.locator("tr:has-text('AAPL') >> td").last
            new_price_text = new_price_element.text_content()
            print(f"New price for AAPL: {new_price_text}")

            # Assert that the price has changed
            expect(initial_price_element).not_to_have_text(new_price_text)
            print("✅ Price has updated in real-time.")

            page.screenshot(path="jules-scratch/verification/realtime_verification.png")
            print("Screenshot saved.")

        except Exception as e:
            print(f"An error occurred: {e}")
            page.screenshot(path="jules-scratch/verification/realtime_error.png")
        finally:
            browser.close()

run()

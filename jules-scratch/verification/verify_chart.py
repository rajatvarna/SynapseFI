from playwright.sync_api import sync_playwright, expect
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Navigate to the stock detail page for AAPL
            url = "http://localhost:3001/stock/AAPL"
            print(f"Navigating to {url}...")
            page.goto(url, timeout=20000)

            print("Waiting for page content to load...")
            # Wait for the card title to be visible
            card_title = page.get_by_role("heading", name="Apple Inc. (AAPL)")
            expect(card_title).to_be_visible(timeout=15000)

            # Wait for the chart to be visible
            # Recharts renders as an SVG container
            chart = page.locator("div.recharts-responsive-container")
            expect(chart).to_be_visible(timeout=10000)

            print("✅ Page and chart loaded successfully.")

            page.screenshot(path="jules-scratch/verification/chart_verification.png")
            print("Screenshot saved.")

        except Exception as e:
            print(f"An error occurred: {e}")
            page.screenshot(path="jules-scratch/verification/chart_error.png")
        finally:
            browser.close()

run()

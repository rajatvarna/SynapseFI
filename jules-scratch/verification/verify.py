from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000", timeout=15000)

            # Wait for the card title to be visible to ensure the page is loaded
            card_title = page.get_by_role("heading", name="Welcome to SynapseFI")
            expect(card_title).to_be_visible(timeout=10000) # 10 second timeout

            print("Page loaded successfully. Taking screenshot.")
            page.screenshot(path="jules-scratch/verification/verification.png")
            print("Screenshot saved to jules-scratch/verification/verification.png")

        except Exception as e:
            print(f"An error occurred: {e}")
            # In case of error, save a screenshot anyway to help debug
            page.screenshot(path="jules-scratch/verification/error.png")
        finally:
            browser.close()

run()

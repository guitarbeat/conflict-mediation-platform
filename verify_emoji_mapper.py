from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Navigate to app
        page.goto("http://localhost:5173")

        # 2. Fill Step 1
        page.fill('input[id="partyAName"]', "Alice")
        page.fill('input[id="partyBName"]', "Bob")
        page.fill('textarea[id="conflictDescription"]', "Disagreement about project timeline.")

        # Click Next
        # NavigationButtons has "Next" button
        next_button = page.get_by_role("button", name="Next")
        next_button.click()

        # 3. Step 2, SubStep 0: Thoughts
        # Wait for transition
        page.wait_for_timeout(1000)

        # Fill Thoughts
        page.fill('textarea[id="partyAThoughts"]', "I think Bob is unreasonable.")

        # Click Next to go to SubStep 1
        next_button.click()

        # 4. Step 2, SubStep 1: Emotions (EmojiGridMapper)
        page.wait_for_timeout(1000)

        # Verify EmojiGridMapper is visible
        expect(page.get_by_text("I feel...")).to_be_visible()

        # Click the start button (Emoji in circle)
        # It has aria-label "Start by placing emoji in the center"
        start_btn = page.get_by_label("Start by placing emoji in the center")
        start_btn.click()

        # Now recommendations should appear
        page.wait_for_timeout(500)

        # Verify "confused" button is present and click it
        # Note: "confused" is in recommended list for neutral
        confused_btn = page.get_by_role("button", name="confused")
        confused_btn.click()

        # Take screenshot
        page.screenshot(path="verification_emoji_mapper.png")

        browser.close()

if __name__ == "__main__":
    run()

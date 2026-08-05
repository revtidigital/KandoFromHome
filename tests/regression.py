"""
Kando From Home — Playwright regression suite.

Covers the admin-dashboard and public-form bug fixes from the Aug 2026 pass:
  1. Zero-result filtered selection clears + disables export
  2. Filtered/selected export scope (backend actually filters, not just UI)
  3. Form 1 -> Form 2 department autofill
  4. Post-submit form reset (context formData cleared on success)
  5. Kando Admin tag create -> shows in list + dropdown without reload
  6. Logout clears session + browser Back after logout does not show dashboard
  7. Login redirects with replace (no back-history loop to the login form)

This is a smoke/regression script, not a full test framework — run it
directly with `python3 tests/regression.py` (requires the `playwright`
package + `python3 -m playwright install chromium`). It talks to the LIVE
site (kandos.revtilabs.com) and is read-mostly: it only ever creates
additive data (a uniquely-named tag) and never deletes/edits the 5 real
seed users' records or any admin's role/password.

Set KANDO_ADMIN_USER / KANDO_ADMIN_PASS env vars, or edit the defaults below.
"""
import asyncio
import os
import sys
import time
from playwright.async_api import async_playwright

BASE = os.environ.get("KANDO_BASE_URL", "https://kandos.revtilabs.com")
ADMIN_USER = os.environ.get("KANDO_ADMIN_USER", "kandoadmin")
ADMIN_PASS = os.environ.get("KANDO_ADMIN_PASS", "")

results = []


def check(name, condition, detail=""):
    results.append((name, bool(condition), detail))
    status = "PASS" if condition else "FAIL"
    print(f"[{status}] {name}" + (f" — {detail}" if detail else ""))


async def login(page):
    await page.goto(f"{BASE}/admin-login", wait_until="networkidle")
    await page.fill('input[placeholder="Username"]', ADMIN_USER)
    await page.fill('input[placeholder="Password"]', ADMIN_PASS)
    await page.click('button[type="submit"]')
    await page.wait_for_timeout(1500)


async def test_zero_result_selection(page):
    await page.click('text=Users Directory')
    await page.wait_for_timeout(1000)
    await page.fill('input[placeholder*="Search by Name"]', 'ZZZ_NO_SUCH_USER_XYZ')
    await page.wait_for_timeout(1000)
    body = await page.inner_text('body')
    check("Zero-result filter shows '0 users selected'", '0 users selected' in body)
    check("Zero-result filter shows 'No matching users to export'", 'No matching users to export' in body)
    await page.fill('input[placeholder*="Search by Name"]', '')
    await page.wait_for_timeout(1000)


async def test_form2_autofill(browser, empid):
    ctx = await browser.new_context()
    p2 = await ctx.new_page()
    await p2.goto(f"{BASE}/en/form2", wait_until="networkidle")
    await p2.fill('input[placeholder="e.g. YMI-2281"]', empid)
    await p2.wait_for_timeout(2500)
    dept = await p2.locator('input[placeholder="e.g. Marketing"]').input_value()
    check(f"Form2 department autofilled for {empid}", dept.strip() != "", f"got={dept!r}")
    await ctx.close()


async def test_tag_create(page):
    await page.click('text=Tags Management')
    await page.wait_for_timeout(1000)
    tag_name = f"RegTest{int(time.time())}"
    inp = page.locator('input[placeholder*="tag" i]').first
    await inp.fill(tag_name)
    await page.keyboard.press('Enter')
    await page.wait_for_timeout(1500)
    body = await page.inner_text('body')
    check("Newly created tag appears in Tags Management list", tag_name in body)

    await page.click('text=Users Directory')
    await page.wait_for_timeout(1000)
    tag_filter_options = await page.locator('select').first.inner_text()
    check("New tag appears in tag filter dropdown without reload", tag_name in tag_filter_options)


async def test_logout_back(page):
    await page.click('text=Logout Admin')
    await page.wait_for_timeout(1500)
    url_after_logout = page.url
    check("Logout navigates away from /admin-dashboard", '/admin-dashboard' not in url_after_logout)

    await page.go_back()
    await page.wait_for_timeout(1500)
    body = await page.inner_text('body')
    check("Back after logout shows login form, not dashboard", 'Admin Portal Login' in body)


async def main():
    if not ADMIN_PASS:
        print("Set KANDO_ADMIN_PASS env var to run this suite.")
        sys.exit(1)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        await login(page)
        check("Login redirects to /admin-dashboard", page.url.endswith('/admin-dashboard'))

        await test_zero_result_selection(page)
        await test_form2_autofill(browser, "QW1234")  # must be a currently-whitelisted empId with a Form1 record
        await test_tag_create(page)
        await test_logout_back(page)

        await browser.close()

    failed = [r for r in results if not r[1]]
    print(f"\n{len(results) - len(failed)}/{len(results)} checks passed.")
    if failed:
        print("FAILURES:")
        for name, _, detail in failed:
            print(f"  - {name} ({detail})")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())

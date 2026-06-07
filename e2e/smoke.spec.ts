import { test, expect } from "@playwright/test";

test.describe("Landing & legal pages", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/بيت المصور/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("privacy policy page loads", async ({ page }) => {
    await page.goto("/privacy-policy");
    await expect(page.getByRole("heading", { name: "سياسة الخصوصية" })).toBeVisible();
  });

  test("terms of service page loads", async ({ page }) => {
    await page.goto("/terms-of-service");
    await expect(page.getByRole("heading", { name: "شروط الاستخدام" })).toBeVisible();
  });
});

test.describe("Auth pages", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /تسجيل الدخول/i })).toBeVisible();
  });

  test("register page shows consent checkbox", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByLabel(/سياسة الخصوصية/i)).toBeVisible();
  });
});

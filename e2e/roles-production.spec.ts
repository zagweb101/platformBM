import { test, expect, type Page } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "https://platformbm-production.up.railway.app";

const USERS = {
  admin: { email: "admin@baytalmosawer.com", password: "Admin@123456" },
  instructor: { email: "ahmed@baytalmosawer.com", password: "Instructor@123" },
  student: { email: "khaled@example.com", password: "Student@123" },
  studentNew: { email: "mona@example.com", password: "Student@123" },
};

async function login(page: Page, email: string, password: string, dashboardPath: string) {
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole("button", { name: "تسجيل الدخول" }).click();
  await page.waitForTimeout(3000);
  await page.goto(`${BASE}${dashboardPath}`, { waitUntil: "networkidle" });
  expect(page.url()).not.toContain("/login");
}

test.describe("Real role-based E2E — production", () => {
  test.describe.configure({ mode: "serial", timeout: 90000 });

  test("ADMIN — login, dashboard, courses, payments, instructors", async ({ page }) => {
    await login(page, USERS.admin.email, USERS.admin.password, "/dashboard/admin");
    await expect(page.getByText(/لوحة|إدارة|admin/i).first()).toBeVisible({ timeout: 15000 });

    await page.goto(`${BASE}/dashboard/admin/courses`);
    await expect(page.locator("body")).toContainText(/دورة|كورس|course/i);

    await page.goto(`${BASE}/dashboard/admin/payments`);
    await expect(page.locator("body")).toContainText(/دفع|payment|تحويل/i);

    await page.goto(`${BASE}/dashboard/admin/instructors`);
    await expect(page.locator("body")).toContainText(/مدرب|instructor/i);
  });

  test("INSTRUCTOR — login, courses list, course builder", async ({ page }) => {
    await login(page, USERS.instructor.email, USERS.instructor.password, "/dashboard/instructor");
    await expect(page.locator("body")).toContainText(/مدرب|instructor|دورة/i);

    await page.goto(`${BASE}/dashboard/instructor/courses`);
    await expect(page.locator("body")).toContainText(/دورة|كورس|أساسيات/i);

    const courseLink = page.locator('a[href*="/dashboard/instructor/courses/"]').first();
    if (await courseLink.count()) {
      await courseLink.click();
      await expect(page.locator("body")).toContainText(/درس|قسم|section|lesson/i);
    }
  });

  test("STUDENT (enrolled) — dashboard, payments, course player", async ({ page }) => {
    await login(page, USERS.student.email, USERS.student.password, "/dashboard/student");
    await expect(page.locator("body")).toContainText(/طالب|student|دورة|تعلم/i);

    await page.goto(`${BASE}/dashboard/student/payments`);
    await expect(page.locator("body")).toContainText(/دفع|payment|دورة/i);

    const learnLink = page.locator('a[href*="/dashboard/student/learn/"]').first();
    if (await learnLink.count()) {
      await learnLink.click();
      await page.waitForURL(/learn\//, { timeout: 15000 });
      await expect(page.locator("body")).toContainText(/درس|مكتمل|منهج/i);
    }
  });

  test("STUDENT (not enrolled) — payments page accessible", async ({ page }) => {
    await login(page, USERS.studentNew.email, USERS.studentNew.password, "/dashboard/student/payments");
    await expect(page.locator("body")).toContainText(/دفع|payment|دورة|299|450|599/i);
  });

  test("PUBLIC — landing, contact, legal pages", async ({ page }) => {
    await page.goto(BASE);
    await expect(page).toHaveTitle(/بيت المصور/);

    await page.goto(`${BASE}/privacy-policy`);
    await expect(page.getByRole("heading", { name: "سياسة الخصوصية" })).toBeVisible();

    await page.goto(`${BASE}/terms-of-service`);
    await expect(page.getByRole("heading", { name: "شروط الاستخدام" })).toBeVisible();

    await page.goto(`${BASE}/contact`);
    await expect(page.locator("body")).toContainText(/تواصل|رسالة/i);
  });
});

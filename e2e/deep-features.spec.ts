import { test, expect, type Page } from "@playwright/test";

const USERS = {
  admin: { email: "admin@baytalmosawer.com", password: "Admin@123456" },
  student: { email: "khaled@example.com", password: "Student@123" },
};

async function acceptCookies(page: Page) {
  const btn = page.getByRole("button", { name: "موافق" });
  if (await btn.isVisible().catch(() => false)) {
    await btn.click();
  }
}

async function login(page: Page, email: string, password: string) {
  await page.goto("/login", { waitUntil: "networkidle" });
  await acceptCookies(page);
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole("button", { name: "تسجيل الدخول" }).click();
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 15000 });
}

test.describe("Deep — landing & about", () => {
  test("home explains project with new sections", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: /أكاديمية رقمية/i })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText("ثلاث خطوات لبدء رحلتك")).toBeVisible();
    await expect(page.getByRole("link", { name: "الفعاليات" }).first()).toBeVisible();
  });

  test("about page uses new design", async ({ page }) => {
    await page.goto("/about", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: /أكاديمية رقمية/i })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText("ثلاث خطوات لبدء رحلتك")).toBeVisible();
  });

  test("events public page loads", async ({ page }) => {
    await page.goto("/events", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: /جميع الفعاليات/i })).toBeVisible({
      timeout: 15000,
    });
  });
});

test.describe("Deep — profile settings", () => {
  test("student can open profile settings", async ({ page }) => {
    await login(page, USERS.student.email, USERS.student.password);
    await page.goto("/dashboard/student/settings", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: "الملف الشخصي" })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByLabel("الاسم الكامل")).toBeVisible();
    await expect(page.getByText("تغيير كلمة المرور")).toBeVisible();
  });
});

test.describe.serial("Deep — events CRUD + join + approve", () => {
  test.setTimeout(90_000);
  const eventTitle = `اختبار E2E ${Date.now()}`;
  let eventUrl = "";

  test("admin creates and publishes event", async ({ page }) => {
    await login(page, USERS.admin.email, USERS.admin.password);
    await page.goto("/dashboard/admin/events", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: "إدارة الفعاليات" })).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole("button", { name: "فعالية جديدة" }).click();
    await page.getByLabel("العنوان").fill(eventTitle);
    await page.getByLabel("الوصف").fill(
      "فعالية اختبار آلية للتحقق من إنشاء ونشر الفعاليات في منصة بيت المصور."
    );
    await page.getByLabel("المكان").fill("جدة — اختبار");
    const start = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    const localStart = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}T${pad(start.getHours())}:${pad(start.getMinutes())}`;
    await page.locator('input[type="datetime-local"]').first().fill(localStart);
    await page.getByLabel("السعة (اختياري)").fill("10");
    await page.getByLabel("الحالة").selectOption("PUBLISHED");
    await acceptCookies(page);
    await page.getByRole("button", { name: "حفظ" }).click();
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(eventTitle)).toBeVisible({ timeout: 15000 });

    await page.goto("/events", { waitUntil: "networkidle" });
    await expect(page.getByText(eventTitle)).toBeVisible({ timeout: 15000 });
    const link = page.locator(`a:has-text("${eventTitle}")`).first();
    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();
    eventUrl = href!;
  });

  test("student requests to join event", async ({ page }) => {
    test.skip(!eventUrl, "Event URL missing from prior step");
    await login(page, USERS.student.email, USERS.student.password);
    await page.goto(eventUrl, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(eventTitle.slice(0, 20));
    await page.getByRole("button", { name: "طلب الانضمام" }).click();
    await expect(page.getByText(/قيد المراجعة|حالة طلبك/i).first()).toBeVisible({
      timeout: 15000,
    });

    await page.goto("/dashboard/student/events", { waitUntil: "networkidle" });
    await expect(page.getByText(eventTitle)).toBeVisible();
    await expect(page.getByText("قيد المراجعة")).toBeVisible();
  });

  test("admin approves registration", async ({ page }) => {
    test.skip(!eventUrl, "Event URL missing from prior step");
    await login(page, USERS.admin.email, USERS.admin.password);
    await page.goto("/dashboard/admin/events", { waitUntil: "networkidle" });

    const eventCard = page.locator("article").filter({ hasText: eventTitle });
    await expect(eventCard).toBeVisible({ timeout: 15000 });
    await eventCard.getByRole("button", { name: /الطلبات/i }).click();
    await acceptCookies(page);
    await eventCard.getByRole("button", { name: "قبول" }).click();
    await page.waitForLoadState("networkidle");

    await page.context().clearCookies();
    await login(page, USERS.student.email, USERS.student.password);
    await page.goto("/dashboard/student/events", { waitUntil: "networkidle" });
    const row = page.locator("li").filter({ hasText: eventTitle });
    await expect(row.getByText("مقبول")).toBeVisible({ timeout: 15000 });
  });
});

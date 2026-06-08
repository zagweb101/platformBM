"use client";

type Strength = "weak" | "medium" | "strong" | "empty";

export function getPasswordStrength(password: string): Strength {
  if (!password) return "empty";
  if (password.length < 6) return "weak";

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) || /[أ-ي]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9\u0600-\u06FF]/.test(password)) score += 1;

  if (score <= 1) return "weak";
  if (score <= 2) return "medium";
  return "strong";
}

const LABELS: Record<Exclude<Strength, "empty">, string> = {
  weak: "ضعيفة",
  medium: "متوسطة",
  strong: "قوية",
};

const COLORS: Record<Exclude<Strength, "empty">, string> = {
  weak: "bg-red-500",
  medium: "bg-amber-500",
  strong: "bg-emerald-500",
};

export function PasswordStrengthIndicator({ password }: { password: string }) {
  const strength = getPasswordStrength(password);
  if (strength === "empty") return null;

  const width =
    strength === "weak" ? "w-1/3" : strength === "medium" ? "w-2/3" : "w-full";

  return (
    <div className="mt-2 space-y-1">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-section">
        <div
          className={`h-full rounded-full transition-all duration-300 ${COLORS[strength]} ${width}`}
        />
      </div>
      <p className="text-xs font-body text-text-muted">
        قوة كلمة المرور:{" "}
        <span className="font-semibold text-[#151525]">{LABELS[strength]}</span>
      </p>
    </div>
  );
}

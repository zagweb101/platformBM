"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";
import { updateProfile, changePassword } from "@/actions/profile.actions";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { UploadButton } from "@/lib/uploadthing";

interface ProfileSettingsFormProps {
  user: {
    name: string;
    email: string;
    phone: string | null;
    bio: string | null;
    image: string | null;
  };
}

export default function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [image, setImage] = useState(user.image ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProfilePending, startProfileTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();

  const handleProfileSave = () => {
    startProfileTransition(async () => {
      const res = await updateProfile({ name, phone, bio, image });
      if (res.error) toast.error(res.error);
      else toast.success(res.success);
    });
  };

  const handlePasswordSave = () => {
    startPasswordTransition(async () => {
      const res = await changePassword({ currentPassword, newPassword, confirmPassword });
      if (res.error) toast.error(res.error);
      else {
        toast.success(res.success);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-[#151525] font-heading sm:text-3xl">
          الملف الشخصي
        </h1>
        <p className="mt-1 text-sm text-text-secondary font-body">
          حدّث بياناتك وصورتك الشخصية.
        </p>
      </header>

      <Card variant="default" padding="lg" className="space-y-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative h-24 w-24 overflow-hidden rounded-full bg-surface-section">
            {image ? (
              <Image src={image} alt={name} fill sizes="96px" className="object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                <User className="h-10 w-10 text-text-muted" aria-hidden="true" />
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <UploadButton
              endpoint="profileImageUploader"
              onClientUploadComplete={(res) => {
                const url = res?.[0]?.url;
                if (url) {
                  setImage(url);
                  toast.success("تم رفع الصورة");
                }
              }}
              onUploadError={(error) => {
                toast.error(error.message);
              }}
            />
            <p className="text-xs text-text-muted font-body">PNG أو JPG — حد أقصى 4MB</p>
          </div>
        </div>

        <Input label="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="البريد الإلكتروني" value={user.email} disabled />
        <Input
          label="رقم الجوال"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          hint="اختياري — يُستخدم للتواصل بخصوص الفعاليات"
        />
        <Textarea
          label="نبذة عنك"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          hint="اختياري — حتى 500 حرف"
        />

        <Button
          variant="primary"
          size="lg"
          onClick={handleProfileSave}
          loading={isProfilePending}
          className="w-full sm:w-auto"
        >
          حفظ التغييرات
        </Button>
      </Card>

      <Card variant="bordered" padding="lg" className="space-y-6">
        <h2 className="text-lg font-bold text-[#151525] font-heading">تغيير كلمة المرور</h2>
        <PasswordInput
          label="كلمة المرور الحالية"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <PasswordInput
          label="كلمة المرور الجديدة"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <PasswordInput
          label="تأكيد كلمة المرور"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          variant="outline"
          size="lg"
          onClick={handlePasswordSave}
          loading={isPasswordPending}
          icon={isPasswordPending ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
        >
          تحديث كلمة المرور
        </Button>
      </Card>
    </div>
  );
}

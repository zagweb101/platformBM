import { redirect } from "next/navigation";
import { getProfileData } from "@/actions/profile.actions";
import ProfileSettingsForm from "@/components/dashboard/ProfileSettingsForm";

export const metadata = {
  title: "الملف الشخصي | بيت المصور",
};

export default async function InstructorSettingsPage() {
  const user = await getProfileData();
  if (!user) redirect("/login");
  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
    redirect("/dashboard/instructor");
  }

  return <ProfileSettingsForm user={user} />;
}

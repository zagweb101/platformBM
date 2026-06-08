import { redirect } from "next/navigation";
import { getProfileData } from "@/actions/profile.actions";
import ProfileSettingsForm from "@/components/dashboard/ProfileSettingsForm";

export const metadata = {
  title: "الملف الشخصي | بيت المصور",
};

export default async function StudentSettingsPage() {
  const user = await getProfileData();
  if (!user) redirect("/login");

  return <ProfileSettingsForm user={user} />;
}

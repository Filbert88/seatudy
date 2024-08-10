import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/auth-options";
import "../globals.css";
import { redirect } from "next/navigation";
import InstructorNavbar from "@/components/instructor-navbar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();
  if (session?.user?.role !== "INSTRUCTOR") {
    redirect("/");
  }
  return (
    <main>
      <InstructorNavbar />
      {children}
    </main>
  );
}

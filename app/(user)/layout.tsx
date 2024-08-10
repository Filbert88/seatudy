import { getServerAuthSession } from "../api/auth/[...nextauth]/auth-options";
import { redirect } from "next/navigation";
import StudentNavbar from "@/components/student-navbar";
import { Providers } from "../providers";

export default async function EntryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();

  if (session?.user?.role !== "USER" && session) {
    redirect("/instructor-dashboard");
  }
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Providers>
            <StudentNavbar />
            {children}
          </Providers>
        </main>
      </div>
    </>
  );
}

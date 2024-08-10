import "../../globals.css";
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/auth-options";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();
  if (session) {
    redirect("/");
  }
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <main>{children}</main>
      </div>
    </>
  );
}

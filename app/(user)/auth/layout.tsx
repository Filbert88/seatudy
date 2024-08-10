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
      <div className="w-full min-h-screen bg-[url('/assets/login_bg.png')] bg-cover flex items-center justify-center font-nunito">
        <main>{children}</main>
      </div>
    </>
  );
}

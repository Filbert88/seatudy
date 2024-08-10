import "../globals.css";
import StudentNavbar from "@/components/student-navbar";
import { Providers } from "../providers";

export default async function EntryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

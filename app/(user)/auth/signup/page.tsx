import React from "react";
import SignupForm from "./signUpForm";
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/auth-options";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/");
  }

  return (
    <div>
      <SignupForm />
    </div>
  );
}

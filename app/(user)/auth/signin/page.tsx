import React from "react";
import SigninForm from "./signInForm";
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/auth-options";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await getServerAuthSession();
  
  if (session) {
    redirect("/");
  }

  return <SigninForm />;
}

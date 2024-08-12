import React from "react";
import Home from "./main-client";
import { getCoursesInfo } from "@/lib/queries/course";
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/auth-options";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await getServerAuthSession();
  const courses = await getCoursesInfo();

  return (
    <div>
      <Home initialCourseData={courses} session={session} />
    </div>
  );
}

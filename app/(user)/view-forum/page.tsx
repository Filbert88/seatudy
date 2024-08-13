import React from "react";
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/auth-options";
import ViewForumPage from "./forum-page";

export default async function page() {
  const session = await getServerAuthSession();
  return (
    <div className="overflow-x-hidden">
      <ViewForumPage session={session} />
    </div>
  );
}

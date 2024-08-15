"use client";
import React from "react";
import SeatudyLogo from "./assets/seatudy-logo";
import { IoNotificationsOutline } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const InstructorNavbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleNavbarClick = (route: string) => {
    const id = new URLSearchParams(window.location.search).get("id");
    router.push(route + "?id=" + id);
  };

  return (
    <nav className="h-20 bg-secondary flex fixed w-full z-50 font-normal">
      <div className="flex justify-between items-center ml-3 text-primary w-full">
        <div
          className="flex items-center hover:cursor-pointer mr-10"
          onClick={() => handleNavbarClick("/")}
        >
          <SeatudyLogo className="h-10 w-10 mx-2" />
          <span className="font-semibold text-2xl mx-2">seatudy</span>
        </div>
        <div className="flex items-center">
          {status === "authenticated" &&
            !pathname.includes("instructor-dashboard") &&
            !pathname.includes("view-submissions") &&
            !pathname.includes("create-courses") &&
            !pathname.includes("instructor-notification-page") &&
            !pathname.includes("edit-materials") &&
            !pathname.includes("edit-assignments") && (
              <>
                <button
                  onClick={() => handleNavbarClick("/view-materials")}
                  className={`mx-10 font-semibold hover:opacity-50 transition text-md hover:cursor-pointer ${
                    pathname.includes("view-materials") && "text-fourth"
                  }`}
                >
                  Materials
                </button>
                <button
                  onClick={() => handleNavbarClick("/view-assignments")}
                  className={`mx-10 font-semibold hover:opacity-50 transition text-md hover:cursor-pointer ${
                    pathname.includes("view-assignments") && "text-fourth"
                  }`}
                >
                  Assignments
                </button>
                <button
                  onClick={() => handleNavbarClick("/view-threads")}
                  className={`mx-10 font-semibold hover:opacity-50 transition text-md hover:cursor-pointer ${
                    (pathname.includes("view-threads") ||
                      pathname.includes("create-thread")) &&
                    "text-fourth"
                  }`}
                >
                  Discussions
                </button>
                <button
                  onClick={() => handleNavbarClick("/delete-courses")}
                  className={`mx-10 font-semibold hover:opacity-50 transition text-md hover:cursor-pointer ${
                    pathname.includes("delete-courses")
                      ? "text-fourth"
                      : "text-red-500"
                  }`}
                >
                  Delete Course
                </button>
              </>
            )}
        </div>
        <div className="flex items-center justify-end ml-auto mr-10">
          {status === "authenticated" && (
            <>
              <IoNotificationsOutline
                className="text-primary mx-2 h-6 w-6 hover:cursor-pointer hover:opacity-50 transition"
                onClick={() => router.push("/instructor-notification-page")}
              />
              <button
                onClick={() =>
                  router.push("/instructor-dashboard/view-profile")
                }
                className="hover:cursor-pointer hover:opacity-50 transition ml-5 flex items-center"
              >
                <div className="mr-4 text-md">{session?.user?.name}</div>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default InstructorNavbar;

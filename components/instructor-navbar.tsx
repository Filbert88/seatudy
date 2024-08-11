"use client";
import React from "react";
import SeatudyLogo from "./assets/seatudy-logo";
import { IoNotificationsOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { NavbarInterface } from "./types/types";
import { useSession } from "next-auth/react";

const InstructorNavbar = ({ activePage }: NavbarInterface) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleNavbarClick = (route: string) => {
    router.push(route);
  };

  return (
    <nav className="h-20 bg-secondary flex fixed w-full z-50 font-normal">
      <div className="flex justify-between items-center ml-3 text-primary w-full">
        <div
          className="flex items-center hover:cursor-pointer"
          onClick={() => handleNavbarClick("/")}
        >
          <SeatudyLogo className="h-10 w-10 mx-2" />
          <span className="font-semibold text-2xl mx-2">seatudy</span>
        </div>
        <div className="flex items-center">
          {status === "authenticated" && (
            <>
              <a
                onClick={() => handleNavbarClick("/instructor-dashboard")}
                className={`mx-10 font-semibold hover:underline text-md hover:cursor-pointer ${
                  activePage === "Dashboard" && "text-fourth"
                }`}
              >
                Dashboard
              </a>
              <a
                onClick={() => handleNavbarClick("/manage-courses")}
                className={`mx-10 font-semibold hover:underline text-md hover:cursor-pointer ${
                  activePage === "Manage Courses" && "text-fourth"
                }`}
              >
                Manage Courses
              </a>
            </>
          )}
        </div>
        <div className="flex items-center justify-end ml-auto mr-10">
          {status === "authenticated" && (
            <>
              <IoNotificationsOutline className="text-primary mx-2 h-6 w-6" />
              <div
                onClick={() => router.push("/instructor-dashboard/view-profile")}
                className="hover:cursor-pointer ml-5 flex items-center"
              >
                <div className="mr-4 text-md">{session?.user?.name}</div>
                <div className="bg-primary h-8 w-8 rounded-full"></div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default InstructorNavbar;

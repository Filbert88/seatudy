"use client";
import React, { useState } from "react";
import SeatudyLogo from "../assets/seatudy-logo";
import { IoSearch, IoNotificationsOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { NavbarInterface } from "./types/types";
import { signOut, useSession } from 'next-auth/react';

const Navbar = ({ isLoggedIn, activePage }: NavbarInterface) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      location.reload();
      router.push(`/search?query=${searchQuery}`);
    }
  };

  const handleNavbarClick = (route: string) => {
    router.push(route);
  }

  return (
    <nav className="h-20 bg-secondary flex fixed w-full z-50">
      <div className="flex justify-between items-center ml-3 text-primary w-full">
        <div
          className="flex items-center hover:cursor-pointer"
          onClick={() => handleNavbarClick('/')}
        >
          <SeatudyLogo className="h-10 w-10 mx-2" />
          <span className="font-semibold text-2xl mx-2">seatudy</span>
        </div>
        <div className="flex items-center border border-primary rounded-md ml-10 mx-10 bg-transparent text-sm w-[20rem]">
          <IoSearch className="text-primary mx-2" />
          <input
            className="bg-transparent border-none outline-none w-full py-[0.5rem]"
            placeholder="What do you want to learn today?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
        <div className="flex items-center">
          {status === 'authenticated' && (
            <a
              href="#"
              className={`mx-10 font-semibold hover:underline text-md ${
                activePage === "My Courses" && "text-fourth"
              }`}
            >
              My Courses
            </a>
          )}
          <a
            onClick={() => handleNavbarClick('/all-courses')}
            className={`mx-10 font-semibold hover:underline text-md hover:cursor-pointer ${
              activePage === "All Courses" && "text-fourth"
            }`}
          >
            All Courses
          </a>
          <a
            onClick={() => handleNavbarClick('/popular-courses')}
            className={`mx-10 font-semibold hover:underline text-md hover:cursor-pointer ${
              activePage === "Popular Courses" && "text-fourth"
            }`}
          >
            Popular Courses
          </a>
        </div>
        <div className="flex items-center justify-end ml-auto mr-10">
          {status === 'authenticated' && (
            <>
              <IoNotificationsOutline className="text-primary mx-2 h-6 w-6" />
              <div onClick={() => signOut()} className="hover:cursor-pointer ml-5 flex items-center">
                <div className="mr-4 text-md">User</div>
                <div className="bg-primary h-8 w-8 rounded-full"></div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

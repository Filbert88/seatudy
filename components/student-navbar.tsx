"use client";
import React, { useState } from "react";
import SeatudyLogo from "./assets/seatudy-logo";
import { IoSearch, IoNotificationsOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { NavbarInterface } from "./types/types";
import { useSession } from "next-auth/react";
import LoadingBouncer from "./loading";

const StudentNavbar = ({ activePage }: NavbarInterface) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsLoading(true);
      const searchParams = new URLSearchParams(window.location.search);
      const rating = searchParams.get("rating") ?? undefined;
      const difficulty = searchParams.get("difficulty") ?? undefined;
      const category = searchParams.get("categoryId") ?? undefined;
      const queryParams = buildQueryParams(
        rating,
        difficulty,
        category,
        searchQuery
      );
      router.push(`/all-courses?${queryParams}`);
      setIsLoading(false);
    }
  };

  const buildQueryParams = (
    rating?: string,
    difficulty?: string,
    category?: string,
    title?: string
  ) => {
    const params = new URLSearchParams();

    if (rating) {
      params.set("rating", rating);
    }
    if (difficulty) {
      params.set("difficulty", difficulty);
    }
    if (category) {
      params.set("categoryId", category);
    }
    if (title) {
      params.set("title", title);
    }
    return params.toString();
  };

  const handleNavbarClick = (route: string) => {
    router.push(route);
  };

  return (
    <nav className="h-20 bg-secondary flex fixed w-full z-50 font-normal">
      {isLoading && <LoadingBouncer />}
      <div className="flex justify-between items-center ml-3 text-primary w-full">
        <button
          className="flex items-center hover:cursor-pointer"
          onClick={() => {
            setIsLoading(true);
            handleNavbarClick("/");
            setIsLoading(false);
          }}
        >
          <SeatudyLogo className="h-10 w-10 mx-2" />
          <span className="font-semibold text-2xl mx-2">seatudy</span>
        </button>
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
          {status === "authenticated" && (
            <button
              onClick={() => {
                setIsLoading(true);
                handleNavbarClick("/my-courses");
                setIsLoading(false);
              }}
              className={`mx-10 font-semibold hover:opacity-50 transition text-md hover:cursor-pointer ${
                activePage === "My Courses" && "text-fourth"
              }`}
            >
              My Courses
            </button>
          )}
          <button
            onClick={() => {
              setIsLoading(true);
              handleNavbarClick("/all-courses");
              setIsLoading(false);
            }}
            className={`mx-10 font-semibold hover:opacity-50 transition text-md hover:cursor-pointer ${
              activePage === "All Courses" && "text-fourth"
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => {
              setIsLoading(true);
              handleNavbarClick("/popular-courses");
              setIsLoading(false);
            }}
            className={`mx-10 font-semibold hover:opacity-50 transition text-md hover:cursor-pointer ${
              activePage === "Popular Courses" && "text-fourth"
            }`}
          >
            Popular Courses
          </button>
        </div>
        <div className="flex items-center justify-end ml-auto mr-10">
          {status === "authenticated" && (
            <>
              <IoNotificationsOutline
                className="text-primary mx-2 h-6 w-6 hover:cursor-pointer hover:opacity-50 transition"
                onClick={() => {
                  setIsLoading(true);
                  router.push("/notification-page");
                  setIsLoading(false);
                }}
              />
              <button
                onClick={() => {
                  setIsLoading(true);
                  router.push("/view-profile");
                  setIsLoading(false);
                }}
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

export default StudentNavbar;

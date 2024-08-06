"use client";
import React, { useState } from 'react';
import SeatudyLogo from '../assets/seatudy-logo';
import { IoSearch, IoNotificationsOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';

interface Props {
  isLoggedIn: boolean;
  activePage?: string;
};

const Navbar = ({ isLoggedIn, activePage }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/');
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      location.reload();
      router.push(`/search?query=${searchQuery}`);
    }
  }

  return (
    <nav className="h-20 bg-secondary flex fixed w-full">
      <div className="flex justify-between items-center ml-3 text-primary w-full">
        <div className="flex items-center hover:cursor-pointer" onClick={handleLogoClick}>
          <SeatudyLogo className="h-10 w-10 mx-2"/>
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
          {isLoggedIn && <a href="#" className={`mx-10 font-semibold hover:underline text-md ${activePage === 'My Courses' && 'text-fourth'}`}>My Courses</a>}
          <a href="#" className={`mx-10 font-semibold hover:underline text-md ${activePage === 'All Courses' && 'text-fourth'}`}>All Courses</a>
          <a href="#" className={`mx-10 font-semibold hover:underline text-md ${activePage === 'Popular Courses' && 'text-fourth'}`}>Popular Courses</a>
        </div>
        <div className="flex items-center justify-end ml-auto mr-5">
          {isLoggedIn && (
            <>
              <IoNotificationsOutline className="text-primary mx-2 h-6 w-6" />
              <div className="hover:cursor-pointer ml-5 flex items-center">
                <div className="mr-4 text-md">User</div>
                <div className="bg-primary h-8 w-8 rounded-full"></div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

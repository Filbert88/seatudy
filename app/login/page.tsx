"use client";

import { useState } from "react";
import SeatudyLogo from "../assets/seatudy-logo";
import { useRouter } from "next/navigation";

export default function Home() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleLoginClick = () => {
    if (email === '' || password === '') {
      alert('Please fill in all fields');
      return;
    }
    router.push('/');
  }

  const handleRegisterClick = () => {
    router.push('/register');
  }

  return (
    <main className="w-screen min-h-screen bg-[url('/assets/login_bg.png')] bg-cover py-20 px-[15rem] flex flex-col font-nunito">
      <div className="rounded-3xl flex bg-third flex-grow h-full">
        <div className="w-[50%] bg-[url('/assets/login_rectangle.png')] bg-cover rounded-l-3xl p-8">
          <div className="flex items-center">
            <SeatudyLogo className="w-10 h-10"/>
            <span className="font-bold text-2xl text-white ml-4">seatudy</span>
          </div>
        </div>
        <div className="w-full rounded-r-3xl p-10">
          <div className="font-bold text-white text-4xl mb-[3rem]">Welcome back</div>
          <div className="font-semibold text-white text-xl mb-3">Email</div>
          <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} className="w-full h-10 rounded-lg px-3 mb-10" placeholder="Enter your email address.." required/>

          <div className="font-semibold text-white text-xl mb-3">Password</div>
          <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} className="w-full h-10 rounded-lg px-3 mb-8" placeholder="Enter your password.." required/>

          <div className="flex justify-between">
            <a className="mr-2 text-primary">Don't have an account yet?</a>
            <a className="underline text-primary hover:cursor-pointer mr-auto" onClick={handleRegisterClick}>Register here</a>
            <div className="underline text-primary hover:cursor-pointer">Forgot Password</div>
          </div>
          
          <div onClick={handleLoginClick} className="bg-fourth mt-8 w-fit px-10 py-2 text-white font-bold rounded-lg hover:cursor-pointer">Login</div>
        </div>
      </div>
    </main>
  );
};

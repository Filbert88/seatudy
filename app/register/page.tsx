"use client";

import { useState } from "react";
import SeatudyLogo from "../assets/seatudy-logo";
import { useRouter } from "next/navigation";

export default function Home() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [campus, setCampus] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  }

  const handleRegisterClick = () => {
    if (fullName === '' || email === '' || phoneNumber === '' || campus === '' || role === '' || password === '' || confirmPassword === '') {
      alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    router.push('/login');
  }

  const handlePhoneNumberField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    setPhoneNumber(phoneNumber);
  }
  
  
  return (
    <main className="w-screen min-h-screen bg-[url('/assets/register_bg.png')] bg-cover py-20 px-[15rem] flex flex-col font-nunito">
      <div className="rounded-3xl flex bg-third flex-grow h-full">
        <div className="w-[50%] bg-[url('/assets/register_rectangle.png')] bg-cover rounded-l-3xl p-8">
          <div className="flex items-center">
            <SeatudyLogo className="w-10 h-10"/>
            <span className="font-bold text-2xl text-white ml-4">seatudy</span>
          </div>
        </div>
        <div className="w-full rounded-r-3xl p-10">
          <div className="font-bold text-white text-4xl mb-[2rem]">Welcome to seatudy</div>
          <input type="text" onChange={(e) => setFullName(e.target.value)} className="w-full h-10 rounded-lg px-3 mb-5" placeholder="Full Name" required/>
          <input type="text" onChange={(e) => setEmail(e.target.value)} className="w-full h-10 rounded-lg px-3 mb-5" placeholder="Email" required/>
          <input type="text" onChange={handlePhoneNumberField} value={phoneNumber} className="w-full h-10 rounded-lg px-3 mb-5" placeholder="Phone Number" required/>
          <input type="text" onChange={(e) => setCampus(e.target.value)} value={campus} className="w-full h-10 rounded-lg px-3 mb-5" placeholder="Campus" required/>
          <input type="text" onChange={(e) => setRole(e.target.value)} value={role} className="w-full h-10 rounded-lg px-3 mb-5" placeholder="Roles" required/>
          <input type="text" onChange={(e) => setPassword(e.target.value)} value={password} className="w-full h-10 rounded-lg px-3 mb-5" placeholder="Password" required/>
          <input type="text" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} className="w-full h-10 rounded-lg px-3 mb-5" placeholder="Confirm Password" required/>

          <a className="text-primary mr-2">Already have an account?</a>
          <a className="text-primary underline hover:cursor-pointer" onClick={handleLoginClick}>Login here</a>
          <div onClick={handleRegisterClick} className="bg-fourth mt-8 w-fit px-10 py-2 text-white font-bold rounded-lg hover:cursor-pointer">Register</div>
        </div>
      </div>
    </main>
  );
};

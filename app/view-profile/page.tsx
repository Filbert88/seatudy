"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DummyProfile from "../../public/assets/dummy_icon.jpg";
import { useState } from "react";
import Navbar from "../components/navbar";

const ViewProfilePage = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<number>();
  const [campus, setCampus] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [balance, setBalance] = useState<number>();

  const handleTopUp = () => {
    router.push("/topup-form");
  };

  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className="bg-primary h-full flex px-5 pb-5 pt-[8rem]">
        <div className="flex flex-row space-x-5 px-5 container">
          <div className="flex-shrink-0">
            <Image
              src={DummyProfile}
              alt="profile"
              width={300}
              height={300}
              className="rounded-full bg-black object-cover"
            />
          </div>
          <div className="border border-5 rounded-md w-full bg-white p-10 shadow-lg">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md mb-5 p-5 text-white">
              <h1 className="font-nunito font-bold text-lg">Balance</h1>
              <h1 className="font-nunito font-bold text-4xl">
                Rp {balance ?? 0}
              </h1>
              <button
                type="button"
                onClick={handleTopUp}
                className="rounded-3xl font-bold bg-cyan-200 mt-5 py-2 px-5 text-black hover:bg-cyan-300"
              >
                Top up
              </button>
            </div>
            <form>
              <div className="font-bold">Full Name</div>
              <div className="form-group pb-3 w-full">
                <input
                  type="text"
                  id="formFullName"
                  placeholder={
                    fullName?.length === 0
                      ? "Enter full name"
                      : fullName.toString()
                  }
                  className="p-3 rounded-md bg-slate-300 text-black w-full h-8"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="font-bold">Email</div>
              <div className="form-group pb-3 w-full">
                <input
                  type="email"
                  id="formEmail"
                  placeholder={email?.length === 0 ? "Enter email" : email}
                  className="p-3 rounded-md bg-slate-300 text-black w-full h-8"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="font-bold">Phone Number</div>
              <div className="form-group pb-3 w-full">
                <input
                  type="number"
                  id="formPhoneNumber"
                  placeholder={
                    phoneNumber?.toString().length === 0
                      ? "Enter phone number"
                      : phoneNumber?.toString()
                  }
                  className="p-3 rounded-md bg-slate-300 text-black w-full h-8"
                  value={phoneNumber ?? ""}
                  onChange={(e) => setPhoneNumber(parseInt(e.target.value))}
                />
              </div>
              <div className="font-bold">Campus</div>
              <div className="form-group pb-3 w-full">
                <input
                  type="text"
                  id="formCampus"
                  placeholder={campus?.length === 0 ? "Enter campus" : campus}
                  className="p-3 rounded-md bg-slate-300 text-black w-full h-8"
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                />
              </div>
              <div className="font-bold">Password</div>
              <div className="form-group pb-3 w-full">
                <input
                  type="password"
                  id="formPassword"
                  placeholder={
                    password?.length === 0 ? "Enter password" : password
                  }
                  className="p-3 rounded-md bg-slate-300 text-black w-full h-8"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                onClick={() => alert("Saved!")}
                type="button"
                className="rounded-md bg-tertiary text-background bg-fourth px-10 font-nunito text-white font-extrabold my-5 py-1"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProfilePage;

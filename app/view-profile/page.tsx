"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DummyProfile from "../../public/assets/dummy_icon.jpg";
import { use, useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { useSession } from "next-auth/react";
import { UserInterface } from "../components/types/types";
import { BounceLoader } from "react-spinners";

const ViewProfilePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserInterface>();
  const [userID, setUserID] = useState<string>();
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [campus, setCampus] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [balance, setBalance] = useState<number>();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const { data: session, status } = useSession();

  const handleTopUp = () => {
    router.push("/topup-form");
  };

  useEffect(() => {
    const checkIfUserIsLoggedIn = () => {
      if (status === "authenticated") {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    };
    checkIfUserIsLoggedIn();

    const fetchUserData = async () => {
      console.log(1);
      try {
        if (session) {
          setIsLoading(true);
          const response = await fetch("/api/profile", {
            method: "GET",
            headers: {
              accept: "application/json",
            },
          });
          const data = await response.json();
          setUserData(data.data);
          if (!userID) {
            setUserID(data.data.id);
            setFullName(session?.user?.name ?? "");
            setEmail(session?.user?.email ?? "");
            setPhoneNumber(data.data.phoneNumber ?? "");
            setCampus(data.data.campus ?? "");
            setPassword(data.data.password ?? "");
            setBalance(data.data.balance ?? 0);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [session, status, userID]);

  const handleSave = async () => {
    if (session) {
      try {
        const response = await fetch(`/api/profile/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            email,
            phoneNumber,
            campus,
            password,
          }),
        });
        const data = await response.json();
        if (data) {
          alert("Profile updated successfully");
        }
      } catch (error) {
        alert("Failed to update profile");
        console.error(error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-primary bg-opacity-40 z-50 flex items-center justify-center">
        <BounceLoader color="#393E46" />
      </div>
    );
  }

  return (
    <>
      <Navbar isLoggedIn={isLogin} />
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
                  onChange={(e) => setPhoneNumber(e.target.value)}
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
                onClick={handleSave}
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

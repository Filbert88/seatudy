"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { UserInterface } from "./types/types";
import { BounceLoader } from "react-spinners";
import { set } from "zod";
import { uploadFileToCloudinary } from "@/lib/utils";
import { IoPersonCircleSharp } from "react-icons/io5";
import { profile } from "console";
import React, { useRef } from 'react';

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
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      console.log(userData);
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
            setProfileUrl(data.data.profileUrl ?? "");
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (session) {
      try {
        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("email", email);
        formData.append("phoneNumber", phoneNumber ?? "");
        formData.append("campus", campus);
        formData.append("password", password);
        if (profileFile) {
          formData.append("file", profileFile);
        }
        formData.append("balance", balance?.toString() ?? "");
        setIsLoading(true);
        const response = await fetch(`/api/profile/update`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data) {
          alert("Profile updated successfully");
        }
      } catch (error) {
        alert("Failed to update profile");
        console.error(error);
      } finally {
        setIsLoading(false);
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

  if (isLogin === false) {
    router.push("/auth/signin");
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      if (!allowedFileTypes.includes(selectedFile.type)) {
        alert("Please upload a file in image format");
        return;
      }
      setProfileFile(selectedFile);
      setProfileUrl(URL.createObjectURL(selectedFile));
    }
    console.log(profileUrl);
  };

  return (
    <div className="bg-primary min-h-screen flex pt-[8rem] justify-center font-nunito">
      <div className="flex flex-row container h-fit">
        <div className="border border-5 rounded-md w-full bg-white p-10 shadow-lg">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-500 rounded-md mb-5 p-5 text-white flex justify-between">
            <div>
            <h1 className="font-bold text-xl mb-2">Your Balance</h1>
            <h1 className="font-bold text-4xl ">
              Rp {balance ?? 0}
            </h1>
            <button
              type="button"
              onClick={handleTopUp}
              className="rounded-lg font-bold bg-primary mt-5 py-2 px-5 text-secondary hover:opacity-50"
            >
              Top up
            </button>
            </div>
            <div className="ml-auto">
              {!profileUrl.length ?
                <IoPersonCircleSharp size={150} className="text-gray-300 hover:cursor-pointer hover:opacity-50 w-full" onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }} />
                :
              <div className="hover:cursor-pointer hover:opacity-50 aspect-w-16 aspect-h-16 relative w-[150px] h-[150px]" onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }} >
                <Image
                  src={profileUrl}
                  alt="profile"
                  layout="fill" 
                  objectFit="cover"

                  className="rounded-full"
                />
              </div>
              }
              <input type="file" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
            </div>
          </div>
          <form>
            <div className="font-bold mb-1">Full Name</div>
            <div className="form-group mb-3 w-full">
              <input
                type="text"
                id="formFullName"
                placeholder={
                  fullName?.length === 0
                    ? "Enter full name"
                    : fullName.toString()
                }
                className="p-3 rounded-md bg-primary text-black w-full h-8"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="font-bold mb-1">Email</div>
            <div className="form-group mb-3 w-full">
              <input
                type="email"
                id="formEmail"
                placeholder={email?.length === 0 ? "Enter email" : email}
                className="p-3 rounded-md bg-primary text-black w-full h-8"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="font-bold mb-1">Phone Number</div>
            <div className="form-group mb-3 w-full">
              <input
                type="number"
                id="formPhoneNumber"
                placeholder={
                  phoneNumber?.toString().length === 0
                    ? "Enter phone number"
                    : phoneNumber?.toString()
                }
                className="p-3 rounded-md bg-primary text-black w-full h-8"
                value={phoneNumber ?? ""}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="font-bold mb-1">Campus</div>
            <div className="form-group mb-3 w-full">
              <input
                type="text"
                id="formCampus"
                placeholder={campus?.length === 0 ? "Enter campus" : campus}
                className="p-3 rounded-md bg-primary text-black w-full h-8"
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
              />
            </div>
            <div className="font-bold mb-1">Password</div>
            <div className="form-group mb-3 w-full">
              <input
                type="password"
                id="formPassword"
                placeholder={
                  password?.length === 0 ? "Enter password" : password
                }
                className="p-3 rounded-md bg-primary text-black w-full h-8"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-between mt-5">
              <button
                onClick={handleSave}
                type="button"
                className="rounded-md bg-tertiary text-background bg-fourth px-10 text-white font-extrabold py-1 hover:shadow-md"
              >
                Save
              </button>
              <button
                type="button"
                className="rounded-md bg-tertiary text-background bg-red-500 px-8 text-white font-extrabold ml-auto py-2 hover:shadow-md"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewProfilePage;

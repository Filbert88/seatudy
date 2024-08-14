"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState , useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { BounceLoader } from "react-spinners";
import { useToast } from "@/components/ui/use-toast";
import { IoPersonCircleSharp } from "react-icons/io5";


const ViewProfilePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [campus, setCampus] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const handleTopUp = () => {
    router.push("/topup-form");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "authenticated") {
        setIsLoading(true);
        try {
          const response = await fetch("/api/profile", {
            method: "GET",
            headers: {
              accept: "application/json",
            },
          });
          const data = await response.json();
          if (response.ok) {
            setFullName(session?.user?.name ?? "");
            setEmail(session?.user?.email ?? "");
            setPhoneNumber(data.data.phoneNumber ?? "");
            setCampus(data.data.campus ?? "");
            setPassword("");
            setBalance(data.data.balance ?? 0);
            setProfileUrl(data.data.profileUrl ?? "");
          } else {
            toast({
              title: "Failed to load profile",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error(error);
          toast({
            title: "Error fetching profile data",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        router.push("/auth/signin");
      }
    };
    fetchUserData();
  }, [status, session]);

  const handleSave = async () => {
    if(!fullName || !email || !campus || !password) {
      toast({
        title: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }
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
        if (response.ok) {
          toast({
            title: "Profile updated successfully",
          });
        } else {
          toast({
            title: "Failed to update profile",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error updating profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile && allowedFileTypes.includes(selectedFile.type)) {
      setProfileFile(selectedFile);
      setProfileUrl(URL.createObjectURL(selectedFile));
    } else {
      toast({
        title: "Please upload a file in image format",
        variant: "destructive",
      });
    }
  };

  const formatNumber = (number: number): string => {
    return new Intl.NumberFormat('en-US').format(number) + ".00";
  };

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-primary bg-opacity-40 z-50 flex items-center justify-center">
        <BounceLoader color="#393E46" />
      </div>
    );
  }

  return (
    <div className="bg-primary min-h-screen flex pt-[8rem] justify-center font-nunito">
      <div className="flex flex-row container h-fit">
        <div className="border border-5 rounded-md w-full bg-white p-10 shadow-lg">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-500 rounded-md mb-5 p-5 text-white flex justify-between">
            <div>
            <h1 className="font-bold text-xl mb-2">Your Balance</h1>
            <h1 className="font-bold text-4xl ">
              Rp {balance ? formatNumber(balance) : 0}
            </h1>
            <button
              type="button"
              onClick={handleTopUp}
              className="rounded-lg font-bold bg-primary transition mt-5 py-2 px-5 text-secondary hover:opacity-50"
            >
              Top up
            </button>
            </div>
            <div className="ml-auto">
              {!profileUrl.length ?
                <IoPersonCircleSharp size={150} className="text-gray-300 hover:cursor-pointer hover:opacity-50 transition w-full" onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }} />
                :
              <div className="hover:cursor-pointer hover:opacity-50 aspect-w-16 aspect-h-16 transition relative w-[150px] h-[150px]" onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }} >
                <Image
                  src={profileUrl}
                  alt="profile"
                  fill
                  style={{ objectFit: "cover" }}
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
                placeholder="Enter full name"
                className="p-3 rounded-md border border-grays text-black w-full h-8"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="font-bold mb-1">Email</div>
            <div className="form-group mb-3 w-full">
              <input
                type="email"
                id="formEmail"
                placeholder="Enter email"
                className="p-3 rounded-md border border-grays text-black w-full h-8"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="font-bold mb-1">Phone Number</div>
            <div className="form-group mb-3 w-full">
              <input
                type="number"
                id="formPhoneNumber"
                placeholder="Enter phone number"
                className="p-3 rounded-md border border-grays text-black w-full h-8"
                value={phoneNumber ?? ""}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="font-bold mb-1">Campus</div>
            <div className="form-group mb-3 w-full">
              <input
                type="text"
                id="formCampus"
                placeholder="Enter campus"
                className="p-3 rounded-md border border-grays text-black w-full h-8"
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
              />
            </div>
            <div className="font-bold mb-1">Password</div>
            <div className="form-group mb-3 w-full">
              <input
                type="password"
                id="formPassword"
                placeholder="Enter your current or new password"
                className="p-3 rounded-md border border-grays text-black w-full h-8"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-between mt-5">
              <button
                onClick={handleSave}
                type="button"
                className="rounded-md bg-tertiary text-background transition bg-fourth px-10 text-white font-extrabold py-1 hover:shadow-md"
              >
                Save
              </button>
              <button
                type="button"
                className="rounded-md bg-tertiary text-background transition bg-red-500 px-8 text-white font-extrabold ml-auto py-2 hover:shadow-md"
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

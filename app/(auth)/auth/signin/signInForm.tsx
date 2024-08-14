"use client";
import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { BounceLoader } from "react-spinners";
import SeatudyLogo from "@/components/assets/seatudy-logo";
import { useToast } from "@/components/ui/use-toast";

const SigninForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleLoginClick = async () => {
    if (email === "" || password === "") {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (response?.error) {
        let errorMessage = "Login failed";
        try {
          const parsedError = JSON.parse(response.error);
          if (parsedError?.message) {
            errorMessage = parsedError.message;
          }
        } catch {
          errorMessage = response.error;
        }
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      toast({
        title: "An error occurred",
        description: "Please try again.",
        variant: "destructive",
      });
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    router.push("/auth/signup");
  };

  return (
    <div className="w-screen min-h-screen bg-[url('/assets/login_bg.png')] bg-cover py-20 px-[15rem] flex flex-col font-nunito">
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <BounceLoader color="#393E46" />
        </div>
      )}
      <div className="rounded-3xl flex bg-third flex-grow h-full">
        <div className="w-[50%] bg-[url('/assets/login_rectangle.png')] bg-cover rounded-l-3xl p-8">
          <div className="flex items-center">
            <SeatudyLogo className="w-10 h-10" />
            <span className="font-bold text-2xl text-white ml-4">seatudy</span>
          </div>
        </div>
        <div className="w-full rounded-r-3xl p-10">
          <div className="font-bold text-white text-4xl mb-[3rem]">
            Welcome back
          </div>
          <div className="font-semibold text-white text-xl mb-3">Email</div>
          <input
            type="email"
            onChange={handleChange}
            value={email}
            className="w-full h-10 rounded-lg px-3 mb-10"
            placeholder="Enter your email address.."
            name="email"
            required
          />

          <div className="font-semibold text-white text-xl mb-3">Password</div>
          <input
            type="password"
            onChange={handleChange}
            value={password}
            className="w-full h-10 rounded-lg px-3 mb-8"
            placeholder="Enter your password.."
            name="password"
            required
          />

          <div className="flex justify-between">
            <a className="mr-2 text-primary">{"Don't have an account yet?"}</a>
            <a
              className="underline text-primary hover:cursor-pointer mr-auto"
              onClick={handleRegisterClick}
            >
              Sign Up here
            </a>
            <div className="underline text-primary hover:cursor-pointer">
              Forgot Password
            </div>
          </div>

          <div
            onClick={handleLoginClick}
            className="bg-fourth mt-8 w-fit px-10 py-2 text-white font-bold rounded-lg hover:cursor-pointer"
          >
            Sign In
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninForm;

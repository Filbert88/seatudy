"use client";
import React, { useState, ChangeEvent } from "react";
import * as z from "zod";
import { useRouter } from "next/navigation";
import SeatudyLogo from "@/components/assets/seatudy-logo";
import { BounceLoader } from "react-spinners";
import { useToast } from "@/components/ui/use-toast";

const userSchema = z
  .object({
    fullName: z
      .string()
      .min(3, { message: "Full name must be at least 3 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    phoneNumber: z.string().min(10, { message: "Phone number must be valid" }),
    campus: z
      .string()
      .min(1, { message: "Campus name must be at least 1 character long" }),
    role: z.string().min(1, { message: "Roles must be inputted" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().min(8, {
      message: "Confirm password must be at least 8 characters long",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof userSchema>;

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    campus: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<z.ZodFormattedError<FormData>>>(
    {}
  );

  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      handlePhoneNumberField(value);
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginClick = () => {
    router.push("/auth/signin");
  };

  const handleSubmit = async () => {
    const validation = userSchema.safeParse(formData);
    if (!validation.success) {
      setErrors(validation.error.format());
      toast({
        title: "Validation error",
        description: "Please check your input and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Signup successful",
          description: "You can now sign in with your new account.",
        });
        router.push("/auth/signin");
      } else {
        const data = await response.json();
        toast({
          title: "Signup failed",
          description: data.message || "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("An error occurred:", err);
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneNumberField = (value: string) => {
    const phoneNumber = value.replace(/\D/g, ""); // Remove non-numeric characters
    setFormData({ ...formData, phoneNumber });
  };

  return (
    <div className="w-screen min-h-screen bg-[url('/assets/register_bg.png')] bg-cover py-20 px-[15rem] flex flex-col font-nunito">
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <BounceLoader color="#393E46" />
        </div>
      )}
      <div className="rounded-3xl flex bg-third flex-grow h-full">
        <div className="w-[50%] bg-[url('/assets/register_rectangle.png')] bg-cover rounded-l-3xl p-8">
          <div className="flex items-center">
            <SeatudyLogo className="w-10 h-10" />
            <span className="font-bold text-2xl text-white ml-4">seatudy</span>
          </div>
        </div>
        <div className="w-full rounded-r-3xl p-10">
          <div className="font-bold text-white text-4xl mb-[2rem]">
            Welcome to seatudy
          </div>
          <input
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full h-10 rounded-lg px-3"
            placeholder="Full Name"
            name="fullName"
            required
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName._errors[0]}
            </p>
          )}
          <input
            type="text"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-10 rounded-lg px-3 mt-4"
            placeholder="Email"
            name="email"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email._errors[0]}
            </p>
          )}
          <input
            type="text"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full h-10 rounded-lg px-3 mt-4"
            placeholder="Phone Number"
            name="phoneNumber"
            required
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phoneNumber._errors[0]}
            </p>
          )}
          <input
            type="text"
            value={formData.campus}
            onChange={handleChange}
            className="w-full h-10 rounded-lg px-3 mt-4"
            placeholder="Campus"
            name="campus"
            required
          />
          {errors.campus && (
            <p className="text-red-500 text-sm mt-1">
              {errors.campus._errors[0]}
            </p>
          )}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full h-10 rounded-lg px-3 mt-4"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="instructor">Instructor</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">
              {errors.role._errors[0]}
            </p>
          )}
          <input
            type="password"
            onChange={handleChange}
            value={formData.password}
            className="w-full h-10 rounded-lg px-3 mt-4"
            placeholder="Password"
            name="password"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password._errors[0]}
            </p>
          )}
          <input
            type="password"
            onChange={handleChange}
            value={formData.confirmPassword}
            className="w-full h-10 rounded-lg px-3 mt-4"
            placeholder="Confirm Password"
            name="confirmPassword"
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword._errors[0]}
            </p>
          )}
          <div className="mt-4">
            <a className="text-primary mr-2">Already have an account?</a>
            <button
              className="text-primary underline hover:cursor-pointer hover:opacity-50 transition"
              onClick={handleLoginClick}
            >
              Sign In here
            </button>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-fourth mt-8 w-fit px-10 py-2 text-white font-bold rounded-lg hover:cursor-pointer hover:shadow-md transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;

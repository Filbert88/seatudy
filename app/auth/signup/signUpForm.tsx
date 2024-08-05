"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import * as z from "zod";
import { useRouter } from "next/navigation";

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
    confirmPassword: z
      .string()
      .min(8, {
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
  const [errors, setErrors] = useState<Partial<z.ZodFormattedError<FormData>>>(
    {}
  );
  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validation = userSchema.safeParse(formData);
    if (!validation.success) {
      setErrors(validation.error.format());
    } else {
      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          router.push("/auth/signin");
        } else {
          // Handle errors
          console.error(data.message);
        }
      } catch (err) {
        console.error("An error occurred:", err);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
          />
          {errors.fullName && (
            <p className="text-red-600 text-sm mt-1">
              {errors.fullName._errors[0]}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">
              {errors.email._errors[0]}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
          />
          {errors.phoneNumber && (
            <p className="text-red-600 text-sm mt-1">
              {errors.phoneNumber._errors[0]}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Campus</label>
          <input
            type="text"
            name="campus"
            value={formData.campus}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
          />
          {errors.campus && (
            <p className="text-red-600 text-sm mt-1">
              {errors.campus._errors[0]}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="instructor">Instructor</option>
          </select>
          {errors.role && (
            <p className="text-red-600 text-sm mt-1">
              {errors.role._errors[0]}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {errors.password._errors[0]}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">
              {errors.confirmPassword._errors[0]}
            </p>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white font-bold rounded-md "
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;

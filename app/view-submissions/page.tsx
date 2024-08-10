"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BounceLoader } from "react-spinners";

const ViewSubmissionsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <BounceLoader color="#393E46" />
      </div>
    );
  }

  return (
    <div className="px-72 pt-24">
      <div className="font-nunito text-4xl font-bold">
        Introduction to Numerical Programming
      </div>
      <button
        type="button"
        className="rounded-md bg-tertiary text-background bg-fourth px-10 font-nunito text-white font-extrabold my-5 py-2"
      >
        Create new task
      </button>
    </div>
  );
};

export default ViewSubmissionsPage;

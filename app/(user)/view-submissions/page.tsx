"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingBouncer from "../all-courses/loading";

const ViewSubmissionsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  if (isLoading) {
    return (
      <LoadingBouncer />
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

"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Image from "next/image";
import checkoutBanner from "../../public/assets/checkout_banner.gif";
import { useRouter } from "next/navigation";
import {
  CourseDetailsInterface,
  UserInterface,
} from "../components/types/types";
import { BounceLoader } from "react-spinners";

const CheckOutPage = () => {
  const { data: session, status } = useSession();
  const [courseId, setCourseId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [courseDetails, setCourseDetails] = useState<CourseDetailsInterface>();
  const [profile, setProfile] = useState<UserInterface>();
  const router = useRouter();

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setCourseId(id);
    }
  }, []);

  useEffect(() => {
    const getCourse = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/course/${courseId}`, {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        });
        const data = await response.json();
        setCourseDetails(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      getCourse();
    }

    const getProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/profile", {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        });
        const data = await response.json();
        setProfile(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (session) {
      getProfile();
    }
  }, [courseId, session]);

  const handlePurchase = async () => {
    if (profile?.balance && courseDetails?.price) {
      if (Number(profile.balance) < Number(courseDetails.price)) {
        alert("Insufficient Balance");
        return;
      }
    }
    // Call API for purchase here...
    try {
      setIsLoading(true);
      const response = await fetch(`/api/course/${courseId}/purchase`, {
        method: "POST",
        headers: {
          accept: "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        alert("Purchase Successful");
        router.push("/");
      } else {
        alert(`Purchase Failed: ${data.message}`);
        router.push("/");
      }
    } catch (error) {
      alert(`Purchase Failed: ${error}`);
      console.error(error);
    } finally {
      setIsLoading(false);
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
      <Navbar />
      <div className="w-screen h-screen items-center justify-center bg-primary flex">
        <form className="form-content mt-10 min-w-[60vh] rounded-md items-center justify-center bg-third">
          <div className="relative w-full h-48">
            <Image
              src={checkoutBanner}
              layout="fill"
              objectFit="cover"
              className="rounded-t-md"
              alt="Course Image"
            />
          </div>
          <div className="font-nunito text-xl px-5 pt-5 text-start font-extrabold text-white">
            Purchase Details
          </div>
          <div className="py-5 px-3 mx-3 mb-3 flex items-center rounded-md bg-gray-800 text-white h-8">
            {courseDetails?.title}
          </div>
          <div className="font-nunito text-xl px-5 pt-5 text-start font-extrabold text-white">
            Pay for it with
          </div>
          <div className="py-5 px-3 mx-3 mb-3 flex items-center rounded-md bg-gray-800 text-white h-8">
            Your Balance: Rp {profile?.balance.toLocaleString()}
          </div>
          <div className="text-xs flex items-center px-5 pb-1 text-white">
            By clicking “purchase”, you agree to the Paid Services Terms
          </div>
          <hr className="border-t-1 border-white flex items-center mb-3 mx-5 w-[25rem]" />
          <div className="text-xs flex items-center px-5 pb-5 text-white">
            <p className="max-w-[25rem]">
              Hey! This purchase is non-refundable. Once you complete your
              purchase, the item will be available for use immediately and can
              be accessed in My Course options in your navigation bar.
            </p>
          </div>
          <div className="flex flex-row justify-end space-x-4 pb-5 px-3">
            <button
              onClick={() => router.back()}
              type="button"
              className="rounded-md bg-black text-background px-6 font-nunito text-white text-sm py-1 font-extrabold"
            >
              Go Back
            </button>
            <button
              onClick={handlePurchase}
              type="button"
              className="rounded-md bg-tertiary text-background bg-fourth px-5 font-nunito text-sm py-1 text-white font-extrabold"
            >
              Purchase
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CheckOutPage;

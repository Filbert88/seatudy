"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CourseDetailsInterface,
  UserInterface,
} from "@/components/types/types";
import LoadingBouncer from "./loading";
import { useToast } from "@/components/ui/use-toast";

const CheckOutPage = () => {
  const { data: session } = useSession();
  const [courseId, setCourseId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [courseDetails, setCourseDetails] = useState<CourseDetailsInterface>();
  const [profile, setProfile] = useState<UserInterface>();
  const router = useRouter();
  const { toast } = useToast();

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
        toast({
          title: "Failed to load course details",
          variant: "destructive",
        });
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
        toast({
          title: "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (session) {
      getProfile();
    }
  }, [courseId, session]); // eslint-disable-line

  const handlePurchase = async () => {
    if (profile?.balance && courseDetails?.price) {
      if (Number(profile.balance) < Number(courseDetails.price)) {
        router.push("/topup-form");
        toast({
          title: "Insufficient Balance",
          variant: "destructive",
        });
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
      console.log(data);
      if (response.ok && data.message === "Success") {
        toast({
          title: "Purchase Successful",
        });
        router.push("/my-courses");
      } else if (data.message === "Already purchased this course") {
        toast({
          title: "You have already purchased this course",
          variant: "destructive",
        });
        router.push("/my-courses");
      } else {
        toast({
          title: `Failed to purchase a course`,
          variant: "destructive",
        });
        router.push("/");
      }
    } catch (error) {
      toast({
        title: `Failed to purchase a course`,
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (number: number): string => {
    return new Intl.NumberFormat('en-US').format(number) + ".00";
  };


  if (isLoading) {
    return <LoadingBouncer />;
  }
  return (
    <div className="min-w-screen h-screen items-center bg-primary flex flex-col text-secondary font-nunito pt-20">
      <form className="form-content mt-10 max-w-[30%] items-center h-fit w-fit justify-center bg-white shadow-lg p-2">
        <div className="relative aspect-w-16 aspect-h-9">
          <Image
            src={
              courseDetails
                ? courseDetails?.thumbnailUrl
                : "/assets/checkout_banner.gif"
            }
            fill
            style={{ objectFit: "cover" }}
            loading="lazy"
            alt="Course Image"
          />
        </div>
        <div className="p-3">
          <div className="font-nunito text-xl mb-2 text-start font-semibold">
            Course Title
          </div>
          <input value={courseDetails?.title} disabled className="py-1 px-3 rounded-md border border-grays w-full" />
          <div className="font-nunito text-xl mb-2 mt-5 text-start font-semibold">
            Course Price
          </div>
          <input value={`Rp ${formatNumber(courseDetails?.price ?? 0)}`} disabled className="py-1 px-3 rounded-md border border-grays w-full" />
          <div className="font-nunito text-xl mb-2 mt-5 text-start font-semibold">
            Your balance
          </div>
          <input value={`Rp ${formatNumber(profile?.balance ?? 0)}`} disabled className="py-1 px-3 rounded-md border border-grays w-full" />
          <div className="text-xs flex items-center my-5">
            By clicking “purchase”, you agree to the Paid Services Terms
          </div>
          <div className="text-xs flex items-center mb-8 max-w-[80%]">
              {"*This purchase is non-refundable. Once you complete your purchase, the item will be available for use immediately and can be accessed in My Course options in your navigation bar."}
          </div>
          <div className="flex flex-row justify-end space-x-4 mb-2">
            <button
              onClick={() => router.back()}
              type="button"
              className="rounded-md text-background px-5 py-1 font-nunito border-2 border-fourth text-fourth hover:opacity-65 transition text-sm font-extrabold"
            >
              Go Back
            </button>
            <button
              onClick={handlePurchase}
              type="button"
              className="rounded-md bg-tertiary text-background bg-fourth px-5 font-nunito text-sm py-1 text-white hover:shadow-md transition font-extrabold"
            >
              Purchase
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckOutPage;

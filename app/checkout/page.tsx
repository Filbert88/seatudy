"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Image from "next/image";
import checkoutBanner from "../../public/assets/checkout_banner.gif";
import { useRouter } from "next/navigation";

const CheckOutPage = () => {
  const { data: session, status } = useSession();
  const [isLogin, setIsLogin] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const checkIfUserIsLoggedIn = () => {
      if (status === "authenticated") {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    };
    checkIfUserIsLoggedIn();

    const routeToAddPaymentMethod = () => {
      if (selectedPaymentMethod === "addNewPayment") {
        router.push("/topup-form");
      }
    };
    routeToAddPaymentMethod();
  }, [selectedPaymentMethod, router, status]);
  return (
    <>
      <Navbar isLoggedIn={isLogin} />
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
            Introduction to Javascript
          </div>
          <div className="font-nunito text-xl px-5 pt-5 text-start font-extrabold text-white">
            Pay for it with
          </div>
          <div className="py-5 px-3 mx-3 mb-3 flex items-center rounded-md bg-gray-800 text-white h-8">
            <select
              className="bg-gray-800 w-full font-nunito"
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            >
              <option value="" className="text-gray-400">
                Click here to view your payment method...
              </option>
              <option value="addNewPayment">Add a new payment method</option>
              {paymentMethod?.map((method, index) => (
                <option key={index} value={method}>
                  {method}
                </option>
              ))}
            </select>
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
              onClick={() => alert("Payment Successful!")}
              type="button"
              className="rounded-md bg-tertiary text-background bg-fourth px-10 font-nunito text-sm py-1 text-white font-extrabold"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CheckOutPage;

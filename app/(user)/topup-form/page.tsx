"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BounceLoader } from "react-spinners";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { SiAmericanexpress } from "react-icons/si";
import { useToast } from "@/components/ui/use-toast";

const TopUpFormPage = () => {
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardDate, setCardDate] = useState<string>("");
  const [cardCVC, setCardCVC] = useState<string>("");
  const [cardName, setCardName] = useState<string>("");
  const [nominals, setNominals] = useState<string>();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (status === "authenticated") {
      setIsLoading(false);
    }
  }, [status]);

  const formatCardDate = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    const formattedValue =
      cleanValue.length > 2
        ? `${cleanValue.slice(0, 2)}/${cleanValue.slice(2)}`
        : cleanValue;
    return formattedValue.length > 5
      ? formattedValue.slice(0, 5)
      : formattedValue;
  };

  const formatCardCVC = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    return cleanValue.length > 3 ? cleanValue.slice(0, 3) : cleanValue;
  };

  const formatCardNumberWithSpaces = (number: string) => {
    return number.replace(/\D/g, "").replace(/(.{4})(?=.)/g, "$1 ");
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 19) {
      setCardNumber(formatCardNumberWithSpaces(input));
    }
  };

  const handleCardDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardDate(formatCardDate(e.target.value));
  };

  const handleCardCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardCVC(formatCardCVC(e.target.value));
  };

  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardName(e.target.value);
  };

  const formatNumberWithCommas = (number: string) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleNominalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    val = formatNumberWithCommas(val);
    setNominals(val);
  };

  const addTransactionData = async () => {
    const isVisa = /^4\d{12}(\d{3})?$/;
    const isMastercard = /^5[1-5]\d{14}$/;
    const isAmex = /^3[47]\d{13}$/;

    // Case #1: Check if the form is filled
    if (
      cardNumber === "" ||
      cardDate === "" ||
      cardCVC === "" ||
      cardName === "" ||
      !nominals
    ) {
      toast({
        title: "Please fill all the fields!",
        variant: "destructive",
      });
      return;
    }

    // Case #2: Check if the card number is valid
    if (
      !isVisa.test(cardNumber.replace(/\s/g, "")) &&
      !isMastercard.test(cardNumber.replace(/\s/g, "")) &&
      !isAmex.test(cardNumber.replace(/\s/g, ""))
    ) {
      toast({
        title: "Invalid card number!",
        variant: "destructive",
      });
      return;
    }

    // Case #3: Check if the expiration date is valid
    const isDate = /^\d{2}\/\d{2}$/;
    if (!isDate.test(cardDate)) {
      toast({
        title: "Invalid expiration date!",
        variant: "destructive",
      });
      return;
    }

    // Case #4: Check if the CVC is valid
    const isCVC = /^\d{3}$/;
    if (!isCVC.test(cardCVC)) {
      toast({
        title: "Invalid CVC!",
        variant: "destructive",
      });
      return;
    }

    // Case #5: Check if the nominals is valid
    if (nominals === "0") {
      toast({
        title: "Invalid Nominals!",
        variant: "destructive",
      });
      return;
    }

    // Case #6: Check if the name is valid
    const isName = /^[a-zA-Z\s]*$/;
    if (!isName.test(cardName)) {
      toast({
        title: "Invalid Name!",
        variant: "destructive",
      });
      return;
    }

    try {
      if (session) {
        setIsLoading(true);
        const response = await fetch("/api/topup", {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: parseInt(nominals.replace(/,/g, "")),
            cardNumber: cardNumber,
            expirationDate: cardDate,
            cvc: cardCVC,
            cardHolderName: cardName,
          }),
        });
        if (response.ok) {
          toast({
            title: "Payment method has been added successfully!",
          });
          router.push("/view-profile");
        } else {
          toast({
            title: "Error adding a payment method",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error adding a payment method",
        variant: "destructive",
      });
      console.error("Error adding a payment method", error);
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
    <div className="w-screen h-screen items-center justify-center bg-primary flex">
      <form className="form-content p-5 mt-10 min-w-[80vh] rounded-md items-center justify-center bg-white">
        <div className="font-nunito text-2xl pb-5 w-full text-start font-extrabold text-secondary">
          Add Payment Method
        </div>
        <div className="font-bold flex flex-row justify-between">
          <div className="flex justify-start">Card Number</div>
          <div className="flex flex-row space-x-4 ">
            <div className="fit flex justify-end space-x-1">
              <FaCcVisa />
              <FaCcMastercard />
              <SiAmericanexpress />
            </div>
          </div>
        </div>
        <div className="form-group pb-5 w-full">
          <input
            type="text"
            id="formCardNumber"
            placeholder="Enter a card number..."
            className="p-3 rounded-md bg-primary text-secondary w-full h-8"
            value={cardNumber}
            onChange={handleCardNumberChange}
          />
        </div>
        <div className="font-bold">Expiration Date</div>
        <div className="form-group pb-5 w-full">
          <input
            type="text"
            id="formCardDate"
            placeholder="MM/YY"
            className="p-3 rounded-md bg-primary text-secondary w-full h-8"
            value={cardDate}
            onChange={handleCardDateChange}
          />
        </div>
        <div className="font-bold">CVC</div>
        <div className="form-group pb-5 w-full">
          <input
            type="number"
            id="formCardCVC"
            placeholder="Security Code"
            className="p-3 rounded-md bg-primary text-secondary w-full h-8"
            value={cardCVC}
            onChange={handleCardCVCChange}
          />
        </div>
        <div className="font-bold">Name on the card</div>
        <div className="form-group pb-5 w-full">
          <input
            type="text"
            id="formCardName"
            placeholder="Name"
            className="p-3 rounded-md bg-primary text-secondary w-full h-8"
            value={cardName}
            onChange={handleCardNameChange}
          />
        </div>
        <div className="font-bold">Nominals (IDR)</div>
        <div className="form-group pb-5 w-full">
          <input
            type="text"
            id="formCardName"
            placeholder="Enter Nominals"
            className="p-3 rounded-md bg-primary text-secondary w-full h-8"
            value={nominals}
            onChange={handleNominalsChange}
          />
        </div>
        <div className="flex flex-row justify-end space-x-4 pt-5">
          <button
            onClick={() => router.back()}
            type="button"
            className="rounded-md bg-tertiary text-background border-fourth border-2 px-6 font-nunito text-fourth font-extrabold"
          >
            Go Back
          </button>
          <button
            onClick={addTransactionData}
            type="button"
            className="rounded-md bg-tertiary text-background bg-fourth px-10 font-nunito text-white font-extrabold"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
export default TopUpFormPage;

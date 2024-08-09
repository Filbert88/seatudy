"use client";

import { useState } from "react";
import Navbar from "../components/navbar";
import visaIcon from "../../public/assets/visa_icon.png";
import mastercardIcon from "../../public/assets/mastercard_icon.png";
import amexIcon from "../../public/assets/amex_icon.png";
import Image from "next/image";

const TopUpFormPage = () => {
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardDate, setCardDate] = useState<string>("");
  const [cardCVC, setCardCVC] = useState<string>("");
  const [cardName, setCardName] = useState<string>("");
  const [nominals, setNominals] = useState<number>();

  const handleClick = () => {
    let isVisa = /^4\d{12}(\d{3})?$/;
    let isMastercard = /^5[1-5]\d{14}$/;
    let isAmex = /^3[47]\d{13}$/;

    // Case #1: Check if the form is filled
    if (
      cardNumber === "" ||
      cardDate === "" ||
      cardCVC === "" ||
      cardName === "" ||
      nominals === 0
    ) {
      alert("Please fill all the fields!");
      return;
    }

    // Case #2: Check if the card number is valid
    if (
      !isVisa.test(cardNumber) &&
      !isMastercard.test(cardNumber) &&
      !isAmex.test(cardNumber)
    ) {
      alert("Invalid card number!");
      return;
    }

    // Case #3: Check if the expiration date is valid
    let isDate = /^\d{2}\/\d{2}$/;
    if (!isDate.test(cardDate)) {
      alert("Invalid expiration date!");
      return;
    }

    // Case #4: Check if the CVC is valid
    let isCVC = /^\d{3}$/;
    if (!isCVC.test(cardCVC)) {
      alert("Invalid CVC!");
      return;
    }

    // Case #5: Check if the nominals is valid
    if (nominals === 0) {
      alert("Invalid Nominals!");
      return;
    }

    // Case #6: Check if the name is valid
    let isName = /^[a-zA-Z\s]*$/;
    if (!isName.test(cardName)) {
      alert("Invalid Name!");
      return;
    }

    // Case #7: If all the fields are valid
    alert("Payment method has been added successfully!");
  };

  const handleInputPhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setCardNumber(phoneNumber);
  };

  return (
    <>
      <Navbar />
      <div className="w-screen h-screen items-center justify-center bg-primary flex">
        <form className="form-content p-5 mt-10 min-w-[80vh] rounded-md items-center justify-center bg-white">
          <div className="font-nunito text-2xl pb-5 w-full text-start font-extrabold text-secondary">
            Add Payment Method
          </div>
          <div className="font-bold flex flex-row justify-between">
            <div className="flex justify-start">Card Number</div>
            <div className="flex flex-row space-x-4 ">
              <Image
                src={visaIcon}
                alt="Visa Icon"
                className="fit flex justify-end"
                width={20}
                height={20}
              />
              <Image
                src={mastercardIcon}
                alt="mastercard Icon"
                className="fit flex justify-end"
                width={20}
                height={20}
              />
              <Image
                src={amexIcon}
                alt="amex Icon"
                className="fit flex justify-end"
                width={20}
                height={20}
              />
            </div>
          </div>
          <div className="form-group pb-5 w-full">
            <input
              type="number"
              id="formCardNumber"
              placeholder="Enter a card number..."
              className="p-3 rounded-md bg-slate-300 text-grays w-full h-8"
              value={cardNumber}
              onChange={handleInputPhoneNumber}
            />
          </div>
          <div className="font-bold">Expiration Date</div>
          <div className="form-group pb-5 w-full">
            <input
              type="text"
              id="formCardDate"
              placeholder="MM/YY"
              className="p-3 rounded-md bg-slate-300 text-grays w-full h-8"
              value={cardDate}
              onChange={(e) => setCardDate(e.target.value)}
            />
          </div>
          <div className="font-bold">CVC</div>
          <div className="form-group pb-5 w-full">
            <input
              type="number"
              id="formCardCVC"
              placeholder="Security Code"
              className="p-3 rounded-md bg-slate-300 text-grays w-full h-8"
              value={cardCVC}
              onChange={(e) => setCardCVC(e.target.value)}
            />
          </div>
          <div className="font-bold">Name on the card</div>
          <div className="form-group pb-5 w-full">
            <input
              type="text"
              id="formCardName"
              placeholder="Name"
              className="p-3 rounded-md bg-slate-300 text-grays w-full h-8"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
          </div>
          <div className="font-bold">Nominals (IDR)</div>
          <div className="form-group pb-5 w-full">
            <input
              type="number"
              id="formCardName"
              placeholder="Enter Nominals"
              className="p-3 rounded-md bg-slate-300 text-grays w-full h-8"
              value={nominals}
              onChange={(e) => setNominals(parseInt(e.target.value))}
            />
          </div>
          <div className="flex flex-row justify-end space-x-4 pt-5">
            <button
              onClick={() => alert("Go Back!")}
              type="button"
              className="rounded-md bg-tertiary text-background border-fourth border-2 px-6 font-nunito text-fourth font-extrabold"
            >
              Go Back
            </button>
            <button
              onClick={handleClick}
              type="button"
              className="rounded-md bg-tertiary text-background bg-fourth px-10 font-nunito text-white font-extrabold"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default TopUpFormPage;

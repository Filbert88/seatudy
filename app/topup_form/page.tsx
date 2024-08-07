"use client";

import { useState } from "react";
import Navbar from "../components/navbar";

const TopUpFormPage = () => {
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardDate, setCardDate] = useState<string>("");
  const [cardCVC, setCardCVC] = useState<string>("");
  const [cardName, setCardName] = useState<string>("");
  const [nominals, setNominals] = useState<number>();
  const handleClick = () => {
    if (
      cardNumber === "" ||
      cardDate === "" ||
      cardCVC === "" ||
      cardName === "" ||
      nominals === 0
    ) {
      alert("Please fill all the fields!");
    }
    if (cardNumber.length < 16) {
      alert("Card number must be 16 digits!");
    }
    if (cardDate.length < 5) {
      alert("Expiration date must be in MM/YY format!");
    }
    if (cardCVC.length < 3) {
      alert("CVC must be 3 digits!");
    }
    if (nominals === 0) {
      alert("Nominals must be more than 0!");
    } else {
      alert("Saved!");
    }
  };

  const handleInputPhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setCardNumber(phoneNumber);
  };

  return (
    <>
      <Navbar isLoggedIn={false} />
      <div className="w-screen h-screen items-center justify-center bg-primary flex">
        <form className="form-content p-5 mt-10 min-w-[80vh] rounded-md items-center justify-center bg-white">
          <div className="font-nunito text-2xl pb-5 w-full text-start font-extrabold text-secondary">
            Add Payment Method
          </div>
          <div className="font-bold">Card Number</div>
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

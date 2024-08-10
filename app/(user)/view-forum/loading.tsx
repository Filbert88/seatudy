import React from "react";
import { BounceLoader } from "react-spinners";

export default function LoadingBouncer() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <BounceLoader color="#393E46" />
    </div>
  );
}

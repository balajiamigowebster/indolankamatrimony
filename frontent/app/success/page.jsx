"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const SuccessPage = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // ✅ Get registration data from sessionStorage
    const data = sessionStorage.getItem("registrationSuccess");

    if (data) {
      setUserData(JSON.parse(data));
      // ❌ Don't remove immediately! Remove when leaving or later
      // sessionStorage.removeItem("registrationSuccess");
    }
    //  else {
    //   // If no registration data, redirect to home
    //   router.replace("/");
    // }

    return () => sessionStorage.removeItem("registrationSuccess");
  }, [router]);

  if (!userData) return null; // or loader while redirecting

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50 p-6">
      <CheckCircle className="text-green-600 w-20 h-20 mb-5" />
      <h1 className="text-3xl font-bold text-green-700 mb-2">
        Registration Successful ✅
      </h1>
      <p className="text-lg text-green-800 mb-4">
        Hello <span className="font-semibold">{userData.name}</span>!
      </p>
      <p className="text-md text-green-700 mb-2">
        Your Profile ID: <span className="font-semibold">{userData.id}</span>
      </p>
      <p className="text-md text-green-700">
        Registered successfully, we will contact you soon.
      </p>
      <button
        onClick={() => {
          sessionStorage.removeItem("registrationSuccess"); // ✅ Remove on leaving
          router.push("/");
        }}
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Back to Home
      </button>
    </div>
  );
};

export default SuccessPage;

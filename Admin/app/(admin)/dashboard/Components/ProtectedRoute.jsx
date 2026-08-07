"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();

  const { isAuthenticated, isAuthChecked } = useSelector(
    (state) => state.adminAuth
  );

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("Push Login pAge Start");
      router.push("/");
    }
  }, [isAuthChecked, isAuthenticated, router]);

  if (!isAuthChecked) {
    console.log("AuthChecked Running");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("Authenticated Runnung");

    return null;
  }

  // Only show dashboard content when authenticated
  return <>{children}</>;
};

export default ProtectedRoute;

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchAdminDetailsOnLoad,
  loginAdmin,
  reset,
} from "./redux/Slices/adminAuthSlice";

const page = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();

  //console.log(formData);

  const { isLoading, isAuthenticated, error, isAuthChecked } = useSelector(
    (state) => state.adminAuth
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    dispatch(loginAdmin(formData))
      .unwrap()
      .then(() => {
        toast.success("Login successful!");
        router.push("/dashboard");
      })
      .catch((err) => {
        //const errorMessage = err.payload || err.message || "Login failed";
        toast.error(err);
      });
  };

  useEffect(() => {
    dispatch(fetchAdminDetailsOnLoad());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthChecked && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthChecked, isAuthenticated, router]);

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (!isAuthChecked || (isAuthChecked && isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-6 w-6 " />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <Card className="w-full max-w-md shadow-xl border-0 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-neutral-900">
            Admin Login
          </CardTitle>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="border-gray-300  focus:border-blue-500"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 rounded-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4  w-4" /> Logging
                    in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default page;

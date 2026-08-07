"use client";

import {
  icons,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin, reset } from "@/app/redux/adminSlices/adminAuthSlice";
import { toast } from "sonner";

const DASHBOARD_BASE_PATH = "/dashboard";

const navItems = [
  {
    href: `${DASHBOARD_BASE_PATH}`,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: `${DASHBOARD_BASE_PATH}/profiles`,
    label: "Profiles List",
    icon: User,
  },
  {
    href: `${DASHBOARD_BASE_PATH}/settings`,
    label: "Settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { isLoading, logoutMessage, error } = useSelector(
    (state) => state.adminAuth
  );

  const handleConfirmLogout = async () => {
    try {
      const result = await dispatch(logoutAdmin()).unwrap();

      toast.success("Logged Out Successfully");
      dispatch(reset());
      router.push("/");
    } catch (error) {
      toast.error(error?.message || "Something went wrong while logging out.");
    } finally {
      setIsLogoutDialogOpen(false);
    }
  };

  const isActive = (href) => {
    if (href === DASHBOARD_BASE_PATH) {
      return pathname === href;
    }

    return pathname.startsWith(href) && href !== DASHBOARD_BASE_PATH;
  };

  return (
    <>
      {/* ======================================================= */}
      {/* 1. Mobile Menu Toggle Button */}
      {/* ======================================================= */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* ======================================================= */}
      {/* 2. Mobile Overlay */}
      {/* ======================================================= */}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ======================================================= */}
      {/* 3. The Actual Sidebar */}
      {/* ======================================================= */}

      <aside
        className={`w-64 bg-gray-800 text-white min-h-screen p-4 shadow-2xl fixed top-0 left-0 z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } `}
      >
        <h2 className="text-3xl font-extrabold  mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          Admin Panel
        </h2>

        <nav>
          <ul>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-xl transition duration-200 ${
                      active
                        ? "bg-gray-200 text-gray-900 shadow-md font-semibold"
                        : "hover:bg-gray-700 hover:text-indigo-300 text-gray-300"
                    }`}
                  >
                    <IconComponent size={20} className="mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 w-full p-4">
          <button
            onClick={() => setIsLogoutDialogOpen(true)}
            className="w-full p-3 flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-xl transition shadow-lg"
          >
            <LogOut size={20} className="mr-2" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* ======================================================= */}
      {/* 5. Logout Confirmation Dialog */}
      {/* ======================================================= */}
      <AlertDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      >
        <AlertDialogContent className="bg-white text-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out from your admin account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmLogout}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4  w-4" /> please
                  wait...
                </>
              ) : (
                "Yes, Logout"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Sidebar;

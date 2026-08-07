import React from "react";
import Sidebar from "./Components/Sidebar";
import { Toaster } from "sonner";
import ProtectedRoute from "./Components/ProtectedRoute";
import DashboardNavbar from "./Components/DashboardNavbar";

const DashboardLayout = ({ children }) => {
  return (
    // <div className="overflow-x-hidden">
    //   <div className="flex flex-col min-h-screen bg-gray-50">
    //     <Sidebar />

    //     {/* Right Content Area */}
    //     {/* Sidebar width (w-64) ku equal-a margin (ml-64) kodukkanum */}
    //     <main
    //       className="flex-1 p-4 pt-20 lg:p-8
    //                lg:ml-64
    //                w-full"
    //     >
    //       <div className="max-w-7xl overflow-x-hidden mx-auto">

    //         {children} {/* 👈 Active route-oda content inga render aagum */}
    //         <Toaster
    //           toastOptions={{
    //             className: "rounded-2xl border shadow-lg",
    //             style: {
    //               //background: "#1e1e1e",
    //               // color: "#fff",
    //               fontSize: "16px",
    //               //color: "white",
    //               borderLeft: "10px solid ",
    //             },
    //           }}
    //         />
    //       </div>
    //     </main>
    //   </div>
    // </div>

    <ProtectedRoute>
      <div className="overflow-x-hidden">
        <div className="">
          <div>{/* <Sidebar /> */}</div>

          {/* Right Content Area */}
          {/* Sidebar width (w-64) ku equal-a margin (ml-64) kodukkanum */}
          <main className="p-4  pt-20 lg:p-0">
            <div className=" overflow-x-hidden ">
              <DashboardNavbar />
              {children} {/* 👈 Active route-oda content inga render aagum */}
              <Toaster
                toastOptions={{
                  className: "rounded-2xl border shadow-lg",
                  style: {
                    //background: "#1e1e1e",
                    // color: "#fff",
                    fontSize: "16px",
                    //color: "white",
                    borderLeft: "10px solid ",
                  },
                }}
              />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;

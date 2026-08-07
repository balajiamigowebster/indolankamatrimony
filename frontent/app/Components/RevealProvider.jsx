// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { Loader2 } from "lucide-react";

// // The target reveal date and time: Monday, October 27, 2025 at 10:00:00 AM IST (GMT+5:30)
// // Please double-check this date and time!
// const REVEAL_DATE_TIMESTAMP = new Date("2025-10-27T09:30:00+05:30").getTime();
// //const REVEAL_DATE_TIMESTAMP = new Date("2025-10-26T21:10:00+05:30").getTime();

// // Helper function to format time difference
// const formatTime = (timeInMs) => {
//   const totalSeconds = Math.floor(timeInMs / 1000);
//   const totalMinutes = Math.floor(totalSeconds / 60);
//   const totalHours = Math.floor(totalMinutes / 60);

//   const days = Math.floor(totalHours / 24);
//   const hours = totalHours % 24;
//   const minutes = totalMinutes % 60;
//   const seconds = totalSeconds % 60;

//   const pad = (num) => num.toString().padStart(2, "0");

//   return {
//     days: pad(days),
//     hours: pad(hours),
//     minutes: pad(minutes),
//     seconds: pad(seconds),
//   };
// };

// // --- RevealProvider Component ---
// export default function RevealProvider({ children }) {
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [isRevealed, setIsRevealed] = useState(false);
//   const [isClient, setIsClient] = useState(false);

//   // Function to calculate and update the time left
//   const calculateTimeLeft = useCallback(() => {
//     const now = new Date().getTime();
//     const difference = REVEAL_DATE_TIMESTAMP - now;

//     if (difference <= 0) {
//       setIsRevealed(true);
//       setTimeLeft(0);
//       return;
//     }

//     setIsRevealed(false);
//     setTimeLeft(difference);
//   }, []);

//   // Set up the timer
//   useEffect(() => {
//     // 1. Initial calculation and client check
//     setIsClient(true);
//     calculateTimeLeft();

//     // 2. Set up interval for countdown
//     const timer = setInterval(calculateTimeLeft, 1000);

//     // 3. Cleanup
//     return () => clearInterval(timer);
//   }, [calculateTimeLeft]);

//   if (!isClient) {
//     // Optional: Show a full-screen loading spinner while hydration/initial check happens
//     return (
//       <div className="flex items-center justify-center h-screen w-full bg-gray-900">
//         <Loader2 className="h-8 w-8 animate-spin text-white" />
//       </div>
//     );
//   }

//   // If revealed, show the children
//   if (isRevealed) {
//     return <>{children}</>;
//   }

//   // If not revealed, show the countdown screen
//   const time = formatTime(timeLeft);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
//       <div className="text-center">
//         <h1 className="font-playfair text-4xl sm:text-6xl md:text-7xl mb-8 font-bold tracking-tight">
//           Website Launching Soon!
//         </h1>
//         <p className="font-geist-sans text-lg sm:text-xl text-gray-400 mb-12">
//           Get ready for the big reveal on Monday, October 27th at 10:00 AM IST.
//         </p>

//         {/* Countdown Timer Display */}
//         <div className="flex justify-center space-x-4 sm:space-x-8">
//           <TimeSegment value={time.days} label="Days" />
//           <TimeSegment value={time.hours} label="Hours" />
//           <TimeSegment value={time.minutes} label="Minutes" />
//           <TimeSegment value={time.seconds} label="Seconds" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // Separate component for a single time segment
// const TimeSegment = ({ value, label }) => (
//   <div className="flex flex-col items-center p-4 bg-gray-800 rounded-xl shadow-2xl min-w-[70px] sm:min-w-[100px]">
//     <div className="font-geist-mono text-4xl sm:text-6xl font-extrabold text-teal-400">
//       {value}
//     </div>
//     <div className="font-geist-sans text-sm sm:text-base mt-1 text-gray-300 uppercase tracking-wider">
//       {label}
//     </div>
//   </div>
// );

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";

// 1. REVEAL DATE DEFINITION (நாளை காலை 9:30 AM IST)
// The target reveal date and time: Monday, October 27, 2025 at 09:30:00 AM IST (GMT+5:30)
const REVEAL_DATE_TIMESTAMP = new Date("2025-10-27T06:15:00+05:30").getTime();
//const REVEAL_DATE_TIMESTAMP = new Date("2025-10-26T21:22:00+05:30").getTime();

// KEY for storing the revealed state in the browser's storage
const REVEAL_STORAGE_KEY = "website_has_revealed";

// Helper function to format time difference
const formatTime = (timeInMs) => {
  const totalSeconds = Math.floor(timeInMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  const pad = (num) => num.toString().padStart(2, "0");

  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  };
};

// --- RevealProvider Component ---
export default function RevealProvider({ children }) {
  const [timeLeft, setTimeLeft] = useState(0);
  // Initial state check: Check if the flag is already set in localStorage
  const [isRevealed, setIsRevealed] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem(REVEAL_STORAGE_KEY) === "true"
      : false
  );
  const [isClient, setIsClient] = useState(false);

  // Function to calculate and update the time left
  const calculateTimeLeft = useCallback(() => {
    // If the state is already marked as revealed (from localStorage), stop calculations
    if (isRevealed) {
      return;
    }

    const now = new Date().getTime();
    const difference = REVEAL_DATE_TIMESTAMP - now;

    if (difference <= 0) {
      // **CRITICAL CHANGE:** Set the flag in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(REVEAL_STORAGE_KEY, "true");
      }

      setIsRevealed(true);
      setTimeLeft(0);
      return;
    }

    setIsRevealed(false);
    setTimeLeft(difference);
  }, [isRevealed]); // Added isRevealed to dependency array

  // Set up the timer
  useEffect(() => {
    // 1. Initial calculation and client check
    setIsClient(true);
    calculateTimeLeft();

    // 2. Set up interval for countdown
    const timer = setInterval(calculateTimeLeft, 1000);

    // 3. Cleanup
    // Clear interval only when revealed to stop unnecessary calculations
    return () => {
      clearInterval(timer);
    };
  }, [calculateTimeLeft]);

  // OPTIONAL: Stop the timer immediately when the revealed state changes to true
  useEffect(() => {
    if (isRevealed) {
      // This ensures any running interval is immediately cleared if the countdown hits zero
      // Note: The cleanup in the main useEffect handles this too, but this is an extra safeguard.
      console.log("Website revealed. Timer stopped.");
    }
  }, [isRevealed]);

  if (!isClient) {
    // Optional: Show a full-screen loading spinner while hydration/initial check happens
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  // If revealed, show the children
  if (isRevealed) {
    return <>{children}</>;
  }

  // If not revealed, show the countdown screen
  const time = formatTime(timeLeft);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="text-center">
        <h1 className="font-playfair text-4xl sm:text-6xl md:text-7xl mb-8 font-bold tracking-tight">
          Website Launching Soon!
        </h1>
        <p className="font-geist-sans text-lg sm:text-xl text-gray-400 mb-12">
          Get ready for the big reveal on Monday, October 27th at 06:15 AM IST.
        </p>

        {/* Countdown Timer Display */}
        <div className="flex justify-center space-x-4 sm:space-x-8">
          <TimeSegment value={time.days} label="Days" />
          <TimeSegment value={time.hours} label="Hours" />
          <TimeSegment value={time.minutes} label="Minutes" />
          <TimeSegment value={time.seconds} label="Seconds" />
        </div>
      </div>
    </div>
  );
}

// Separate component for a single time segment
const TimeSegment = ({ value, label }) => (
  <div className="flex flex-col items-center p-4 bg-gray-800 rounded-xl shadow-2xl min-w-[70px] sm:min-w-[100px]">
    <div className="font-geist-mono text-4xl sm:text-6xl font-extrabold text-teal-400">
      {value}
    </div>
    <div className="font-geist-sans text-sm sm:text-base mt-1 text-gray-300 uppercase tracking-wider">
      {label}
    </div>
  </div>
);

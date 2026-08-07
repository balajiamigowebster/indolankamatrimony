"use client";
import React from "react";
import { FaUsers } from "react-icons/fa";
import { FaMale, FaFemale } from "react-icons/fa";

const stats = [
  {
    id: 1,
    icon: <FaUsers className="text-3xl text-[#704214]" />,
    value: "500K",
    label: "COUPLES PAIRED",
  },
  {
    id: 2,
    icon: <FaUsers className="text-3xl text-[#704214]" />,
    value: "1000+",
    label: "REGISTERED USERS",
  },
  {
    id: 3,
    icon: <FaMale className="text-3xl text-[#704214]" />,
    value: "800+",
    label: "MENS",
  },
  {
    id: 4,
    icon: <FaFemale className="text-3xl text-[#704214]" />,
    value: "800+",
    label: "WOMENS",
  },
];

const StatsSection = () => {
  return (
    <section className="pt-10">
      <div className="max-w-6xl mx-auto  grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 px-5  overflow-hidden">
        {stats.map((item, index) => (
          <div
            key={item.id}
            className={`flex  flex-col sm:flex-row md:flex-col lg:flex-row gap-4 items-center justify-center py-8 px-6 border md:border lg:border-0  lg:border-t-1 lg:border-b-1 border-[#e1d5c1] rounded-md lg:rounded-none ${
              stats.length - 1 === index ? "lg:border-r-0" : "lg:border-r-1"
            }`}
          >
            <div className="p-3 border border-[#d6b98e] rounded-md mb-2 hover:vibrate">
              {item.icon}
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <h2 className="text-2xl font-semibold playfairDisplay text-[#704214]">
                {item.value}
              </h2>
              <p className="text-[#704214] mt-1 text-[14px] tracking-wide">
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;

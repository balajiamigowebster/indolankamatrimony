"use client";

import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa"; // Our Office Icons
import { FaHandshakeSimple } from "react-icons/fa6"; // Customer Relations Icon
import { RiWhatsappFill } from "react-icons/ri";
import { IoTimerOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import API from "../api";
import { toast } from "sonner";

// ⚙️ Card Data Array
const contactData = [
  {
    type: "office",
    title: "OUR OFFICE",
    isPrimary: true,
    content: [
      {
        icon: FaMapMarkerAlt,
        text: "51, sowbakkiya nagar, kosapur, chennai-600 060.",
        link: "#",
      },
      {
        icon: FaPhoneAlt,
        text: "+91 8524054040",
        link: "tel:+918524054040",
      },
      {
        icon: FaEnvelope,
        text: "info@indolankamatrimony.com",
        link: "mailto:info@indolankamatrimony.com",
      },
    ],
  },
  {
    type: "relations",
    title: "CUSTOMER RELATIONS",
    icon: FaHandshakeSimple, // Icon for main section
    buttonText: "Get Support",
    link: "#support",
  },
  {
    type: "whatsapp",
    title: "WHATSAPP SUPPORT",
    icon: RiWhatsappFill, // Icon for main section
    buttonText: "Talk to sales",
    link: "#whatsapp",
  },
];

const CardItem = ({ item }) => {
  // Common Text for all cards
  const commonText = "Most Trusted and premium Matrimony Service in the World.";

  // Office Card Layout
  if (item.type === "office") {
    return (
      // Hover Shadow Effect
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-2xl h-full flex flex-col justify-between">
        <h2 className="text-xl font-bold text-[#4a2f1c] mb-6 border-b pb-2">
          {item.title}
        </h2>

        {item.content.map((detail, index) => (
          <a
            key={index}
            href={detail.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-start mb-4 p-3 rounded-lg transition-colors hover:bg-gray-50 ${
              index === 0 ? "mt-4" : ""
            }`}
          >
            <detail.icon className="text-xl text-[#ff5722] min-w-[20px] mt-1" />
            <span className="ml-4 text-gray-700 text-sm font-medium leading-relaxed">
              {detail.text}
            </span>
          </a>
        ))}
        {/* Subtext */}
        <p className="text-sm text-gray-500 mt-4 leading-relaxed">
          {commonText}
        </p>
      </div>
    );
  }

  // Relations and Whatsapp Card Layout
  const IconComponent = item.icon;

  const renderCustomIcon = () => {
    if (item.type === "relations") {
      // Shaking hands icon
      return (
        <div className="flex justify-center items-center w-32 h-32 mx-auto bg-orange-100 rounded-full mb-6">
          <IconComponent className="text-6xl text-orange-500" />
        </div>
      );
    }
    if (item.type === "whatsapp") {
      // 24H/Whatsapp icon
      return (
        <div className="relative flex justify-center items-center w-32 h-32 mx-auto bg-blue-100 rounded-full mb-6">
          {/* Main Whatsapp Icon */}
          <RiWhatsappFill className="text-6xl text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          {/* 24h overlay icon */}
          <IoTimerOutline className="text-3xl text-red-500 absolute top-2 right-2 rotate-12" />
        </div>
      );
    }
    return null;
  };

  return (
    // Hover Shadow Effect
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-2xl text-center h-full flex flex-col justify-between">
      <div>
        {renderCustomIcon()}

        <h2 className="text-xl font-bold text-[#4a2f1c] mt-4 mb-4">
          {item.title}
        </h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          {commonText}
        </p>
      </div>

      <a href={item.link} className="block mt-auto">
        <button
          className={
            `w-full px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out 
            ${
              item.type === "relations"
                ? "border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white" // Get Support Button Style
                : "bg-green-600 text-white hover:bg-green-700"
            }` // Talk to sales Button Style
          }
        >
          {item.buttonText}
        </button>
      </a>
    </div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const illustrationUrl = "/contact/c2.webp";

  const marqueeStyle = {
    backgroundImage: `url(${illustrationUrl})`,
  };

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    type: "",
    message: "", // success, error
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/contact/submit", formData);
      if (res.data.success) {
        toast.success("Contact submitted successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to send enquiry. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20">
      {/* 1. Header Section (Gradient Banner) */}
      <section className="bg-gradient-to-r from-[#191627] via-[#403a58] to-[#0b0815] text-white py-16 md:py-24 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* WE ARE HERE TO ASSIST YOU. */}
          <p
            className="text-sm md:text-xl lg:text-2xl tracking-widest pb-5 uppercase font-medium"
            style={{ color: "#FCD34D" }}
          >
            WE ARE HERE TO ASSIST YOU.
          </p>

          {/* Contact us (Gradient Text) */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mt-2 mb-7"
            style={{
              backgroundImage: "linear-gradient(to right, #4ADDEB, #10B981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Contact us
          </h1>

          {/* Most Trusted and premium Matrimony Service in the World. */}
          <p className="text-base md:text-xl text-gray-300 font-light mt-4">
            Most Trusted and premium Matrimony Service in the World.
          </p>
        </div>
      </section>

      <section>
        <div className="flex   max-w-4xl mx-auto my-12  px-5 md:px-5 lg:px-0 shadow-xl  rounded-lg overflow-hidden flex-col md:flex-col lg:flex-row">
          {/* Left Panel - UI Design (Golden/Yellow Background) */}
          <div
            // bg-yellow-100 (FFEBCC) / p-10 / flex-1 / text-center / flex-col / justify-center
            className=" p-10 flex relative flex-col justify-center rounded-md items-center bg-[#fff1b5] md:justify-center lg:justify-start lg:items-start md:items-center   md:flex-1"
            // Illustration image-a background-kku set panrom
          >
            <p className="text-2xl py-2 font-serif text-[#877525] mb-0">Now</p>
            <h1 className="text-4xl lg:text-6xl  lg:py-2 md:text-4xl font-extrabold lg:w-[150px] text-[#665611] mb-2 mt-0 font-serif">
              Contact to us
            </h1>
            <h2 className="text-2xl py-2 font-serif text-[#877525] pb-5 font-medium">
              Easy and fast.
            </h2>
            <img
              src="/contact/c1.webp"
              alt="Contact Image"
              className="h-[250px] pb-5 hidden md:hidden lg:block "
            />

            <div className="absolute bottom-0 left-0 w-full pt-16 h-32 md:h-36 overflow-hidden">
              <div
                className="w-full h-full marquee-bg" // <-- Custom CSS class for animation
                style={marqueeStyle} // <-- Background image URL
              />
            </div>

            {/* Image Component-a inga pottu, background image-a remove pannalaam */}
            {/* <img src="/path/to/illustration.png" alt="Couple Illustration" className="w-full mt-6" /> */}
          </div>

          <div className="p-8 bg-white flex-1">
            <p className="text-red-400 pl-8 md:pl-0 lg:pl-5 font-semibold tracking-widest text-sm mb-1">
              LET'S TALK
            </p>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Send your enquiry now
            </h2>

            {alert.message && (
              <div
                // Success: bg-green-100 text-green-700 | Error: bg-red-100 text-red-700
                className={`p-3 rounded-md mb-4 font-medium ${
                  alert.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {alert.message}
              </div>
            )}

            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  // Input Styles: w-full, p-3, border-gray-300, rounded-md, focus ring
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Phone:
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  minLength="10"
                  maxLength="10"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Message:
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter message"
                  required
                  rows="4" // 4 lines height
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                />
              </div>
              <div className="py-5">
                <Button disabled={loading} type="submit">
                  {loading ? "Sending..." : "Submit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Cards Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Responsive Grid Layout: 1 column on mobile, 2 on medium, 3 on large */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 md:grid-cols-2">
            {contactData.map((item, index) => (
              <CardItem key={index} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

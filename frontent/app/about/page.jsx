import React from "react";
import { IoMailUnreadOutline } from "react-icons/io5";
import { IoCallOutline } from "react-icons/io5";

const features = [
  {
    image: "/about/prize.webp",
    title: "Genuine profiles",
    description: "The most trusted wedding matrimony brand",
  },
  {
    image: "/about/rings.webp",
    title: "Most trusted",
    description: "The most trusted wedding matrimony brand",
  },
  {
    image: "/about/trust.webp",
    title: "2000+ weddings",
    description: "The most trusted wedding matrimony brand",
  },
];

function AboutSection() {
  return (
    <div className="py-16 md:py-24 bg-gradient-to-r from-amber-50/20 to-amber-100/30 ">
      <section>
        {/* Header Section */}
        <div className="mx-auto lg:mb-32 text-center py-10 md:py-10 lg:pt-10 lg:pb-20 bg-gradient-to-br lg:mt-10 md:-mt-2  from-gray-800 to-gray-900 px-4">
          {/* Subtitle */}
          <p className="text-sm md:text-base font-semibold text-yellow-500 mb-2">
            WEDDING WEBSITE
          </p>
          {/* Main Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-teal-300 mb-4">
            About us
          </h2>
          {/* Description */}
          <p className="text-base md:text-lg text-gray-300 mb-12">
            Most Trusted and premium Matrimony Service in the World.
          </p>
        </div>

        {/* Feature Cards Section */}
        <div className="pb-16 pt-10 lg:relative">
          <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:absolute lg:-top-48 lg:left-1/5 lg:grid-cols-3 gap-8 px-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg lg:py-12 shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300"
              >
                {/* Icon */}
                <div className="flex justify-center py-5">
                  <img src={feature.image} alt={index} className="h-[50px]" />
                </div>
                {/* Feature Title */}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                {/* Feature Description */}
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------section-2--------------- */}

      <section className=" py-12 md:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center justify-center lg:gap-5">
          <div className="w-full lg:w-5/12 relative mb-10 lg:mb-0">
            <div className="absolute top-[-40px] left-[-40px] w-24 h-24 border-8 border-yellow-600 rounded-full border-b-0 border-r-0 transform rotate-45 hidden sm:block"></div>

            {/* Image Container with Custom Shape (Right-Bottom) */}
            <div className="relative z-10 p-2 bg-white rounded-xl shadow-2xl">
              {/* The actual image */}
              <img
                src="about/a1.webp"
                alt="Couple  wedding"
                className="w-full h-auto object-cover rounded-xl"
              />
              {/* Custom Shape 2: Right-Bottom Pink border */}
              <div className="absolute top-0 right-0 w-full h-full border-4 border-pink-300 rounded-xl transform translate-x-3 translate-y-3 -z-10"></div>
            </div>
          </div>

          {/* Right Side: Content and Contact Info */}
          <div className="w-full lg:w-6/12 lg:pl-12">
            {/* Main Titles */}
            <h2 className="text-2xl md:text-5xl cinzel_font pb-5 font-serif font-bold text-gray-800 tracking-wider">
              WELCOME TO
            </h2>
            <h2 className="text-2xl md:text-4xl cinzel_font  font-bold text-pink-600 tracking-wider mb-6">
              WEDDING MATRIMONY
            </h2>

            {/* Content Paragraphs */}
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Best wedding matrimony. It is a long established fact that a
              reader will be distracted by the readable content of a page when
              looking at its layout.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-10">
              There are many variations available, but the majority have
              suffered alteration in some form, by injected humour, or
              randomised words which don't look even believable.
            </p>

            {/* Contact Information */}
            <div className="flex flex-col sm:flex-row justify-start space-y-6 sm:space-y-0 space-x-4">
              {/* Enquiry - Phone Number */}
              <div className="flex items-center  space-x-2">
                <div className="p-3 bg-black rounded-full border-7 border-neutral-300 text-white">
                  <IoCallOutline className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-600 font-medium">Enquiry</p>
                  <a
                    href="tel:+918524054040"
                    className=" font-bold text-black hover:text-pink-700 transition duration-300"
                  >
                    +91 8524054040
                  </a>
                </div>
              </div>

              {/* Get Support - Email */}
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-black rounded-full border-7 border-neutral-300 text-white">
                  <IoMailUnreadOutline className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Get Support
                  </p>
                  <a
                    href="mailto:info@indolankamatrimony.com"
                    className=" font-bold text-black hover:text-pink-700 transition duration-300"
                  >
                    info@indolankamatrimony.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutSection;

import React from "react";
import { FaLinkedin, FaTwitter, FaFacebookF, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#e9f0f6] text-gray-700 pt-0">
      {/* 🔝 Top Bar */}
      <div className="bg-[#ff1e75] text-white py-3 text-center text-sm md:text-base">
        Free support:{" "}
        <span className="font-semibold text-white">+91 8524054040</span> &nbsp;
        | &nbsp; Email:{" "}
        <a
          href="mailto:info@indolankamatrimony.com"
          className="font-semibold underline-offset-2 hover:underline"
        >
          info@indolankamatrimony.com
        </a>
      </div>

      {/* 🔹 Main Footer */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 border-b border-gray-300">
        {/* 📍 Get In Touch */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            GET IN TOUCH
          </h3>
          <p className="text-sm mb-2">
            Address: 51, Sowbakkiya Nagar, Kosapur, Chennai-600 060.
          </p>
          <p className="text-sm mb-2">Phone: +91 8524054040</p>
          <p className="text-sm">Email: info@indolankamatrimony.com</p>
        </div>

        {/* 🧭 Help & Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            HELP & SUPPORT
          </h3>
          <ul className="text-sm space-y-2">
            <li>
              <a href="#" className="hover:text-[#ff1e75]">
                About company
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#ff1e75]">
                Feedback
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#ff1e75]">
                Testimonials
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#ff1e75]">
                Contact us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#ff1e75]">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* 🌐 Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            SOCIAL MEDIA
          </h3>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-[#0077B5] hover:scale-110 transition-transform"
            >
              <FaLinkedin size={22} />
            </a>
            <a
              href="#"
              className="text-[#1DA1F2] hover:scale-110 transition-transform"
            >
              <FaTwitter size={22} />
            </a>
            <a
              href="#"
              className="text-[#3B5998] hover:scale-110 transition-transform"
            >
              <FaFacebookF size={22} />
            </a>
            <a
              href="#"
              className="text-[#FF0000] hover:scale-110 transition-transform"
            >
              <FaYoutube size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* 🔻 Bottom Text */}
      <div className="text-center text-sm md:text-base py-6 px-4">
        <p className="mb-3 text-gray-700">
          <span className="font-medium">indolanka matrimonial services</span> –
          Trusted by over thousands of Boys & Girls for successful marriage.{" "}
          <button className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm">
            Join us today !
          </button>
        </p>
        <p className="text-gray-600 text-sm">
          Copyright © 2025{" "}
          <a
            href="https://amigowebster.com"
            target="_blank"
            className="text-[#0077B5] hover:underline font-semibold"
          >
            amigowebster{" "}
          </a>
          All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

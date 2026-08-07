"use client";
import React, { useEffect, useState } from "react";
import Services from "./Services";
import StatsSection from "./StatsSection";
import Parterns from "./Partners";
import Partners from "./Partners";
import BannerCarousel from "./BannerCarosel";

const images = ["/banner/b1.webp", "/banner/b2.webp"];

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="md:mt-[116px] mt-[80px]">
      {/* <div className="h-[200px] md:h-[400px] lg:h-[530px] overflow-hidden relative ">
        
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-[5000ms] ease-in-out   ${
              index === currentIndex
                ? "opacity-100 scale-150 z-10 "
                : "opacity-0 scale-100 z-0"
            } transition-opacity `}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        ))}
      </div> */}
      <div>
        <BannerCarousel />
      </div>

      <div>
        <Partners />
      </div>

      {/* section-----------------------2 */}

      <div>
        <Services />
      </div>
      <div className="bg-gradient-to-r from-amber-50/50 to-amber-100/40">
        <StatsSection />
      </div>
    </div>
  );
};

export default HomePage;

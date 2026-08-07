import React from "react";
import ProfileGallery from "./ProfileGallery";

const Gallery = () => {
  const illustrationUrl = "/gallery/g1.webp";

  const marqueeStyle = {
    backgroundImage: `url(${illustrationUrl})`,
  };

  return (
    <div className="mt-16">
      <section className="relative w-full h-80 md:h-96 lg:h-[400px] bg-gradient-to-r from-pink-300 to-blue-200 overflow-hidden flex flex-col justify-center items-center text-center p-4">
        <div className="absolute top-1/2 left-1/2 -translate-y-3/4 -translate-x-1/2  text-pink-200 opacity-50 text-7xl  md:text-[10rem] lg:text-[12rem] cinzel_font font-bold pointer-events-none z-0">
          Matrimony
        </div>

        {/* Content (Title and Subtitle) - z-index to bring it above the overlay text */}
        <div className="relative z-10  text-pink-600 pt-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl  font-bold mb-3">
            Photo gallery
          </h2>
          <p className="text-base md:text-lg lg:text-2xl   text-pink-700 max-w-xl mx-auto">
            lacinia viverra lectus. Fusce imperdiet ullamcorper metus eu
            fringilla
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-24 md:h-16 overflow-hidden z-20">
          <div
            className="w-full h-full marquee-bg" // <-- Custom CSS class for animation
            style={marqueeStyle} // <-- Background image URL
          />
        </div>
      </section>

      {/* ------------section-2--------- */}
      <section className="bg-gradient-to-r from-amber-50/20 pb-20 md:pb-24 lg:pb-28 to-amber-100/30">
        <ProfileGallery />
      </section>
    </div>
  );
};

export default Gallery;

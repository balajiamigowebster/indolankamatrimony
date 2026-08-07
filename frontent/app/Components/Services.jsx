"use client";
import React from "react";
import { motion, useAnimation } from "framer-motion";

const services = [
  {
    title: "Browse Profiles",
    subtitle: "",
    image: "/carousel/c2.webp",
    img: "/carousel/c1.webp",
  },
  {
    title: "Wedding",
    subtitle: "",
    image: "/carousel/c3.webp",
    img: "/carousel/c4.webp",
  },
  {
    title: "Join Now",
    subtitle: "Start for free",
    image: "/carousel/c6.webp",
    img: "/carousel/c5.webp",
  },
  {
    title: "Photo gallery",
    subtitle: "",
    image: "/carousel/c8.webp",
    img: "/carousel/c7.webp",
  },
];

const ServiceCard = ({ service }) => {
  const roseControls = useAnimation();
  const btnControls = useAnimation();

  const handleHoverStart = () => {
    // Animate rose color up to 90px
    roseControls.start({
      height: "90px",
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    });
    btnControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    });
  };

  const handleHoverEnd = () => {
    roseControls.start({
      height: "0px",
      opacity: 0,
      transition: { duration: 0.4, ease: "easeIn" },
    });
    btnControls.start({
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 },
    });
  };

  return (
    <motion.div
      className="relative rounded-xl overflow-hidden group h-[350px] shadow-lg cursor-pointer"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${service.image})` }}
      ></div>

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/60 z-[1]"></div>

      {/* 🌹 Rose Fill Animation — fixed visibility + z-index */}
      <motion.div
        animate={roseControls}
        initial={{ height: "0px", opacity: 0 }}
        className="absolute bottom-0 left-0 right-0 bg-rose-600/90 z-[2]"
      ></motion.div>

      {/* Content */}
      <div className="relative z-[3] flex flex-col items-center justify-center h-full text-center px-4">
        <div className="border-4 rounded-4xl px-10 py-5">
          <img
            className="invert mb-4 h-[80px] w-[80px] opacity-90"
            src={service.img}
            alt={service.title}
          />
        </div>
        <h3 className="text-xl font-semibold mb-1">{service.title}</h3>
        {service.subtitle && (
          <p className="text-sm opacity-80">{service.subtitle}</p>
        )}

        {/* View More button inside pink area */}
        <motion.button
          animate={btnControls}
          initial={{ opacity: 0, y: 20 }}
          className="absolute bottom-6 px-4 py-2 bg-white text-black rounded-full font-semibold shadow-md"
        >
          View More
        </motion.button>
      </div>
    </motion.div>
  );
};

const Services = () => {
  return (
    <section className="bg-black text-white py-16">
      {/* Heading */}
      <div className="text-center mb-12">
        <h3 className="text-[#c9a15c] cinzel_font text-xl tracking-[4px] font-semibold uppercase">
          Quick Access
        </h3>
        <h2 className="text-3xl pt-5 font-bold text-[#e0b869] playfairDisplay mb-3">
          Our Services
        </h2>
        <div className="flex justify-center items-center space-x-2  relative">
          <img
            src="/leaf/l1.webp"
            className="w-30 h-30 object-contain rotate-180 animate-leaffly "
          />
          <img
            src="/leaf/l1.webp"
            className="w-30 h-30 object-contain animate-leaffly "
          />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-6">
        {services.map((service, index) => (
          <ServiceCard key={index} service={service} />
        ))}
      </div>
    </section>
  );
};

export default Services;

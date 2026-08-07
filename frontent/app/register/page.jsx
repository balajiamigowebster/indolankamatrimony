import React from "react";
import RegisterProfile from "../Components/RegisterProfile";
import SendOtpRegisterProfile from "../Components/SendOTPRegisterProfile";
import SendOtpRegister from "../Components/SendOtpRegister";

const Register = () => {
  return (
    <div className="mt-16">
      <section className="bg-gradient-to-r  from-gray-400 via-gray-600 to-gray-900 text-center pb-5 pt-23 ">
        <p className="text-yellow-400 text-lg font-semibold tracking-wide mb-4">
          WE ARE HERE TO ASSIST YOU.
        </p>

        <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
          Registry Your Profile
        </h1>

        <p className="text-white/90 text-xl mt-6">
          Most Trusted and Premium Matrimony Service in the World.
        </p>
      </section>
      {/* <section className="bg-yellow-400/45  h-[300px] md:h-[220px] lg:h-[220px]">
        <div className="flex flex-col justify-center items-center md:flex-row lg:flex-row md:justify-around ">
          <img
            src="/banner/b3.webp"
            className="h-[200px] w-[200px] "
            alt="Love"
          />
          <p className="text-[#4a2f1c] text-2xl px-5 py-2 text-center font-bold md:text-3xl lg:text-4xl">
            Now Registry Your Profile Easy and fast.
          </p>
        </div>
      </section> */}
      <section className="bg-gradient-to-r from-amber-50/20 to-amber-100/50">
        {/* <RegisterProfile /> */}

        <SendOtpRegister />
      </section>
    </div>
  );
};

export default Register;

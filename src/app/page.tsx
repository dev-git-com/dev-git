"use client";
import "@/app/globals.css";
import AnimatedNetworkNodes from "@/shared/components/AnimatedNetworkNodes";
import Image from "next/image";
import logo from "../assets/images/logo/logo.png";
import Link from "next/link";

const Home = () => {
  return (
    <div className="relative flex flex-col items-center min-h-screen px-4 gap-32 overflow-hidden py-10">
      {/* Background Animation */}
      <div className="absolute flex flex-col inset-0 w-full h-full z-[-1] pointer-events-none">
        <div className="absolute inset-0 bg-black/60 z-[1]" />
        <Image
          alt="logo"
          src={logo}
          className="absolute top-[15%] left-[40%] w-[120px] h-[120px] lg:xl:w-[200px] lg:xl:h-[200px]"
        />
        <AnimatedNetworkNodes />
      </div>

      <div className="flex flex-wrap bg-white/10 w-full rounded-lg p-10 justify-between items-center">
        <div>
          <h1 className="text-xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-white via-slate-400 to-blue-300 bg-clip-text text-transparent leading-tight">
            Build Your Backend
            <br />
            from SQL Instantly
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Upload your schema
            <br />
            Select features
            <br />
            Get a full backend in seconds
            <br />
            <span className="text-blue-800 font-bold">
              No more manual setup
              <br />
              No more boilerplate hell
            </span>
          </p>
        </div>

        <div className="px-10 w-[250px] h-[200px] md:lg:w-[350px] rounded-lg">
          <iframe
            className="w-full h-full object-cover scale-[1.5] rounded-lg"
            src="https://www.youtube.com/embed/WCwD_1Qm218?autoplay=1&mute=0&loop=1&playlist=WCwD_1Qm218"
            title="YouTube Short"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      </div>
      <Link href="/develop">
        <div className="w-[300px] h-[60px] bg-gradient-to-r from-blue-700 via-slate-400 to-blue-500 rounded-lg text-lg font-bold shadow-xl items-center justify-center flex">
          {"Develop now!"}
        </div>
      </Link>

      {/* <div className="slide-br w-full flex justify-center md:lg:justify-start lg:pl-[10%]">
        <Shape />
      </div>

      <div className="slide-br w-full flex justify-center">
        <Shape />
      </div>

      <div className="slide-br w-full flex justify-center md:lg:justify-end lg:pr-[10%]">
        <Shape />
      </div> */}
    </div>
  );
};

export default Home;

"use client";

import { useState, useEffect } from "react";
import { EnumLocalStorage } from "@/shared/constants/LocalStorage.constants";
import { MiniDrawer } from "./MiniDrawer.component";
import logo from "../../assets/images/logo/logo.png";
import Image from "next/image";

export const DrawerWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateScreenSize = () => {
      const tablet = window.innerWidth < 900;
      const mobile = window.innerWidth < 600;
      setIsTablet(tablet);
      setIsMobile(mobile);

      if (!tablet) {
        const storedValue = localStorage.getItem(EnumLocalStorage.isDrawerOpen);
        const shouldBeOpen = storedValue === "true";
        setIsDrawerOpen(window.innerWidth >= 1000 || shouldBeOpen);
      } else {
        setIsDrawerOpen(false);
      }
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  useEffect(() => {
    if (!isTablet) {
      localStorage.setItem(EnumLocalStorage.isDrawerOpen, String(isDrawerOpen));
    }
  }, [isDrawerOpen, isTablet]);

  return (
    <main
      className={`${
        isDrawerOpen && !isTablet ? "ml-72" : isMobile ? "ml-0" : "ml-24"
      } duration-300`}
    >
      {isMobile && !isDrawerOpen ? (
        // Mobile app bar
        <div className="fixed top-0 left-2 z-50">
          <div
            className="justify-center items-center justify-items-center py-2 cursor-pointer inline-flex w-full gap-3 font-bold"
            onClick={() => {
              setIsDrawerOpen(!isDrawerOpen);
            }}
          >
            <Image
              alt="logo"
              src={logo}
              className="self-center justify-center w-14 h-w-14"
            />
            {isDrawerOpen && (
              <span className="inline-flex">
                <p className="text-blue-400">Dev</p>-
                <p className="text-orange-400">G</p>it
              </span>
            )}
          </div>
        </div>
      ) : (
        <MiniDrawer
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
      )}

      {(isMobile || isTablet) && isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {children}
    </main>
  );
};

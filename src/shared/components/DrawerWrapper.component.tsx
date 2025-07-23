"use client";

import { useState, useEffect } from "react";
import { EnumLocalStorage } from "@/shared/constants/LocalStorage.constants";
import { MiniDrawer } from "./MiniDrawer.component";

export const DrawerWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const storedValue = localStorage.getItem(EnumLocalStorage.isDrawerOpen);
    const shouldBeOpen = storedValue === "true";
    setIsDrawerOpen(window.innerWidth >= 1000 || shouldBeOpen);
  }, []);

  useEffect(() => {
    localStorage.setItem(EnumLocalStorage.isDrawerOpen, String(isDrawerOpen));
  }, [isDrawerOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1030) {
        setIsDrawerOpen(false);
      } else {
        setIsDrawerOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <MiniDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />
      <main className={`${isDrawerOpen ? "ml-72" : "ml-24"} duration-300`}>
        {children}
      </main>
    </div>
  );
};

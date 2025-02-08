"use client";

import { useState, useEffect } from "react";
import { EnumLocalStorage } from "@/shared/constants/LocalStorage.constants";
import { MiniDrawer } from "./MiniDrawer.component";

export const DrawerWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const storedValue = localStorage.getItem(EnumLocalStorage.isDrawerOpen);
    setIsDrawerOpen(storedValue === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem(EnumLocalStorage.isDrawerOpen, String(isDrawerOpen));
  }, [isDrawerOpen]);

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

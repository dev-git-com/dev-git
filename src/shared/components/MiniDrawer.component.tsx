"use client";

import { Menu, ChevronLeft, ChevronDown } from "lucide-react";
import {
  IPagesConstants,
  pagesConstants,
} from "@/shared/constants/Pages.constants";
import Link from "next/link";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import logo from "../../assets/images/logo/logo.png";
import Image from "next/image";

export const MiniDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
}: {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (value: boolean) => void;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState<number | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pathname = usePathname();

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const toggleSubMenu = (index: number) => {
    setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
  };

  return (
    <aside
      className={`bg-slate-950 text-white fixed top-0 left-0 h-full transition-all duration-300 ${
        isDrawerOpen ? "w-64" : "w-20"
      }`}
    >
      {/* <div className="flex h-16 justify-items-center items-center px-2 border-b border-b-slate-600">
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="w-full p-2 rounded-lg hover:bg-slate-100 hover:text-slate-500"
        >
          {!isDrawerOpen ? (
            <Menu className="h-6 w-6 justify-self-center" />
          ) : (
            <ChevronLeft className="h-6 w-6" />
          )}
        </button>
      </div> */}

      <div className="justify-center items-center justify-items-center py-2">
        <Image
          alt="logo"
          src={logo}
          className="self-center justify-center w-14 h-w-14"
        />
      </div>
      <div
        className={`overflow-y-auto max-h-full pb-28 scrollbar-hide items-center ${
          !isDrawerOpen ? "justify-items-center" : ""
        }`}
      >
        {pagesConstants.map((page: any, index: number) => {
          const isActive = pathname.includes(page.route);
          //* prefetch for docs page only
          const isPrefetchable = page.subMenu
            ? `${page.subMenu[0].route}`.endsWith("docs")
            : page.route.endsWith("docs");

          return (
            <div className="px-2 py-3" key={`${page.route}-${index}`}>
              {!isPrefetchable && (
                <Link
                  prefetch={true}
                  href={page.subMenu ? `${page.subMenu[0].route}` : page.route}
                >
                  <button
                    ref={(el: HTMLButtonElement | null) => {
                      buttonRefs.current[index] = el;
                    }}
                    className={`w-full flex items-center px-4 py-2 rounded-lg
                    ${
                      page.route === "/"
                        ? "bg-blue-900 text-white"
                        : isActive
                        ? "bg-slate-700 text-white"
                        : "hover:bg-white hover:text-slate-900"
                    } gap-3`}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => page.subMenu && toggleSubMenu(index)}
                  >
                    {page.icon}
                    {isDrawerOpen && (
                      <div
                        className={`w-full flex items-center justify-between`}
                      >
                        {page.label}
                        {page.subMenu && (
                          <ChevronDown
                            className={`${
                              openSubMenuIndex === index
                                ? "rotate-180"
                                : "rotate-0"
                            } transition-transform`}
                          />
                        )}
                      </div>
                    )}
                  </button>
                  {isDrawerOpen &&
                    page.subMenu &&
                    openSubMenuIndex === index && (
                      <div className="space-y-2 ml-5 mt-2 rounded-lg">
                        {page.subMenu.map(
                          (page: IPagesConstants, subIndex: number) => {
                            const isActive = pathname === page.route;
                            return (
                              <Link
                                href={page.route}
                                key={`${page.route}-${subIndex}`}
                                className={`flex items-center px-2 py-2 gap-3 rounded-lg ${
                                  isActive
                                    ? "bg-slate-700 text-white"
                                    : "hover:bg-white hover:text-slate-900"
                                }`}
                              >
                                {page.icon}
                                <p>{page.label}</p>
                              </Link>
                            );
                          }
                        )}
                      </div>
                    )}
                </Link>
              )}
              {isPrefetchable && (
                <a
                  href={page.subMenu ? `${page.subMenu[0].route}` : page.route}
                >
                  <button
                    ref={(el: HTMLButtonElement | null) => {
                      buttonRefs.current[index] = el;
                    }}
                    className={`w-full flex items-center px-4 py-2 rounded-lg
                    ${
                      page.route === "/"
                        ? "bg-blue-900 text-white"
                        : isActive
                        ? "bg-slate-700 text-white"
                        : "hover:bg-white hover:text-slate-900"
                    } gap-3`}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => page.subMenu && toggleSubMenu(index)}
                  >
                    {page.icon}
                    {isDrawerOpen && (
                      <div
                        className={`w-full flex items-center justify-between`}
                      >
                        {page.label}
                        {page.subMenu && (
                          <ChevronDown
                            className={`${
                              openSubMenuIndex === index
                                ? "rotate-180"
                                : "rotate-0"
                            } transition-transform`}
                          />
                        )}
                      </div>
                    )}
                  </button>
                  {isDrawerOpen &&
                    page.subMenu &&
                    openSubMenuIndex === index && (
                      <div className="space-y-2 ml-5 mt-2 rounded-lg">
                        {page.subMenu.map(
                          (page: IPagesConstants, subIndex: number) => {
                            const isActive = pathname === page.route;
                            return (
                              <Link
                                href={page.route}
                                key={`${page.route}-${subIndex}`}
                                className={`flex items-center px-2 py-2 gap-3 rounded-lg ${
                                  isActive
                                    ? "bg-slate-700 text-white"
                                    : "hover:bg-white hover:text-slate-900"
                                }`}
                              >
                                {page.icon}
                                <p>{page.label}</p>
                              </Link>
                            );
                          }
                        )}
                      </div>
                    )}
                </a>
              )}

              {!isDrawerOpen && hoveredIndex === index && (
                <p
                  className="fixed bg-slate-700 text-white text-sm px-3 py-2 rounded-lg"
                  style={{
                    zIndex: 1000,
                    top:
                      (buttonRefs.current[index]?.getBoundingClientRect().top ??
                        0) + 3,
                    left:
                      (buttonRefs.current[index]?.getBoundingClientRect()
                        .left ?? 0) +
                      (buttonRefs.current[index]?.offsetWidth ?? 0) +
                      15, // margin
                  }}
                >
                  {page.label}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

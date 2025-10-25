"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


const menuSections = [
  {
    label: "General",
    items: [
      { name: "Home", path: "/" },
    ],
  },
  {
    label: "Projects",
    items: [
      { name: "All Projects", path: "/projects/all" },
      { name: "Create Project", path: "/projects/create" },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Settings", path: "/settings" },
    ],
  },
];

export default function SideMenu() {
  const pathname = usePathname();

 return (
  <nav className="flex flex-col space-y-6">
    {menuSections.map((section) => (
      <div key={section.label}>
        {/* Section Label */}
        <h3 className="px-4 text-xs font-semibold uppercase text-gray-500 tracking-wide mb-2">
          {section.label}
        </h3>

        {/* Items */}
        <div className="flex flex-col space-y-1">
          {section.items.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-4 py-2 rounded-md transition ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    ))}
  </nav>
);

}

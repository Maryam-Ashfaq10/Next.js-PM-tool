"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/profile" },
  { name: "Settings", path: "/settings" },
];

export default function SideMenu() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-2">
      {menuItems.map((item) => {
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
    </nav>
  );
}

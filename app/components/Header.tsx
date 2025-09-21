"use client"; 
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {

  const [open, setOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Tasks.me</h1>


      {/* Profile Dropdown */}
      <div className="relative">
        <button onClick={() => setOpen(!open)}>
          <Image
            src="/img/icon-user.png"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full border-2 border-white cursor-pointer"
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 text-gray-800">
            <Link
              href="/settings"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Settings
            </Link>
          
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setOpen(false);
                // add logout logic here
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>

    </header>

  );
}

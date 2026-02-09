"use client"; 
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      // Whether or not the API call errors, send user to login
      router.push("/login");
    }
  };

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
          
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setOpen(false);
                handleLogout();
                
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

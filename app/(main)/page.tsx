'use client';

import { useEffect, useState } from "react";

interface User {
  name: string;
}
export default function Home() {

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/auth/userProfile");
        const data = await res.json();
        if (res.ok) {
          setUser({ name: data.name });
        }
      } catch {
        // ignore, show generic greeting
      }
    };

    fetchMe();
  }, []);

  return (
    <div className="flex flex-col h-screen p-6">
      {/* Heading */}
      <h1 className="text-2xl font-bold mb-6"> Hi {user ? user.name : "User"}</h1>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Card 1 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Your Recents</h2>
          <p className="text-gray-600">
            This is the first card.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Due Projects</h2>
          <p className="text-gray-600">
            This is the second card.
          </p>
        </div>
        
      </div>
    </div>
  );
}

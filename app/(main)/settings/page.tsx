"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/auth/userProfile");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load user");
        }

        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading user info...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error || "User not found"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="p-6 border rounded-md bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Name:</span> {user.name}
          </div>
          <div>
            <span className="font-medium">Email:</span> {user.email}
          </div>
         
        </div>
      </section>
    </div>
  );
}
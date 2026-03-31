"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <h1>Loading...</h1>
      </div>
    );
  }

  const username = session.user?.name?.replace(/\s+/g, "") || "user";

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl mb-6">Welcome {session.user?.name} 🎉</h1>

      {/* 🔥 FIXED BUTTON LAYOUT */}
      <div className="flex flex-col gap-4 w-64 mx-auto">
        <Link href="/availability">
          <button className="w-full bg-blue-500 px-6 py-2 rounded hover:bg-blue-600">
            Set Availability
          </button>
        </Link>

        <Link href="/bookings">
          <button className="w-full bg-green-500 px-6 py-2 rounded hover:bg-green-600">
            My Bookings
          </button>
        </Link>

        <Link href={`/book/${username}`}>
          <button className="w-full bg-purple-500 px-6 py-2 rounded hover:bg-purple-600">
            Book Me
          </button>
        </Link>

        <button
          onClick={() => signOut()}
          className="w-full bg-red-500 px-6 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

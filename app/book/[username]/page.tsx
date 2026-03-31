"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function BookingPage() {
  const { username } = useParams();

  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        name,
        date,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Something went wrong"); // ✅ dynamic message
      return;
    }

    if (data.success) {
      alert("Booking successful 🎉");
      setName("");
      setDate("");
    } 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      
      <h1 className="text-3xl mb-6">
        Book {username}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-64"
      >
        <input
          type="text"
          placeholder="Your Name"
          className="p-2 rounded bg-white text-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="datetime-local"
          className="p-2 rounded bg-white text-black"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <button className="bg-purple-500 py-2 rounded hover:bg-purple-600">
          Confirm Booking
        </button>
      </form>
    </div>
  );
}
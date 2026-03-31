"use client";

import { useState } from "react";
import { setAvailability } from "@/lib/store";

export default function Availability() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleSave = () => {
    const data = { start, end };

    // 🔥 THIS IS THE MAIN FIX
    localStorage.setItem("availability", JSON.stringify(data));

    console.log("Saved:", data);

    alert("Availability Saved!");
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Set Your Availability</h1>

      <input
        type="time"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        className="border p-2"
      />

      <input
        type="time"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        className="border p-2 ml-2"
      />

      <button
        onClick={handleSave}
        className="block mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Availability
      </button>
    </div>
  );
}

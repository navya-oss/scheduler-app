"use client";

import { useState, useEffect } from "react";

export default function BookingClient({ username }: { username: string }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Booked slots state
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  // ✅ Fetch booked slots when date changes
  useEffect(() => {
    if (!date) return;

    const fetchSlots = async () => {
      try {
        const res = await fetch(`/api/booked-slots?date=${date}`);
        const data = await res.json();

        if (data.success) {
          setBookedSlots(data.slots);
        }
      } catch (error) {
        console.error("Error fetching slots", error);
      }
    };

    fetchSlots();
  }, [date]);

  const handleBooking = async () => {
    if (!date || !time) {
      alert("Please select date and time");
      return;
    }

    try {
      setLoading(true);

      const selectedDateTime = new Date(date);
      const [hours, minutes] = time.split(":");

      selectedDateTime.setHours(Number(hours));
      selectedDateTime.setMinutes(Number(minutes));
      selectedDateTime.setSeconds(0);
      selectedDateTime.setMilliseconds(0);

      const res = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDateTime.toISOString(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert((data as any).message || "Please login first");
        return;
      }

      if ((data as any).success) {
        alert(`Booked ${username} on ${date} at ${time}`);
        setTime("");
        setDate("");
        setBookedSlots([]);
      }
    } catch (error) {
      console.error(error);
      alert("Error while booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "30px", color: "white" }}>
      <h2>Select Time Slot</h2>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ padding: "10px", marginRight: "10px" }}
      />

      <select
        value={time}
        onChange={(e) => setTime(e.target.value)}
        style={{ padding: "10px", marginRight: "10px" }}
      >
        <option value="">Select time</option>

        {["09:00", "10:00", "11:00", "12:00"].map((slot) => (
          <option
            key={slot}
            value={slot}
            disabled={bookedSlots.includes(slot)}
          >
            {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
          </option>
        ))}
      </select>

      <button
        onClick={handleBooking}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Booking..." : "Confirm Booking"}
      </button>
    </div>
  );
} 
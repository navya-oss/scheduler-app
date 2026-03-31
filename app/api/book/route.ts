import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Incoming booking:", body.date);

    const session = await getServerSession(authOptions);

    // 🔒 Check login
    if (!session) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Please login first",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // ❗ Validate date
    if (!body.date) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Date is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const client = await clientPromise;
    const db = client.db("scheduler");

    // ✅ Restrict booking to next 7 days
    const selectedDate = new Date(body.date);

    const now = new Date();

    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 7);

    if (selectedDate < now || selectedDate > maxDate) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Bookings allowed only within next 7 days",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // 🔥 Create time range (same hour slot)
    const start = new Date(selectedDate);
    start.setMinutes(0, 0, 0);

    const end = new Date(selectedDate);
    end.setMinutes(59, 59, 999);

    // 🔍 Check duplicate booking
    const existing = await db.collection("bookings").findOne({
      date: {
        $gte: start,
        $lte: end,
      },
    });

    if (existing) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Slot already booked",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // ✅ Insert booking (IMPORTANT FIX: store as Date)
    await db.collection("bookings").insertOne({
      username: session.user?.name,
      name: session.user?.name,
      date: new Date(body.date),
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Booking successful",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("SERVER ERROR:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

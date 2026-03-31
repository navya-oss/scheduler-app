import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return new Response(
        JSON.stringify({
          success: false,
          slots: [],
        }),
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("scheduler");

    // ✅ Start of day
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    // ✅ End of day
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    // ✅ Fetch bookings only for selected date
    const bookings = await db
      .collection("bookings")
      .find({
        date: {
          $gte: start.toISOString(),
          $lte: end.toISOString(),
        },
      })
      .toArray();

    // ✅ Convert to "HH:00"
    const slots = bookings.map((b) => {
      const d = new Date(b.date);

      // ✅ Convert to IST manually (or local)
      const hours = d.getUTCHours() + 5; // IST offset
      const finalHour = hours % 24;

      return `${finalHour.toString().padStart(2, "0")}:00`;
    });

    return new Response(
      JSON.stringify({
        success: true,
        slots,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        success: false,
        slots: [],
      }),
      { status: 500 },
    );
  }
}

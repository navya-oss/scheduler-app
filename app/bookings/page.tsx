import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // make sure this exists

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);

  const client = await clientPromise;
  const db = client.db("scheduler");

  const bookings = await db
    .collection("bookings")
    .find({
      username: session?.user?.name, // filter here 🔥
    })
    .sort({ createdAt: -1 })
    .toArray();

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl mb-6 text-center">My Bookings 📅</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-400">No bookings found.</p>
      ) : (
        <div className="flex flex-col gap-4 items-center">
          {bookings.map((b: any) => (
            <div
              key={b._id.toString()}
              className="bg-gray-800 p-4 rounded w-80 shadow-lg"
            >
              <p>
                <b>Name:</b> {b.name.toUpperCase()}
              </p>
              <p>
                <b>User:</b> {b.username}
              </p>
              <p>
                <b>Date:</b> {new Date(b.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

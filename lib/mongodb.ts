import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Add MONGODB_URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!(global as any)._mongo) {
    client = new MongoClient(uri);
    console.log("⏳ Connecting to MongoDB...");
    (global as any)._mongo = client.connect().then((client) => {
      console.log("✅ MongoDB Connected!");
      return client;
    });
  }
  clientPromise = (global as any)._mongo;
} else {
  client = new MongoClient(uri);
  console.log("⏳ Connecting to MongoDB...");
  clientPromise = client.connect().then((client) => {
    console.log("✅ MongoDB Connected!");
    return client;
  });
}

export default clientPromise;
// libs/mongodbFront.ts
import mongoose from "mongoose";

const uri = process.env.NEXT_PUBLIC_MONGO_DB;
if (!uri) throw new Error("NEXT_PUBLIC_MONGO_DB not defined");

let cached = (global as any).mongooseFront;

if (!cached) {
  cached = (global as any).mongooseFront = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.createConnection(uri).asPromise();
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

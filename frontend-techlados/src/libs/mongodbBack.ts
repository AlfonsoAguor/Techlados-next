// libs/mongodbBack.ts
import mongoose from "mongoose";

const uri = process.env.NEXT_PUBLIC_MONGO_DB_BACK;
if (!uri) throw new Error("MONGO_DB_BACK not defined");
console.log("Uri back", uri);

let cached = (global as any).mongooseBack;

if (!cached) {
  cached = (global as any).mongooseBack = { conn: null, promise: null };
}

export const connectDBBack = async () => {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.createConnection(uri).asPromise();
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

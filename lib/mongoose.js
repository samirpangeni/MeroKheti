import mongoose from "mongoose";

const MONGODB_URI = process.env.MongoURL;

if (!MONGODB_URI) {
  throw new Error("Please define Mongo_URL in .env");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDBconnectionToDatabase() {
  if (mongoose.connection.readyState === 1) return;
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log("DB CONNECTED"); 
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDBconnectionToDatabase;

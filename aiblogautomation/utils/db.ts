import mongoose from "mongoose";

export default async function db() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const dbUri = process.env.DATABASE;
    if (!dbUri) {
      throw new Error("DATABASE environment variable is not defined");
    }
    await mongoose.connect(dbUri);
    console.log("🟢 Database connection successful");
  } catch (error) {
    console.error("🔴 Database connection error:", error);
  }
}

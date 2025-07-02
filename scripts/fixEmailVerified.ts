import mongoose from "mongoose";
import User from "../models/User";
import { connectToDatabase } from "../lib/db";

async function fixEmailVerified() {
  await connectToDatabase();

  // Set emailVerified to true for users where it is a Date
  await User.updateMany(
    { emailVerified: { $type: "date" } },
    { $set: { emailVerified: true } }
  );

  // Set emailVerified to false for users where it is null or missing
  await User.updateMany(
    { $or: [{ emailVerified: null }, { emailVerified: { $exists: false } }] },
    { $set: { emailVerified: false } }
  );

  console.log("All users updated: emailVerified is now a boolean.");
  await mongoose.connection.close();
}

fixEmailVerified().catch((err) => {
  console.error(err);
  mongoose.connection.close();
}); 
import mongoose, { Schema, Document } from "mongoose";

// Create the Ticket Schema
const ticketSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    ticketType: {
      type: String,
      required: true, // Allows for any string as the ticket type
    },
    message: {
      type: String,
      required: true,
      maxlength: 160, // Limit the message length
    },
    status: {
      type: String,
      default: "open", // Set default status as "open"
      enum: ["open", "closed"], // Possible status values
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt
);

// Create the Ticket model
const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);

export default Ticket;

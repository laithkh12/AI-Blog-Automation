"use server";
import db from "@/utils/db";
import Ticket from "@/models/ticket";
import User from "@/models/user";
import { TicketType } from "@/utils/types";

export const createTicketDb = async (data: TicketType) => {
  try {
    await db();

    // find user by email
    const user = await User.findOne({ email: data.email });

    if (!user) {
      throw new Error("Please use an email linked to an account with us");
    }

    const ticket = await Ticket.create({
      ...data,
      user: user._id,
    });

    return JSON.parse(JSON.stringify(ticket));
  } catch (error: any) {
    console.error("Error creating blog:", error);
    throw new Error(error.message || "Failed to create ticket");
  }
};

// get all tickets with counts for open and closed statuses
export const adminGetAllTicketsDb = async (page: number, limit: number) => {
  try {
    db();

    const [tickets, totalCount, openCount, closedCount] = await Promise.all([
      Ticket.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("user", "name username"),
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: "open" }),
      Ticket.countDocuments({ status: "closed" }),
    ]);

    return {
      tickets: JSON.parse(JSON.stringify(tickets)),
      totalCount,
      openCount,
      closedCount,
    };
  } catch (err: any) {
    throw new Error(err.message);
  }
};

// update ticket status
export async function toggleTicketStatusDb(ticketId: string) {
  try {
    await db(); // Initialize the database connection if needed

    // Find the ticket by ID
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Toggle the status
    ticket.status = ticket.status === "open" ? "closed" : "open";

    // Save the updated ticket
    await ticket.save();

    // Return the updated ticket and success message in json string format

    return JSON.parse(
      JSON.stringify({
        success: true,
        message: `Ticket status updated to ${ticket.status}`,
        ticket, // Include the updated ticket data
      })
    );
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update ticket status",
    };
  }
}

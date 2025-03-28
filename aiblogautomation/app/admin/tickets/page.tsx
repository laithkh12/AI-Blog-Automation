import React from "react";
import { adminGetAllTicketsDb } from "@/actions/ticket";
import { TicketType } from "@/utils/types";
import TicketCard from "@/components/admin/TicketCard";
import BlogPagination from "@/components/blog/BlogPagination";
import toast, { Toaster } from "react-hot-toast";

interface PageProps {
  searchParams: Promise<{ page?: number }>;
}

export default async function AdminTicketsPage({ searchParams }: PageProps) {
  // Wait for the searchParams to resolve
  const { page } = await searchParams;

  // Set the current page or default to 1 if not specified
  const currentPage = page ? parseInt(page as unknown as string, 10) : 1;
  const limit = 12; // Set the number of items per page

  // Fetch tickets from the database
  const { tickets, totalCount, openCount, closedCount } =
    await adminGetAllTicketsDb(currentPage, limit);

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="md:mt-0">
      <Toaster />
      <div className="p-5">
        <h1 className="text-2xl font-bold">Manage tickets</h1>
        <p className="text-sm text-gray-500">
          Total tickets: {totalCount} | Open: {openCount} | Closed:{" "}
          {closedCount}
        </p>
        <br />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tickets.map((ticket: TicketType) => {
            return (
              <div key={ticket._id} className="relative">
                <TicketCard ticket={ticket} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center mt-5">
        <BlogPagination page={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}

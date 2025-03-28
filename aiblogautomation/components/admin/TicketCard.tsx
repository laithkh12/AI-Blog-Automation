"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { TicketType } from "@/utils/types";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { toggleTicketStatusDb } from "@/actions/ticket";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

// plugin
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface TicketCardProps {
  ticket: TicketType;
}

// email ticketType message status user
export default function TicketCard({ ticket }: TicketCardProps) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleStatusChange = async () => {
    setLoading(true);
    try {
      if (!ticket._id) {
        toast.error("Ticket ID is missing.");
        setLoading(false);
        return;
      }
      const response = await toggleTicketStatusDb(ticket._id);

      if (response.success) {
        toast.success(response.message); // Show success toast
        router.refresh(); // Refresh the page
      } else {
        toast.error(response.message); // Show error toast
      }
    } catch (error) {
      toast.error("An error occurred while updating the ticket status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-col pb-2">
        <CardTitle className="text-lg line-clamp-1 mt-2">
          {ticket?.ticketType || "Ticket Type"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm mb-4">
          <p>{ticket.message}</p>
          <div className="flex justify-between">
            <p className="text-gray-500">
              by {ticket.user?.name || "Unknown User"}
            </p>
            <p className="text-gray-500">{ticket.email}</p>
          </div>
        </div>

        <div className="space-y-2">{dayjs(ticket.createdAt).fromNow()}</div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center w-full">
          {/* Status Buttons */}
          <div>
            {ticket.status === "open" ? (
              <div>
                <Button
                  variant="outline"
                  disabled
                  className="text-green-500 mr-2"
                  onClick={handleStatusChange}
                >
                  {loading ? <Loader2Icon className="animate-spin" /> : "Open"}
                </Button>
                <Button onClick={handleStatusChange} variant="outline">
                  Close
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  onClick={handleStatusChange}
                  variant="outline"
                  disabled
                  className="text-red-500 mr-2"
                >
                  {loading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    "Closed"
                  )}
                </Button>
                <Button onClick={handleStatusChange} variant="outline">
                  Reopen
                </Button>
              </div>
            )}
          </div>

          {/* Copy Button */}
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(ticket.email);
              toast.success("Email address copied to clipboard!");
            }}
          >
            Reply
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

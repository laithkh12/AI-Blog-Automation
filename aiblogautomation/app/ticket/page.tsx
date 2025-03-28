"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { createTicketDb } from "@/actions/ticket";

export default function TicketPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [ticketType, setTicketType] = useState("blog-automation");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTicketDb({ email, ticketType, message, status: "open" });
      setEmail("");
      setMessage("");

      toast.success(
        `Ticket opened. Keep an eye on your dashboard or email for updates.`
      );
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full md:w-1/2 max-w-6xl mx-auto my-5 space-y-6">
      <CardHeader>
        <CardTitle>Open A Ticket</CardTitle>
        <p className="text-gray-500">
          Tell us how we can help you. We will get back to you as soon as
          possible.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              required
            />
          </div>

          {/* Ticket Type Dropdown */}
          <div>
            <Label htmlFor="ticketType">Ticket Type</Label>
            <Select
              value={ticketType}
              onValueChange={(value) => setTicketType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ticket type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog-automation">Blog Automation</SelectItem>
                <SelectItem value="general-enquiry">General Enquiry</SelectItem>
                <SelectItem value="password-forgot">Password Forgot</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={160}
              required
            />
            <div className="text-right text-sm text-gray-500">
              {message.length}/160 characters
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || message.length > 160}
          >
            {loading ? "Please wait..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

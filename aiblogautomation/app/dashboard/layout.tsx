"use server";
import { authCheckAction } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const result = await authCheckAction();

  if (!result.loggedIn) {
    redirect("/login"); // Redirect to the home page if not logged in.
  }

  // If logged in, render the layout and children.
  return <div>{children}</div>;
}

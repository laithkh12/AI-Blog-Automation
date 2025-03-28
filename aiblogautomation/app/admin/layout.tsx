"use server";
import { authCheckAction } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const result = await authCheckAction();
  // console.log("result in admin layout => ", result);

  // Redirect to the login page if the user is not logged in.
  if (!result.loggedIn) {
    redirect("/login");
  }

  // Check if the user's role is 'admin'. If not, redirect to the login page.
  if (!result.user || result.user.role !== "admin") {
    redirect("/");
  }

  // If the user is logged in and has the admin role, render the layout with its children.
  return <div>{children}</div>;
}

"use client";
import React from "react";
import ModeToggle from "@/components/nav/mode-toggle";
import Link from "next/link";
import Image from "next/image";
import { Toaster } from "react-hot-toast";
import Breadcrumbs from "@/components/nav/breadcrumbs";
import LoginModal from "@/components/modal/login";
import { useAuthContext } from "@/context/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TopNav() {
  const { loginModalOpen, setLoginModalOpen, user, loggedIn, logout } =
    useAuthContext();

  return (
    <>
      <nav className="flex flex-wrap justify-between items-center m-2 pb-2 border-b-2 gap-2">
        {/* Logo and title */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="logo" width={50} height={50} />{" "}
          <span className="ml-2">
            <span
              style={{ fontFamily: "Arial" }}
              className="text-transparent bg-clip-text font-extrabold bg-gradient-to-r from-red-500 via-blue-500 to-yellow-400"
            >
              KALORAAT
            </span>
            <br />
            <span className="text-sm font-normal text-gray-700">
              AI Blog Automation
            </span>
          </span>
        </Link>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-2">
          <Link href="/blogs">
            <Button variant="outline">Blogs</Button>
          </Link>

          <a href="/dashboard/blog-automation">
            <Button variant="outline">Blog Automation</Button>
          </a>

          <Link href="/search">
            <Button variant="outline">Search</Button>
          </Link>
        </div>

        {/* User Menu */}
        {loggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="relative border p-2 rounded-md capitalize">
                {user.name}
                <span className="absolute top-0.4 right-0.5 h-2 w-2 bg-green-500 rounded-full"></span>
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <Link href={`/dashboard`}>
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />

              <Link href={`/dashboard/profile-update`}>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={() => setLoginModalOpen(!loginModalOpen)}
            variant="outline"
          >
            Login
          </Button>
        )}

        {/* Admin Role Button */}
        {loggedIn && user.role === "admin" && (
          <Link href={`/${user.role}`}>
            <span className="relative border p-2 rounded-md capitalize">
              {user.role}
              <span className="absolute top-0.4 right-0.5 h-2 w-2 bg-green-500 rounded-full"></span>
            </span>
          </Link>
        )}

        {/* Mode Toggle */}
        <ModeToggle />
      </nav>
      <nav>
        <Breadcrumbs />
        <LoginModal />
      </nav>

      {/* <pre>{JSON.stringify({ user, loggedIn }, null, 2)}</pre> */}
    </>
  );
}

"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/context/auth";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import toast, { Toaster } from "react-hot-toast";
import {
  updateProfileDb,
  updatePasswordDb,
  updateUsernameDb,
} from "@/actions/auth";

export default function ProfileUpdate() {
  const { user, setUser } = useAuthContext();
  const [loading, setLoading] = useState({ name: "", status: false });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading({ name: "profile", status: true });

    try {
      await updateProfileDb(user); // Call the server action
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading({ name: "profile", status: false });
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading({ name: "password", status: true });

    try {
      if (user.password) {
        await updatePasswordDb(user.password);
        toast.success("Password updated successfully");
      } else {
        toast.error("Password must be at least 6 characters long");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading({ name: "password", status: false });
    }
  };

  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading({ name: "username", status: true });

    try {
      await updateUsernameDb(user.username);
      toast.success("Username updated successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading({ name: "username", status: false });
    }
  };

  return (
    <Card className="w-full md:w-1/2 max-w-6xl mx-auto my-5 space-y-6">
      {/* Profile Update Form */}
      <Toaster />
      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleProfileUpdate}>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={user?.name || ""}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              type="text"
              required
            />
          </div>
          <div>
            <Label htmlFor="website">Website (optional)</Label>
            <Input
              id="website"
              value={user?.website || ""}
              onChange={(e) => setUser({ ...user, website: e.target.value })}
              type="text"
            />
          </div>
          <div>
            <Label htmlFor="about">About (optional)</Label>
            <Input
              id="about"
              value={user?.about || ""}
              onChange={(e) => setUser({ ...user, about: e.target.value })}
              type="text"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading.name === "profile" && loading.status}
          >
            {loading.name === "profile" && loading.status
              ? "Updating..."
              : "Update Profile"}
          </Button>
        </form>
      </CardContent>

      {/* Username Update Form */}
      <CardHeader>
        <CardTitle>Update Username</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleUsernameUpdate}>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={user?.username || ""}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              type="text"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading.name === "username" && loading.status}
          >
            {loading.name === "username" && loading.status
              ? "Updating..."
              : "Update Username"}
          </Button>
        </form>
      </CardContent>

      {/* Password Update Form */}
      <CardHeader>
        <CardTitle>Update Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handlePasswordUpdate}>
          <div>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              value={user.password || ""}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              type="password"
              // required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading.name === "password" && loading.status}
          >
            {loading.name === "password" && loading.status
              ? "Updating..."
              : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

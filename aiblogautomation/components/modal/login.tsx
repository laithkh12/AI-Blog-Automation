"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginModal() {
  const {
    user,
    setUser,
    loading,
    loginModalOpen,
    setLoginModalOpen,
    handleLoginSubmit,
  } = useAuthContext();

  const router = useRouter();

  const forgotPasswordClick = () => {
    setLoginModalOpen(false);
    router.push("/ticket");
  };

  return (
    <div>
      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>
              Enter your email address to login
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <Input
              value={user?.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              type="email"
              id="email"
              placeholder="Email"
              className="col-span-3"
              required
            />

            <Input
              value={user?.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              type="password"
              id="password"
              placeholder="Password"
              className="col-span-3"
              required
            />

            <DialogFooter className="flex justify-between items-center">
              <Button disabled={loading} type="submit">
                {loading && <Loader2Icon className="animate-spin" />} Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

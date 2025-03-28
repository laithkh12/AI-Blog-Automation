"use client";
import React, { useEffect } from "react";
import LoginModal from "@/components/modal/login";
import { useAuthContext } from "@/context/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function TopNav() {
  const { loginModalOpen, setLoginModalOpen, loggedIn } = useAuthContext();

  const router = useRouter();

  useEffect(() => {
    if (!loggedIn) {
      setLoginModalOpen(true);
    } else {
      setLoginModalOpen(false);
      router.push("/dashboard");
    }
  }, [loggedIn]);

  return (
    <div className="flex gap-5 justify-center items-center h-screen">
      <Button
        onClick={() => setLoginModalOpen(!loginModalOpen)}
        variant="outline"
        className="mt-[-100px]"
      >
        Login
      </Button>

      <LoginModal />
    </div>
  );
}

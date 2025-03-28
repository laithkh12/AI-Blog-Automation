import React from "react";
import { Loader2Icon } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-white">
        <Loader2Icon className="animate-spin" size={64} />
      </div>
    </div>
  );
}

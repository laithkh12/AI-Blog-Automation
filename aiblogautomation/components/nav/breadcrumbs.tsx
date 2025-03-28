"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs() {
  const path = usePathname();
  const pathSegments = path.split("/").filter((segment) => segment);

  // Only render breadcrumbs if there's more than the "Home" link
  if (pathSegments.length === 0) return null;

  return (
    <div className="flex items-center text-sm text-gray-500 space-x-2 mx-2">
      <Link href="/" className="hover:underline">
        Home
      </Link>
      {pathSegments.map((segment, index) => {
        // Generate the href for each breadcrumb link
        const href = "/" + pathSegments.slice(0, index + 1).join("/");
        return (
          <React.Fragment key={href}>
            <ChevronRight size={16} />
            <Link href={href} className="hover:underline capitalize">
              {segment.replace("-", " ")}
            </Link>
          </React.Fragment>
        );
      })}
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Users, ThumbsUp } from "lucide-react";

export default function UserDashboard() {
  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/blogs">
          <Button className="w-full h-32 text-xl" variant="outline">
            <FileText className="mr-2 h-8 w-8" />
            Blog Management
          </Button>
        </Link>
        <Link href="/dashboard/profile-update">
          <Button className="w-full h-32 text-xl" variant="outline">
            <Users className="mr-2 h-8 w-8" />
            Profile Management
          </Button>
        </Link>
        <Link href="/dashboard/liked-blogs">
          <Button className="w-full h-32 text-xl" variant="outline">
            <ThumbsUp className="mr-2 h-8 w-8" />
            Liked Blogs
          </Button>
        </Link>
      </div>
    </div>
  );
}

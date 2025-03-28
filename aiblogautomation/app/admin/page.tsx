import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Users } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/blogs">
          <Button className="w-full h-32 text-xl" variant="outline">
            <FileText className="mr-2 h-8 w-8" />
            Blog Management
          </Button>
        </Link>
        <Link href="/admin/users">
          <Button className="w-full h-32 text-xl" variant="outline">
            <Users className="mr-2 h-8 w-8" />
            User Management
          </Button>
        </Link>
        <Link href="/admin/tickets">
          <Button className="w-full h-32 text-xl" variant="outline">
            <Users className="mr-2 h-8 w-8" />
            Tickets
          </Button>
        </Link>
      </div>
    </div>
  );
}

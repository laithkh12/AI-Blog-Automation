import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronsRight, ChevronsLeft } from "lucide-react";

interface BlogPaginationProps {
  page: number;
  totalPages: number;
}

export default function BlogPagination({
  page,
  totalPages,
}: BlogPaginationProps) {
  return (
    <nav className="d-flex justify-content-center fixed-bottom opacity-75 mb-10">
      <ul className="flex justify-center items-center space-x-2 mt-5">
        {page > 1 && (
          <li className="page-item">
            <Link href={`?page=${page - 1}`}>
              <Button variant="outline">
                <ChevronsLeft />
              </Button>
            </Link>
          </li>
        )}

        {Array.from({ length: totalPages }, (_, index) => {
          const p = index + 1;
          return (
            <li key={p} className="page-item">
              <Link href={`?page=${p}`}>
                <Button variant={`${page === p ? "secondary" : "ghost"}`}>
                  {p}
                </Button>
              </Link>
            </li>
          );
        })}

        {page < totalPages && (
          <li className="page-item">
            <Link href={`?page=${page + 1}`}>
              <Button variant="outline">
                <ChevronsRight />
              </Button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

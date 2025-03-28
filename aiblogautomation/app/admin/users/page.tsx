import React from "react";
import { adminGetAllUsersDb } from "@/actions/auth";
import { UserType } from "@/utils/types";
import BlogPagination from "@/components/blog/BlogPagination";
import UserCard from "@/components/user/UserCard";

interface PageProps {
  searchParams: Promise<{ page?: number }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  // Wait for the searchParams to resolve
  const { page } = await searchParams;

  // Set the current page or default to 1 if not specified
  const currentPage = page ? parseInt(page as unknown as string, 10) : 1;
  const limit = 12; // Set the number of users per page

  // Fetch users from the database
  const { users, totalCount } = await adminGetAllUsersDb(currentPage, limit);

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="md:mt-0">
      <div className="p-5">
        <h1 className="text-2xl font-bold">Explore users</h1>
        <p className="text-sm text-gray-500">
          Total users: {totalPages * limit}
        </p>
        <br />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {users.map((user: UserType) => {
            return (
              <div key={user._id} className="relative">
                <UserCard user={user} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center mt-5">
        <BlogPagination page={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}

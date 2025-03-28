import React from "react";
import { adminGetAllBlogsDb } from "@/actions/blog";
import { BlogType } from "@/utils/types";
import BlogCard from "@/components/blog/BlogCard";
import BlogPagination from "@/components/blog/BlogPagination";
import FloatingBlogEditButtons from "@/components/admin/FloatingBlogEditButtons";

interface BlogsPageProps {
  searchParams: Promise<{ page?: number }>;
}

export default async function AdminPage({ searchParams }: BlogsPageProps) {
  const { page } = await searchParams;
  const currentPage =
    page !== undefined ? parseInt(page as unknown as string, 10) : 1;
  const limit = 12; // Number of blogs per page

  // Fetch the blogs based on the current page and limit
  const { blogs, totalCount } = await adminGetAllBlogsDb(currentPage, limit);

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="md:mt-0">
      <div className="p-5">
        <h1 className="text-2xl font-bold">Explore the Latest Blog Posts</h1>
        <p className="text-sm text-gray-500">Total blog posts: {totalCount}</p>
        <br />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map((blog: BlogType) => {
            return (
              <div key={blog._id} className="relative">
                {/* BlogCard */}
                <div>
                  <BlogCard blog={blog} />
                </div>
                {/* Floating Buttons */}
                <FloatingBlogEditButtons blog={blog} />
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

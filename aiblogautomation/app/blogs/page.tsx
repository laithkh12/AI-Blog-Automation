import React from "react";
import { getAllBlogsDb } from "@/actions/blog";
import { BlogType } from "@/utils/types";
import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import BlogPagination from "@/components/blog/BlogPagination";

export const metadata = {
  title: "Blogs",
  description: "Find the latest blogs",
};

interface BlogsPageProps {
  searchParams: Promise<{ page?: number }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const { page } = await searchParams; // Await and destructure the `page` from the resolved promise
  const currentPage = page ? parseInt(page as unknown as string, 10) : 1;
  const limit = 12; // Set the number of blogs per page

  const { blogs, totalCount } = await getAllBlogsDb(currentPage, limit); // Make sure your action supports pagination
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="md:mt-0">
      <div className="p-5">
        <h1 className="text-2xl font-bold">Explore the Latest Blog Posts</h1>
        <p className="text-sm text-gray-500">
          Total blog posts: {totalPages * limit}
        </p>
        <br />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map((blog: BlogType) => (
            <div
              key={blog._id}
              className="transform transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Link href={`/blogs/${blog.slug}`}>
                <BlogCard blog={blog} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-5">
        <BlogPagination page={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}

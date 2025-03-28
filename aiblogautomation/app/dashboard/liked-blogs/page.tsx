import React from "react";
import { getLikedBlogsDb } from "@/actions/blog";
import { BlogType } from "@/utils/types";
import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import BlogPagination from "@/components/blog/BlogPagination";

interface BlogsPageProps {
  searchParams: Promise<{ page?: number }>;
}

export default async function LikedBlogsPage({ searchParams }: BlogsPageProps) {
  const { page } = await searchParams; // Wait for the promise to resolve
  const currentPage = page ? parseInt(page as unknown as string, 10) : 1;
  const limit = 12; // Set the number of blogs per page

  const { blogs, totalCount } = await getLikedBlogsDb(currentPage, limit); // Make sure your action supports pagination
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="md:mt-0">
      <div className="p-5">
        <h1 className="text-2xl font-bold">Your Liked Blog Posts</h1>
        <p className="text-sm text-gray-500">Total blog posts: {totalCount}</p>
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

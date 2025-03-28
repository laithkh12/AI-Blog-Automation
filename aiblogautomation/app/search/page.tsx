"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Loader2Icon } from "lucide-react";
import { searchBlogsDb } from "@/actions/blog";
import { BlogType } from "@/utils/types";
import Link from "next/link";

// Component wrapped in Suspense
function SearchComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [text, setText] = useState(searchParams.get("query") || "");
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(false);

  // Synchronize URL query parameters with state
  useEffect(() => {
    const query = searchParams.get("query") || "";
    searchBlogsDb(query).then((result) => setBlogs(result));
  }, [searchParams]);

  // Function to fetch blogs
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`?query=${text}`);

    setLoading(true);
    try {
      const result = await searchBlogsDb(text);
      setBlogs(result);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="flex gap-4 items-stretch" onSubmit={handleSearch}>
        <Input
          id="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search blogs"
          className="flex-1"
          autoFocus
        />
        <Button
          type="submit"
          variant="outline"
          disabled={loading}
          className="flex items-center justify-center"
        >
          {loading ? (
            <Loader2Icon className="animate-spin w-5 h-5" />
          ) : (
            <SearchIcon className="w-5 h-5" />
          )}
          <span className="ml-2">Search</span>
        </Button>
      </form>

      <div className="mt-5">
        {loading ? (
          <p>Loading...</p>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <Link key={blog._id} href={`/blogs/${blog.slug}`}>
                <div className="border p-4 rounded-lg shadow-sm hover:shadow-md">
                  <h2 className="text-lg font-semibold">{blog.title}</h2>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No blogs found. Try searching for something else.
          </p>
        )}
      </div>
    </div>
  );
}

// Parent Component with Suspense
export default function SearchPage() {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <Label htmlFor="search" className="block text-lg font-semibold">
        Search
      </Label>

      <Suspense fallback={<p>Loading search parameters...</p>}>
        <SearchComponent />
      </Suspense>
    </div>
  );
}

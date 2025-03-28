import { BlogType } from "@/utils/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import readingTime from "reading-time";
import BlogLike from "@/components/blog/BlogLike";

dayjs.extend(relativeTime);

interface SingleBlogCardProps {
  blog: BlogType;
}

export default function BlogView({ blog }: SingleBlogCardProps) {
  const timeToRead = readingTime(blog.content);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-col items-start pb-2">
        {/* Blog image or placeholder */}
        <div className="w-full h-96 relative overflow-hidden rounded-md">
          {blog?.imageUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={blog.imageUrl}
                alt={blog?.title || "Blog image"}
                layout="fill"
                objectFit="cover"
              />
              {/* Title overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                <h1 className="text-white text-3xl md:text-4xl font-bold text-center">
                  {blog?.title || "Untitled"}
                </h1>
              </div>
            </div>
          ) : (
            "No Featured Image"
          )}
        </div>
      </CardHeader>

      <div className="flex flex-wrap justify-center gap-4 mx-4 my-4 sm:mx-10 text-sm">
        <BlogLike blog={blog} />

        {/* Time to Read */}
        <Button disabled variant="outline" className="rounded-full">
          {timeToRead.text}
        </Button>

        {/* Word Count */}
        <Button disabled variant="outline" className="rounded-full">
          {timeToRead.words} words
        </Button>

        {/* Published Date */}
        <Button disabled variant="outline" className="rounded-full">
          Published{" "}
          {blog?.createdAt ? dayjs(new Date(blog.createdAt)).fromNow() : "Date"}
        </Button>

        {/* Last Updated (Conditional) */}
        {blog?.updatedAt && blog.createdAt !== blog.updatedAt && (
          <Button disabled variant="outline" className="rounded-full">
            Updated {dayjs(new Date(blog.updatedAt)).fromNow()}
          </Button>
        )}

        {/* Author */}
        <Button disabled variant="outline" className="rounded-full">
          by {blog?.user?.name || "Author"}
        </Button>

        {/* Category */}
        <Button disabled variant="outline" className="rounded-full">
          on{" "}
          <Link href={`/blog/category/${blog?.category}`}>
            {blog?.category || "Category"}
          </Link>
        </Button>
      </div>

      {/* Blog content preview */}
      <CardContent className="prose prose-strong:text-gray-500 prose-headings:text-gray-500 max-w-none mt-12">
        <div className="text-lg leading-relaxed text-gray-500 space-y-6">
          {blog?.content && (
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import React from "react";
import Image from "next/image";
import { Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogType } from "@/utils/types"; // Update this import based on your actual type definition
// import BlogImagePlaceholder from "@/components/blog/cards/blog-image-placeholder";
import dayjs from "dayjs";

// plugin
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface BlogCardProps {
  blog: BlogType;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-col pb-2">
        <div className="w-full h-40 relative overflow-hidden rounded-md">
          {blog?.imageUrl ? (
            <Image
              src={blog?.imageUrl}
              alt={blog?.title}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <p>blog image placeholder</p>
            // <BlogImagePlaceholder title={blog?.title || "Untitled"} />
          )}
        </div>
        <CardTitle className="text-lg line-clamp-1 mt-2">
          {blog?.title || "Blog Title"}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {blog?.category || "Category"}{" "}
          {!blog.published && (
            <span className="text-red-500 text-[8px]">Unpublished</span>
          )}
        </p>
      </CardHeader>
      <CardContent>
        <div className="text-sm mb-4 line-clamp-3">
          {blog?.excerpt && (
            <div dangerouslySetInnerHTML={{ __html: blog.excerpt }} />
          )}
        </div>

        <div className="space-y-2">
          <InfoItem icon={User} text={blog?.user?.name || "Author"} />
          <InfoItem
            icon={Clock}
            text={blog?.createdAt ? dayjs(blog.createdAt).fromNow() : "Date"}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center text-sm">
      <Icon className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
      <span className="line-clamp-1">{text}</span>
    </div>
  );
}

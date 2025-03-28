"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { togglePublishBlogDb, deleteBlogDb } from "@/actions/blog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BlogType } from "@/utils/types";

interface FloatingBlogEditButtonsProps {
  blog: BlogType;
}

// Destructure blogId from props
export default function FloatingBlogEditButtons({
  blog,
}: FloatingBlogEditButtonsProps) {
  const router = useRouter();

  const handlePublish = async (blogId: string) => {
    try {
      const blog = await togglePublishBlogDb(blogId);
      router.refresh();
      if (blog.published) {
        toast.success("Published");
      } else {
        toast.error("Not published");
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDelete = async (blogId: string) => {
    try {
      await deleteBlogDb(blogId);
      router.refresh();
      toast.success("Blog deleted successfully");
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="absolute mt-2 top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-3">
      <Button variant="outline">
        <Link href={`/dashboard/blog-automation?id=${blog._id}`}>Edit</Link>
      </Button>
      <Button
        variant={blog.published ? "default" : "destructive"}
        onClick={() => blog._id && handlePublish(blog._id)}
      >
        {blog.published ? "Published" : "Not Published"}
      </Button>
      <Button
        variant="destructive"
        onClick={() => blog._id && handleDelete(blog._id)}
      >
        Delete
      </Button>
    </div>
  );
}

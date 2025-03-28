"use client";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BlogType } from "@/utils/types";
import { useAuthContext } from "@/context/auth";
import { toggleBlogLikeDb } from "@/actions/blog";
import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogLike({ blog }: { blog: BlogType }) {
  const { user, loggedIn } = useAuthContext(); // context
  const [likes, setLikes] = useState(blog?.likes);
  const [loading, setLoading] = useState(false);

  // Check if the user has liked the blog
  const liked = user?._id && likes?.includes(user._id);

  const handleLike = async () => {
    if (!loggedIn) {
      toast.error("Please login to like");
      return;
    }

    setLoading(true);
    try {
      if (!blog?._id) {
        throw new Error("Blog ID is undefined");
      }
      const data = await toggleBlogLikeDb(blog._id);
      console.log("liked data => ", data);
      setLikes(data.likes);
      data.liked ? toast.success("Blog liked") : toast.error("Blog unliked");
    } catch (err) {
      console.log(err);
      toast.error("Failed to like");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cursor-pointer" onClick={handleLike}>
      <Toaster />
      {liked ? (
        <Button variant="outline" className="rounded-full">
          <ThumbsUp className={`${loading && "animate-spin"}`} />
          {liked ? "Liked" : "Like"}
        </Button>
      ) : (
        <Button variant="outline" className="rounded-full">
          <ThumbsUp className={`${loading && "animate-spin"}`} />
          {liked ? "Liked" : "Like"}
        </Button>
      )}
    </div>
  );
}

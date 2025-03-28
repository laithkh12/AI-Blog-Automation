"use client";
import React, { useState, useEffect, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateContentAi } from "@/actions/googleAi";
import { generateImageUnsplash } from "@/actions/unsplash";
import { Bot, Loader2Icon, Send } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import MDEditor from "@uiw/react-md-editor";
import { createBlogDb, getBlogByIdDb, updateBlogDb } from "@/actions/blog";
import { useRouter, useSearchParams } from "next/navigation";

const defaultPrompt = `Generate an SEO-optimized blog post on the topic: {title}. The post should be written in a clear, easy-to-understand language suitable for a broad audience. Ensure the content is human-friendly and engaging while incorporating relevant SEO keywords naturally. Please return the response in JSON format as follows: { "content": "Your blog post content here" }. Content must be written in semantic HTML format including multiple headings, bullet points, paragraphs etc but excluding DOCTYPE html head meta sections. Include Summary section at the end of content but do not include keywords: section at the end.`;

export default function Page() {
  const [category, setCategory] = useState("");
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState({ name: "", status: false });
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [promptVisible, setPromptVisible] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      getBlogByIdDb(id).then((blog) => {
        if (blog) {
          setCategory(blog.category);
          setTitle(blog.title);
          setContent(blog.content);
          setImage(blog.imageUrl);
        }
      });
    }
  }, [id]);

  const handleSubmit = async () => {
    // Check required fields
    if (!category || !title || !content || !image) {
      toast.error("Please fill in all fields before submitting.");
      return;
    }

    setLoading({ name: "saving", status: true });
    try {
      // Update blog if `id` exists
      if (id) {
        const blog = await updateBlogDb(id, {
          category,
          title,
          content,
          imageUrl: image,
        });

        if (blog) {
          toast.success("Blog post updated successfully.");

          // Reset form fields after successful creation
          setCategory("");
          setSuggestedCategories([]);
          setTitle("");
          setSuggestedTitles([]);
          setContent("");
          setImage("");

          // Redirect to the blog post
          router.push("/dashboard");
        } else {
          toast.error("Failed to update blog post.");
        }
      } else {
        // Create new blog
        const blog = await createBlogDb({
          category,
          title,
          content,
          imageUrl: image,
        });

        if (blog) {
          toast.success("Blog post created successfully.");

          // Reset form fields after successful creation
          setCategory("");
          setSuggestedCategories([]);
          setTitle("");
          setSuggestedTitles([]);
          setContent("");
          setImage("");
        } else {
          toast.error("Failed to create blog post.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(
        id ? "Failed to update blog post." : "Failed to create blog post."
      );
    } finally {
      setLoading({ name: "saving", status: false });
    }
  };

  const generateCategories = async () => {
    setLoading({ name: "categories", status: true });
    try {
      const { categories } = await generateContentAi(
        `Suggest 20 of the most popular and relevant categories for a blogging application. Please return the response in JSON format like this: { "categories": ["Category 1", "Category 2", "Category 3", ...] }`
      );
      setSuggestedCategories(categories as string[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading({ name: "categories", status: false });
    }
  };

  const generateTitles = async () => {
    if (!category) {
      toast.error("Please write or select a category first.");
      return;
    }
    setLoading({ name: "titles", status: true });
    try {
      const { titles } = await generateContentAi(
        `Suggest 3 SEO-optimized blog post titles for the category: ${category}. The titles should be catchy, relevant, and designed to attract traffic. Please return the response in JSON format like this: { "titles": ["Title 1", "Title 2", "Title 3"] }`
      );
      console.log(titles);
      setSuggestedTitles(titles as string[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading({ name: "titles", status: false });
    }
  };

  const generateContent = async () => {
    if (!title) {
      toast.error("Please write or select a title first.");
      return;
    }
    setLoading({ name: "content", status: true });
    try {
      // const { content } = await generateContentAi(
      //   `Generate an SEO-optimized blog post on the topic: ${title}. The post should be written in a clear, easy-to-understand language suitable for a broad audience. Ensure the content is human-friendly and engaging while incorporating relevant SEO keywords naturally. Please return the response in JSON format as follows: { "content": "Your blog post content here" }. Content must be written in semantic HTML format including multiple headings, bullet points, paragraphs etc but excluding DOCTYPE html head meta sections. Include Summary section at the end of content but do not include keywords: section at the end.`
      // );
      const formattedPrompt = prompt.replace("{title}", title);
      const { content } = await generateContentAi(formattedPrompt);

      setContent(content as string);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading({ name: "content", status: false });
    }
  };

  // const generateImage = () => {
  //   setImage(`https://via.placeholder.com/600x400.png?text=${title}`);
  // };

  // move fetch to server side to prevent exposing API key
  const generateImage = async () => {
    if (!category || !title || !content) {
      toast.error(
        "Please fill in the category, title, and content fields first."
      );
      return;
    }

    setLoading({ name: "image", status: true });

    try {
      const url = await generateImageUnsplash(title);
      setImage(url);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading({ name: "image", status: false });
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto my-5">
      <Toaster />
      <CardHeader>
        <CardTitle>Create a New Blog Post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>

          <div className="flex gap-2">
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category name"
              className="flex-1"
            />
            <Button
              onClick={generateCategories}
              variant="outline"
              className="flex-1"
              disabled={loading.name === "categories" && loading.status}
            >
              {loading.name === "categories" && loading.status ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <Bot />
              )}{" "}
              Get Categories Suggestions from AI
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {suggestedCategories.map((c) => (
              <Button
                key={c}
                variant={category === c ? "default" : "outline"}
                onClick={() => setCategory(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <div className="flex gap-2">
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your blog post title"
              className="flex-1"
            />
            <Button
              onClick={generateTitles}
              variant="outline"
              className="flex-1"
              disabled={loading.name === "titles" && loading.status}
            >
              {loading.name === "titles" && loading.status ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <Bot />
              )}{" "}
              Get Titles Suggestion from AI
            </Button>
          </div>

          {suggestedTitles.length > 0 && (
            <div className="mt-2">
              <Label>Suggested Titles:</Label>
              <div className="grid gap-2 mt-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {suggestedTitles.map((t) => (
                  <div
                    key={t}
                    className={`justify-start p-2 cursor-pointer ${
                      title === t
                        ? "border rounded-md bg-black text-white dark:bg-white dark:text-black"
                        : ""
                    }`}
                    onClick={() => setTitle(t)}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {/* Trigger Button */}
          <div className="flex gap-2">
            <Button
              onClick={() => setPromptVisible((prev) => !prev)}
              variant="outline"
            >
              Final Prompt
            </Button>
            <Button onClick={() => setPrompt(defaultPrompt)} variant="outline">
              Reset
            </Button>
          </div>

          {/* Conditional Prompt Section */}
          <div className={`${promptVisible ? "block" : "hidden"} w-full`}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              id="prompt"
              className="w-full p-2 border rounded"
              placeholder="Edit the prompt here"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>

          <div>
            <Button
              className="w-full"
              variant="outline"
              onClick={generateContent}
              disabled={loading.name === "content" && loading.status}
            >
              {loading.name === "content" && loading.status ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <Bot />
              )}{" "}
              Generate Content with AI
            </Button>
          </div>

          <div className="pt-5">
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || "")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Featured Image</Label>
          <div className="flex gap-2 items-center">
            <Button
              onClick={generateImage}
              className="flex-1"
              variant="outline"
              disabled={loading.name === "image" && loading.status}
            >
              {loading.name === "image" && loading.status ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <Bot />
              )}{" "}
              Generate Image
            </Button>

            {image && (
              <div className="flex-1">
                <img
                  src={image}
                  alt="Featured"
                  className="mt-2 max-w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={loading.name === "saving" && loading.status}
          >
            {loading.name === "saving" && loading.status ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <Send />
            )}{" "}
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

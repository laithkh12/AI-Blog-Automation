import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Search, Type, User } from "lucide-react";

/**
<section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
 */

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Create Stunning Blogs in Seconds with AI
                </h1>
                <p className="mx-auto max-w-3xl text-gray-500 md:text-xl dark:text-gray-400">
                  Revolutionize your content creation with our AI-powered blog
                  automation platform. Generate SEO-optimized blogs with just a
                  few clicks.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="It's completely free!"
                    disabled
                  />
                  <Link href="/dashboard/blog-automation">
                    <Button type="submit">Get Started</Button>
                  </Link>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get your unique URL and start blogging instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Powerful AI Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {/* Feature Cards */}
              {[
                {
                  icon: <Type className="h-12 w-12 text-blue-500" />,
                  title: "Topic Suggestions",
                  description:
                    "Get AI-powered blog topic ideas tailored to your niche and audience.",
                },
                {
                  icon: <Type className="h-12 w-12 text-green-500" />,
                  title: "Multiple Headings",
                  description:
                    "Generate engaging headlines and subheadings for your blog posts.",
                },
                {
                  icon: <Type className="h-12 w-12 text-purple-500" />,
                  title: "Full Blog Content",
                  description:
                    "Create unique, high-quality blog content with a single click.",
                },
                {
                  icon: <Search className="h-12 w-12 text-yellow-500" />,
                  title: "SEO Optimization",
                  description:
                    "Ensure your content ranks high with built-in SEO best practices.",
                },
                {
                  icon: <Image className="h-12 w-12 text-red-500" />,
                  title: "AI-Generated Images",
                  description:
                    "Enhance your blogs with relevant, AI-generated images.",
                },
                {
                  icon: <User className="h-12 w-12 text-indigo-500" />,
                  title: "Custom Username",
                  description:
                    "Get a unique URL to showcase and promote your blog portfolio.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg"
                >
                  {feature.icon}
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 justify-items-center">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <div className="bg-blue-500 text-white rounded-full p-3 text-3xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold">Choose Your Topic</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Select from AI-suggested topics or input your own idea.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <div className="bg-green-500 text-white rounded-full p-3 text-3xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold">Customize Content</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Let AI suggest titles and generate full SEO content in
                  seconds.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <div className="bg-purple-500 text-white rounded-full p-3 text-3xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold">Generate & Publish</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Click to create your blog and publish it instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Start Blogging in Seconds
                </h2>
                <p className="max-w-3xl text-gray-500 md:text-xl dark:text-gray-400">
                  Join thousands of business owners who are revolutionizing
                  their content creation with us. Create engaging, SEO-optimized
                  content faster than ever before.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="It's completely free!"
                    disabled
                  />
                  <Link href="/dashboard/blog-automation">
                    <Button type="submit">Get Started</Button>
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} AI Blog Automation. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="/ticket"
          >
            Support
          </Link>
        </nav>
      </footer>
    </div>
  );
}

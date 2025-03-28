import { getBlogBySlugFromDb } from "@/actions/blog";
import { BlogType } from "@/utils/types";
import BlogView from "@/components/blog/BlogView";
import UserCard from "@/components/user/UserCard";
import { UserType } from "@/utils/types";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

function stripHtmlAndTruncate(text: string, maxLength: number): string {
  // Remove HTML tags
  const strippedText = text.replace(/(<([^>]+)>)/gi, "");

  // Remove line breaks and extra white spaces
  const cleanedText = strippedText.replace(/\s+/g, " ").trim();

  // Truncate the text if necessary
  return cleanedText.length > maxLength
    ? cleanedText.substring(0, maxLength) + "..."
    : cleanedText;
}

// Generate metadata for SEO and OpenGraph
export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params; // Awaiting params to resolve
  const blog = await getBlogBySlugFromDb(slug);
  const imageUrl = blog?.imageUrl || "/images/logo.png";
  const shortDescription = stripHtmlAndTruncate(blog.content, 160);

  // Define image dimensions (adjust based on actual image dimensions)
  const imageWidth = 1200; // Example width
  const imageHeight = 630; // Example height (16:9 aspect ratio is common for OG images)

  return {
    title: `${blog.title} - ${blog.category}`,
    description: shortDescription,
    openGraph: {
      title: blog.title,
      description: shortDescription,
      type: "article",
      url: `${process.env.DOMAIN}/blog/${slug}`,
      site_name: `${process.env.APP_NAME}`,
      images: [
        {
          url: imageUrl,
          alt: `${blog.title}`,
          type: "image/jpg",
          width: imageWidth,
          height: imageHeight,
        },
      ],
    },
    canonical: `${process.env.DOMAIN}/blog/${slug}`,
  };
}

// Blog Page Component
export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params; // Awaiting params to resolve
  const blog: BlogType = await getBlogBySlugFromDb(slug);

  return (
    <div className="container mx-auto px-4 py-8 md:mt-0">
      <div className="flex flex-col md:flex-row justify-center items-start gap-8">
        {/* Main blog content */}
        <div className="w-full">
          <BlogView blog={blog} />

          <div className="flex justify-center py-10 w-full max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-lg mb-2 ml-1">About the author</h3>
              <UserCard user={blog.user as UserType} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

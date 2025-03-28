"use server";
import db from "@/utils/db";
import Blog from "@/models/blog";
import slugify from "slugify";
import { authCheckAction } from "@/actions/auth";
import { BlogType, UserType } from "@/utils/types";

// can edit blog or not?
const canEditBlog = (blog: BlogType, user: UserType) => {
  if (!user) {
    throw new Error("You need to be logged in to perform this action");
  }

  // Check if the blog exists
  if (!blog) {
    throw new Error("Blog not found");
  }

  // If the user._id is not equal to blog.user._id, and the user is not an admin, they are not authorized
  if (
    blog.user?._id?.toString() !== user?._id?.toString() &&
    user.role !== "admin"
  ) {
    throw new Error("You are not authorized to perform this action");
  }
};

// Helper to generate an excerpt
const generateExcerpt = (content: string) => {
  const maxLength = 160;
  return content.length > maxLength
    ? content.slice(0, maxLength) + "..."
    : content;
};

export const createBlogDb = async (data: BlogType) => {
  try {
    const { user } = await authCheckAction();

    if (!user) {
      throw new Error("You need to be logged in to create a blog");
    }

    const slug = slugify(data.title, { lower: true, strict: true });
    await db();

    // Check if the slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      throw new Error(
        "A blog with this slug already exists. Please use a different title."
      );
    }

    const excerpt = generateExcerpt(data.content);

    const blog = await Blog.create({
      ...data,
      slug,
      user: user._id,
      excerpt, // Add generated excerpt
    });

    return JSON.parse(JSON.stringify(blog));
  } catch (error: any) {
    console.error("Error creating blog:", error);
    throw new Error(error.message || "Failed to create blog");
  }
};

// get blog by id
export const getBlogByIdDb = async (id: string) => {
  try {
    await db();

    const blog = await Blog.findById(id).populate("user", "_id name").lean();
    return JSON.parse(JSON.stringify(blog));
  } catch (err: any) {
    throw new Error(err);
  }
};

// update blog by id
export const updateBlogDb = async (id: string, data: BlogType) => {
  try {
    await db();

    const { user } = await authCheckAction();

    if (!user) {
      throw new Error("You need to be logged in to update a blog");
    }

    // Check if the user is authorized to update the blog:
    const blog = await Blog.findById(id).populate("user");

    // check if user can edit blog
    canEditBlog(blog, user);

    // Generate excerpt based on updated content
    const excerpt = generateExcerpt(data.content);

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $set: {
          ...data,
          excerpt,
          slug: slugify(data.title, { lower: true, strict: true }),
        },
      },
      { new: true }
    ).lean();

    return JSON.parse(JSON.stringify(blog));
  } catch (err: any) {
    console.error("Error updating blog:", err);
    throw new Error(err.message || "Failed to update blog");
  }
};

// get current user blogs
export const getUserBlogsDb = async (page: number, limit: number) => {
  try {
    db();

    const { user } = await authCheckAction();

    if (!user) {
      throw new Error("You need to be logged in to create a blog");
    }

    const [blogs, totalCount] = await Promise.all([
      Blog.find({ user: user._id })
        .select("-content") // Exclude content field
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("user", "name username"),
      Blog.countDocuments({ user: user._id, published: true }),
    ]);

    console.log(blogs?.length);

    return {
      blogs: JSON.parse(JSON.stringify(blogs)),
      totalCount,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

// get all blogs from database with pagination
export const getAllBlogsDb = async (page: number, limit: number) => {
  try {
    db();

    const [blogs, totalCount] = await Promise.all([
      Blog.find({ published: true })
        .select("-content") // Exclude content field
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("user", "name username"),
      Blog.countDocuments({ published: true }),
    ]);

    console.log(blogs?.length);

    return {
      blogs: JSON.parse(JSON.stringify(blogs)),
      totalCount,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

// get all blogs from database with pagination
export const adminGetAllBlogsDb = async (page: number, limit: number) => {
  try {
    db();

    const [blogs, totalCount] = await Promise.all([
      Blog.find()
        .select("-content") // Exclude content field
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("user", "name username"),
      Blog.countDocuments(),
    ]);

    console.log(blogs?.length);

    return {
      blogs: JSON.parse(JSON.stringify(blogs)),
      totalCount,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

// get a single blog by slug from database
export const getBlogBySlugFromDb = async (slug: string) => {
  try {
    await db();

    const blog = await Blog.findOne({ slug })
      .populate("user", "name username createdAt")
      .lean();

    if (!blog) {
      throw new Error("Blog not found");
    }

    return JSON.parse(JSON.stringify(blog));
  } catch (err: any) {
    console.log("blog not found err => ", err);
    throw new Error(err);
  }
};

// get all blogs with pagination based on category
export const getBlogsByCategory = async (
  category: string,
  page: number,
  limit: number
) => {
  try {
    await db();

    const [blogs, totalCount] = await Promise.all([
      Blog.find({ category, published: true })
        .select("title slug") // Fetch only title and slug fields
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Blog.countDocuments({ category, published: true }),
    ]);

    return {
      blogs: JSON.parse(JSON.stringify(blogs)),
      totalCount,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

export const searchBlogsDb = async (query: string) => {
  try {
    db(); // Ensure database connection
    // console.log("search query => ", query);

    const blogs = await Blog.find({
      $text: { $search: query }, // Full-text search
      published: true, // Only fetch published blogs
    })
      .sort({ score: { $meta: "textScore" } }) // Sort by relevance
      .limit(100)
      .exec();

    // console.log("Found blogs: ", blogs);

    return JSON.parse(JSON.stringify(blogs));
  } catch (err: any) {
    console.error("Error in searchBlogsDb:", err.message);
    throw new Error(err);
  }
};

export const toggleBlogLikeDb = async (blogId: string) => {
  try {
    const { user } = await authCheckAction();
    const userId = user?._id;

    if (!userId) {
      throw new Error("Login required");
    }

    // Initialize `likes` as an empty array if it doesn't exist
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }

    if (!blog.likes) {
      blog.likes = [];
    }

    // Check if the user already liked the blog
    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyLiked) {
      // User is unliking the blog
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        { $pull: { likes: userId } },
        { new: true }
      );

      return JSON.parse(
        JSON.stringify({
          liked: false,
          likes: updatedBlog.likes,
        })
      );
    } else {
      // User is liking the blog
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        { $addToSet: { likes: userId } },
        { new: true }
      );

      return JSON.parse(
        JSON.stringify({
          liked: true,
          likes: updatedBlog.likes,
        })
      );
    }
  } catch (err: any) {
    throw new Error(`Failed to toggle like: ${err.message}`);
  }
};

export const togglePublishBlogDb = async (id: string) => {
  try {
    await db();

    const { user } = await authCheckAction();

    if (!user) {
      throw new Error("You need to be logged in to update a blog");
    }

    // Fetch the blog
    const blog = await Blog.findById(id).populate("user");

    // Check if the user can publish/unpublish the blog
    canEditBlog(blog, user);

    // Toggle the published status
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $set: {
          published: !blog.published,
        },
      },
      { new: true }
    ).lean();

    return JSON.parse(JSON.stringify(updatedBlog));
  } catch (err: any) {
    console.error("Error toggling publish status:", err);
    throw new Error(err.message || "Failed to toggle publish status");
  }
};

export const deleteBlogDb = async (id: string) => {
  try {
    await db();

    const { user } = await authCheckAction();

    if (!user) {
      throw new Error("You need to be logged in to update a blog");
    }

    // Fetch the blog
    const blog = await Blog.findById(id).populate("user");

    // Check if the user can delete the blog
    canEditBlog(blog, user);

    // Delete the blog
    await Blog.findByIdAndDelete(id);

    return { message: "Blog deleted successfully" };
  } catch (err: any) {
    console.error("Error deleting blog:", err);
    throw new Error(err.message || "Failed to delete blog");
  }
};

// get user liked blogs
export const getLikedBlogsDb = async (page: number, limit: number) => {
  try {
    db();

    const { user } = await authCheckAction();

    if (!user) {
      throw new Error("You need to be logged in to view liked blogs");
    }

    const [blogs, totalCount] = await Promise.all([
      Blog.find({ likes: { $in: [user._id] }, published: true }) // Find blogs where user._id is in the likes array
        .select("-content") // Exclude content field
        .sort({ createdAt: -1 }) // Sort by creation date
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("user", "name username"), // Populate the user field with name and username
      Blog.countDocuments({ likes: { $in: [user._id] }, published: true }), // Count total liked and published blogs
    ]);

    // console.log("total count => ", totalCount);

    return {
      blogs: JSON.parse(JSON.stringify(blogs)),
      totalCount,
    };
  } catch (err: any) {
    console.error("Error in getLikedBlogsDb:", err.message);
    throw new Error(err.message || "Failed to retrieve liked blogs");
  }
};

export const getUniqueBlogCategories = async () => {
  try {
    await db();

    const aggregationPipeline = [
      {
        $group: {
          _id: null,
          uniqueCategories: { $addToSet: { $toLower: "$category" } },
        },
      },
      {
        $project: {
          _id: 0,
          uniqueCategories: 1,
        },
      },
    ];

    const result = await Blog.aggregate(aggregationPipeline);

    if (result.length > 0) {
      return {
        uniqueCategories: result[0].uniqueCategories,
      };
    }

    return { uniqueCategories: [], uniqueAddresses: [] };
  } catch (err: any) {
    console.error("Error fetching unique categories from blogs:", err);
    throw new Error(err);
  }
};

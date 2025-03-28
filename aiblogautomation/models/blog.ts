import mongoose from "mongoose";

// category, title, subtitle, content
const BlogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    category: String,
    content: String,
    excerpt: String,
    imageUrl: String,
    published: { type: Boolean, default: true },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

BlogSchema.index({
  category: "text",
  title: "text",
  content: "text",
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;

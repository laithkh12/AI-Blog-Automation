
# AI Blog Automation Platform

This project is a full-stack AI-powered blog automation platform built with Next.js and TypeScript. It integrates Google Generative AI to generate blog categories, titles, content, and images, along with custom authentication using JWT and cookies. It allows users to automate blog creation and manage their blog posts with features like SEO optimization, user profiles, and admin dashboards.

## Features

- **Blog Automation**: Suggest categories, titles, content, and images using Google Generative AI.
- **Custom Authentication**: Login, register, and protect routes with JWT-based authentication.
- **User Dashboard**: View and manage user-specific blog posts, profile updates, and ticketing system.
- **Admin Dashboard**: Admins can manage all users and blog posts, including publish/unpublish, delete, and restrictions.
- **Pagination & SEO**: Pagination for blogs and SEO metadata for improved discoverability.

## Installation

Follow the steps below to get the project up and running locally.

### Prerequisites

Make sure you have the following installed:

- Node.js (v16 or higher)
- MongoDB (local or use MongoDB Atlas for cloud storage)
- Vercel (optional for deployment)

### Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/ai-blog-automation.git
   cd ai-blog-automation
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   Create a `.env.local` file at the root of your project and add the following environment variables:

   ```env
   DATABASE=<your_mongo_db_connection_string>
   JWT_SECRET=<your_jwt_secret>
   GEMINI_API_KEY=<your_google_ai_api_key>
   UNSPLASH_API_KEY=<your_unsplash_api_key>
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

## Usage

- **Create a new blog**: Navigate to the blog automation page to generate blog content and submit.
- **User Authentication**: Use the login modal to sign in or register.
- **Admin Dashboard**: If you're an admin, you can access the admin dashboard to manage users and blog posts.
- **SEO Features**: Each blog post is optimized for SEO with metadata and social media previews.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a pull request.

## License

This project is licensed under private use only.

## Acknowledgments

- [Next.js](https://nextjs.org/) for the framework.
- [ShadCN](https://ui.shadcn.com/) for UI components.
- [Google Generative AI](https://developers.google.com/ai) for AI-powered content generation.
- [Unsplash API](https://unsplash.com/documentation) for generating featured images.
- [JWT](https://jwt.io/) for secure authentication.

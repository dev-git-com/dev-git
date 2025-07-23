import Link from "next/link";

// Mock data for blog posts (replace this with data from an API or CMS)
const blogPosts = [
  {
    id: 1,
    title: "💡 What is Dev-Git?",
    description: `Dev-Git is a developer-first tool designed to speed up backend development by generating fully functional backend applications from a SQL file. Whether you're building a new app, MVP, or internal tool, Dev-Git helps you move faster — with clean code, scalable architecture, and optional features like:

🔧 Swagger Documentation

🔐 Auth with JWT or OAuth

📂 File Upload Support

🌐 REST or GraphQL APIs

🧪 Test Setup

⚙️ Role-Based Access Control

🗃️ Admin Panel (coming soon)

No more writing boilerplate code from scratch — Dev-Git handles it all.

`,
    author: "Ammar Omari (Founder)",
    date: "Jul 23, 2025",
    tags: ["Bakcend", "Nest.Js", "Web Development"],
    slug: "getting-started-with-dev-git",
  },
  // {
  //   id: 2,
  //   title: "Mastering TypeScript in 2023",
  //   description:
  //     "A comprehensive guide to mastering TypeScript, covering advanced types, generics, and best practices.",
  //   author: "Jane Smith",
  //   date: "September 25, 2023",
  //   tags: ["TypeScript", "JavaScript", "Programming"],
  //   slug: "mastering-typescript-in-2023",
  // },
  // {
  //   id: 3,
  //   title: "Building Scalable APIs with GraphQL",
  //   description:
  //     "Discover how to design and build scalable APIs using GraphQL, including schema design and performance optimization.",
  //   author: "Alice Johnson",
  //   date: "August 15, 2023",
  //   tags: ["GraphQL", "API", "Backend"],
  //   slug: "building-scalable-apis-with-graphql",
  // },
];

export default function Blog() {
  return (
    <div className="container px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 uppercase">Blogs</h1>
      <div className="space-y-8">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            {/* <Link href={`/blog/${post.slug}`}> */}
            <h2 className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
              {post.title}
            </h2>
            {/* </Link> */}
            <p className="mt-2 text-gray-600">{post.description}</p>
            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
              <span>By {post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

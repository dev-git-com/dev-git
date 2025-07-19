import Link from "next/link";

// Mock data for blog posts (replace this with data from an API or CMS)
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js 14",
    description:
      "Learn how to build modern web applications with Next.js 14, including new features like Server Actions and enhanced performance.",
    author: "John Doe",
    date: "October 10, 2023",
    tags: ["Next.js", "React", "Web Development"],
    slug: "getting-started-with-nextjs-14",
  },
  {
    id: 2,
    title: "Mastering TypeScript in 2023",
    description:
      "A comprehensive guide to mastering TypeScript, covering advanced types, generics, and best practices.",
    author: "Jane Smith",
    date: "September 25, 2023",
    tags: ["TypeScript", "JavaScript", "Programming"],
    slug: "mastering-typescript-in-2023",
  },
  {
    id: 3,
    title: "Building Scalable APIs with GraphQL",
    description:
      "Discover how to design and build scalable APIs using GraphQL, including schema design and performance optimization.",
    author: "Alice Johnson",
    date: "August 15, 2023",
    tags: ["GraphQL", "API", "Backend"],
    slug: "building-scalable-apis-with-graphql",
  },
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
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
            </Link>
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

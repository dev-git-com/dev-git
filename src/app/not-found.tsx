import { pagesConstants } from "@/shared/constants/Pages.constants";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-slate-300 mt-4 text-lg">
        The page you're looking for does not exist.
      </p>
      <a
        href={pagesConstants[0].route}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Go Back Home
      </a>
    </div>
  );
}

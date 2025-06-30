import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">Oops! We Couldnt find that page.</p>
      <Link href="/" className="text-blue-600 hover:underline text-lg">
        Go back home
      </Link>
    </div>
  );
}

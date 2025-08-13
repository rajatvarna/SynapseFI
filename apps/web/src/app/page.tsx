import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Trading App</h1>
      <div className="flex gap-4">
        <Link href="/login" className="px-4 py-2 bg-blue-500 text-white rounded">
          Login
        </Link>
        <Link href="/register" className="px-4 py-2 bg-gray-500 text-white rounded">
          Register
        </Link>
      </div>
    </div>
  );
}

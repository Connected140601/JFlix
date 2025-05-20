import Link from 'next/link';
import { FiHome } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="container-fluid flex flex-col items-center justify-center min-h-[70vh] py-12 text-center">
      <h1 className="text-6xl font-bold text-[var(--primary)] mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
      <p className="text-gray-400 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/" className="btn-primary flex items-center gap-2">
        <FiHome />
        <span>Back to Home</span>
      </Link>
    </div>
  );
}

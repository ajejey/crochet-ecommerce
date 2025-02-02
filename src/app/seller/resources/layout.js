// import { requireSeller } from '@/lib/auth';

export default async function ResourcesLayout({ children }) {
  // Get the authenticated seller data
  // const user = await requireSeller();

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}

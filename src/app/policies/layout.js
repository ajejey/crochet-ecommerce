import { SuspendedPostHogPageView } from "@/components/PostHogProvider";

export const metadata = {
  title: 'Policies | KnitKart',
  description: 'Official policies of KnitKart - India\'s first AI-powered platform for handcrafted crochet products.',
};

export default function PoliciesLayout({ children }) {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SuspendedPostHogPageView />
      <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8 border border-gray-100">
        {children}
      </div>
    </main>
  );
}

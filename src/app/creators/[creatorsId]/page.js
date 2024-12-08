import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import CreatorHeader from './components/CreatorHeader';
import CreatorTabs from './components/CreatorTabs';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { getCreatorStats, getCreatorProducts, getCreatorReviews } from './actions';

export async function generateMetadata({ params }) {
  const creator = await getCreatorStats(params.creatorsId);
  
  if (!creator) {
    return {
      title: 'Creator Not Found',
      description: 'The requested creator could not be found.'
    };
  }

  return {
    title: `${creator.businessName} | Crochet Store`,
    description: creator.description || `Welcome to ${creator.businessName}'s store`
  };
}

export default async function CreatorPage({ params }) {
  const [creator, initialProducts] = await Promise.all([
    getCreatorStats(params.creatorsId),
    getCreatorProducts(params.creatorsId, { page: 1 })
  ]);

  if (!creator) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CreatorHeader creator={creator} />

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <Suspense fallback={<LoadingSpinner />}>
          <CreatorTabs 
            initialProducts={initialProducts}
            creatorId={params.creatorsId}
            followersCount={creator.metadata?.followersCount || 0}
            isFollowing={false} // TODO: Get from user session
          />
        </Suspense>
      </div>
    </div>
  );
}
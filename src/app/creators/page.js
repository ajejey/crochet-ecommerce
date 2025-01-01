import React from 'react'
import { getActiveCreators } from './actions';
import CreatorsGrid from './components/CreatorsGrid';
import CreatorsHeader from './components/CreatorsHeader';
import CreatorsSearch from './components/CreatorsSearch';

export const metadata = {
  title: 'Discover Creators | Crochet Marketplace',
  description: 'Explore our talented creators and their unique crochet creations.',
};

export default async function CreatorsPage({
  searchParams
}) {
  const { creators, pagination } = await getActiveCreators(searchParams);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <CreatorsHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              <CreatorsSearch />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <CreatorsGrid creators={creators} pagination={pagination} />
          </main>
        </div>
      </div>
    </div>
  );
}
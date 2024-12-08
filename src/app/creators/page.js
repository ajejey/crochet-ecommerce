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
    <div className="space-y-8">
      <CreatorsHeader />
      
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 space-y-6">
          <CreatorsSearch />
        </aside>

        <main className="flex-1">
          <CreatorsGrid creators={creators} pagination={pagination} />
        </main>
      </div>
    </div>
  );
}
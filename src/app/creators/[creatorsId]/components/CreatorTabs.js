'use client';

import { useState } from 'react';
import { 
  ShoppingBag, 
  Megaphone, 
  GraduationCap, 
  Calendar, 
  Users,
  MessageCircle,
  MapPin,
  Heart
} from 'lucide-react';
import CreatorProducts from './CreatorProducts';

const tabs = [
  { id: 'products', label: 'Products', icon: ShoppingBag },
  { id: 'announcements', label: 'Updates', icon: Megaphone },
  { id: 'tutorials', label: 'Learn', icon: GraduationCap },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'community', label: 'Community', icon: Users }
];

export default function CreatorTabs({ 
  initialProducts,
  creatorId,
  followersCount = 0,
  isFollowing = false
}) {
  const [activeTab, setActiveTab] = useState('products');
  const [following, setFollowing] = useState(isFollowing);

  const handleFollow = async () => {
    // TODO: Implement follow functionality
    setFollowing(!following);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Follow Button and Stats */}
      {/* <div className="flex items-center justify-between">
        <button
          onClick={handleFollow}
          className={`inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-colors
            ${following 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
        >
          <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 ${following ? 'fill-gray-700' : ''}`} />
          {following ? 'Following' : 'Follow'}
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="text-gray-600 hover:text-gray-900">
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div> */}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex overflow-x-auto hide-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex flex-col items-center justify-center whitespace-nowrap py-3 px-3 sm:py-4 sm:px-6 border-b-2 text-[13px] sm:text-sm font-medium
                  ${activeTab === tab.id
                    ? 'border-rose-500 text-rose-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-5 w-5 sm:h-5 sm:w-5 mb-1 sm:mb-0 sm:mr-2" />
                <span className="sm:hidden">{tab.label}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Add scrollbar hiding styles */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Tab Content */}
      <div>
        {activeTab === 'products' && (
          <CreatorProducts
            initialProducts={initialProducts}
            creatorId={creatorId}
          />
        )}
        {activeTab === 'announcements' && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="text-center py-6 sm:py-8">
              <Megaphone className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No announcements</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Check back later for updates from this creator.
              </p>
            </div>
          </div>
        )}
        {activeTab === 'tutorials' && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="text-center py-6 sm:py-8">
              <GraduationCap className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tutorials yet</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                The creator hasn't posted any tutorials yet.
              </p>
            </div>
          </div>
        )}
        {activeTab === 'events' && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="text-center py-6 sm:py-8">
              <Calendar className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming events</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Stay tuned for future events from this creator.
              </p>
            </div>
          </div>
        )}
        {activeTab === 'community' && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="text-center py-6 sm:py-8">
              <Users className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Join the community</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Follow this creator to join their community and stay updated.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube,
  Pinterest,
  Globe,
  MessageCircle,
  MapPin,
  Package,
  Users
} from 'lucide-react';

const socialIcons = {
  website: Globe,
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
  pinterest: Pinterest
};

export default function CreatorHeader({ creator }) {
  const {
    businessName,
    displayLocation,
    description,
    profileImage,
    socialLinks = {},
    metadata = {}
  } = creator || {};

  const { productsCount = 0, reviewsCount = 0, followersCount = 0 } = metadata;

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        {/* Main Container - Column on mobile, Row on desktop */}
        <div className="flex flex-row md:items-start md:gap-8">
          {/* Profile Image */}
          <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden bg-rose-50 shrink-0">
            {profileImage?.url ? (
              <Image
                src={profileImage.url}
                alt={profileImage.alt || businessName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl md:text-4xl font-semibold text-rose-500">
                {businessName?.[0]}
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            {/* Info Container */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between flex-1 gap-4 ml-4 md:ml-0">
              {/* Creator Info */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-xl md:text-3xl font-bold text-gray-900 sm:tracking-tight">
                    {businessName}
                  </h1>
                  {displayLocation && (
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {displayLocation}
                    </div>
                  )}
                  {description && (
                    <p className="mt-2 text-sm text-gray-600 max-w-2xl">
                      {description}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Package className="h-4 w-4 mr-1" />
                    <span>{productsCount} Products</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{followersCount} Followers</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-3">
                  {Object.entries(socialLinks).map(([platform, url]) => {
                    if (!url) return null; // Don't show if no URL
                    const Icon = socialIcons[platform];
                    if (!Icon) return null;
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                        title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Actions - Full width on mobile, auto width on desktop */}
              <div className="flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-initial inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
                  Follow
                </button>
                <button className="flex-1 md:flex-initial inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

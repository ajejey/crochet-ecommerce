'use client';

import Image from 'next/image';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube,
  MessageCircle,
  MapPin,
  Package,
  Users,
  ExternalLink,
  Info
} from 'lucide-react';

const socialIcons = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube
};

export default function CreatorHeader({ 
  businessName = "Beautiful Designers",
  location = "Mumbai, India",
  profileImage,
  socialLinks = {},
  productsCount = 0,
  followersCount = 0,
  isFollowing = false
}) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="px-4 py-3 sm:px-6 sm:py-4">
        {/* Mobile Layout */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="relative h-12 w-12 rounded-full overflow-hidden">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt={businessName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-rose-100 flex items-center justify-center">
                    <span className="text-rose-600 text-lg font-semibold">
                      {businessName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="font-semibold text-lg leading-tight">{businessName}</h1>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {location}
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Info className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center justify-center p-2 bg-gray-50 rounded-lg">
              <Package className="h-4 w-4 text-gray-600 mr-1.5" />
              <span className="text-sm font-medium">{productsCount} Products</span>
            </div>
            <div className="flex items-center justify-center p-2 bg-gray-50 rounded-lg">
              <Users className="h-4 w-4 text-gray-600 mr-1.5" />
              <span className="text-sm font-medium">{followersCount} Followers</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex -space-x-1">
              {Object.entries(socialIcons).map(([platform, url]) => {
                const Icon = socialIcons[platform];
                if (!Icon) return null;
                
                return url ? (
                  <div title={`Visit ${platform}`} key={platform}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative inline-flex items-center justify-center h-8 w-8 bg-white border border-gray-200 rounded-full hover:bg-gray-50"
                    >
                      <Icon className="h-4 w-4" />
                      {/* <ExternalLink className="absolute -top-0.5 -right-0.5 h-3 w-3" /> */}
                    </a>
                  </div>
                ) : (
                  <div
                    key={platform}
                    className="inline-flex items-center justify-center h-8 w-8 bg-gray-100 border border-gray-200 rounded-full text-gray-400 cursor-not-allowed"
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                );
              })}
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <MessageCircle className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <MapPin className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative h-16 w-16">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={businessName}
                  fill
                  className="object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-rose-200 rounded-full">
                  <span className="text-2xl font-bold text-rose-600">
                    {businessName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{businessName}</h1>
              <div className="flex items-center mt-1 text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {location}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <Package className="h-5 w-5 mr-1.5" />
                <span>{productsCount} Products</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-1.5" />
                <span>{followersCount} Followers</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {Object.entries(socialIcons).map(([platform, url]) => {
                const Icon = socialIcons[platform];
                if (!Icon) return null;
                
                return url ? (
                  <div title={`Visit ${platform}`} key={platform}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative inline-flex items-center justify-center h-10 w-10 bg-white border border-gray-200 rounded-full hover:bg-gray-50"
                    >
                      <Icon className="h-5 w-5" />
                      {/* <ExternalLink className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5" /> */}
                    </a>
                  </div>
                ) : (
                  <div
                    key={platform}
                    className="inline-flex items-center justify-center h-10 w-10 bg-gray-100 border border-gray-200 rounded-full text-gray-400 cursor-not-allowed"
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

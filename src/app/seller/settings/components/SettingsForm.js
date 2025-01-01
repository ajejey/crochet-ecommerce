'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { updateSellerProfile, uploadProfileImage } from '../actions';

export default function SettingsForm({ initialData }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pending, startTransition] = useTransition();
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const [uploadingBannerImage, setUploadingBannerImage] = useState(false);
  const [profileImage, setProfileImage] = useState(initialData?.sellerProfile?.profileImage || null);
  const [bannerImage, setBannerImage] = useState(initialData?.sellerProfile?.bannerImage || null);

  async function handleImageUpload(e, type) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type); // profile or banner

    if (type === 'profile') {
      setUploadingProfileImage(true);
    } else {
      setUploadingBannerImage(true);
    }

    try {
      const result = await uploadProfileImage(formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (type === 'profile') {
        setProfileImage({
          id: result.fileId,
          url: result.fileUrl,
          alt: file.name
        });
      } else {
        setBannerImage({
          id: result.fileId,
          url: result.fileUrl,
          alt: file.name
        });
      }
      toast.success(`${type === 'profile' ? 'Profile' : 'Banner'} image uploaded successfully`);
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      if (type === 'profile') {
        setUploadingProfileImage(false);
      } else {
        setUploadingBannerImage(false);
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Add images to formData
    if (profileImage) {
      formData.append('profileImage', JSON.stringify(profileImage));
    }
    if (bannerImage) {
      formData.append('bannerImage', JSON.stringify(bannerImage));
    }

    // Add social links
    const socialLinks = {};
    ['website', 'instagram', 'facebook', 'twitter', 'youtube', 'pinterest'].forEach(platform => {
      const value = formData.get(`social_${platform}`);
      if (value) socialLinks[platform] = value;
    });
    formData.append('socialLinks', JSON.stringify(socialLinks));

    // Add shop policies
    const shopPolicies = {};
    ['shipping', 'returns', 'customization'].forEach(policy => {
      const value = formData.get(`policy_${policy}`);
      if (value) shopPolicies[policy] = value;
    });
    formData.append('shopPolicies', JSON.stringify(shopPolicies));

    // Add specialties
    const specialtiesStr = formData.get('specialties');
    if (specialtiesStr) {
      const specialties = specialtiesStr.split(',').map(s => s.trim()).filter(Boolean);
      formData.append('specialties', JSON.stringify(specialties));
    }
    
    startTransition(async () => {
      setError('');
      setSuccess('');

      try {
        const result = await updateSellerProfile(formData);
        if (result.error) {
          setError(result.error);
        } else {
          setSuccess('Profile updated successfully');
          router.refresh();
        }
      } catch (err) {
        setError('Failed to update profile');
      }
    });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Seller Settings</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images Section */}
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="border-b pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Profile Images</h2>
              <div className="flex items-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="font-medium">Format:</span>
                  <span>JPEG, PNG, WebP</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Max:</span>
                  <span>5MB</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Size:</span>
                  <span>400×400px (Profile), 1200×400px (Banner)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Profile Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image
              </label>
              <div className="relative">
                {profileImage?.url ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                    <Image
                      src={profileImage.url}
                      alt={profileImage.alt || 'Profile image'}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setProfileImage(null)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex justify-center items-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Check file size
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error('File size must be less than 5MB');
                            return;
                          }
                          handleImageUpload(e, 'profile');
                        }
                      }}
                      className="sr-only"
                    />
                    {uploadingProfileImage ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                        <span className="mt-2 block text-xs">Uploading...</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <span className="mt-2 block text-xs text-gray-600">Upload</span>
                      </div>
                    )}
                  </label>
                )}
              </div>
            </div>

            {/* Banner Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image
              </label>
              <div className="relative">
                {bannerImage?.url ? (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <Image
                      src={bannerImage.url}
                      alt={bannerImage.alt || 'Banner image'}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setBannerImage(null)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex justify-center items-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Check file size
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error('File size must be less than 5MB');
                            return;
                          }
                          handleImageUpload(e, 'banner');
                        }
                      }}
                      className="sr-only"
                    />
                    {uploadingBannerImage ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                        <span className="mt-2 block text-xs">Uploading...</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <span className="mt-2 block text-xs text-gray-600">Upload Banner</span>
                      </div>
                    )}
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-medium">Business Information</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                id="businessName"
                required
                defaultValue={initialData?.sellerProfile?.businessName}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="displayLocation" className="block text-sm font-medium text-gray-700">
                Display Location
              </label>
              <input
                type="text"
                name="displayLocation"
                id="displayLocation"
                defaultValue={initialData?.sellerProfile?.displayLocation}
                placeholder="e.g., Mumbai, India"
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                id="contactEmail"
                defaultValue={initialData?.sellerProfile?.contactEmail || initialData?.email}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                defaultValue={initialData?.sellerProfile?.phoneNumber || initialData?.phone}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Business Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                defaultValue={initialData?.sellerProfile?.description}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-medium">Social Media Links</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {['website', 'instagram', 'facebook', 'twitter', 'youtube', 'pinterest'].map((platform) => (
              <div key={platform}>
                <label htmlFor={`social_${platform}`} className="block text-sm font-medium text-gray-700 capitalize">
                  {platform}
                </label>
                <input
                  type="url"
                  name={`social_${platform}`}
                  id={`social_${platform}`}
                  defaultValue={initialData?.sellerProfile?.socialLinks?.[platform]}
                  placeholder={`Your ${platform} URL`}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Shop Policies */}
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-medium">Shop Policies</h2>
          
          <div className="space-y-6">
            {['shipping', 'returns', 'customization'].map((policy) => (
              <div key={policy}>
                <label htmlFor={`policy_${policy}`} className="block text-sm font-medium text-gray-700 capitalize">
                  {policy} Policy
                </label>
                <textarea
                  name={`policy_${policy}`}
                  id={`policy_${policy}`}
                  rows={4}
                  defaultValue={initialData?.sellerProfile?.shopPolicies?.[policy]}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Specialties */}
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-medium">Specialties</h2>
          
          <div>
            <label htmlFor="specialties" className="block text-sm font-medium text-gray-700">
              Your Specialties
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="specialties"
                id="specialties"
                defaultValue={initialData?.sellerProfile?.specialties?.join(', ')}
                placeholder="e.g., Amigurumi, Baby Blankets, Scarves"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="mt-1.5 text-sm text-gray-500">
                Add multiple specialties separated by commas
              </p>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-medium">Business Address</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                name="street"
                id="street"
                defaultValue={initialData?.sellerProfile?.address?.street}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                defaultValue={initialData?.sellerProfile?.address?.city}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                name="state"
                id="state"
                defaultValue={initialData?.sellerProfile?.address?.state}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                id="postalCode"
                defaultValue={initialData?.sellerProfile?.address?.postalCode}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                name="country"
                id="country"
                defaultValue={initialData?.sellerProfile?.address?.country}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending || uploadingProfileImage || uploadingBannerImage}
            className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              (pending || uploadingProfileImage || uploadingBannerImage) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {pending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

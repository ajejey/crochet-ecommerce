'use client';

import { useState, useRef, useEffect } from 'react';
import { Share2, X } from 'lucide-react';
import { toast } from 'sonner';
import { 
  FacebookShareButton, FacebookIcon,
  WhatsappShareButton, WhatsappIcon,
  TwitterShareButton, TwitterIcon,
  PinterestShareButton, PinterestIcon,
  EmailShareButton, EmailIcon
} from 'react-share';

export default function ShareButton({ product, url }) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);
  
  // Close the popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate the full URL if only path is provided
  const fullUrl = url.startsWith('http') ? url : `https://www.knitkart.in${url}`;
  
  // Prepare share data
  const title = `Check out this ${product.name} on KnitKart`;
  const description = product.description?.short || product.description?.full || `Handcrafted ${product.name} available on KnitKart.in`;
  const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : '';
  const price = product.formattedPrice || `₹${product.price}`;
  
  // Pinterest requires an image
  const pinterestDescription = `${description} | Price: ${price}`;

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-md border transition-all ${
          isOpen
            ? 'border-rose-600 text-rose-600 bg-rose-50'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="Share product"
      >
        <Share2 className="h-5 w-5" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 right-0 mt-2 w-72 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-900">Share this product</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            <WhatsappShareButton url={fullUrl} title={title} className="flex flex-col items-center">
              <WhatsappIcon size={40} round />
              <span className="text-xs mt-1">WhatsApp</span>
            </WhatsappShareButton>
            
            <FacebookShareButton url={fullUrl} quote={title} className="flex flex-col items-center">
              <FacebookIcon size={40} round />
              <span className="text-xs mt-1">Facebook</span>
            </FacebookShareButton>
            
            <TwitterShareButton url={fullUrl} title={title} className="flex flex-col items-center">
              <TwitterIcon size={40} round />
              <span className="text-xs mt-1">Twitter</span>
            </TwitterShareButton>
            
            <PinterestShareButton 
              url={fullUrl} 
              media={imageUrl}
              description={pinterestDescription}
              className="flex flex-col items-center"
            >
              <PinterestIcon size={40} round />
              <span className="text-xs mt-1">Pinterest</span>
            </PinterestShareButton>
            
            <EmailShareButton 
              url={fullUrl} 
              subject={title}
              body={`${description}\n\nPrice: ${price}\n\nCheck it out: ${fullUrl}`}
              className="flex flex-col items-center"
            >
              <EmailIcon size={40} round />
              <span className="text-xs mt-1">Email</span>
            </EmailShareButton>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center">
              <input
                type="text"
                value={fullUrl}
                readOnly
                className="flex-1 p-2 text-xs border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(fullUrl);
                  toast.success('Link copied to clipboard!');
                }}
                className="bg-rose-600 text-white px-3 py-2 text-xs font-medium rounded-r-md hover:bg-rose-700"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

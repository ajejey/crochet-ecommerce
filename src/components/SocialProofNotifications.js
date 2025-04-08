'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { formatDistanceToNow } from '@/utils/format';
import { formatEventMessage } from '@/lib/social-proof';
import useSWR from 'swr';

export default function SocialProofNotifications() {
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true); // Allow users to disable notifications

  // Check if notifications are disabled
  useEffect(() => {
    const notificationsDisabled = localStorage.getItem('knitkart_disable_social_proof') === 'true';
    if (notificationsDisabled) {
      setIsEnabled(false);
    }
  }, []);
  
  // Fetch events using SWR with automatic revalidation
  const fetcher = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  };
  
  const { data } = useSWR(
    isEnabled ? '/api/social-proof/latest' : null, 
    fetcher, 
    { 
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: false,
      onSuccess: (data) => {
        if (data.success && data.events && data.events.length > 0) {
          console.log(`Social proof: Fetched ${data.events.length} events`);
          
          setEvents(prevEvents => {
            // Merge new events, avoid duplicates, and limit size
            const combinedEvents = [...data.events, ...prevEvents];
            const uniqueEvents = Array.from(new Map(combinedEvents.map(event => 
              [event._id, event])).values());
            return uniqueEvents.slice(0, 30); // Keep last 30 events
          });
        }
      }
    }
  );

  // Display events with random timing
  useEffect(() => {
    if (!isEnabled || events.length === 0 || isVisible) return;

    // For immediate testing, use a very short delay (1-3 seconds)
    // In production, you can increase this to 30-60 seconds
    const randomDelay = Math.floor(Math.random() * (3000 - 1000) + 1000);
    
    console.log(`Social proof: ${events.length} events available, showing in ${randomDelay/1000} seconds`);
    
    const timer = setTimeout(() => {
      // Pick a random event
      const randomIndex = Math.floor(Math.random() * events.length);
      const selectedEvent = events[randomIndex];
      console.log('Social proof: Showing notification', selectedEvent);
      
      setCurrentEvent(selectedEvent);
      setIsVisible(true);
      
      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
        // Remove displayed event to avoid repetition
        setEvents(prevEvents => prevEvents.filter((_, i) => i !== randomIndex));
      }, 5000);
    }, randomDelay);
    
    return () => clearTimeout(timer);
  }, [events, isVisible, isEnabled]);

  // Handle close button click
  const handleClose = () => {
    setIsVisible(false);
  };

  // Handle disable notifications
  const handleDisable = () => {
    localStorage.setItem('knitkart_disable_social_proof', 'true');
    setIsEnabled(false);
    setIsVisible(false);
  };

  if (!isEnabled || !currentEvent || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 z-50 max-w-xs bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-3 border border-rose-100"
      >
        <button 
          onClick={handleClose}
          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm text-gray-500 hover:text-gray-700"
          aria-label="Close notification"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex items-center gap-3">
          {currentEvent.productImage && (
            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
              <Image 
                src={typeof currentEvent.productImage === 'string' ? currentEvent.productImage : 
                      currentEvent.productImage.url ? currentEvent.productImage.url : 
                      '/images/placeholder-product.jpg'} 
                alt={currentEvent.productName || 'Product'} 
                width={48} 
                height={48} 
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div>
            <p className="text-sm text-gray-700">{formatEventMessage(currentEvent)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDistanceToNow(new Date(currentEvent.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleDisable}
          className="text-xs text-gray-400 hover:text-gray-600 mt-2 w-full text-right"
        >
          Don't show these
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

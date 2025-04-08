'use server';

import { cache } from 'react';

// In-memory queue (will be lost on server restart, but that's acceptable for social proof)
let eventQueue = [];
let isProcessing = false;

// Add event to queue
export async function queueEvent(eventData) {
  eventQueue.push({
    ...eventData,
    timestamp: new Date()
  });
  
  // Start processing if not already running
  if (!isProcessing) {
    processEventQueue();
  }
}

// Process events in background
async function processEventQueue() {
  if (eventQueue.length === 0) {
    isProcessing = false;
    return;
  }
  
  isProcessing = true;
  
  // Take a batch of events to process
  const batch = eventQueue.splice(0, Math.min(10, eventQueue.length));
  
  try {
    // Import dynamically to avoid circular dependencies
    const { default: SocialProofEvent } = await import('@/models/SocialProofEvent');
    const savedEvents = await SocialProofEvent.insertMany(batch);
    
    // We'll use a different approach to broadcast events
    // The events will be fetched by clients via SSE
  } catch (error) {
    console.error('Error processing social proof event batch:', error);
    // Optional: Put failed events back in queue or log to a separate error collection
  }
  
  // Continue processing remaining events
  setTimeout(processEventQueue, 100);
}

// Cached function to get recent events
export const getRecentEvents = cache(async (limit = 20) => {
  try {
    const { default: SocialProofEvent } = await import('@/models/SocialProofEvent');
    const events = await SocialProofEvent.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    return events;
  } catch (error) {
    console.error('Error fetching social proof events:', error);
    return [];
  }
});

// Function to get events by type
export const getEventsByType = cache(async (type, limit = 10) => {
  try {
    const { default: SocialProofEvent } = await import('@/models/SocialProofEvent');
    const events = await SocialProofEvent.find({ type })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    return events;
  } catch (error) {
    console.error(`Error fetching ${type} events:`, error);
    return [];
  }
});

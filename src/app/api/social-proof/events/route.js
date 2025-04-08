/**
 * NOTE: This SSE implementation is no longer used.
 * We've switched to a polling approach with SWR for better compatibility with Vercel.
 * See /api/social-proof/latest/route.js for the current implementation.
 */

import { getRecentEvents } from '@/lib/event-queue';

// Store connected clients
const clients = new Set();

// Function to broadcast events to all connected clients
export function broadcastEvent(event) {
  const deadClients = new Set();
  
  clients.forEach(client => {
    try {
      client.controller.enqueue(client.encoder.encode(`data: ${JSON.stringify({ event })}\n\n`));
    } catch (error) {
      // If controller is closed, mark client for removal
      if (error.code === 'ERR_INVALID_STATE') {
        deadClients.add(client);
      } else {
        console.error('Error broadcasting event:', error);
      }
    }
  });
  
  // Clean up dead clients
  deadClients.forEach(client => {
    clients.delete(client);
  });
}

// export async function GET() {
//   const encoder = new TextEncoder();
  
//   const stream = new ReadableStream({
//     async start(controller) {
//       // Create client object
//       const client = { controller, encoder };
      
//       // Add client to set
//       clients.add(client);
      
//       try {
//         // Send initial batch of events
//         const events = await getRecentEvents(15);
//         console.log(`SSE: Sending ${events.length} initial events to new client`);
        
//         // Send a test event immediately for debugging
//         const testEvent = {
//           type: 'test',
//           productName: 'Test Product',
//           sellerName: 'Test Seller',
//           timestamp: new Date(),
//           location: 'Test Location'
//         };
        
//         // First send the test event
//         controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: testEvent })}\n\n`));
        
//         // Then send the batch of events
//         controller.enqueue(encoder.encode(`data: ${JSON.stringify({ events })}\n\n`));
        
//         // Keep connection alive with heartbeat
//         const heartbeat = setInterval(() => {
//           try {
//             controller.enqueue(encoder.encode(`: heartbeat\n\n`));
//           } catch (error) {
//             // If controller is closed, clear interval
//             if (error.code === 'ERR_INVALID_STATE') {
//               clearInterval(heartbeat);
//               clients.delete(client);
//             }
//           }
//         }, 15000); // 15-second heartbeat
        
//         // Clean up on close
//         return () => {
//           clearInterval(heartbeat);
//           clients.delete(client);
//         };
//       } catch (error) {
//         console.error('Error in SSE stream:', error);
//         clients.delete(client);
//       }
//     }
//   });

//   return new Response(stream, {
//     headers: {
//       'Content-Type': 'text/event-stream',
//       'Cache-Control': 'no-cache',
//       'Connection': 'keep-alive'
//     }
//   });
// }

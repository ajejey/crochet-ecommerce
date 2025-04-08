'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function SocialProofAdmin() {
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  // Generate sample events
  const handleGenerateEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/social-proof/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Generated ${data.count} social proof events`);
        fetchStats();
      } else {
        toast.error(data.error || 'Failed to generate events');
      }
    } catch (error) {
      console.error('Error generating events:', error);
      toast.error('An error occurred while generating events');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats about current events
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/social-proof/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Clear all events
  const handleClearEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/social-proof/clear', {
        method: 'POST',
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Cleared all social proof events');
        setStats(null);
      } else {
        toast.error(data.error || 'Failed to clear events');
      }
    } catch (error) {
      console.error('Error clearing events:', error);
      toast.error('An error occurred while clearing events');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Social Proof Notifications</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Generate Sample Events</h2>
          <p className="text-gray-600 mb-4">
            Generate sample social proof events for testing. These events will appear as notifications to users browsing the site.
          </p>
          
          <div className="flex items-end gap-4 mb-6">
            <div>
              <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Events
              </label>
              <input
                type="number"
                id="count"
                min="1"
                max="50"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 10)}
                className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
              />
            </div>
            
            <button
              onClick={handleGenerateEvents}
              disabled={loading}
              className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Events'}
            </button>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={handleClearEvents}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Clear All Events
            </button>
          </div>
        </div>
        
        {stats && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Event Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium text-gray-900 capitalize">{type.replace('_', ' ')}</h3>
                  <p className="text-2xl font-bold text-rose-600">{count}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <p className="text-gray-700">
                <span className="font-medium">Total Events:</span> {stats.total}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Oldest Event:</span> {new Date(stats.oldest).toLocaleString()}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Newest Event:</span> {new Date(stats.newest).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
  );
}

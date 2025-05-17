import React from 'react';
import { getAISettings, updateAISettings } from './actions';
import Card from '@/app/components/Card';
import { Settings } from 'lucide-react';

export default async function AISettingsPage() {
  const { success, aiSettings, error } = await getAISettings();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl lg:text-7xl font-serif text-gray-900">AI Settings</h1>
        <p className="text-lg sm:text-xl text-gray-600 mt-4">Configure AI model settings for your platform.</p>
      </div>

      <Card className="p-6 border border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">Gemini Model Settings</h2>
            <p className="text-lg text-gray-600 mt-2">Configure which Gemini model to use for AI features</p>
          </div>
          <div className="p-3 bg-rose-100 rounded-lg">
            <Settings className="w-6 h-6 text-rose-600" />
          </div>
        </div>

        <form action={updateAISettings} className="space-y-6">
          <div>
            <label htmlFor="geminiModel" className="block text-lg font-medium text-gray-700 mb-2">
              Gemini Model Name
            </label>
            <input
              type="text"
              id="geminiModel"
              name="geminiModel"
              defaultValue={aiSettings?.geminiModel || 'gemini-2.0-flash'}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-rose-500 focus:border-rose-500"
              placeholder="Enter model name (e.g., gemini-2.0-flash)"
            />
            <p className="mt-2 text-sm text-gray-500">
              Enter the exact model name as provided by Google Gemini API. Default: gemini-2.0-flash
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

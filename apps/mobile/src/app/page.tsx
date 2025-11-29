'use client';

import { useState } from 'react';
import { sendLike } from './actions';

export default function Index() {
  const [likeCount, setLikeCount] = useState(0);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    setLoading(true);
    try {
      const data = await sendLike();
      setLastResponse(data);
      if (data.success) {
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      setLastResponse({ error: 'Failed to connect to like service' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Mobile App - Like Service Demo
            </h1>
            <p className="text-gray-600">
              Click the button to send a like via gRPC to the like-service
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <button
              onClick={handleLike}
              disabled={loading}
              className={`
                group relative px-8 py-4 rounded-xl font-semibold text-lg
                transition-all duration-200 transform
                ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 hover:scale-105 active:scale-95'
                }
                text-white shadow-lg
              `}
            >
              <span className="flex items-center space-x-2">
                <svg
                  className={`w-6 h-6 ${
                    loading ? '' : 'group-hover:animate-bounce'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  {loading ? 'Sending Like...' : 'Send Like via gRPC'}
                </span>
              </span>
            </button>

            <div className="text-center">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500">
                {likeCount}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Likes Sent</div>
            </div>

            {lastResponse && (
              <div className="w-full mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Last Response
                </h3>
                <pre className="text-sm text-gray-800 bg-white p-4 rounded-lg overflow-x-auto border border-gray-200">
                  {JSON.stringify(lastResponse, null, 2)}
                </pre>
              </div>
            )}

            <div className="w-full mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">
                How it works:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • Click button → Next.js Server Action generates random post &
                  user IDs
                </li>
                <li>• Server Action calls like-service directly via gRPC (port 50052)</li>
                <li>• Like-service stores the like in memory</li>
                <li>• Response is displayed with generated IDs</li>
              </ul>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

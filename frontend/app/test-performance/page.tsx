"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TestPerformancePage() {
  const [bestSellersResult, setBestSellersResult] = useState<any>(null);
  const [featuredResult, setFeaturedResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testBestSellers = async () => {
    setIsLoading(true);
    try {
      const start = Date.now();
      const response = await fetch('/api/products/best-sellers?limit=8');
      const data = await response.json();
      const end = Date.now();
      
      setBestSellersResult({
        data,
        clientTime: end - start,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setBestSellersResult({ error: errorMessage, timestamp: new Date().toISOString() });
    } finally {
      setIsLoading(false);
    }
  };

  const testFeatured = async () => {
    setIsLoading(true);
    try {
      const start = Date.now();
      const response = await fetch('/api/products/featured?limit=4&page=1');
      const data = await response.json();
      const end = Date.now();
      
      setFeaturedResult({
        data,
        clientTime: end - start,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setFeaturedResult({ error: errorMessage, timestamp: new Date().toISOString() });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Performance Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Best Sellers Test */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Best Sellers Performance Test</h2>
          <Button 
            onClick={testBestSellers} 
            disabled={isLoading}
            className="mb-4"
          >
            {isLoading ? 'Testing...' : 'Test Best Sellers'}
          </Button>
          
          {bestSellersResult && (
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">Results:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(bestSellersResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Featured Products Test */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Featured Products Performance Test</h2>
          <Button 
            onClick={testFeatured} 
            disabled={isLoading}
            className="mb-4"
          >
            {isLoading ? 'Testing...' : 'Test Featured Products'}
          </Button>
          
          {featuredResult && (
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">Results:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(featuredResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Click "Test Best Sellers" to test the best sellers API performance</li>
          <li>Click "Test Featured Products" to test the featured products API performance</li>
          <li>Compare the client-side timing and server-side performance data</li>
          <li>Check the browser console for detailed server-side performance logs</li>
        </ol>
      </div>
    </div>
  );
}

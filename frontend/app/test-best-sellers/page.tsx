import { getBestSellerProducts, clearBestSellersCache } from "@/actions/products";

export default async function TestBestSellersPage() {
  // Clear cache first
  clearBestSellersCache();
  
  // Test the function
  const result = await getBestSellerProducts(8);
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Best Sellers Test Page</h1>
      
      <div className="mb-4">
        <button 
          onClick={() => clearBestSellersCache()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Clear Cache
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Function Result:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
      
      {result.success && result.data && result.data.length > 0 ? (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Products Found:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.data.map((product: any) => (
              <div key={product.id} className="border p-4 rounded">
                <h3 className="font-semibold">{product.title}</h3>
                <p className="text-sm text-gray-600">ID: {product.id}</p>
                <p className="text-sm text-gray-600">Best Seller: {product.bestSeller ? 'Yes' : 'No'}</p>
                <p className="text-sm text-gray-600">Featured: {product.featured ? 'Yes' : 'No'}</p>
                <p className="text-sm text-gray-600">Images: {product.images?.length || 0}</p>
                <p className="text-sm text-gray-600">Sizes: {product.sizes?.length || 0}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 text-red-600">
          <p>No products found or error occurred</p>
          {result.error && <p>Error: {result.error}</p>}
        </div>
      )}
    </div>
  );
}

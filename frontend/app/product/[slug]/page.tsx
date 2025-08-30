import { getProductBySlug, getRelatedProducts } from "@/actions/product";
import dynamic from "next/dynamic";
import Image from "next/image";
const ImageCarousel = dynamic(() => import("@/components/product/ImageCarousel"));
const ProductDetailsAccordian = dynamic(
  () => import("@/components/product/ProductDetailsAccordian")
);
const ProductActions = dynamic(() => import("@/components/product/ProductActions"));
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { slug } = await params;
    
    const result = await getProductBySlug(slug);
    
    
    if (!result.success || !result.data) {
      
      notFound();
    }

    const product = result.data;
    const related = await getRelatedProducts(product.categoryId, product.id, 4);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <ImageCarousel images={product.images || []} title={product.title} />
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {product.description}
                </p>
                {product.brand && (
                  <p className="text-sm text-gray-500">
                    Brand: <span className="font-medium">{product.brand}</span>
                  </p>
                )}
              </div>

              {/* Product Actions */}
              <ProductActions 
                sizes={product.sizes || []}
                discount={product.discount}
                productId={product.id}
                productName={product.title}
                productImage={product.images?.[0]?.url || ""}
              />

              {/* Product Details Accordion */}
              <ProductDetailsAccordian 
                description={product.description}
                longDescription={product.longDescription}
                benefits={product.benefits || []}
                ingredients={product.ingredients || []}
              />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.success && related.data && related.data.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 pb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {related.data.map((rp) => (
                <a
                  key={rp.id}
                  href={`/product/${rp.slug}`}
                  className="group bg-white rounded-lg p-2 sm:p-3"
                >
                  <div className="relative aspect-square mb-2 sm:mb-3 overflow-hidden rounded-md">
                    {rp.images?.[0]?.url && (
                      <img
                        src={rp.images[0].url}
                        alt={rp.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="font-semibold text-sm sm:text-base line-clamp-2">{rp.title}</p>
                  <p className="text-base sm:text-lg font-semibold mt-1">
                    ₹{(rp.sizes?.[0]?.price ?? 0).toFixed(2)}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in ProductPage:", error);
    notFound();
  }
}

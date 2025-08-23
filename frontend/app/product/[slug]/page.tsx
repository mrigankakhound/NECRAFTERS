import { getProductBySlug } from "@/actions/product";
import ImageCarousel from "@/components/product/ImageCarousel";
import ProductDetailsAccordian from "@/components/product/ProductDetailsAccordian";
import ProductActions from "@/components/product/ProductActions";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    console.log("Fetching product with slug:", params.slug);
    
    const result = await getProductBySlug(params.slug);
    console.log("Product fetch result:", result);
    
    if (!result.success || !result.data) {
      console.error("Product not found or error:", result.error);
      notFound();
    }

    const product = result.data;

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
      </div>
    );
  } catch (error) {
    console.error("Error in ProductPage:", error);
    notFound();
  }
}

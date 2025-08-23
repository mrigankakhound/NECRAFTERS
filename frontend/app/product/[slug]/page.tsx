import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/actions/products';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    return {
      title: 'Product Not Found | NE CRAFTERS',
      description: 'The requested product could not be found.',
    };
  }

  const title = `${product.title} - Premium ${product.category.name} | NE CRAFTERS`;
  const description = `${product.description} - Authentic Northeast Indian ${product.category.name.toLowerCase()}. ${product.brand ? `Brand: ${product.brand}.` : ''} Shop now for premium quality and authentic flavors.`;
  
  return {
    title,
    description,
    keywords: [
      product.title.toLowerCase(),
      product.category.name.toLowerCase(),
      'northeast indian spices',
      'premium spices',
      'authentic flavors',
      'chili oil',
      'spice blends',
      'online spices',
      'indian spices',
      'traditional spices'
    ].join(', '),
    openGraph: {
      title,
      description,
      images: product.images.map(img => ({
        url: img.url || '',
        width: 800,
        height: 600,
        alt: product.title,
      })),
      type: 'product',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.images.map(img => img.url || ''),
    },
    alternates: {
      canonical: `/product/${params.slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO-optimized breadcrumb */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-red-600">Home</a>
            <span>/</span>
            <a href="/categories" className="hover:text-red-600">Categories</a>
            <span>/</span>
            <a href={`/categories/${product.category.slug}`} className="hover:text-red-600">
              {product.category.name}
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </div>
        </div>
      </nav>

      {/* Product content will go here */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {product.title}
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          {product.description}
        </p>
        
        {/* Add your existing product display components here */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600">
            Product details and images will be displayed here...
          </p>
        </div>
      </div>
    </div>
  );
}

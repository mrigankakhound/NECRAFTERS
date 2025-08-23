import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const title = `${categoryName} - Premium Northeast Indian Spices | NE CRAFTERS`;
  const description = `Discover authentic ${categoryName.toLowerCase()} from Northeast India. Premium quality spices, traditional flavors, and regional delicacies. Shop now for authentic Northeast Indian ${categoryName.toLowerCase()}.`;
  
  return {
    title,
    description,
    keywords: [
      categoryName.toLowerCase(),
      'northeast indian spices',
      'premium spices',
      'authentic flavors',
      'chili oil',
      'spice blends',
      'online spices',
      'indian spices',
      'traditional spices',
      'northeast india'
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `/categories/${params.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
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
            <span className="text-gray-900 font-medium">{categoryName}</span>
          </div>
        </div>
      </nav>

      {/* Category header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Premium <span className="text-red-600">{categoryName}</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Discover authentic {categoryName.toLowerCase()} from Northeast India. Premium quality, traditional flavors, 
            and regional delicacies that bring the authentic taste of Northeast India to your kitchen.
          </p>
        </div>
      </div>

      {/* Category content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder for products */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌶️</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Premium {categoryName}</h3>
            <p className="text-gray-600">Authentic Northeast Indian {categoryName.toLowerCase()} with perfect flavor balance</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Traditional Quality</h3>
            <p className="text-gray-600">Handcrafted using traditional methods passed down through generations</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏔️</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Northeast Origin</h3>
            <p className="text-gray-600">Directly sourced from the pristine regions of Northeast India</p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {categoryName}
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Discover our collection of {categoryName.toLowerCase()}.
        </p>
        
        {/* Products will be displayed here */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-center">
            Products for this category will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
}

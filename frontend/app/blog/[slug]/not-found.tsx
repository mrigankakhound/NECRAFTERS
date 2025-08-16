import Link from 'next/link';

export default function BlogPostNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-display text-foreground mb-4">
            Blog Post Not Found
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Sorry, the blog post you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/blog"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Blog
          </Link>
          
          <div className="block">
            <Link 
              href="/"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

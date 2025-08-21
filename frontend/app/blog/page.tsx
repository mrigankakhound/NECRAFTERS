import Image from 'next/image';
import Link from 'next/link';

export default function BlogPage() {
  const blogPosts = [
    {
      title: "The Art of Making Chili Oil",
      slug: "the-art-of-making-chili-oil",
      excerpt: "Discover the traditional methods and secrets behind crafting the perfect chili oil. From selecting the finest ingredients to mastering the temperature control, learn how our artisans create the perfect balance of heat and flavor.",
      date: "March 15, 2024",
      category: "Techniques",
      image: "https://img.freepik.com/premium-photo/glass-jar-filled-with-vibrant-red-chili-oil-light-pervading-translucency-spicy-liquid_997580-1829.jpg",
      readTime: "5 min read"
    },
    {
      title: "Understanding Heat Levels",
      slug: "understanding-heat-levels",
      excerpt: "A comprehensive guide to different types of chilies and their heat levels. Learn about the Scoville scale, flavor profiles, and how to choose the right chili oil for your palate.",
      date: "March 12, 2024",
      category: "Education",
      image: "https://plus.unsplash.com/premium_photo-1668440163167-e477c6c24c64?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      readTime: "4 min read"
    },
    {
      title: "Health Benefits of Chili Oil",
      slug: "health-benefits-of-chili-oil",
      excerpt: "Exploring the numerous health benefits of incorporating chili oil in your diet. From boosting metabolism to providing essential nutrients, discover why chili oil is more than just a condiment.",
      date: "March 10, 2024",
      category: "Health",
      image: "https://images.herzindagi.info/image/2023/Jul/how-to-make-chilli-oil.jpg",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-lg font-bold sm:text-3xl text-center w-full relative py-4 sm:py-6 uppercase mb-16 font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">Latest Articles</h1>
      
      <div className="max-w-6xl mx-auto space-y-16">
        {blogPosts.map((post, index) => (
          <article 
            key={index} 
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
              index % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] w-full">
                <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl"
                  style={{
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.08)'
                  }}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {/* Decorative background blur */}
                <div className={`absolute -z-10 -bottom-8 ${
                  index % 2 === 0 ? '-right-8' : '-left-8'
                } w-full h-full rounded-[2rem] ${
                  index % 2 === 0 ? 'bg-primary/5' : 'bg-accent/5'
                } blur-2xl`}></div>
              </div>
            </div>

            {/* Content */}
            <div className={`space-y-6 ${
              index % 2 === 1 ? 'lg:pr-12' : 'lg:pl-12'
            }`}>
              <div className="flex items-center gap-4 text-sm text-foreground/60">
                <span className="px-3 py-1 rounded-full bg-primary/5 text-primary">
                  {post.category}
                </span>
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>

              <h2 className="text-3xl font-display text-primary">
                {post.title}
              </h2>

              <p className="text-lg text-foreground/80 leading-relaxed">
                {post.excerpt}
              </p>

              <Link 
                href={`/blog/${post.slug}`}
                className="group flex items-center text-primary font-display hover:text-primary/80 transition-colors"
              >
                Read More 
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Newsletter Section */}
      <section className="mt-24 max-w-3xl mx-auto text-center">
        <div className="spicy-card p-12 rounded-[2rem]">
          <h3 className="text-2xl font-display text-primary mb-4">
            Stay Updated with Our Latest Recipes
          </h3>
          <p className="text-foreground/70 mb-8">
            Subscribe to our newsletter for exclusive recipes, tips, and updates.
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button className="spicy-button px-6 py-2 rounded-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
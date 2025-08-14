import Image from 'next/image';

export default function BlogPage() {
  const blogPosts = [
    {
      title: "The Art of Making Chili Oil",
      excerpt: "Discover the traditional methods and secrets behind crafting the perfect chili oil. From selecting the finest ingredients to mastering the temperature control, learn how our artisans create the perfect balance of heat and flavor.",
      date: "March 15, 2024",
      category: "Techniques",
      image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a",
      readTime: "5 min read"
    },
    {
      title: "Understanding Heat Levels",
      excerpt: "A comprehensive guide to different types of chilies and their heat levels. Learn about the Scoville scale, flavor profiles, and how to choose the right chili oil for your palate.",
      date: "March 12, 2024",
      category: "Education",
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5",
      readTime: "4 min read"
    },
    {
      title: "Health Benefits of Chili Oil",
      excerpt: "Exploring the numerous health benefits of incorporating chili oil in your diet. From boosting metabolism to providing essential nutrients, discover why chili oil is more than just a condiment.",
      date: "March 10, 2024",
      category: "Health",
      image: "https://images.unsplash.com/photo-1628527304948-06157ee3c8a6",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="section-heading mb-16">Latest Articles</h1>
      
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

              <button className="group flex items-center text-primary font-display">
                Read More 
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </button>
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
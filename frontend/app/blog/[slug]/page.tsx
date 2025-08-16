import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Blog post data - in a real app, this would come from a database
const blogPosts = [
  {
    slug: "the-art-of-making-chili-oil",
    title: "The Art of Making Chili Oil",
    excerpt: "Discover the traditional methods and secrets behind crafting the perfect chili oil. From selecting the finest ingredients to mastering the temperature control, learn how our artisans create the perfect balance of heat and flavor.",
    date: "March 15, 2024",
    category: "Techniques",
            image: "https://img.freepik.com/premium-photo/glass-jar-filled-with-vibrant-red-chili-oil-light-pervading-translucency-spicy-liquid_997580-1829.jpg",
    readTime: "5 min read",
    author: "Chef Maria Rodriguez",
    content: `
      <h2>The Ancient Craft of Chili Oil</h2>
      <p>Chili oil has been a cornerstone of culinary traditions across Asia for centuries. The process of creating the perfect chili oil is both an art and a science, requiring patience, precision, and a deep understanding of ingredients.</p>
      
      <h3>Selecting the Right Chilies</h3>
      <p>The foundation of exceptional chili oil lies in the quality of chilies used. We carefully select from several varieties:</p>
      <ul>
        <li><strong>Arbol Chilies:</strong> Provide a bright, clean heat with subtle smoky undertones</li>
        <li><strong>Guajillo Chilies:</strong> Offer a mild, fruity flavor with moderate spiciness</li>
        <li><strong>Pasilla Chilies:</strong> Contribute deep, rich flavors with complex notes</li>
      </ul>
      
      <h3>The Oil Selection Process</h3>
      <p>We use only the finest cold-pressed oils, primarily:</p>
      <ul>
        <li><strong>Peanut Oil:</strong> High smoke point and neutral flavor</li>
        <li><strong>Sesame Oil:</strong> Adds nutty, aromatic qualities</li>
        <li><strong>Grapeseed Oil:</strong> Light and clean, perfect for delicate infusions</li>
      </ul>
      
      <h3>Temperature Control: The Key to Success</h3>
      <p>The most critical aspect of chili oil production is temperature control. Our process involves:</p>
      <ol>
        <li>Heating oil to exactly 350°F (175°C)</li>
        <li>Adding chilies in stages to prevent burning</li>
        <li>Maintaining consistent temperature for 15-20 minutes</li>
        <li>Cooling gradually to room temperature</li>
      </ol>
      
      <h3>Infusion Techniques</h3>
      <p>We employ traditional infusion methods that have been perfected over generations:</p>
      <ul>
        <li><strong>Cold Infusion:</strong> For delicate flavors and aromas</li>
        <li><strong>Hot Infusion:</strong> For deeper, more intense heat</li>
        <li><strong>Dual Infusion:</strong> Combining both methods for complexity</li>
      </ul>
      
      <h3>Quality Control</h3>
      <p>Every batch undergoes rigorous testing:</p>
      <ul>
        <li>Heat level verification using Scoville scale</li>
        <li>Flavor profile analysis by our expert tasters</li>
        <li>Consistency checks across multiple batches</li>
        <li>Safety testing for proper preservation</li>
      </ul>
      
      <h3>Storage and Preservation</h3>
      <p>Proper storage is essential for maintaining quality:</p>
      <ul>
        <li>Store in dark, cool locations</li>
        <li>Use airtight containers</li>
        <li>Consume within 6 months for optimal flavor</li>
        <li>Refrigerate after opening</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>The art of making chili oil is a testament to the importance of tradition, patience, and attention to detail. Our artisans continue to honor these ancient methods while incorporating modern quality standards, ensuring that every bottle delivers the perfect balance of heat, flavor, and authenticity.</p>
    `,
         relatedPosts: [
       {
         title: "Understanding Heat Levels",
         slug: "understanding-heat-levels",
         excerpt: "A comprehensive guide to different types of chilies and their heat levels.",
         image: "https://plus.unsplash.com/premium_photo-1668440163167-e477c6c24c64?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
       },
       {
         title: "Health Benefits of Chili Oil",
         slug: "health-benefits-of-chili-oil",
         excerpt: "Exploring the numerous health benefits of incorporating chili oil in your diet.",
         image: "https://images.herzindagi.info/image/2023/Jul/how-to-make-chilli-oil.jpg"
       }
    ]
  },
  {
    slug: "understanding-heat-levels",
    title: "Understanding Heat Levels",
    excerpt: "A comprehensive guide to different types of chilies and their heat levels. Learn about the Scoville scale, flavor profiles, and how to choose the right chili oil for your palate.",
    date: "March 12, 2024",
    category: "Education",
            image: "https://plus.unsplash.com/premium_photo-1668440163167-e477c6c24c64?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    readTime: "4 min read",
    author: "Dr. Sarah Chen",
    content: `
      <h2>The Scoville Scale: Measuring Heat</h2>
      <p>The Scoville scale is the standard measure of chili pepper heat, developed by pharmacist Wilbur Scoville in 1912. Understanding this scale is crucial for choosing the right chili oil for your needs.</p>
      
      <h3>Heat Level Categories</h3>
      <ul>
        <li><strong>Mild (0-3,500 SHU):</strong> Perfect for beginners and those who prefer subtle heat</li>
        <li><strong>Medium (3,500-50,000 SHU):</strong> Balanced heat with rich flavor profiles</li>
        <li><strong>Hot (50,000-100,000 SHU):</strong> Intense heat for experienced chili lovers</li>
        <li><strong>Extreme (100,000+ SHU):</strong> For the most daring heat seekers</li>
      </ul>
      
      <h3>Popular Chili Varieties and Their Heat</h3>
      <ul>
        <li><strong>Bell Pepper:</strong> 0 SHU - No heat, sweet and mild</li>
        <li><strong>Poblano:</strong> 1,000-2,000 SHU - Mild, rich flavor</li>
        <li><strong>Jalapeño:</strong> 2,500-8,000 SHU - Medium heat, versatile</li>
        <li><strong>Serrano:</strong> 10,000-23,000 SHU - Hot, bright flavor</li>
        <li><strong>Habanero:</strong> 100,000-350,000 SHU - Very hot, fruity notes</li>
      </ul>
    `,
         relatedPosts: [
       {
         title: "The Art of Making Chili Oil",
         slug: "the-art-of-making-chili-oil",
         excerpt: "Discover the traditional methods and secrets behind crafting the perfect chili oil.",
         image: "https://img.freepik.com/premium-photo/glass-jar-filled-with-vibrant-red-chili-oil-light-pervading-translucency-spicy-liquid_997580-1829.jpg"
       },
       {
         title: "Health Benefits of Chili Oil",
         slug: "health-benefits-of-chili-oil",
         excerpt: "Exploring the numerous health benefits of incorporating chili oil in your diet.",
         image: "https://images.herzindagi.info/image/2023/Jul/how-to-make-chilli-oil.jpg"
       }
    ]
  },
  {
    slug: "health-benefits-of-chili-oil",
    title: "Health Benefits of Chili Oil",
    excerpt: "Exploring the numerous health benefits of incorporating chili oil in your diet. From boosting metabolism to providing essential nutrients, discover why chili oil is more than just a condiment.",
    date: "March 10, 2024",
    category: "Health",
            image: "https://images.herzindagi.info/image/2023/Jul/how-to-make-chilli-oil.jpg",
    readTime: "6 min read",
    author: "Dr. Michael Thompson",
    content: `
      <h2>Beyond Flavor: The Health Benefits of Chili Oil</h2>
      <p>Chili oil isn't just a delicious condiment—it's also packed with numerous health benefits that make it a valuable addition to any diet.</p>
      
      <h3>Metabolic Benefits</h3>
      <ul>
        <li><strong>Boosts Metabolism:</strong> Capsaicin increases metabolic rate by up to 20%</li>
        <li><strong>Fat Burning:</strong> Promotes fat oxidation and weight management</li>
        <li><strong>Appetite Control:</strong> Helps regulate hunger and satiety signals</li>
      </ul>
      
      <h3>Cardiovascular Health</h3>
      <ul>
        <li><strong>Blood Pressure:</strong> Helps maintain healthy blood pressure levels</li>
        <li><strong>Cholesterol:</strong> May help reduce LDL cholesterol</li>
        <li><strong>Circulation:</strong> Improves blood flow and vascular health</li>
      </ul>
      
      <h3>Anti-Inflammatory Properties</h3>
      <ul>
        <li><strong>Pain Relief:</strong> Natural pain relief for various conditions</li>
        <li><strong>Arthritis:</strong> May help reduce joint inflammation</li>
        <li><strong>Recovery:</strong> Speeds up muscle recovery after exercise</li>
      </ul>
      
      <h3>Immune System Support</h3>
      <ul>
        <li><strong>Antioxidants:</strong> Rich in vitamin C and other antioxidants</li>
        <li><strong>Antimicrobial:</strong> Natural antibacterial properties</li>
        <li><strong>Detoxification:</strong> Aids in natural detox processes</li>
      </ul>
    `,
    relatedPosts: [
      {
        title: "The Art of Making Chili Oil",
        slug: "the-art-of-making-chili-oil",
        excerpt: "Discover the traditional methods and secrets behind crafting the perfect chili oil.",
        image: "https://img.freepik.com/premium-photo/glass-jar-filled-with-vibrant-red-chili-oil-light-pervading-translucency-spicy-liquid_997580-1829.jpg"
      },
      {
        title: "Understanding Heat Levels",
        slug: "understanding-heat-levels",
        excerpt: "A comprehensive guide to different types of chilies and their heat levels.",
        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5"
      }
    ]
  }
];

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-foreground/60">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
          <li>/</li>
          <li className="text-foreground">{post.title}</li>
        </ol>
      </nav>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm text-foreground/60 mb-6">
            <span className="px-3 py-1 rounded-full bg-primary/5 text-primary">
              {post.category}
            </span>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
            <span>By {post.author}</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-display text-primary mb-6">
            {post.title}
          </h1>

          <p className="text-xl text-foreground/80 leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        {/* Featured Image */}
        <div className="relative mb-12">
          <div className="relative aspect-[16/9] w-full">
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-16">
          <div 
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="space-y-6 text-foreground/80 leading-relaxed"
          />
        </div>

        {/* Author Bio */}
        <div className="border-t border-border pt-8 mb-16">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl text-primary font-bold">
                {post.author.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{post.author}</h3>
              <p className="text-foreground/60">Expert in {post.category.toLowerCase()} and culinary arts</p>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-display text-primary mb-12 text-center">
          Related Articles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {post.relatedPosts.map((relatedPost, index) => (
            <Link 
              key={index} 
              href={`/blog/${relatedPost.slug}`}
              className="group block"
            >
              <article className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-primary mb-3 group-hover:text-primary/80 transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    {relatedPost.excerpt}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

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

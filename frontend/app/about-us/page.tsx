import Image from 'next/image';

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-16 space-y-32">
      {/* Mission Section - Image Left, Text Right */}
      <section className="relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image - Left */}
            <div className="relative">
              <div className="relative aspect-[4/3] w-full">
                <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl" 
                  style={{
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.08)'
                  }}>
                  <Image
                    src="/images/aboutUs/mission.png"
                    alt="Chili oil making process"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
                {/* Decorative background blur */}
                <div className="absolute -z-10 -bottom-8 -right-8 w-full h-full rounded-[2rem] bg-primary/5 blur-2xl"></div>
              </div>
            </div>

            {/* Text - Right */}
            <div className="space-y-6">
              <h1 className="text-[40px] font-display text-[#33475b] mb-8">
                Our Mission
              </h1>
              <p className="text-lg text-[#5f6b7b] leading-relaxed">
              At NE CRAFTERS, our mission is to bring the rich, authentic flavours of Northeast India to kitchens across the world, while creating sustainable livelihoods for farmers and food artisans. We are committed to producing pure, high-quality, and innovative food products, free from harmful additives, and deeply rooted in the cultural and agricultural heritage of our region.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section - Text Left, Image Right */}
      <section className="relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text - Left */}
            <div className="space-y-6">
              <h2 className="text-[40px] font-display text-[#33475b] mb-8">
                Our Story
              </h2>
              <p className="text-lg text-[#5f6b7b] leading-relaxed">
              NE CRAFTERS began with a simple idea: that the unique spices, crops, and traditional recipes of Northeast India deserve a wider audience and that our farmers deserve a fair price for their hard work.
              </p>
              <p className="text-lg text-[#5f6b7b] leading-relaxed">
              Founded by a team with deep roots in Assam and a passion for both food and community development, we started small, sourcing directly from local farmers and experimenting with value-added products. Our journey led to the creation of specialty items like Bhut Jolokia Chili Oil and premium adulteration-free spices, along with nutritious innovations like high-protein breakfast mixes.
              </p>
              <p className="text-lg text-[#5f6b7b] leading-relaxed">
              As we grew, we realised our responsibility went beyond food and it extended to the planet itself. We began transforming agricultural by-products, such as chili stems, into biochar, creating a long-term carbon sink that stores carbon in the soil for extended periods and even captures carbon dioxide from the atmosphere. This step is part of our ongoing mission to become a carbon-negative company, ensuring that our business not only supports livelihoods but also contributes to global climate action.
              </p>
              <p className="text-lg text-[#5f6b7b] leading-relaxed">
              Today, NE CRAFTERS is more than a food processing company. We are a bridge between rural producers and urban markets, between traditional knowledge and modern taste, and between delicious food and a sustainable future.
              </p>
            </div>

            {/* Image - Right */}
            <div className="relative">
              <div className="relative aspect-[4/3] w-full">
                <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl"
                  style={{
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.08)'
                  }}>
                  <Image
                    src="/images/aboutUs/story.png"
                    alt="Our story"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {/* Decorative background blur */}
                <div className="absolute -z-10 -bottom-8 -left-8 w-full h-full rounded-[2rem] bg-accent/5 blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - Image Left, Text Right */}
      <section className="relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image - Left */}
            <div className="relative">
              <div className="relative aspect-[4/3] w-full">
                <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl"
                  style={{
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.08)'
                  }}>
                  <Image
                    src="/images/aboutUs/impact.jpg"
                    alt="Impact Created"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {/* Decorative background blur */}
                <div className="absolute -z-10 -bottom-8 -right-8 w-full h-full rounded-[2rem] bg-primary/5 blur-2xl"></div>
              </div>
            </div>

            {/* Text - Right */}
            <div className="space-y-6">
              <h2 className="text-[40px] font-display text-[#33475b] mb-8">
                Impact Created
              </h2>
              <p className="text-lg text-[#5f6b7b] leading-relaxed">
              At NE CRAFTERS, our work goes beyond making great food and now we aim to create lasting change. By sourcing directly from farmers and farmer-producer organisations across Assam, Nagaland, and the Northeast, we ensure fair prices, steady market access, and recognition for indigenous crops like Bhut Jolokia, Lakadong turmeric, and aromatic black rice.
              </p>
              <p className="text-lg text-[#5f6b7b] leading-relaxed">
              We also use the waste and unsellable Bhut Jolokia and convert it to value added oleoresins (A Waste-To-Value initiative).
              </p>
              <p className="text-lg text-[#5f6b7b] leading-relaxed">
              We create employment opportunities for local youth and women, preserve traditional farming practices, and promote healthy living through MSG-free, preservative-free, and protein-rich products.
              </p>
              <p className="text-lg text-[#5f6b7b] leading-relaxed">
              Sustainability is at the heart of our operations, and we are now moving towards becoming a carbon-negative company. We do this by transforming agricultural by-products into biochar, which serves as a long-term carbon sink by storing carbon in the soil for decades while also having the ability to capture carbon dioxide directly from the atmosphere. This approach not only reduces waste but also contributes to global efforts against climate change, turning our food business into a force for both community and environmental good.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
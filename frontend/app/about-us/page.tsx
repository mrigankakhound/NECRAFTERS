import Image from 'next/image';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section with Background Pattern */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 to-accent/5 py-12 sm:py-20">
        <div className="absolute inset-0 bg-[url('/images/chili-pattern.svg')] bg-repeat opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-6 sm:space-y-8 max-w-5xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-accent rounded-full mb-4 sm:mb-6">
              <span className="text-2xl sm:text-3xl">🌿</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display mb-6 sm:mb-8 leading-tight font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
              About Us
            </h1>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-white/20">
              <p className="text-base sm:text-lg md:text-xl text-[#5f6b7b] leading-relaxed text-justify mb-4 sm:mb-6">
                NE CRAFTERS is a brand under <span className="font-semibold text-primary">NE CRAFTERS ENTERPRISE LLP</span>, a Limited Liability Partnership registered at <span className="font-medium">Pachoni Bora Chuck, Masarhat, Jorhat – 785001, Assam</span>. We are a food innovation startup from North East, India, dedicated to transforming the unique agricultural produce of Northeast India into sustainable, high-value products. We work closely with farmers and women SHGs, crafting authentic and healthy products that bring the true taste of the Northeast straight to your plate.
              </p>
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20">
                <p className="text-sm sm:text-base md:text-lg text-[#5f6b7b] text-center font-medium">
                  <span className="text-primary font-semibold">LLPIN:</span> ACC-1228 | <span className="text-primary font-semibold">GSTIN:</span> 18AAVFN5592M1Z5
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-16 space-y-16 sm:space-y-32">
        {/* Mission Section - Enhanced */}
        <section className="relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
              {/* Image - Left with Enhanced Styling */}
              <div className="relative group order-2 lg:order-1">
                <div className="relative aspect-[4/3] w-full">
                  <div className="absolute inset-0 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-500" 
                    style={{
                      boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 15px 30px rgba(0,0,0,0.1)'
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
                  {/* Enhanced decorative background blur */}
                  <div className="absolute -z-10 -bottom-4 sm:-bottom-8 -right-4 sm:-right-8 w-full h-full rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-primary/20 to-accent/20 blur-xl sm:blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                  {/* Floating badge */}
                  <div className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 bg-gradient-to-r from-primary to-accent text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                    Our Mission
                  </div>
                </div>
              </div>

              {/* Text - Right with Enhanced Typography */}
              <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
                <div className="inline-flex items-center space-x-2 text-primary font-medium mb-3 sm:mb-4">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm sm:text-base">WHO WE ARE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display leading-tight font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
                  Our Mission
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-base sm:text-lg text-[#5f6b7b] leading-relaxed text-justify">
                    At <span className="font-semibold text-primary">NE CRAFTERS</span>, our mission is to bring the rich, authentic flavours of Northeast India to kitchens across the world, while creating sustainable livelihoods for farmers and food artisans. We are committed to producing pure, high-quality, and innovative food products, free from harmful additives, and deeply rooted in the cultural and agricultural heritage of our region.
                  </p>
                </div>
                {/* Feature highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-xl">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm">🌶️</span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-[#5f6b7b]">Authentic Flavors</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gradient-to-r from-accent/5 to-transparent rounded-xl">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm">🌱</span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-[#5f6b7b]">Sustainable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section - Enhanced */}
        <section className="relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
              {/* Text - Left with Enhanced Layout */}
              <div className="space-y-6 sm:space-y-8 order-1">
                <div className="inline-flex items-center space-x-2 text-accent font-medium mb-3 sm:mb-4">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm sm:text-base">OUR JOURNEY</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display leading-tight font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
                  Our Story
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-base sm:text-lg text-[#5f6b7b] leading-relaxed text-justify">
                    NE CRAFTERS began with a simple idea: that the unique spices, crops, and traditional recipes of Northeast India deserve a wider audience and that our farmers deserve a fair price for their hard work.
                  </p>
                  <p className="text-base sm:text-lg text-[#5f6b7b] leading-relaxed text-justify">
                    Founded by a team with deep roots in Assam and a passion for both food and community development, we started small, sourcing directly from local farmers and experimenting with value-added products. Our journey led to the creation of specialty items like <span className="font-semibold text-primary">Bhut Jolokia Chili Oil</span> and premium adulteration-free spices, along with nutritious innovations like high-protein breakfast mixes.
                  </p>
                  <p className="text-base sm:text-lg text-[#5f6b7b] leading-relaxed text-justify">
                    As we grew, we realised our responsibility went beyond food and it extended to the planet itself. We began transforming agricultural by-products, such as chili stems, into biochar, creating a long-term carbon sink that stores carbon in the soil for extended periods and even captures carbon dioxide from the atmosphere. This step is part of our ongoing mission to become a carbon-negative company, ensuring that our business not only supports livelihoods but also contributes to global climate action.
                  </p>
                  <p className="text-base sm:text-lg text-[#5f6b7b] leading-relaxed text-justify">
                    Today, NE CRAFTERS is more than a food processing company. We are a bridge between rural producers and urban markets, between traditional knowledge and modern taste, and between delicious food and a sustainable future.
                  </p>
                </div>
                {/* Timeline indicator */}
                <div className="flex items-center space-x-3 sm:space-x-4 mt-6 sm:mt-8">
                  <div className="flex space-x-1 sm:space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-accent rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-accent/50 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-accent/30 rounded-full"></div>
                  </div>
                  <span className="text-xs sm:text-sm text-accent font-medium">Our Growth Journey</span>
                </div>
              </div>

              {/* Image - Right with Enhanced Effects */}
              <div className="relative group order-2">
                <div className="relative aspect-[4/3] w-full">
                  <div className="absolute inset-0 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                    style={{
                      boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 15px 30px rgba(0,0,0,0.1)'
                    }}>
                    <Image
                      src="/images/aboutUs/story.png"
                      alt="Our story"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  {/* Enhanced decorative background blur */}
                  <div className="absolute -z-10 -bottom-4 sm:-bottom-8 -left-4 sm:-left-8 w-full h-full rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-accent/20 to-primary/20 blur-xl sm:blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                  {/* Floating badge */}
                  <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-gradient-to-r from-accent to-primary text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                    Our Story
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section - Enhanced */}
        <section className="relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
              {/* Image - Left with Enhanced Styling */}
              <div className="relative group order-2 lg:order-1">
                <div className="relative aspect-[4/3] w-full">
                  <div className="absolute inset-0 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                    style={{
                      boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 15px 30px rgba(0,0,0,0.1)'
                    }}>
                    <Image
                      src="/images/aboutUs/impact.jpg"
                      alt="Impact Created"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  {/* Enhanced decorative background blur */}
                  <div className="absolute -z-10 -bottom-4 sm:-bottom-8 -right-4 sm:-right-8 w-full h-full rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-primary/20 to-accent/20 blur-xl sm:blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                  {/* Floating badge */}
                  <div className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 bg-gradient-to-r from-primary to-accent text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                    Our Impact
                  </div>
                </div>
              </div>

              {/* Text - Right with Enhanced Content */}
              <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
                <div className="inline-flex items-center space-x-2 text-primary font-medium mb-3 sm:mb-4">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm sm:text-base">MAKING A DIFFERENCE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display leading-tight font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
                  Impact Created
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-base sm:text-lg text-[#5f6b7b] leading-relaxed text-justify">
                    At NE CRAFTERS, our work goes beyond making great food and now we aim to create lasting change. By sourcing directly from farmers and farmer-producer organisations across Assam, Nagaland, and the Northeast, we ensure fair prices, steady market access, and recognition for indigenous crops like <span className="font-semibold text-primary">Bhut Jolokia</span>, <span className="font-semibold text-primary">Lakadong turmeric</span>, and aromatic black rice.
                  </p>
                  <p className="text-base sm:text-lg text-[#5f6b7b] leading-relaxed text-justify">
                    We also use the waste and unsellable Bhut Jolokia and convert it to value added oleoresins (A <span className="font-semibold text-accent">Waste-To-Value</span> initiative).
                  </p>
                  <p className="text-base sm:text-lg text-[#5f6b7b] leading-relaxed text-justify">
                    We create employment opportunities for local youth and women, preserve traditional farming practices, and promote healthy living through MSG-free, preservative-free, and protein-rich products.
                  </p>
                  <p className="text-base sm:text-lg text-[#5f6b7b] leading-relaxed text-justify">
                    Sustainability is at the heart of our operations, and we are now moving towards becoming a carbon-negative company. We do this by transforming agricultural by-products into biochar, which serves as a long-term carbon sink by storing carbon in the soil for decades while also having the ability to capture carbon dioxide directly from the atmosphere. This approach not only reduces waste but also contributes to global efforts against climate change, turning our food business into a force for both community and environmental good.
                  </p>
                </div>
                {/* Impact metrics */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-primary/10 to-transparent rounded-xl border border-primary/20">
                    <div className="text-xl sm:text-2xl font-bold text-primary">100%</div>
                    <div className="text-xs sm:text-sm text-[#5f6b7b]">Farmer Direct</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-accent/10 to-transparent rounded-xl border border-accent/20">
                    <div className="text-xl sm:text-2xl font-bold text-accent">Carbon</div>
                    <div className="text-xs sm:text-sm text-[#5f6b7b]">Negative Goal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
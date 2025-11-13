'use client';

import { FormEvent, useMemo, useState } from 'react';

type Marketplace = 'amazon' | 'flipkart' | 'meesho';

type ProductCard = {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  marketplace: Marketplace;
  tag: string;
  image?: string;
};

type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

type Feature = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

type HowItWorksStep = {
  id: number;
  title: string;
  description: string;
};

const marketplaceLabels: Record<Marketplace, string> = {
  amazon: 'Amazon',
  flipkart: 'Flipkart',
  meesho: 'Meesho',
};

const bestSellers: ProductCard[] = [
  {
    id: 'bs-1',
    title: 'Premium Copper Water Bottle 1L',
    price: 999,
    rating: 4.8,
    reviews: 1245,
    marketplace: 'amazon',
    tag: 'High Demand',
  },
  {
    id: 'bs-2',
    title: 'Organic Cotton Baby Swaddle Set',
    price: 1299,
    rating: 4.7,
    reviews: 865,
    marketplace: 'flipkart',
    tag: 'Top 1%',
  },
  {
    id: 'bs-3',
    title: 'Non-stick Dosa Tawa 28cm',
    price: 899,
    rating: 4.6,
    reviews: 940,
    marketplace: 'amazon',
    tag: 'High Demand',
  },
  {
    id: 'bs-4',
    title: 'Designer Cushion Covers (Set of 5)',
    price: 699,
    rating: 4.5,
    reviews: 715,
    marketplace: 'meesho',
    tag: 'Top 1%',
  },
];

const newLaunches: ProductCard[] = [
  {
    id: 'nl-1',
    title: 'Eco-friendly Yoga Brick Set',
    price: 1499,
    rating: 4.5,
    reviews: 120,
    marketplace: 'amazon',
    tag: 'Low Competition',
  },
  {
    id: 'nl-2',
    title: 'Wireless Neck Massager Pro',
    price: 2499,
    rating: 4.4,
    reviews: 210,
    marketplace: 'flipkart',
    tag: 'Early Mover Advantage',
  },
  {
    id: 'nl-3',
    title: 'Kids STEM Robot Kit',
    price: 1899,
    rating: 4.6,
    reviews: 98,
    marketplace: 'amazon',
    tag: 'Early Mover Advantage',
  },
  {
    id: 'nl-4',
    title: 'Handmade Terracotta Planters (Set of 3)',
    price: 1299,
    rating: 4.3,
    reviews: 76,
    marketplace: 'meesho',
    tag: 'Low Competition',
  },
];

const popularNow: ProductCard[] = [
  {
    id: 'pn-1',
    title: 'Smart Temperature Water Bottle',
    price: 1599,
    rating: 4.7,
    reviews: 512,
    marketplace: 'flipkart',
    tag: 'Trending 🔥',
  },
  {
    id: 'pn-2',
    title: 'Aesthetic LED Neon Lamp',
    price: 1399,
    rating: 4.6,
    reviews: 468,
    marketplace: 'meesho',
    tag: 'Trending 🔥',
  },
  {
    id: 'pn-3',
    title: 'Portable Smoothie Blender',
    price: 2199,
    rating: 4.8,
    reviews: 624,
    marketplace: 'amazon',
    tag: 'Trending 🔥',
  },
  {
    id: 'pn-4',
    title: 'Ergonomic Laptop Stand',
    price: 1799,
    rating: 4.5,
    reviews: 532,
    marketplace: 'amazon',
    tag: 'Trending 🔥',
  },
];

const easyToLaunch: ProductCard[] = [
  {
    id: 'et-1',
    title: 'Reusable Silicone Food Bags',
    price: 799,
    rating: 4.6,
    reviews: 385,
    marketplace: 'amazon',
    tag: 'Easy to Source',
  },
  {
    id: 'et-2',
    title: 'Minimalist Canvas Tote Bags',
    price: 549,
    rating: 4.4,
    reviews: 245,
    marketplace: 'meesho',
    tag: 'Beginner Friendly',
  },
  {
    id: 'et-3',
    title: 'Herbal Hair Care Combo Pack',
    price: 999,
    rating: 4.5,
    reviews: 302,
    marketplace: 'flipkart',
    tag: 'Easy to Source',
  },
  {
    id: 'et-4',
    title: 'Multi-purpose Spice Jar Set',
    price: 649,
    rating: 4.3,
    reviews: 228,
    marketplace: 'amazon',
    tag: 'Beginner Friendly',
  },
];

const categories: Category[] = [
  { id: 'cat-1', name: 'Baby', icon: '🍼', description: 'Explore products →' },
  { id: 'cat-2', name: 'Kitchen', icon: '🍳', description: 'Explore products →' },
  { id: 'cat-3', name: 'Fashion', icon: '👗', description: 'Explore products →' },
  { id: 'cat-4', name: 'Home & Living', icon: '🛋️', description: 'Explore products →' },
  { id: 'cat-5', name: 'Electronics', icon: '📱', description: 'Explore products →' },
  { id: 'cat-6', name: 'Health & Beauty', icon: '💆‍♀️', description: 'Explore products →' },
  { id: 'cat-7', name: 'Toys & Games', icon: '🧸', description: 'Explore products →' },
  { id: 'cat-8', name: 'Fitness', icon: '🏋️‍♀️', description: 'Explore products →' },
];

const featureHighlights: Feature[] = [
  {
    id: 'feat-1',
    icon: '🤖',
    title: 'AI Title & Description Generator',
    description:
      'Instantly craft persuasive copy tailored for Indian shoppers with localized keywords and tone.',
  },
  {
    id: 'feat-2',
    icon: '🔍',
    title: 'Keyword & Trend Research',
    description:
      'Discover the hottest search terms, seasonality, and trend shifts across Amazon, Flipkart, and Meesho.',
  },
  {
    id: 'feat-3',
    icon: '📈',
    title: 'Profit & Fee Calculator',
    description:
      'Estimate margins, logistics costs, and platform fees to stay profitable before you invest.',
  },
  {
    id: 'feat-4',
    icon: '🧠',
    title: 'Product Opportunity Scoring',
    description:
      'Balanced metrics across demand, competition, and supplier readiness to highlight winning bets.',
  },
];

const howItWorksSteps: HowItWorksStep[] = [
  {
    id: 1,
    title: 'Enter niche or keyword',
    description: 'Describe what you want to sell. Our AI hunts through millions of data points instantly.',
  },
  {
    id: 2,
    title: 'Compare products and scores',
    description: 'Review profitability, demand trends, sourcing readiness, and competition in one dashboard.',
  },
  {
    id: 3,
    title: 'Launch with confidence',
    description: 'Validate suppliers, optimize listings, and go live faster with actionable playbooks.',
  },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'baby', label: 'Baby' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'home', label: 'Home & Living' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'beauty', label: 'Health & Beauty' },
  { value: 'fitness', label: 'Fitness' },
];

const availableMarketplaces: { id: Marketplace; label: string }[] = [
  { id: 'amazon', label: 'Amazon' },
  { id: 'flipkart', label: 'Flipkart' },
  { id: 'meesho', label: 'Meesho' },
];

type ProductSectionProps = {
  title: string;
  description: string;
  products: ProductCard[];
  accent?: 'default' | 'warm';
};

function ProductSection({ title, description, products, accent = 'default' }: ProductSectionProps) {
  return (
    <section className="py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">{description}</p>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCardItem key={product.id} product={product} accent={accent} />
          ))}
        </div>
      </div>
    </section>
  );
}

type ProductCardItemProps = {
  product: ProductCard;
  accent?: 'default' | 'warm';
};

function ProductCardItem({ product, accent = 'default' }: ProductCardItemProps) {
  const marketplaceColor = {
    amazon: 'text-amber-600 bg-amber-50 border-amber-200',
    flipkart: 'text-blue-600 bg-blue-50 border-blue-200',
    meesho: 'text-pink-600 bg-pink-50 border-pink-200',
  }[product.marketplace];

  const accentClass =
    accent === 'warm'
      ? 'border-orange-200/80 bg-white/90'
      : 'border-slate-200 bg-white/90';

  return (
    <div className={`min-w-[260px] flex-1 rounded-2xl border ${accentClass} p-5 shadow-sm transition-shadow hover:shadow-md`}> 
      <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100" />
      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${marketplaceColor}`}>
            {marketplaceLabels[product.marketplace]}
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">
            {product.tag}
          </span>
        </div>
        <h3 className="text-base font-semibold text-slate-900">{product.title}</h3>
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span className="text-lg font-semibold text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
          <span className="flex items-center gap-1 text-xs font-medium">
            <span className="text-amber-500">★</span>
            {product.rating.toFixed(1)}
            <span className="text-slate-400">({product.reviews.toLocaleString('en-IN')})</span>
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Velocity score, profit margins, and supplier readiness updated hourly across marketplaces.
        </p>
      </div>
    </div>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
        {category.icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{category.name}</h3>
      <p className="mt-2 text-sm text-slate-600">{category.description}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-900 opacity-0 transition-opacity group-hover:opacity-100">
        Explore now
        <span aria-hidden>→</span>
      </span>
    </div>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
        {feature.icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{feature.description}</p>
    </div>
  );
}

function StepCard({ step }: { step: HowItWorksStep }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
        {step.id}
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<Marketplace[]>([
    'amazon',
    'flipkart',
    'meesho',
  ]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchInfo, setSearchInfo] = useState<string | null>(null);

  const selectedCategoryLabel = useMemo(
    () => categoryOptions.find((option) => option.value === selectedCategory)?.label ?? 'All Categories',
    [selectedCategory],
  );

  const handleMarketplaceToggle = (marketplace: Marketplace) => {
    setSelectedMarketplaces((prev) =>
      prev.includes(marketplace) ? prev.filter((item) => item !== marketplace) : [...prev, marketplace],
    );
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const readableMarketplaces = selectedMarketplaces.length
      ? selectedMarketplaces.map((mkt) => marketplaceLabels[mkt]).join(', ')
      : 'All Marketplaces';

    const message = `Showing results for "${query || 'top opportunities'}" in ${selectedCategoryLabel} on ${readableMarketplaces}`;
    console.log({ query, selectedMarketplaces, selectedCategory });
    setSearchInfo(message);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-6xl px-4 pb-24">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-16 text-white shadow-xl sm:px-12">
          <div className="absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium uppercase tracking-wide text-cyan-200">
                Built for Indian marketplace sellers
              </span>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Find Winning Products Instantly
              </h1>
              <p className="text-lg text-slate-200">
                AI-powered product research for Amazon, Flipkart & Meesho sellers in India. Discover profitable opportunities, validate demand, and launch faster.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-slate-200">
                {['AI Keywords', 'Profit Calculator', 'Trend Analysis'].map((badge) => (
                  <span key={badge} className="rounded-full bg-white/10 px-3 py-1 font-medium">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <form
              onSubmit={handleSearch}
              className="w-full max-w-xl space-y-4 rounded-3xl bg-white p-6 text-slate-900 shadow-lg"
            >
              <div className="space-y-2">
                <label htmlFor="search" className="text-sm font-medium text-slate-600">
                  Search any niche
                </label>
                <input
                  id="search"
                  name="search"
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search any niche… e.g. ‘baby blanket’, ‘water bottle’, ‘yoga mat’"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium text-slate-600">Marketplaces</span>
                <div className="flex flex-wrap gap-3">
                  {availableMarketplaces.map((marketplace) => {
                    const isSelected = selectedMarketplaces.includes(marketplace.id);
                    return (
                      <label
                        key={marketplace.id}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                          isSelected
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleMarketplaceToggle(marketplace.id)}
                          className="hidden"
                        />
                        {marketplace.label}
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium text-slate-600">
                  Category
                </label>
                <div className="relative">
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-base shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                    ▼
                  </span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-base font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Find Winning Products
              </button>
            </form>
          </div>
          {searchInfo && (
            <div className="mt-10 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-slate-100 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                {searchInfo}
              </div>
            </div>
          )}
        </section>

        <ProductSection
          title="Best Sellers"
          description="Proven top performers with elite demand scores and consistent profit margins."
          products={bestSellers}
        />
        <ProductSection
          title="New Launches"
          description="Fresh arrivals with low competition. Move fast to capture early sales velocity."
          products={newLaunches}
        />
        <ProductSection
          title="Popular Right Now"
          description="Trending products across marketplaces with surging search volume this week."
          products={popularNow}
          accent="warm"
        />
        <ProductSection
          title="Easy to Launch"
          description="Beginner friendly products with simple sourcing and predictable logistics."
          products={easyToLaunch}
        />

        <section className="py-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Browse by Category</h2>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                Dive into curated opportunities aligned with your brand and sourcing strengths.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        <section className="py-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                Everything you need to launch profitably
              </h2>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                Streamline your product research workflow with built-in AI copilots designed for Indian sellers.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {featureHighlights.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </section>

        <section className="py-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">How it works</h2>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                Launch-ready insights in minutes, without spreadsheets or complex dashboards.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {howItWorksSteps.map((step) => (
              <StepCard key={step.id} step={step} />
            ))}
          </div>
        </section>

        <section className="py-16">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 px-6 py-12 text-white shadow-xl sm:px-16">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-purple-500/20" aria-hidden />
            <div className="relative space-y-6 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">Ready to find your next winning product?</h2>
              <p className="mx-auto max-w-2xl text-base text-slate-200 sm:text-lg">
                Start with our free tool. Upgrade later for pro features. Discover high-potential listings, optimize pricing, and dominate Amazon, Flipkart, and Meesho in weeks, not months.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button className="w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-md transition hover:-translate-y-0.5 hover:bg-slate-100 sm:w-auto">
                  Start Free
                </button>
                <button className="w-full rounded-xl border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white sm:w-auto">
                  View Pricing
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <span className="text-lg font-semibold text-slate-900">Winning Product Finder</span>
            <p className="text-sm text-slate-500">Built for Indian marketplace sellers.</p>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            {['Product', 'Pricing', 'Documentation', 'Contact'].map((link) => (
              <a key={link} href="#" className="transition hover:text-slate-900">
                {link}
              </a>
            ))}
          </nav>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Winning Product Finder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}


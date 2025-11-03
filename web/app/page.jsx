'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { DEFAULT_MARKETPLACES } from '@winning-product-finder/shared';

const marketplaceLabels = {
  amazon: 'Amazon',
  flipkart: 'Flipkart',
  meesho: 'Meesho',
};

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    marketplaces: DEFAULT_MARKETPLACES,
  });
  const [email, setEmail] = useState('');
  const [results, setResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [keywordData, setKeywordData] = useState(null);

  const searchMutation = useMutation({
    mutationFn: async () => {
      const params = new URLSearchParams();
      params.set('q', query);
      if (filters.marketplaces?.length) {
        params.set('marketplaces', filters.marketplaces.join(','));
      }
      if (filters.minPrice != null)
        params.set('minPrice', String(filters.minPrice));
      if (filters.maxPrice != null)
        params.set('maxPrice', String(filters.maxPrice));
      if (filters.minRating != null)
        params.set('minRating', String(filters.minRating));
      if (filters.cogs != null) params.set('cogs', String(filters.cogs));

      const response = await axios.get(`/api/search?${params.toString()}`);
      return response.data;
    },
    onSuccess: (data) => {
      setResults(data.results);
    },
  });

  const keywordMutation = useMutation({
    mutationFn: async (product) => {
      const response = await axios.post('/api/keywords', {
        productTitle: product.title,
        marketplace: product.marketplace,
        language: 'en',
        price: product.price,
        rating: product.rating ?? undefined,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setKeywordData(data);
    },
  });

  const hasMarketplace = (marketplace) =>
    filters.marketplaces?.includes(marketplace) ?? false;

  const toggleMarketplace = (marketplace) => {
    setFilters((current) => {
      const next = new Set(current.marketplaces ?? DEFAULT_MARKETPLACES);
      if (next.has(marketplace)) {
        next.delete(marketplace);
      } else {
        next.add(marketplace);
      }
      const marketplaces = next.size
        ? Array.from(next)
        : [...DEFAULT_MARKETPLACES];
      return { ...current, marketplaces };
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    searchMutation.mutate();
  };

  const handleExportCsv = () => {
    if (!results.length) return;
    const headers = [
      'Marketplace',
      'Title',
      'Price',
      'Rating',
      'Reviews',
      'OpportunityScore',
      'ProfitMarginPct',
    ];
    const csvRows = results.map((result) =>
      [
        marketplaceLabels[result.marketplace],
        `"${result.title.replace(/"/g, '""')}"`,
        result.price,
        result.rating ?? '',
        result.reviews ?? '',
        result.opportunityScore.toFixed(1),
        `${result.profitMarginPct.toFixed(1)}%`,
      ].join(','),
    );

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `winning-product-results-${Date.now()}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form className="space-y-6" onSubmit={handleSearch}>
          <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-600"
                htmlFor="query"
              >
                Product Keyword
              </label>
              <input
                id="query"
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                placeholder="e.g. baby thermal"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-600"
                htmlFor="email"
              >
                Email (optional)
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                placeholder="demo@winningproductfinder.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">
                Marketplaces
              </label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_MARKETPLACES.map((marketplace) => (
                  <button
                    type="button"
                    key={marketplace}
                    onClick={() => toggleMarketplace(marketplace)}
                    className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                      hasMarketplace(marketplace)
                        ? 'border-brand bg-brand/10 text-brand'
                        : 'border-slate-200 text-slate-500 hover:border-brand/50'
                    }`}
                  >
                    {marketplaceLabels[marketplace]}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-600"
                htmlFor="minPrice"
              >
                Min Price (₹)
              </label>
              <input
                id="minPrice"
                type="number"
                min={0}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                value={filters.minPrice ?? ''}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    minPrice: event.target.value
                      ? Number(event.target.value)
                      : undefined,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-600"
                htmlFor="maxPrice"
              >
                Max Price (₹)
              </label>
              <input
                id="maxPrice"
                type="number"
                min={0}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                value={filters.maxPrice ?? ''}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    maxPrice: event.target.value
                      ? Number(event.target.value)
                      : undefined,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-600"
                htmlFor="minRating"
              >
                Min Rating
              </label>
              <input
                id="minRating"
                type="number"
                min={0}
                max={5}
                step={0.1}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                value={filters.minRating ?? ''}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    minRating: event.target.value
                      ? Number(event.target.value)
                      : undefined,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-600"
                htmlFor="cogs"
              >
                Estimated COGS (₹)
              </label>
              <input
                id="cogs"
                type="number"
                min={0}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                value={filters.cogs ?? ''}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    cogs: event.target.value
                      ? Number(event.target.value)
                      : undefined,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={searchMutation.isPending}
            >
              {searchMutation.isPending ? 'Searching…' : 'Search'}
            </button>
            {searchMutation.isError && (
              <p className="text-sm text-red-500">
                Failed to search. Please try again.
              </p>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Results</h2>
          <button
            type="button"
            className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:border-brand hover:text-brand disabled:opacity-50"
            onClick={handleExportCsv}
            disabled={!results.length}
          >
            Export CSV
          </button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-slate-600">
                  Marketplace
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-600">
                  Title
                </th>
                <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-slate-600">
                  Price (₹)
                </th>
                <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-slate-600">
                  Rating
                </th>
                <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-slate-600">
                  Reviews
                </th>
                <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-slate-600">
                  Opportunity
                </th>
                <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-slate-600">
                  Profit %
                </th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {results.map((result) => (
                <tr
                  key={`${result.marketplace}-${result.id}`}
                  className="hover:bg-slate-50"
                >
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {marketplaceLabels[result.marketplace]}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-start gap-3">
                      {result.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={result.imageUrl}
                          alt=""
                          className="h-12 w-12 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-slate-800">
                          {result.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          Demand {result.demandScore.toFixed(0)} · Competition{' '}
                          {result.competitionScore.toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-medium text-slate-700">
                    ₹{result.price.toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-3">
                    {result.rating?.toFixed(1) ?? '—'}
                  </td>
                  <td className="px-3 py-3">
                    {result.reviews?.toLocaleString('en-IN') ?? '—'}
                  </td>
                  <td className="px-3 py-3 font-semibold text-emerald-600">
                    {result.opportunityScore.toFixed(0)}
                  </td>
                  <td className="px-3 py-3">
                    {result.profitMarginPct.toFixed(1)}%
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-dark disabled:bg-slate-300"
                        onClick={() => {
                          setSelectedProduct(result);
                          setKeywordData(null);
                          keywordMutation.mutate(result);
                        }}
                        disabled={
                          keywordMutation.isPending &&
                          selectedProduct?.id === result.id
                        }
                      >
                        {keywordMutation.isPending &&
                        selectedProduct?.id === result.id
                          ? 'Loading…'
                          : 'AI Keywords'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!results.length && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-6 text-center text-sm text-slate-500"
                  >
                    No results yet. Start by searching for a product idea above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  AI Keyword Suggestions
                </h3>
                <p className="text-sm text-slate-500">
                  {selectedProduct.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedProduct(null);
                  setKeywordData(null);
                }}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {keywordMutation.isPending && (
                <p className="text-sm text-slate-500">
                  Generating suggestions…
                </p>
              )}
              {keywordMutation.isError && (
                <p className="text-sm text-red-500">
                  Failed to generate keywords.
                </p>
              )}
              {keywordData && (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      SEO Title
                    </p>
                    <p className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                      {keywordData.seoTitle}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Long-tail Keywords
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                      {keywordData.keywords.map((keyword) => (
                        <li key={keyword}>{keyword}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Bullet Points
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                      {keywordData.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


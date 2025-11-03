import Link from 'next/link';

async function getSavedSearches() {
  try {
    const response = await fetch('http://localhost:4000/api/saved', {
      cache: 'no-store',
    });
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error('Failed to load saved searches', error);
    return [];
  }
}

export default async function SavedPage() {
  const savedSearches = await getSavedSearches();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Saved Searches</h2>
        <Link href="/" className="text-sm text-brand hover:text-brand-dark">
          Back to search
        </Link>
      </div>

      <div className="grid gap-4">
        {savedSearches.map((search) => (
          <div
            key={search.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-base font-semibold text-slate-800">
              {search.query}
            </p>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {new Date(search.createdAt).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
            <pre className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
              {JSON.stringify(search.filters, null, 2)}
            </pre>
          </div>
        ))}
        {!savedSearches.length && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            No saved searches yet. Run your first search to see it here.
          </div>
        )}
      </div>
    </div>
  );
}


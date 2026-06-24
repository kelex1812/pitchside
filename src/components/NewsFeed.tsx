interface NewsFeedProps {
  news: {
    title: string;
    source: string;
    url: string;
    publishedAt: string;
  }[];
}

export default function NewsFeed({ news }: NewsFeedProps) {
  if (!news || news.length === 0) {
    return (
      <div>
        <h3 className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">
          Latest News
        </h3>
        <p className="text-sm text-slate-500 italic">No news items available.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">
        Latest News
      </h3>
      <ul className="space-y-3" role="list">
        {news.map((item, i) => (
          <li key={i}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded"
              aria-label={`${item.title} - ${item.source}, published ${item.publishedAt}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 group-hover:text-white transition-colors leading-snug">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-emerald-400">{item.source}</span>
                    <span className="text-xs text-slate-600" aria-hidden="true">.</span>
                    <span className="text-xs text-slate-500">{item.publishedAt}</span>
                  </div>
                </div>
                <span className="text-slate-600 text-sm group-hover:text-slate-400 transition-colors flex-shrink-0" aria-hidden="true">{"\u2192"}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

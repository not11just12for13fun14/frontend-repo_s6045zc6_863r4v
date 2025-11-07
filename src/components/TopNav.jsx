import React from 'react';

export default function TopNav({ sections = [], onNavigate }) {
  return (
    <header className="fixed top-0 inset-x-0 z-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="backdrop-blur bg-white/10 border border-white/10 rounded-xl mt-3 px-4 py-2 flex items-center justify-between">
          <div className="text-sm font-semibold tracking-wide text-white/90">Letter Worlds</div>
          <nav className="flex gap-1">
            {sections.map((s, i) => (
              <button
                key={s.key}
                onClick={() => onNavigate?.(i)}
                className="px-3 py-1.5 rounded-md text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors"
              >
                {s.title}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

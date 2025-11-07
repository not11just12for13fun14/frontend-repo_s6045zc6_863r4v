import React from 'react';

export default function TopNav({ sections = [], onNavigate }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 backdrop-blur bg-white/10 text-white">
      <div className="font-semibold tracking-wide">Lettering Worlds</div>
      <div className="flex items-center gap-2">
        {sections.map((s, i) => (
          <button
            key={s.key}
            onClick={() => onNavigate?.(i)}
            className="px-3 py-1.5 rounded-full text-sm hover:bg-white/15 active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            {s.title}
          </button>
        ))}
      </div>
    </div>
  );
}

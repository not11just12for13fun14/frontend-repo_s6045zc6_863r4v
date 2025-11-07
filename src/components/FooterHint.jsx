import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FooterHint() {
  return (
    <div className="fixed bottom-4 inset-x-0 z-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-2 text-white/80">
          <span className="hidden sm:inline">Scroll to explore all four worlds</span>
          <span className="sm:hidden">Swipe to explore</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

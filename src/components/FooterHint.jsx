import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FooterHint() {
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur">
      <span className="text-sm">Scroll to explore the worlds</span>
      <ArrowRight className="h-4 w-4" />
    </div>
  );
}

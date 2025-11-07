import React from 'react';
import WorldsScroller from './components/WorldsScroller';
import TopNav from './components/TopNav';
import FooterHint from './components/FooterHint';

export default function App() {
  const sections = [
    { key: 'a', title: 'World A' },
    { key: 'b', title: 'World B' },
    { key: 'c', title: 'World C' },
    { key: 'd', title: 'World D' },
  ];

  const handleNavigate = (idx) => {
    const container = document.querySelector('#worlds-container');
    if (!container) return;
    const x = idx * window.innerWidth;
    container.scrollTo({ left: x, behavior: 'smooth' });
  };

  return (
    <div className="min-h-[100svh] bg-black text-white">
      <TopNav sections={sections} onNavigate={handleNavigate} />
      <main className="pt-14">
        <WorldsScroller id="worlds-container" />
      </main>
      <FooterHint />
    </div>
  );
}

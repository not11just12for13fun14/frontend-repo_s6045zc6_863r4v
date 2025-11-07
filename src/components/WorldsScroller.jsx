import React, { useRef, useEffect } from 'react';
import ParallaxWorld from './ParallaxWorld';

export default function WorldsScroller({ id }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        // Convert vertical wheel to horizontal scroll
        el.scrollBy({ left: e.deltaY, behavior: 'smooth' });
      }
    };

    el.addEventListener('wheel', onWheel, { passive: true });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const worlds = [
    { key: 'calligraphy', title: 'Calligraphy', subtitle: 'Elegant strokes in flowing scripts', palette: 'A' },
    { key: 'graffiti', title: 'Graffiti', subtitle: 'Bold tags and street energy', palette: 'B' },
    { key: 'type', title: 'Typeface', subtitle: 'Precision of geometric letterforms', palette: 'C' },
    { key: 'neon', title: 'Neon', subtitle: 'Glowing cursive in a night city', palette: 'D' },
  ];

  return (
    <div id={id} className="relative w-screen h-[100svh] overflow-x-auto overflow-y-hidden snap-x snap-mandatory" ref={wrapperRef}>
      <div className="flex h-full w-max">
        {worlds.map((w, i) => (
          <div key={w.key} className="snap-start">
            <ParallaxWorld index={i} title={w.title} subtitle={w.subtitle} palette={w.palette} />
          </div>
        ))}
      </div>
    </div>
  );
}

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

  // Four worlds with specified 3D letter aesthetics
  const worlds = [
    {
      key: 'world-a',
      title: 'World A',
      subtitle: 'Cursive elegance in 3D',
      variant: 'A',
      // Replace with a cursive A Spline scene when available
      splineScene: 'https://prod.spline.design/N8g2VNcx8Rycz93J/scene.splinecode',
    },
    {
      key: 'world-b',
      title: 'World B',
      subtitle: 'Bold chromed presence',
      variant: 'B',
      // Replace with a chromed B Spline scene when available
      splineScene: 'https://prod.spline.design/N8g2VNcx8Rycz93J/scene.splinecode',
    },
    {
      key: 'world-c',
      title: 'World C',
      subtitle: 'Pixel-styled dimensionality',
      variant: 'C',
      // Replace with a pixel C Spline scene when available
      splineScene: 'https://prod.spline.design/N8g2VNcx8Rycz93J/scene.splinecode',
    },
    {
      key: 'world-d',
      title: 'World D',
      subtitle: 'Nature-textured depth',
      variant: 'D',
      // Replace with a nature D Spline scene when available
      splineScene: 'https://prod.spline.design/N8g2VNcx8Rycz93J/scene.splinecode',
    },
  ];

  return (
    <div id={id} className="relative w-screen h-[100svh] overflow-x-auto overflow-y-hidden snap-x snap-mandatory" ref={wrapperRef}>
      <div className="flex h-full w-max">
        {worlds.map((w, i) => (
          <div key={w.key} className="snap-start">
            <ParallaxWorld index={i} title={w.title} subtitle={w.subtitle} variant={w.variant} splineScene={w.splineScene} />
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

/****
 A single horizontally-scrollable world section with layered parallax.
 Each world accepts: title, subtitle, palette, foreground, midground, background shapes.
 ****/

const Layer = ({ speed = 0.5, children, offsetX }) => {
  const x = useTransform(offsetX, (v) => v * speed);
  return (
    <motion.div style={{ x }} className="absolute inset-0 will-change-transform">
      {children}
    </motion.div>
  );
};

export default function ParallaxWorld({ index, title, subtitle, palette }) {
  const containerRef = useRef(null);
  const offsetX = useMotionValue(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      // Positive when section enters from right to left
      const viewportWidth = window.innerWidth;
      const centerX = rect.left + rect.width / 2;
      const delta = viewportWidth / 2 - centerX; // negative when right, positive when left
      offsetX.set(delta);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [offsetX]);

  const gradients = {
    A: 'from-pink-500 via-rose-400 to-amber-300',
    B: 'from-indigo-500 via-blue-400 to-cyan-300',
    C: 'from-emerald-500 via-lime-400 to-yellow-300',
    D: 'from-fuchsia-500 via-purple-400 to-sky-300',
  };

  const paletteKey = palette ?? ['A','B','C','D'][index % 4];
  const gradient = gradients[paletteKey];

  return (
    <section
      ref={containerRef}
      className="relative shrink-0 w-screen h-[100svh] overflow-hidden"
      aria-label={`${title} world`}
    >
      {/* Background sky */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      {/* Distant mountains (slow) */}
      <Layer speed={0.15} offsetX={offsetX}>
        <svg className="absolute bottom-0 w-[160%] left-[-30%] text-white/25" viewBox="0 0 1200 300" preserveAspectRatio="none">
          <path d="M0 220 L120 150 L240 210 L360 130 L480 200 L600 120 L720 210 L840 140 L960 200 L1080 160 L1200 220 L1200 300 L0 300 Z" fill="currentColor"/>
        </svg>
      </Layer>

      {/* Mid mountains */}
      <Layer speed={0.35} offsetX={offsetX}>
        <svg className="absolute bottom-0 w-[160%] left-[-20%] text-black/10" viewBox="0 0 1200 300" preserveAspectRatio="none">
          <path d="M0 240 L100 180 L200 230 L300 170 L400 230 L500 170 L600 230 L700 180 L800 230 L900 170 L1000 220 L1100 180 L1200 240 L1200 300 L0 300 Z" fill="currentColor"/>
        </svg>
      </Layer>

      {/* Foreground low-poly shards */}
      <Layer speed={0.65} offsetX={offsetX}>
        <div className="absolute bottom-0 left-0 right-0 h-1/2">
          <div className="absolute -bottom-8 left-[10%] rotate-[-8deg] w-40 h-40 bg-white/40 backdrop-blur rounded-md [clip-path:polygon(0_100%,20%_20%,60%_0,100%_50%,80%_100%)]" />
          <div className="absolute -bottom-10 left-[40%] rotate-[12deg] w-56 h-56 bg-white/30 backdrop-blur rounded-md [clip-path:polygon(0_70%,30%_0,80%_20%,100%_80%,50%_100%)]" />
          <div className="absolute -bottom-12 left-[70%] rotate-[-6deg] w-44 h-44 bg-black/15 rounded-md [clip-path:polygon(10%_100%,0_40%,40%_0,90%_35%,100%_100%)]" />
        </div>
      </Layer>

      {/* Lettering centerpiece */}
      <Layer speed={0.5} offsetX={offsetX}>
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <h2 className="text-white drop-shadow-2xl text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-none">
            {title}
          </h2>
          <p className="mt-4 text-white/90 text-lg sm:text-xl font-medium">{subtitle}</p>
        </div>
      </Layer>

      {/* Ground plane */}
      <Layer speed={0.8} offsetX={offsetX}>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
      </Layer>
    </section>
  );
}

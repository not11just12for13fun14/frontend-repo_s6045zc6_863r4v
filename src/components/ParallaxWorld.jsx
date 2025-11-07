import React, { useRef, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Spline from '@splinetool/react-spline';

/****
 A single horizontally-scrollable world section with layered parallax + 3D.
 - Uses Spline for interactive 3D element per world
 - Lettering SVG reacts to scroll progress
 - Depth of field simulated via dynamic blur per layer
 ****/

const Layer = ({ speed = 0.5, children, offsetX, blur }) => {
  const x = useTransform(offsetX, (v) => v * speed);
  const filter = useTransform(blur ?? offsetX, (b) => `blur(${Math.max(0, b)}px)`);
  return (
    <motion.div style={{ x, filter }} className="pointer-events-none absolute inset-0 will-change-transform">
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

  // Normalized progress of this section relative to viewport center: -1 (off right) -> 0 (center) -> 1 (off left)
  const progress = useTransform(offsetX, (v) => {
    const w = window.innerWidth || 1;
    return Math.max(-1, Math.min(1, v / (w * 0.5)));
  });

  // Depth-of-field: more blur when further from center
  const farBlur = useTransform(progress, (p) => Math.abs(p) * 6); // px
  const midBlur = useTransform(progress, (p) => Math.abs(p) * 3);
  const nearBlur = useTransform(progress, (p) => Math.abs(p) * 1.5);

  // 3D hero transforms (subtle parallax + scale + yaw)
  const heroScale = useTransform(progress, [-1, 0, 1], [0.9, 1, 0.9]);
  const heroRotateY = useTransform(progress, [-1, 0, 1], [12, 0, -12]);
  const heroTranslateZ = useTransform(progress, [-1, 0, 1], [-40, 0, -40]); // visual hint

  // Lettering stroke animation: reveal at center, hide off-center
  const strokeOffset = useTransform(progress, [-1, 0, 1], [180, 0, 180]);
  const strokeOpacity = useTransform(progress, [-1, 0, 1], [0.2, 1, 0.2]);

  const gradients = {
    A: 'from-pink-500 via-rose-400 to-amber-300',
    B: 'from-indigo-500 via-blue-400 to-cyan-300',
    C: 'from-emerald-500 via-lime-400 to-yellow-300',
    D: 'from-fuchsia-500 via-purple-400 to-sky-300',
  };

  const paletteKey = palette ?? ['A','B','C','D'][index % 4];
  const gradient = gradients[paletteKey];

  // Distinct lettering word per world for a themed feel
  const word = useMemo(() => {
    const mapping = ['Calligraphy', 'Graffiti', 'Typeface', 'Neon'];
    return mapping[index % mapping.length] || title;
  }, [index, title]);

  return (
    <section
      ref={containerRef}
      className="relative shrink-0 w-screen h-[100svh] overflow-hidden"
      aria-label={`${title} world`}
    >
      {/* Background sky */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      {/* Distant mountains (slow) */}
      <Layer speed={0.15} offsetX={offsetX} blur={farBlur}>
        <svg className="absolute bottom-0 w-[160%] left-[-30%] text-white/25" viewBox="0 0 1200 300" preserveAspectRatio="none">
          <path d="M0 220 L120 150 L240 210 L360 130 L480 200 L600 120 L720 210 L840 140 L960 200 L1080 160 L1200 220 L1200 300 L0 300 Z" fill="currentColor"/>
        </svg>
      </Layer>

      {/* Mid mountains */}
      <Layer speed={0.35} offsetX={offsetX} blur={midBlur}>
        <svg className="absolute bottom-0 w-[160%] left-[-20%] text-black/10" viewBox="0 0 1200 300" preserveAspectRatio="none">
          <path d="M0 240 L100 180 L200 230 L300 170 L400 230 L500 170 L600 230 L700 180 L800 230 L900 170 L1000 220 L1100 180 L1200 240 L1200 300 L0 300 Z" fill="currentColor"/>
        </svg>
      </Layer>

      {/* Interactive 3D hero via Spline (centered). */}
      <motion.div
        style={{ scale: heroScale, rotateY: heroRotateY, translateZ: heroTranslateZ }}
        className="absolute inset-0"
      >
        <Spline
          scene="https://prod.spline.design/N8g2VNcx8Rycz93J/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </motion.div>

      {/* Foreground low-poly shards */}
      <Layer speed={0.65} offsetX={offsetX} blur={nearBlur}>
        <div className="absolute bottom-0 left-0 right-0 h-1/2">
          <div className="absolute -bottom-8 left-[10%] rotate-[-8deg] w-40 h-40 bg-white/40 backdrop-blur rounded-md [clip-path:polygon(0_100%,20%_20%,60%_0,100%_50%,80%_100%)]" />
          <div className="absolute -bottom-10 left-[40%] rotate-[12deg] w-56 h-56 bg-white/30 backdrop-blur rounded-md [clip-path:polygon(0_70%,30%_0,80%_20%,100%_80%,50%_100%)]" />
          <div className="absolute -bottom-12 left-[70%] rotate-[-6deg] w-44 h-44 bg-black/15 rounded-md [clip-path:polygon(10%_100%,0_40%,40%_0,90%_35%,100%_100%)]" />
        </div>
      </Layer>

      {/* Lettering centerpiece (SVG stroke reveal) */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="text-center">
          <motion.svg
            width="70vw"
            height="22vh"
            viewBox="0 0 1000 220"
            className="mx-auto"
            style={{ opacity: strokeOpacity }}
          >
            <defs>
              <linearGradient id={`stroke-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="white"/>
                <stop offset="100%" stopColor="rgba(255,255,255,0.6)"/>
              </linearGradient>
            </defs>
            <motion.text
              x="50%"
              y="55%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontFamily="'Mona Sans', 'Inter', ui-sans-serif"
              fontSize="120"
              fontWeight="800"
              fill="transparent"
              stroke={`url(#stroke-${index})`}
              strokeWidth="2.5"
              strokeDasharray="180 600"
              style={{ strokeDashoffset: strokeOffset }}
            >
              {word}
            </motion.text>
          </motion.svg>
          <p className="mt-2 text-white/90 text-base sm:text-lg font-medium">{subtitle}</p>
        </div>
      </div>

      {/* Soft vignette and ground plane (non-blocking) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
    </section>
  );
}

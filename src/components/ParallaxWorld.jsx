import React, { useRef, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Spline from '@splinetool/react-spline';

/*
 A single horizontally-scrollable world section with a flat gradient background, 
 an interactive Spline 3D element, and a styled letter centerpiece that matches
 the requested aesthetic per world (A cursive, B chrome, C pixel, D nature).
*/

const LetterArt = ({ variant = 'A', strokeOffset, strokeOpacity }) => {
  // SVG-based letter treatments to evoke 3D through gradients, shadows, and texture
  const common = {
    x: '50%',
    y: '55%',
    dominantBaseline: 'middle',
    textAnchor: 'middle',
  };

  // Subtle shadow for pseudo-depth
  const Shadow = ({ children }) => (
    <g filter="url(#softShadow)">{children}</g>
  );

  return (
    <motion.svg
      width="70vw"
      height="28vh"
      viewBox="0 0 1000 300"
      className="mx-auto"
      style={{ opacity: strokeOpacity }}
    >
      <defs>
        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="rgba(0,0,0,0.35)" />
        </filter>
        {/* Chrome gradient for B */}
        <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5f7fa" />
          <stop offset="20%" stopColor="#d7dde8" />
          <stop offset="40%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#b8c6db" />
          <stop offset="80%" stopColor="#eef2f3" />
          <stop offset="100%" stopColor="#cfd9df" />
        </linearGradient>
        {/* Nature texture for D */}
        <pattern id="leafTex" patternUnits="userSpaceOnUse" width="60" height="60">
          <rect width="60" height="60" fill="#96e6a1" />
          <path d="M0 40 C20 30, 40 30, 60 40" stroke="#5bb381" strokeWidth="4" fill="none" />
          <path d="M0 20 C20 10, 40 10, 60 20" stroke="#5bb381" strokeWidth="3" fill="none" />
          <circle cx="15" cy="15" r="3" fill="#73c59e" />
          <circle cx="45" cy="45" r="3" fill="#73c59e" />
        </pattern>
        {/* Stroke gradient for animated outlines */}
        <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0.7)"/>
        </linearGradient>
      </defs>

      {variant === 'A' && (
        <Shadow>
          <motion.text
            {...common}
            fontFamily="'Pacifico', 'Brush Script MT', 'Mona Sans', cursive"
            fontSize="220"
            fill="url(#strokeGrad)"
            stroke="white"
            strokeWidth="1.2"
            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.65)', letterSpacing: '0.03em', strokeDasharray: '220 800', strokeDashoffset: strokeOffset }}
          >
            A
          </motion.text>
        </Shadow>
      )}

      {variant === 'B' && (
        <Shadow>
          <motion.text
            {...common}
            fontFamily="'Mona Sans', 'Inter', ui-sans-serif"
            fontSize="240"
            fontWeight="900"
            fill="url(#chromeGrad)"
            stroke="#eef2f3"
            strokeWidth="2"
            style={{ strokeDasharray: '240 800', strokeDashoffset: strokeOffset }}
          >
            B
          </motion.text>
        </Shadow>
      )}

      {variant === 'C' && (
        <g transform="translate(350,60)">
          {/* Pixel block C */}
          {[0,1,2,3,4].map((row) => (
            [0,1,2,3,4].map((col) => {
              const on = (
                (row === 0 && col < 4) ||
                (row === 1 && (col === 0)) ||
                (row === 2 && (col === 0)) ||
                (row === 3 && (col === 0)) ||
                (row === 4 && col < 4)
              );
              return (
                <motion.rect
                  key={`${row}-${col}`}
                  x={col * 60}
                  y={row * 60}
                  width="56"
                  height="56"
                  rx="6"
                  fill={on ? '#66e3ff' : 'transparent'}
                  stroke={on ? '#aaf1ff' : 'transparent'}
                  strokeWidth="2"
                  style={{ filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.35))' }}
                />
              );
            })
          ))}
          {/* Animated outline */}
          <motion.rect x="-20" y="-20" width="360" height="360" fill="transparent" stroke="url(#strokeGrad)" strokeWidth="4" rx="16" style={{ strokeDasharray: '180 600', strokeDashoffset: strokeOffset }} />
        </g>
      )}

      {variant === 'D' && (
        <Shadow>
          <motion.text
            {...common}
            fontFamily="'Mona Sans', 'Inter', ui-sans-serif"
            fontSize="240"
            fontWeight="900"
            fill="url(#leafTex)"
            stroke="#d1fadf"
            strokeWidth="2"
            style={{ strokeDasharray: '240 800', strokeDashoffset: strokeOffset }}
          >
            D
          </motion.text>
        </Shadow>
      )}
    </motion.svg>
  );
};

const BackgroundGrad = ({ variant = 'A' }) => {
  const classMap = {
    A: 'from-rose-400 via-pink-400 to-amber-300',
    B: 'from-indigo-600 via-blue-500 to-cyan-400',
    C: 'from-emerald-500 via-teal-400 to-lime-300',
    D: 'from-green-600 via-emerald-500 to-sky-400',
  };
  const g = classMap[variant] || classMap.A;
  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br ${g}`} />
      {/* Soft radial to add depth so the letter appears to float */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 [background:radial-gradient(60%_50%_at_50%_40%,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.04)_60%,transparent_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
    </>
  );
};

export default function ParallaxWorld({ index, title, subtitle, variant = 'A', splineScene }) {
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

  // Normalized progress: -1 (off right) -> 0 (center) -> 1 (off left)
  const progress = useTransform(offsetX, (v) => {
    const w = window.innerWidth || 1;
    return Math.max(-1, Math.min(1, v / (w * 0.5)));
  });

  // Subtle depth-of-field
  const heroScale = useTransform(progress, [-1, 0, 1], [0.94, 1, 0.94]);
  const heroRotateY = useTransform(progress, [-1, 0, 1], [10, 0, -10]);

  // Letter animation controls
  const strokeOffset = useTransform(progress, [-1, 0, 1], [200, 0, 200]);
  const strokeOpacity = useTransform(progress, [-1, 0, 1], [0.25, 1, 0.25]);

  const sceneUrl = splineScene || 'https://prod.spline.design/N8g2VNcx8Rycz93J/scene.splinecode';

  return (
    <section
      ref={containerRef}
      className="relative shrink-0 w-screen h-[100svh] overflow-hidden"
      aria-label={`${title} world`}
    >
      {/* Flat gradient background with subtle depth */}
      <BackgroundGrad variant={variant} />

      {/* Spline 3D element (centered). Keep overlays non-blocking. */}
      <motion.div
        style={{ scale: heroScale, rotateY: heroRotateY }}
        className="absolute inset-0"
      >
        <Spline scene={sceneUrl} style={{ width: '100%', height: '100%' }} />
      </motion.div>

      {/* Letter centerpiece styled per-world */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="text-center">
          <LetterArt variant={variant} strokeOffset={strokeOffset} strokeOpacity={strokeOpacity} />
          <p className="mt-2 text-white/95 text-base sm:text-lg font-medium">{subtitle}</p>
        </div>
      </div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
      </div>
    </section>
  );
}

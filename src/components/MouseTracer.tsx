import React, { useEffect, useState, useRef } from 'react';

export const MouseTracer: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [visible]);

  // Smooth lerp trailing follower
  useEffect(() => {
    const updateTrailing = () => {
      setTrailingPos((prev) => {
        const dx = pos.x - prev.x;
        const dy = pos.y - prev.y;
        return {
          x: prev.x + dx * 0.18,
          y: prev.y + dy * 0.18
        };
      });
      animFrameRef.current = requestAnimationFrame(updateTrailing);
    };

    animFrameRef.current = requestAnimationFrame(updateTrailing);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [pos]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {/* 1. Large Ambient Cyber Blue-Purple Flashlight / Spotlight */}
      <div
        className="absolute rounded-full transition-opacity duration-300 pointer-events-none -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-35"
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, rgba(99, 102, 241, 0.22) 35%, rgba(124, 58, 237, 0.15) 70%, transparent 100%)',
          willChange: 'transform, left, top'
        }}
      />

      {/* 2. Sleek Inner Tracer Ring */}
      <div
        className="absolute w-8 h-8 rounded-full border border-sky-400/60 shadow-[0_0_15px_rgba(56,189,248,0.5)] -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-75 ease-out"
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          willChange: 'left, top'
        }}
      />

      {/* 3. Sharp Pinpoint Center Dot */}
      <div
        className="absolute w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#38bdf8] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          willChange: 'left, top'
        }}
      />
    </div>
  );
};

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  colorType: 'cyan' | 'blue' | 'purple' | 'violet';
  color: string;
  glowColor: string;
  pulseSpeed: number;
  pulsePhase: number;
}

export const AtomicBondingBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse coordinates tracking for subtle interactive bonding
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 170,
      active: false
    };

    // Color palette matching dark cyber theme (Cyan, Electric Blue, Purple, Violet)
    const colorThemes = [
      {
        type: 'cyan' as const,
        color: 'rgba(6, 182, 212, ',
        glow: '#06b6d4'
      },
      {
        type: 'blue' as const,
        color: 'rgba(56, 189, 248, ',
        glow: '#38bdf8'
      },
      {
        type: 'purple' as const,
        color: 'rgba(168, 85, 247, ',
        glow: '#a855f7'
      },
      {
        type: 'violet' as const,
        color: 'rgba(139, 92, 246, ',
        glow: '#8b5cf6'
      }
    ];

    let particles: Particle[] = [];

    const calculateParticleCount = (w: number, h: number) => {
      const area = w * h;
      // Responsive particle density: ~75 particles on 1080p desktop, ~35 on mobile
      if (w < 640) return Math.min(36, Math.floor(area / 16000));
      if (w < 1024) return Math.min(55, Math.floor(area / 18000));
      return Math.min(85, Math.floor(area / 20000));
    };

    const initParticles = () => {
      const count = calculateParticleCount(width, height);
      particles = [];

      for (let i = 0; i < count; i++) {
        const theme = colorThemes[Math.floor(Math.random() * colorThemes.length)];
        const isNucleus = Math.random() < 0.18; // Some larger nucleus nodes
        const baseRadius = isNucleus ? Math.random() * 1.4 + 2.4 : Math.random() * 1.0 + 1.2;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.55,
          vy: (Math.random() - 0.5) * 0.55,
          radius: baseRadius,
          baseRadius,
          colorType: theme.type,
          color: theme.color,
          glowColor: theme.glow,
          pulseSpeed: Math.random() * 0.03 + 0.015,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Track mouse movement passively
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const maxConnectionDistance = 135;
    const maxMouseDistance = 165;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Update and draw connecting atomic bonds / matrix lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Connect with other particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDistance) {
            const factor = 1 - dist / maxConnectionDistance;
            const alpha = factor * factor * 0.35; // Smooth quadratic falloff

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            // Dynamic gradient bond line matching particle colors
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            gradient.addColorStop(0, `${p1.color}${alpha})`);
            gradient.addColorStop(1, `${p2.color}${alpha})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = factor > 0.6 ? 1.2 : 0.8;
            ctx.stroke();

            // Subtle energy packet traveling between close bonds
            if (dist < 55 && factor > 0.7) {
              const midX = (p1.x + p2.x) * 0.5;
              const midY = (p1.y + p2.y) * 0.5;
              ctx.beginPath();
              ctx.arc(midX, midY, 1, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${factor * 0.4})`;
              ctx.fill();
            }
          }
        }

        // Connect with cursor if in proximity
        if (mouse.active) {
          const mdx = p1.x - mouse.x;
          const mdy = p1.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < maxMouseDistance) {
            const mfactor = 1 - mdist / maxMouseDistance;
            const malpha = mfactor * 0.48;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);

            const mgradient = ctx.createLinearGradient(p1.x, p1.y, mouse.x, mouse.y);
            mgradient.addColorStop(0, `${p1.color}${malpha})`);
            mgradient.addColorStop(1, `rgba(56, 189, 248, ${malpha * 0.8})`);

            ctx.strokeStyle = mgradient;
            ctx.lineWidth = 1.1;
            ctx.stroke();

            // Subtle attraction toward cursor
            p1.x -= (mdx / mdist) * 0.25;
            p1.y -= (mdy / mdist) * 0.25;
          }
        }
      }

      // 2. Update and draw atomic nodes/particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries smoothly
        const padding = 20;
        if (p.x < -padding) p.x = width + padding;
        if (p.x > width + padding) p.x = -padding;
        if (p.y < -padding) p.y = height + padding;
        if (p.y > height + padding) p.y = -padding;

        // Atomic breathing/pulsing effect
        p.pulsePhase += p.pulseSpeed;
        const pulse = Math.sin(p.pulsePhase) * 0.35 + 1;
        const currentRadius = p.baseRadius * pulse;

        // Outer glow
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.glowColor;

        // Node center
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}0.85)`;
        ctx.fill();

        // High-energy core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        zIndex: 0,
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    />
  );
};

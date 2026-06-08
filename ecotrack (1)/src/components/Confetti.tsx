import { useEffect, useRef } from 'react';

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  shape: 'circle' | 'square';
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

const CONFETTI_COLORS = [
  '#10B981', // emerald-500
  '#34D399', // emerald-400
  '#059669', // emerald-600
  '#3B82F6', // blue-500
  '#60A5FA', // blue-400
  '#F59E0B', // amber-500
  '#FBBF24', // amber-400
  '#EC4899', // pink-500
  '#8B5CF6', // violet-500
];

export default function Confetti({ active, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      particlesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Spawn physics particles (from bottom-left and bottom-right bursting upward & inward)
    const spawnParticles = () => {
      const particles: Particle[] = [];
      const count = 160;

      // Left corner burst
      for (let i = 0; i < count / 2; i++) {
        particles.push({
          x: 0,
          y: window.innerHeight,
          size: Math.random() * 8 + 6,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          shape: Math.random() > 0.5 ? 'square' : 'circle',
          vx: Math.random() * 8 + 6, // shoots to the right
          vy: -(Math.random() * 15 + 12), // shoots upwards
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 10 - 5,
          opacity: 1,
        });
      }

      // Right corner burst
      for (let i = 0; i < count / 2; i++) {
        particles.push({
          x: window.innerWidth,
          y: window.innerHeight,
          size: Math.random() * 8 + 6,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          shape: Math.random() > 0.5 ? 'square' : 'circle',
          vx: -(Math.random() * 8 + 6), // shoots to the left
          vy: -(Math.random() * 15 + 12), // shoots upwards
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 10 - 5,
          opacity: 1,
        });
      }

      particlesRef.current = particles;
    };

    spawnParticles();
    startTime.current = Date.now();

    const animate = () => {
      const currentCanvas = canvasRef.current;
      if (!currentCanvas || !ctx) return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const elapsed = Date.now() - (startTime.current || 0);

      // Simple physics loop with gravity & air resistance
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.vx *= 0.98; // horizontal air resistance
        p.vy *= 0.98; // vertical terminal velocity helper
        p.rotation += p.rotationSpeed;

        // Start fading out after 2.5 seconds
        if (elapsed > 2000) {
          p.opacity = Math.max(0, 1 - (elapsed - 2000) / 1500);
        }
      });

      // Filter particles still visible and within bound
      particlesRef.current = particles.filter(
        (p) => p.opacity > 0 && p.y < h + 20 && p.x > -20 && p.x < w + 20
      );

      // Render remaining particles
      particlesRef.current.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, 2 * Math.PI);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }
        ctx.restore();
      });

      // If no particles remaining or elapsed > 3.5 seconds, trigger onComplete
      if (particlesRef.current.length === 0 || elapsed > 3500) {
        if (onComplete) onComplete();
      } else {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      id="confetti-canvas"
      className="fixed inset-0 pointer-events-none z-[100]"
      aria-hidden="true"
    />
  );
}

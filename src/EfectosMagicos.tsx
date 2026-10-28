import React, { useEffect, useRef } from 'react';

// === TIPOS DE PARTÍCULAS ===
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  color: string;
  rotation: number;
  vRot: number;
  type: 'star' | 'circle' | 'diamond' | 'petal';
}

// Global emitter event so any component can trigger a stardust burst
const BURST_EVENT = 'xv-magic-burst';

export const triggerStardustBurst = (x?: number, y?: number) => {
  const defaultX = window.innerWidth / 2;
  const defaultY = window.innerHeight / 2;
  window.dispatchEvent(
    new CustomEvent(BURST_EVENT, {
      detail: { x: x ?? defaultX, y: y ?? defaultY }
    })
  );
};

// === COMPONENTE 1: LIENZO DE RASTRO MÁGICO INTERACTIVO (SPARKLE TRAIL & BURST) ===
export const MagicSparkleTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const colors = [
      '#FFFDF0', // Oro brillante / blanco cálido
      '#F4E2A8', // Champán dorado
      '#E5C07B', // Oro pulido
      '#D0BCF2', // Lila suave
      '#EADBFC', // Lavanda cristalino
      '#B794E6', // Violeta orquídea
      '#FFFFFF'  // Diamante puro
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Función para crear una partícula
    const createParticle = (
      x: number,
      y: number,
      speedMultiplier = 1,
      forcedType?: 'star' | 'circle' | 'diamond' | 'petal'
    ): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 2.4 + 0.6) * speedMultiplier;
      const types: ('star' | 'circle' | 'diamond')[] = ['star', 'circle', 'diamond'];
      const type = forcedType || types[Math.floor(Math.random() * types.length)];
      const maxLife = Math.random() * 35 + 25;

      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.4, // sutil flotación hacia arriba
        size: Math.random() * (type === 'star' ? 10 : 5) + 3,
        alpha: 1,
        maxLife,
        life: maxLife,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.12,
        type
      };
    };

    // Dibujar estrella de 4 puntas centelleante
    const drawStar = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      alpha: number
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      c.globalAlpha = alpha;
      c.fillStyle = color;
      c.shadowBlur = 8;
      c.shadowColor = color;

      c.beginPath();
      const spikes = 4;
      const outerRadius = size;
      const innerRadius = size * 0.22;
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const a = (i * Math.PI) / spikes;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    // Dibujar diamante o círculo con resplandor
    const drawDiamond = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      alpha: number
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      c.globalAlpha = alpha;
      c.fillStyle = color;
      c.shadowBlur = 6;
      c.shadowColor = color;

      c.beginPath();
      c.moveTo(0, -size);
      c.lineTo(size * 0.7, 0);
      c.lineTo(0, size);
      c.lineTo(-size * 0.7, 0);
      c.closePath();
      c.fill();
      c.restore();
    };

    // Manejar evento de explosión festiva (al romper el sello de cera de la invitación)
    const onBurstEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number }>;
      const { x, y } = customEvent.detail;
      // Generar partículas con velocidad radial y destello
      for (let i = 0; i < 50; i++) {
        const p = createParticle(x, y, 2.2);
        p.maxLife = Math.random() * 40 + 30;
        p.life = p.maxLife;
        particles.push(p);
      }
    };

    window.addEventListener(BURST_EVENT, onBurstEvent);

    // Ciclo de animación
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life--;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // gravedad suave
        p.rotation += p.vRot;
        p.alpha = Math.max(0, p.life / p.maxLife);

        if (p.life <= 0 || p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        if (p.type === 'star') {
          drawStar(ctx, p.x, p.y, p.size, p.rotation, p.color, p.alpha);
        } else if (p.type === 'diamond') {
          drawDiamond(ctx, p.x, p.y, p.size, p.rotation, p.color, p.alpha);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener(BURST_EVENT, onBurstEvent);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60]"
      style={{ willChange: 'transform' }}
    />
  );
};

// === COMPONENTE 2: PÉTALOS DESACTIVADOS SEGÚN SOLICITUD ===
export const FloatingCelebrationPetals: React.FC = () => {
  return null;
};

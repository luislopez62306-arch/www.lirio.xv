import React, { useEffect, useRef } from 'react';

// === SINTETIZADOR DE AUDIO MÁGICO (WEB AUDIO API) ===
// Genera campanillas celestiales y arpa de hadas al interactuar con el sobre
export const playMagicChimeSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;

    // Arpegio pentatónico celestial: C6, E6, G6, B6, C7, E7
    const frequencies = [1046.5, 1318.51, 1567.98, 1975.53, 2093.0, 2637.02];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.065);

      // Armónico cristalino brillante
      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq * 2, now + idx * 0.065);

      gain.gain.setValueAtTime(0, now + idx * 0.065);
      gain.gain.linearRampToValueAtTime(0.16, now + idx * 0.065 + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.065 + 1.4);

      osc.connect(gain);
      oscHarmonic.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.065);
      oscHarmonic.start(now + idx * 0.065);
      osc.stop(now + idx * 0.065 + 1.45);
      oscHarmonic.stop(now + idx * 0.065 + 1.45);
    });
  } catch (err) {
    console.warn('Audio synth feedback no disponible:', err);
  }
};

// === INTERFAZ DE PARTÍCULAS DE CENTELLEO (SCINTILLATING CRYSTALS) ===
interface GlitterParticle {
  x: number;
  y: number;
  baseSize: number;
  phase: number;
  speed: number;
  maxAlpha: number;
  color: string;
  hasFlares: boolean;
  driftX: number;
  driftY: number;
}

interface LienzoGlitterVivoProps {
  pointerOffset: { x: number; y: number };
  className?: string;
}

export const LienzoGlitterVivo: React.FC<LienzoGlitterVivoProps> = ({ pointerOffset, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', onResize);

    // Paleta de destellos: diamantes puros, champán suave y lavanda luminosa
    const sparkleColors = [
      'rgba(255, 255, 255, 0.95)',
      'rgba(255, 250, 235, 0.95)',
      'rgba(247, 232, 195, 0.9)',
      'rgba(235, 215, 255, 0.92)',
      'rgba(220, 190, 255, 0.88)',
      'rgba(255, 240, 220, 0.85)'
    ];

    let particles: GlitterParticle[] = [];

    const initParticles = () => {
      // Cantidad reducida de destellos de estrellas animadas al fondo según solicitud
      const count = Math.min(32, Math.max(14, Math.floor((width * height) / 38000)));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseSize: Math.random() * 2.2 + 1.0,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.009 + 0.005,
          maxAlpha: Math.random() * 0.65 + 0.25,
          color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
          hasFlares: Math.random() > 0.72, // Menor proporción de estrellas con destellos
          driftX: (Math.random() - 0.5) * 0.03,
          driftY: (Math.random() - 0.5) * 0.03
        });
      }
    };

    initParticles();

    let waveTime = 0;

    const render = () => {
      // Ritmo pausado y relajante (movimiento suave y majestuoso)
      waveTime += 0.005;
      ctx.clearRect(0, 0, width, height);

      // 1. EFECTO ONDA DE SEDA Y MICA LÍQUIDA (Inspirado en IMG_3749)
      // Un haz oblicuo de luz nacarada que se desplaza orgánicamente a paso lento y elegante
      const sweepProgress = (Math.sin(waveTime * 0.45) + 1) / 2; // de 0 a 1 suave
      const sweepX = width * (0.15 + sweepProgress * 0.7) + pointerOffset.x * 0.5;
      const sweepY = height * (0.2 + sweepProgress * 0.6) + pointerOffset.y * 0.5;

      const micaGrad = ctx.createRadialGradient(
        sweepX,
        sweepY,
        width * 0.08,
        sweepX,
        sweepY,
        width * 0.65
      );
      micaGrad.addColorStop(0, 'rgba(245, 230, 255, 0.18)');
      micaGrad.addColorStop(0.35, 'rgba(220, 180, 255, 0.08)');
      micaGrad.addColorStop(0.7, 'rgba(190, 140, 240, 0.03)');
      micaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.fillStyle = micaGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 2. RAYOS VOLUMÉTRICOS DE LUZ MÁGICA (GOD RAYS) DIAGONALES SUTILES Y LENTOS
      const rayAngle = Math.PI / 3.8;
      const cosA = Math.cos(rayAngle);
      const sinA = Math.sin(rayAngle);
      const rayCount = 3;
      ctx.save();
      for (let r = 0; r < rayCount; r++) {
        const offset = ((waveTime * 8 + r * 160) % (width + height * 0.8)) - height * 0.4;
        const grad = ctx.createLinearGradient(
          offset,
          0,
          offset + cosA * height * 1.2,
          sinA * height * 1.2
        );
        grad.addColorStop(0, 'rgba(255, 245, 230, 0)');
        grad.addColorStop(0.5, 'rgba(240, 220, 255, 0.025)');
        grad.addColorStop(1, 'rgba(255, 245, 230, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(offset - 40, 0);
        ctx.lineTo(offset + 70, 0);
        ctx.lineTo(offset + 70 + cosA * height, height);
        ctx.lineTo(offset - 40 + cosA * height, height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 3. CENTELLEO VIVO DE CRISTALES Y POLVO DE DIAMANTES (CANTIDAD MODERADA)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.phase += p.speed;
        p.x += p.driftX;
        p.y += p.driftY;

        // Rebote o teletransporte suave en bordes
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Cálculo de brillo oscilante con picos de destello
        const rawSine = Math.sin(p.phase);
        // Exponenciación para que el destello sea agudo como diamante real
        const sparkleFactor = Math.pow(Math.max(0, rawSine), 3.8);
        const alpha = sparkleFactor * p.maxAlpha;

        if (alpha < 0.02) continue;

        const currentSize = p.baseSize * (0.8 + sparkleFactor * 1.4);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.globalAlpha = alpha;

        // Núcleo brillante
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, currentSize * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Destello de 4 puntas en cristales selectos (menos estrellas y más sutiles)
        if (p.hasFlares && sparkleFactor > 0.52) {
          const flareLen = currentSize * 2.8;
          const flareWidth = Math.max(0.65, currentSize * 0.22);

          ctx.strokeStyle = p.color;
          ctx.lineWidth = flareWidth;
          ctx.beginPath();
          // Eje horizontal
          ctx.moveTo(-flareLen, 0);
          ctx.lineTo(flareLen, 0);
          // Eje vertical
          ctx.moveTo(0, -flareLen);
          ctx.lineTo(0, flareLen);
          ctx.stroke();

          // Resplandor radial difuso
          ctx.beginPath();
          ctx.arc(0, 0, currentSize * 1.0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [pointerOffset]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ willChange: 'transform, opacity' }}
    />
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Church, Wine, MapPin, Shirt, Mail, Music, Pause, Heart, X, ZoomIn, Shuffle, CalendarPlus, Calendar, Sparkles } from 'lucide-react';
import { SeccionDeseos } from './SeccionDeseos.tsx';
import { ConfirmacionAsistencia } from './ConfirmacionAsistencia.tsx';
import { GeneradorPases } from './GeneradorPases.tsx';
import { MagicSparkleTrail, triggerStardustBurst } from './EfectosMagicos.tsx';
import { LienzoGlitterVivo, playMagicChimeSound } from './LienzoGlitterVivo.tsx';

// === TIPOGRAFÍAS ROMÁNTICAS Y ELEGANTES DISPONIBLES ===
export type FontThemeKey = 'parisienne' | 'alex_brush' | 'allura' | 'pinyon' | 'italianno';

export interface FontTheme {
  id: FontThemeKey;
  name: string;
  description: string;
  scriptClass: string;
  headingClass: string;
  quoteClass: string;
}

export const FONT_THEMES: Record<FontThemeKey, FontTheme> = {
  parisienne: {
    id: 'parisienne',
    name: 'Romance Parisino',
    description: 'Cursiva francesa fluida, romántica y con bucles armoniosos',
    scriptClass: "font-['Parisienne']",
    headingClass: "font-['Cinzel']",
    quoteClass: "font-['Cormorant_Garamond']"
  },
  alex_brush: {
    id: 'alex_brush',
    name: 'Caligrafía Real',
    description: 'Trazo caligráfico clásico, nítido y distinguido',
    scriptClass: "font-['Alex_Brush']",
    headingClass: "font-['Cinzel']",
    quoteClass: "font-['Cormorant_Garamond']"
  },
  allura: {
    id: 'allura',
    name: 'Romance Allura',
    description: 'Trazos suaves, soñadores y delicadamente entrelazados',
    scriptClass: "font-['Allura']",
    headingClass: "font-['Cinzel']",
    quoteClass: "font-['Cormorant_Garamond']"
  },
  pinyon: {
    id: 'pinyon',
    name: 'Manuscrito Imperial',
    description: 'Caligrafía victoriana aristocrática de época',
    scriptClass: "font-['Pinyon_Script']",
    headingClass: "font-['Cinzel']",
    quoteClass: "font-['Playfair_Display']"
  },
  italianno: {
    id: 'italianno',
    name: 'Romance Clásico',
    description: 'Elegancia lírica renacentista con trazo fluido',
    scriptClass: "font-['Italianno']",
    headingClass: "font-['Cinzel']",
    quoteClass: "font-['Cormorant_Garamond']"
  }
};

// === TIPOGRAFÍAS DISPONIBLES PARA EL SELLO DE CERA REALISTA ===
export type SealFontKey = 
  | 'pinyon' 
  | 'monsieur_la_doulaise' 
  | 'great_vibes' 
  | 'alex_brush' 
  | 'parisienne' 
  | 'playfair_italic' 
  | 'cinzel_decorative' 
  | 'cinzel';

export interface SealFontOption {
  id: SealFontKey;
  name: string;
  subtitle: string;
  fontClass: string;
  sampleLetter: string;
  opticalOffset?: string;
  sizeClass?: string;
}

export const SEAL_FONTS: Record<SealFontKey, SealFontOption> = {
  pinyon: {
    id: 'pinyon',
    name: 'Caligrafía Victoriana Imperial',
    subtitle: 'Trazo de pluma inglesa aristocrática con lazos fluidos',
    fontClass: "font-['Pinyon_Script']",
    sampleLetter: 'L',
    opticalOffset: 'translate-x-[2px] translate-y-[-2px]',
    sizeClass: 'text-5xl sm:text-6xl'
  },
  monsieur_la_doulaise: {
    id: 'monsieur_la_doulaise',
    name: 'Floritura Francesa Rococó',
    subtitle: 'Máxima ornamentación caligráfica con espirales barrocas',
    fontClass: "font-['Monsieur_La_Doulaise']",
    sampleLetter: 'L',
    opticalOffset: 'translate-x-[4px] translate-y-[-1px]',
    sizeClass: 'text-5xl sm:text-6xl'
  },
  great_vibes: {
    id: 'great_vibes',
    name: 'Caligrafía Poética Romántica',
    subtitle: 'Lazos fluidos y florituras románticas armónicas',
    fontClass: "font-['Great_Vibes']",
    sampleLetter: 'L',
    opticalOffset: 'translate-x-[2px] translate-y-[-2px]',
    sizeClass: 'text-5xl sm:text-6xl'
  },
  alex_brush: {
    id: 'alex_brush',
    name: 'Firma de Corte Real',
    subtitle: 'Trazos distinguidos de caligrafía palaciega',
    fontClass: "font-['Alex_Brush']",
    sampleLetter: 'L',
    opticalOffset: 'translate-y-[-1px]',
    sizeClass: 'text-4xl sm:text-5xl'
  },
  parisienne: {
    id: 'parisienne',
    name: 'Romance Parisino',
    subtitle: 'Cursiva francesa suave y romántica',
    fontClass: "font-['Parisienne']",
    sampleLetter: 'L',
    opticalOffset: 'translate-y-[-2px]',
    sizeClass: 'text-4xl sm:text-5xl'
  },
  playfair_italic: {
    id: 'playfair_italic',
    name: 'Editorial Alta Costura',
    subtitle: 'Serif itálica moderna con terminal de gota refinado',
    fontClass: "font-['Playfair_Display'] italic",
    sampleLetter: 'L',
    opticalOffset: 'translate-x-[-1px] translate-y-[-1px]',
    sizeClass: 'text-4xl sm:text-5xl'
  },
  cinzel_decorative: {
    id: 'cinzel_decorative',
    name: 'Monograma Real Ornamental',
    subtitle: 'Sello heráldico imperial con remates curvados',
    fontClass: "font-['Cinzel_Decorative']",
    sampleLetter: 'L',
    opticalOffset: 'translate-y-[-1px]',
    sizeClass: 'text-4xl sm:text-5xl'
  },
  cinzel: {
    id: 'cinzel',
    name: 'Romana Clásica Imperial',
    subtitle: 'Capitular tallada en relieve solemne',
    fontClass: "font-['Cinzel']",
    sampleLetter: 'L',
    opticalOffset: 'translate-y-[-0.5px]',
    sizeClass: 'text-4xl sm:text-5xl'
  }
};

// === CONSTANTES Y CONFIGURACIÓN ===
const TARGET_DATE = new Date('2026-12-18T17:00:00');
const WHATSAPP_NUMBER = "526681367714";

const heroImages = [
  "/gallery/IMG-3667.jpg",
  "/gallery/IMG-3665.jpg",
  "/gallery/IMG-3671.jpg",
  "/gallery/IMG-3664.jpg"
];

// Fotos mezcladas armónicamente para el mosaico de 2 columnas
const initialGalleryImages = [
  "/gallery/IMG-3661.jpg",
  "/gallery/IMG-3668.jpg",
  "/gallery/IMG-3667.jpg",
  "/gallery/IMG-3673.jpg",
  "/gallery/IMG-3665.jpg",
  "/gallery/IMG-3660.jpg",
  "/gallery/IMG-3671.jpg",
  "/gallery/IMG-3662.jpg",
  "/gallery/IMG-3663.jpg",
  "/gallery/IMG-3672.jpg",
  "/gallery/IMG-3664.jpg",
  "/gallery/IMG-3670.jpg"
];

// === COMPONENTE: SOBRE ANIMADO COMPLETO CON EFECTO GLITTER VIVO Y 3D ===
export type EstiloSobreKey = 'normal' | 'vellum' | 'clasico_nacar' | 'imperial';
export type ColorSello = 'rojo' | 'purpura' | 'marfil';
export type ModeloSello = 'lirio' | 'liston' | 'medallon' | 'clasico' | 'corona';

export const WAX_THEMES: Record<ColorSello, {
  name: string;
  buttonShadow: string;
  outerBg: string;
  outerHighlight: string;
  outerShadow: string;
  drop1Bg: string;
  drop2Bg: string;
  innerBg: string;
  innerShadow: string;
  ringBorderDark: string;
  ringBorderLight: string;
  letterGradient: string;
  letterDropShadow: string;
  letterTextShadow: string;
  subtextColor: string;
  subtextShadow: string;
  crownColor: string;
  crownStroke: string;
  crownDots: string;
  ribbonFrom: string;
  ribbonVia: string;
  ribbonTo: string;
}> = {
  rojo: {
    name: 'Lacre Rojo Borgoña',
    buttonShadow: 'drop-shadow(0 4px 6px rgba(40, 0, 10, 0.45)) drop-shadow(0 14px 26px rgba(25, 0, 5, 0.5))',
    outerBg: 'radial-gradient(circle at 35% 28%, #FF526B 0%, #D81636 22%, #9E0A24 52%, #630313 80%, #300108 100%)',
    outerHighlight: 'rgba(255, 175, 190, 0.65)',
    outerShadow: 'rgba(25, 0, 5, 0.8)',
    drop1Bg: '#A00D26',
    drop2Bg: '#54030F',
    innerBg: 'radial-gradient(circle at 45% 40%, #830B1E 0%, #54030F 65%, #280107 100%)',
    innerShadow: 'inset 3px 4px 7px rgba(18, 0, 4, 0.95), inset -2px -2px 4px rgba(255, 150, 165, 0.35), 0 1px 2px rgba(255, 255, 255, 0.25)',
    ringBorderDark: 'rgba(30, 0, 6, 0.65)',
    ringBorderLight: 'rgba(255, 170, 185, 0.35)',
    letterGradient: 'linear-gradient(145deg, #FFFFFF 0%, #FFCAD4 24%, #FF5570 52%, #BF122D 80%, #54030F 100%)',
    letterDropShadow: '1px 2px 2px rgba(20, 0, 5, 0.95)',
    letterTextShadow: '0 1px 2px rgba(255, 200, 215, 0.5)',
    subtextColor: '#FFCCD5',
    subtextShadow: 'rgba(18, 0, 4, 0.95)',
    crownColor: '#FF5570',
    crownStroke: '#2D0107',
    crownDots: '#FFFFFF',
    ribbonFrom: '#580814',
    ribbonVia: '#8B1424',
    ribbonTo: '#42040E'
  },
  purpura: {
    name: 'Lacre Púrpura Real',
    buttonShadow: 'drop-shadow(0 4px 6px rgba(25, 0, 35, 0.45)) drop-shadow(0 14px 26px rgba(18, 0, 25, 0.5))',
    outerBg: 'radial-gradient(circle at 35% 28%, #D988FF 0%, #9C27B0 22%, #681585 52%, #3E0654 80%, #1F012B 100%)',
    outerHighlight: 'rgba(240, 200, 255, 0.65)',
    outerShadow: 'rgba(18, 0, 28, 0.8)',
    drop1Bg: '#7A1A9C',
    drop2Bg: '#340447',
    innerBg: 'radial-gradient(circle at 45% 40%, #590F78 0%, #360549 65%, #180124 100%)',
    innerShadow: 'inset 3px 4px 7px rgba(12, 0, 18, 0.95), inset -2px -2px 4px rgba(225, 170, 255, 0.35), 0 1px 2px rgba(255, 255, 255, 0.25)',
    ringBorderDark: 'rgba(20, 0, 30, 0.65)',
    ringBorderLight: 'rgba(230, 180, 255, 0.35)',
    letterGradient: 'linear-gradient(145deg, #FFFFFF 0%, #EFCFFF 24%, #BA55D3 52%, #7B1FA2 80%, #38034D 100%)',
    letterDropShadow: '1px 2px 2px rgba(15, 0, 24, 0.95)',
    letterTextShadow: '0 1px 2px rgba(240, 210, 255, 0.5)',
    subtextColor: '#EBCBFF',
    subtextShadow: 'rgba(15, 0, 24, 0.95)',
    crownColor: '#BA55D3',
    crownStroke: '#20012E',
    crownDots: '#FFFFFF',
    ribbonFrom: '#38044D',
    ribbonVia: '#6A128B',
    ribbonTo: '#250233'
  },
  marfil: {
    name: 'Lacre Blanco Nácar',
    buttonShadow: 'drop-shadow(0 4px 6px rgba(30, 25, 20, 0.35)) drop-shadow(0 14px 26px rgba(20, 18, 14, 0.4))',
    outerBg: 'radial-gradient(circle at 35% 28%, #FFFFFF 0%, #F5F1EB 22%, #DFD6CA 52%, #B5A898 80%, #6E6252 100%)',
    outerHighlight: 'rgba(255, 255, 255, 0.85)',
    outerShadow: 'rgba(40, 35, 28, 0.65)',
    drop1Bg: '#C2B6A6',
    drop2Bg: '#7A6E5F',
    innerBg: 'radial-gradient(circle at 45% 40%, #D8CFC1 0%, #AEA18F 65%, #5F5445 100%)',
    innerShadow: 'inset 3px 4px 7px rgba(35, 30, 24, 0.9), inset -2px -2px 4px rgba(255, 255, 255, 0.7), 0 1px 2px rgba(255, 255, 255, 0.4)',
    ringBorderDark: 'rgba(50, 42, 33, 0.55)',
    ringBorderLight: 'rgba(255, 255, 255, 0.6)',
    letterGradient: 'linear-gradient(145deg, #FFFFFF 0%, #FAF8F5 24%, #D5CBBF 52%, #8C7F6E 80%, #443B30 100%)',
    letterDropShadow: '1px 2px 2px rgba(30, 25, 20, 0.8)',
    letterTextShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
    subtextColor: '#4A4033',
    subtextShadow: 'rgba(255, 255, 255, 0.8)',
    crownColor: '#E8E0D5',
    crownStroke: '#3C342A',
    crownDots: '#FFFFFF',
    ribbonFrom: '#9E907E',
    ribbonVia: '#C9BEB0',
    ribbonTo: '#7A6D5E'
  }
};

interface SobreAnimadoProps {
  onOpen: () => void;
  activeTheme: FontTheme;
  sealFontKey: SealFontKey;
}

export type TipoCierre = 'broche_joya' | 'sello_papel' | 'amatista' | 'hebilla_seda';

const SobreAnimado: React.FC<SobreAnimadoProps> = ({ onOpen, activeTheme, sealFontKey }) => {
  const activeSealFont = SEAL_FONTS[sealFontKey] || SEAL_FONTS.pinyon;
  const [estiloSobre, setEstiloSobre] = useState<EstiloSobreKey>('normal');
  const [tipoCierre, setTipoCierre] = useState<TipoCierre>('broche_joya');
  const [colorSello, setColorSello] = useState<ColorSello>('rojo');
  const [modeloSello, setModeloSello] = useState<ModeloSello>('lirio');
  const wax = WAX_THEMES[colorSello] || WAX_THEMES.rojo;
  // Fases de la experiencia:
  // 'cerrada' -> 'desatando' -> 'abriendo_solapa' -> 'carta_saliendo' -> 'desvanecer'
  const [fase, setFase] = useState<'cerrada' | 'desatando' | 'abriendo_solapa' | 'carta_saliendo' | 'desvanecer'>('cerrada');
  const [oculto, setOculto] = useState(false);
  const [shockwaveActive, setShockwaveActive] = useState(false);
  
  // Posición estable y centrada del fondo
  const magneticOffset = { x: 0, y: 0 };

  const abrirSobre = (e?: React.MouseEvent<HTMLElement>) => {
    if (fase === 'carta_saliendo') {
      // Si el usuario toca la carta tras abrirse, transicionar directamente
      setFase('desvanecer');
      setTimeout(() => setOculto(true), 700);
      return;
    }
    if (fase !== 'cerrada') return;

    // 1. Efecto sonoro de arpa celestial
    playMagicChimeSound();

    // 2. Onda expansiva dorada
    setShockwaveActive(true);

    // 3. Polvo de estrellas saliendo del broche
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      triggerStardustBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else {
      triggerStardustBurst();
    }

    // 4. Iniciar música de fondo
    onOpen();

    if (estiloSobre === 'normal') {
      // SOBRE NORMAL: Apertura directa y elegante sin espera de moño
      setFase('desatando');
      setTimeout(() => {
        setFase('abriendo_solapa');
      }, 180);

      setTimeout(() => {
        setFase('carta_saliendo');
        triggerStardustBurst();
      }, 950);

      setTimeout(() => {
        setFase('desvanecer');
      }, 5500);

      setTimeout(() => {
        setOculto(true);
      }, 6300);
    } else {
      // ESTILOS CON LISTÓN Y MOÑO: Desamarre y apertura
      setFase('desatando');
      setTimeout(() => {
        setFase('abriendo_solapa');
      }, 850);

      setTimeout(() => {
        setFase('carta_saliendo');
        triggerStardustBurst();
      }, 1850);

      setTimeout(() => {
        setFase('desvanecer');
      }, 5500);

      setTimeout(() => {
        setOculto(true);
      }, 6300);
    }
  };

  if (oculto) return null;

  const desatando = fase !== 'cerrada';
  const solapaAbierta = fase === 'abriendo_solapa' || fase === 'carta_saliendo' || fase === 'desvanecer';
  const cartaAfuera = fase === 'carta_saliendo' || fase === 'desvanecer';
  const desvaneciendo = fase === 'desvanecer';

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#462153] p-4 transition-all duration-800 overflow-hidden select-none ${
        desvaneciendo ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* ===== FONDO DE GLITTER CON MOVIMIENTO VIVO, ONDAS DE SEDA Y CRISTALES HD ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Capa 1: Base de glitter lila fino uniforme en movimiento diagonal continuo */}
        <div 
          className="absolute -inset-[20%] pointer-events-none animate-glitter-flow-1"
          style={{
            backgroundImage: 'url(/assets/aistudio/glitter_lila_fino.jpg)',
            backgroundRepeat: 'repeat',
            backgroundSize: '180px 180px',
            imageRendering: '-webkit-optimize-contrast',
            filter: 'contrast(1.18) brightness(0.98) saturate(1.15)',
            transform: `translate(${magneticOffset.x * 0.18}px, ${magneticOffset.y * 0.18}px)`,
            willChange: 'background-position, transform',
          }}
        />

        {/* Capa 2: Contracorriente de glitter con micro-centelleo vivo y refracción de luz */}
        <div 
          className="absolute -inset-[20%] pointer-events-none animate-glitter-flow-2 animate-glitter-scintillate mix-blend-screen opacity-75"
          style={{
            backgroundImage: 'url(/assets/aistudio/glitter_lila_fino.jpg)',
            backgroundRepeat: 'repeat',
            backgroundSize: '160px 160px',
            filter: 'contrast(1.25) brightness(1.2) saturate(1.2)',
            transform: `translate(${magneticOffset.x * -0.12}px, ${magneticOffset.y * -0.12}px)`,
            willChange: 'background-position, transform',
          }}
        />

        {/* Capa 3: Lienzo interactivo en tiempo real con ondas de seda de mica, centelleo de diamantes y rayos de luz */}
        <LienzoGlitterVivo pointerOffset={magneticOffset} />

        {/* Capa 4: Haz de luz elegante tipo Ojo de Gato (Cat-Eye Velvet) en continuo barrido */}
        <div 
          className="absolute -inset-[35%] animate-glitter-wave pointer-events-none mix-blend-screen"
          style={{
            transform: `translate(${magneticOffset.x * 0.9}px, ${magneticOffset.y * 0.9}px)`,
          }}
        >
          <div 
            className="w-full h-full"
            style={{
              background: `linear-gradient(
                125deg,
                transparent 15%,
                rgba(255, 255, 255, 0.02) 32%,
                rgba(235, 215, 255, 0.22) 46%,
                rgba(255, 250, 255, 0.45) 50%,
                rgba(235, 215, 255, 0.22) 54%,
                rgba(255, 255, 255, 0.02) 68%,
                transparent 85%
              )`,
              filter: 'blur(18px)',
            }}
          />
        </div>

        {/* Capa 5: Viñeta atmosférica suave para realzar la legibilidad manteniendo luminosidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#180520]/30 via-transparent to-[#100316]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(255,255,255,0.08)_0%,transparent_75%)] pointer-events-none" />
      </div>

      {/* ===== TÍTULO DE PORTADA: MIS QUINCE AÑOS ===== */}
      <div className={`text-center mb-4 sm:mb-6 max-w-2xl px-4 z-10 transition-all duration-700 ${
        solapaAbierta ? 'opacity-0 -translate-y-5 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}>
        <p className="font-['Cinzel'] text-xs sm:text-sm uppercase tracking-[0.38em] text-[#F3E5AB] font-extrabold leading-relaxed text-center">
          TIENES UNA INVITACIÓN
        </p>

        <div className="flex items-center justify-center gap-2 mt-1 mb-1.5 opacity-90">
          <div className="w-10 h-[1.5px] bg-[#F3E5AB]/80" />
          <span className="text-[#F3E5AB] text-xs font-bold">✦</span>
          <div className="w-10 h-[1.5px] bg-[#F3E5AB]/80" />
        </div>

        <h2 
          className="font-['Great_Vibes'] text-6xl sm:text-7xl md:text-8xl text-champagne-gold tracking-wide leading-tight my-1 select-none font-normal"
          style={{ 
            WebkitTextStroke: '0.65px #F5DFB5'
          }}
        >
          Mis Quince Años
        </h2>

        <p className="font-['Cinzel'] text-xs sm:text-sm text-[#F3E5AB]/90 tracking-[0.28em] uppercase font-bold mt-1">
          Lirio Quetzalli Herrera
        </p>
      </div>

      {/* ===== CONTENEDOR PRINCIPAL DEL SOBRE SELECCIONADO ===== */}
      <div 
        onClick={(e) => abrirSobre(e)}
        className={`relative w-full max-w-md sm:max-w-xl aspect-[16/11] rounded-2xl transition-all duration-700 select-none overflow-visible ${
          !cartaAfuera ? 'cursor-pointer' : ''
        }`}
        style={{ 
          perspective: '750px',
          perspectiveOrigin: '50% 32%',
          transformStyle: 'preserve-3d',
        }}
        title={estiloSobre === 'normal' ? "Toca el sobre o el sello para abrir" : (fase === 'cerrada' ? "Toca el moño para desatar y abrir" : (cartaAfuera ? "Toca para ver la invitación completa" : undefined))}
      >
        {/* Haz reflectante nácar perimetral */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-2">
          <div className="w-[180%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-envelope-sheen" />
        </div>

        {/* -------------------------------------------------------------------------------- */}
        {/* FONDO BASE DEL SOBRE SEGÚN EL ESTILO */}
        {/* -------------------------------------------------------------------------------- */}
        {estiloSobre === 'normal' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#EFE2CE] rounded-2xl overflow-hidden border-2 border-[#D4BA7A] shadow-2xl z-0">
            {/* Forro interior dorado champán de lujo visible al abrirse la solapa */}
            <div className="absolute inset-2 rounded-xl bg-gradient-to-b from-[#FAF0D8] via-[#E8D4A8] to-[#CCA258] overflow-hidden opacity-95">
              <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none">
                <defs>
                  <pattern id="envelopeGoldDamaskNormal" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M15,0 C18,7 23,12 30,15 C23,18 18,23 15,30 C12,23 7,18 0,15 C7,12 12,7 15,0 Z" fill="none" stroke="#8A5818" strokeWidth="0.75" />
                    <circle cx="15" cy="15" r="1.75" fill="#8A5818" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#envelopeGoldDamaskNormal)" />
              </svg>
            </div>
          </div>
        )}
        {estiloSobre === 'vellum' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#FBF8FE] via-[#F3E7FC] to-[#E8D4F8] rounded-2xl overflow-hidden border-2 border-[#D4BA7A] shadow-2xl z-0">
            <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
              <defs>
                <pattern id="baseDamaskVellum" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M14,0 C17,6 22,11 28,14 C22,17 17,22 14,28 C11,22 6,17 0,14 C6,11 11,6 14,0 Z" fill="none" stroke="#D4BA7A" strokeWidth="0.6" />
                  <circle cx="14" cy="14" r="1.5" fill="#C9A254" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#baseDamaskVellum)" />
            </svg>
            <div 
              className="absolute -inset-[15%] opacity-20 animate-glitter-flow-1 pointer-events-none mix-blend-multiply"
              style={{
                backgroundImage: 'url(/assets/aistudio/glitter_lila_fino.jpg)',
                backgroundRepeat: 'repeat',
                backgroundSize: '140px 140px',
              }}
            />
          </div>
        )}

        {estiloSobre === 'clasico_nacar' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9] via-[#FAF4EA] to-[#EFE2CE] rounded-2xl overflow-hidden border-2 border-[#D4BA7A] shadow-2xl z-0">
            {/* Forro interior dorado con patrón adamascado */}
            <div className="absolute inset-1.5 rounded-xl bg-gradient-to-b from-[#FBF3DE] via-[#EADBBD] to-[#CCA258] overflow-hidden opacity-95">
              <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none">
                <defs>
                  <pattern id="envelopeGoldDamaskNacar" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M15,0 C18,7 23,12 30,15 C23,18 18,23 15,30 C12,23 7,18 0,15 C7,12 12,7 15,0 Z" fill="none" stroke="#8A5818" strokeWidth="0.75" />
                    <circle cx="15" cy="15" r="1.75" fill="#8A5818" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#envelopeGoldDamaskNacar)" />
              </svg>
            </div>
          </div>
        )}

        {estiloSobre === 'imperial' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#3E1655] via-[#521E70] to-[#2E0B40] rounded-2xl overflow-hidden border-2 border-[#D4BA7A] shadow-2xl z-0">
            <div className="absolute inset-1.5 rounded-xl bg-gradient-to-b from-[#FBF3DE] via-[#EADBBD] to-[#CCA258] overflow-hidden opacity-95">
              <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none">
                <defs>
                  <pattern id="envelopeGoldDamaskImp" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M15,0 C18,7 23,12 30,15 C23,18 18,23 15,30 C12,23 7,18 0,15 C7,12 12,7 15,0 Z" fill="none" stroke="#8A5818" strokeWidth="0.75" />
                    <circle cx="15" cy="15" r="1.75" fill="#8A5818" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#envelopeGoldDamaskImp)" />
              </svg>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------------- */}
        {/* TARJETA DE INVITACIÓN REAL EN EL CENTRO */}
        {/* -------------------------------------------------------------------------------- */}
        <div 
          className={`absolute inset-x-3 sm:inset-x-5 top-3 bottom-3 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6FE] to-[#F3EAFB] border-2 border-[#D4BA7A] rounded-xl p-3 sm:p-5 flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-1000 ${
            cartaAfuera 
              ? (estiloSobre === 'vellum' 
                  ? 'scale-[1.05] shadow-2xl z-30' 
                  : '-translate-y-[48%] scale-[1.05] shadow-2xl z-35')
              : 'scale-100 z-5'
          }`}
          style={{
            transform: cartaAfuera 
              ? (estiloSobre === 'vellum' 
                  ? 'translateZ(30px) scale(1.05)' 
                  : 'translateY(-48%) translateZ(36px) scale(1.05)')
              : 'translateY(0px) translateZ(0px) scale(1)',
            transitionTimingFunction: 'cubic-bezier(0.18, 0.89, 0.32, 1.15)',
          }}
          onClick={cartaAfuera ? (e) => { e.stopPropagation(); abrirSobre(); } : undefined}
        >
          {/* Filete perimetral interior dorado con esquinas barrocas */}
          <div className="absolute inset-1.5 sm:inset-2 rounded-lg border border-[#D4BA7A]/60 pointer-events-none" />
          <div className="absolute top-1.5 left-2 text-[#C9A254] text-xs pointer-events-none opacity-80 select-none">✦</div>
          <div className="absolute top-1.5 right-2 text-[#C9A254] text-xs pointer-events-none opacity-80 select-none">✦</div>
          <div className="absolute bottom-1.5 left-2 text-[#C9A254] text-xs pointer-events-none opacity-80 select-none">✦</div>
          <div className="absolute bottom-1.5 right-2 text-[#C9A254] text-xs pointer-events-none opacity-80 select-none">✦</div>

          {/* Haz reflectante foil que recorre la tarjeta con brillo dorado sutil */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div 
              className="w-[200%] h-full bg-gradient-to-r from-transparent via-[#F3E5AB]/30 to-transparent animate-foil-sweep" 
              style={{ animationDuration: '9s', animationDelay: '0.5s' }}
            />
          </div>

          {/* Monograma real L en pan de oro con Pinyon Script */}
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#C9A254] flex items-center justify-center mb-1 text-[#B88E3E] relative z-10 bg-white/60 shadow-sm">
            <span 
              className="font-['Pinyon_Script'] text-2xl sm:text-3xl font-bold translate-x-[1px] translate-y-[-1px]"
              style={{ WebkitTextStroke: '0.45px #B88E3E' }}
            >
              L
            </span>
          </div>

          <p className="text-[9px] sm:text-xs uppercase tracking-[0.38em] text-[#B88E3E] font-bold mb-0.5 relative z-10">
            Invitación de Honor
          </p>

          <h3 
            className="font-['Great_Vibes'] text-3xl sm:text-5xl md:text-6xl text-[#3D145A] leading-tight mb-0.5 relative z-10 font-bold"
            style={{ 
              WebkitTextStroke: '0.45px #3D145A'
            }}
          >
            Lirio Quetzalli
          </h3>

          <p className="font-['Cinzel'] text-[10px] sm:text-xs text-[#8A5818] tracking-[0.3em] font-extrabold uppercase mb-0.5 relative z-10">
            Mis Quince Años
          </p>

          <p className="font-['Cinzel'] text-[10px] sm:text-xs text-[#3D145A] tracking-[0.22em] mb-1 font-bold relative z-10">
            18 DE DICIEMBRE · 2026
          </p>

          <div className="w-20 sm:w-28 h-[1px] bg-gradient-to-r from-transparent via-[#C9A254] to-transparent mb-1 relative z-10" />

          <p className="font-['Cormorant_Garamond'] italic text-[11px] sm:text-sm md:text-base text-[#3D145A] max-w-sm leading-relaxed font-semibold relative z-10">
            "Nos honrará profundamente contar con tu distinguida presencia."
          </p>
        </div>

        {/* -------------------------------------------------------------------------------- */}
        {/* CASO A: SOBRE VELLUM CRISTALINO (ALAS BATIENTES TRASLÚCIDAS 3D CON PROFUNDIDAD) */}
        {/* -------------------------------------------------------------------------------- */}
        {estiloSobre === 'vellum' && (
          <>
            {/* ALA IZQUIERDA DE PAPEL VELLUM */}
            <div 
              className="absolute top-0 left-0 w-[50.8%] h-full z-20 pointer-events-none rounded-l-2xl overflow-hidden"
              style={{ 
                transformOrigin: 'left center',
                transform: solapaAbierta 
                  ? 'rotateY(-135deg) translateZ(-26px) rotateZ(-2.5deg) scale(0.97)' 
                  : 'rotateY(0deg) translateZ(2px)',
                transformStyle: 'preserve-3d',
                transition: 'transform 1.05s cubic-bezier(0.22, 1.25, 0.36, 1), filter 1s ease',
                transitionDelay: solapaAbierta ? '0.12s' : '0s',
                filter: solapaAbierta 
                  ? 'drop-shadow(-10px 14px 22px rgba(0,0,0,0.35))' 
                  : 'drop-shadow(0 2px 6px rgba(0,0,0,0.1))',
              }}
            >
              <div className="absolute inset-0 bg-white/45 backdrop-blur-[2px] border-r border-[#D4BA7A]/70 flex items-center justify-center">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full opacity-85">
                  <defs>
                    <linearGradient id="vellumGoldStrokeMulti" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C9A254" />
                      <stop offset="50%" stopColor="#F5E3B8" />
                      <stop offset="100%" stopColor="#B88E3E" />
                    </linearGradient>
                  </defs>
                  <g stroke="url(#vellumGoldStrokeMulti)" fill="none" strokeWidth="0.7" opacity="0.9">
                    <path d="M 10,12 Q 35,18 70,14" />
                    <path d="M 25,15 Q 28,8 34,10 Q 30,16 25,15 Z" fill="#F8EED6" fillOpacity="0.5" />
                    <path d="M 45,16 Q 48,9 54,11 Q 50,17 45,16 Z" fill="#F8EED6" fillOpacity="0.5" />
                    <path d="M 62,15 Q 67,8 72,12 Q 68,17 62,15 Z" fill="#F8EED6" fillOpacity="0.5" />
                  </g>
                  <g stroke="url(#vellumGoldStrokeMulti)" fill="none" strokeWidth="0.7" opacity="0.9">
                    <path d="M 10,88 Q 35,82 70,86" />
                    <path d="M 25,85 Q 28,92 34,90 Q 30,84 25,85 Z" fill="#F8EED6" fillOpacity="0.5" />
                    <path d="M 45,84 Q 48,91 54,89 Q 50,83 45,84 Z" fill="#F8EED6" fillOpacity="0.5" />
                    <path d="M 62,85 Q 67,92 72,88 Q 68,83 62,85 Z" fill="#F8EED6" fillOpacity="0.5" />
                  </g>
                  <path d="M 4,4 L 96,4 L 96,96 L 4,96" stroke="url(#vellumGoldStrokeMulti)" strokeWidth="0.5" strokeDasharray="3,3" fill="none" opacity="0.6" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* ALA DERECHA DE PAPEL VELLUM */}
            <div 
              className="absolute top-0 right-0 w-[50.8%] h-full z-20 pointer-events-none rounded-r-2xl overflow-hidden"
              style={{ 
                transformOrigin: 'right center',
                transform: solapaAbierta 
                  ? 'rotateY(135deg) translateZ(-26px) rotateZ(2.5deg) scale(0.97)' 
                  : 'rotateY(0deg) translateZ(2px)',
                transformStyle: 'preserve-3d',
                transition: 'transform 1.05s cubic-bezier(0.22, 1.25, 0.36, 1), filter 1s ease',
                transitionDelay: solapaAbierta ? '0.12s' : '0s',
                filter: solapaAbierta 
                  ? 'drop-shadow(10px 14px 22px rgba(0,0,0,0.35))' 
                  : 'drop-shadow(0 2px 6px rgba(0,0,0,0.1))',
              }}
            >
              <div className="absolute inset-0 bg-white/45 backdrop-blur-[2px] border-l border-[#D4BA7A]/70 flex items-center justify-center">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full opacity-85">
                  <g stroke="url(#vellumGoldStrokeMulti)" fill="none" strokeWidth="0.7" opacity="0.9">
                    <path d="M 90,12 Q 65,18 30,14" />
                    <path d="M 75,15 Q 72,8 66,10 Q 70,16 75,15 Z" fill="#F8EED6" fillOpacity="0.5" />
                    <path d="M 55,16 Q 52,9 46,11 Q 50,17 55,16 Z" fill="#F8EED6" fillOpacity="0.5" />
                    <path d="M 38,15 Q 33,8 28,12 Q 32,17 38,15 Z" fill="#F8EED6" fillOpacity="0.5" />
                  </g>
                  <g stroke="url(#vellumGoldStrokeMulti)" fill="none" strokeWidth="0.7" opacity="0.9">
                    <path d="M 90,88 Q 65,82 30,86" />
                    <path d="M 75,85 Q 72,92 66,90 Q 70,84 75,85 Z" fill="#F8EED6" fillOpacity="0.5" />
                    <path d="M 55,84 Q 52,91 46,89 Q 50,83 55,84 Z" fill="#F8EED6" fillOpacity="0.5" />
                    <path d="M 38,85 Q 33,92 28,88 Q 32,83 38,85 Z" fill="#F8EED6" fillOpacity="0.5" />
                  </g>
                  <path d="M 96,4 L 4,4 L 4,96 L 96,96" stroke="url(#vellumGoldStrokeMulti)" strokeWidth="0.5" strokeDasharray="3,3" fill="none" opacity="0.6" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent pointer-events-none" />
              </div>
            </div>
          </>
        )}

        {/* -------------------------------------------------------------------------------- */}
        {/* CASO A: SOBRE NORMAL (BOLSILLO TRADICIONAL CON PLIEGUES REALES Y SOLAPA TRIANGULAR) */}
        {/* -------------------------------------------------------------------------------- */}
        {estiloSobre === 'normal' && (
          <>
            {/* BOLSILLO DELANTERO TRADICIONAL CON PLIEGUES ORIGAMI DE SOBRE CLÁSICO */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden z-20 pointer-events-none">
              <svg viewBox="0 0 100 68" preserveAspectRatio="none" className="w-full h-full drop-shadow-[0_-5px_10px_rgba(0,0,0,0.06)]">
                <defs>
                  <linearGradient id="pocketBaseNormal" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFDF9" />
                    <stop offset="60%" stopColor="#FAF4E8" />
                    <stop offset="100%" stopColor="#EFE3CF" />
                  </linearGradient>
                  <linearGradient id="pocketSideFlapLeft" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#F7EFE2" />
                    <stop offset="100%" stopColor="#ECE0CE" />
                  </linearGradient>
                  <linearGradient id="pocketSideFlapRight" x1="100%" y1="50%" x2="0%" y2="50%">
                    <stop offset="0%" stopColor="#F7EFE2" />
                    <stop offset="100%" stopColor="#ECE0CE" />
                  </linearGradient>
                  <filter id="pocketSeamShadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#8B6914" floodOpacity="0.22" />
                  </filter>
                </defs>

                {/* Solapa lateral izquierda doblada */}
                <path 
                  d="M 0,0 L 48,36 L 0,68 Z" 
                  fill="url(#pocketSideFlapLeft)" 
                  stroke="#D4BA7A" 
                  strokeWidth="0.5"
                />

                {/* Solapa lateral derecha doblada */}
                <path 
                  d="M 100,0 L 52,36 L 100,68 Z" 
                  fill="url(#pocketSideFlapRight)" 
                  stroke="#D4BA7A" 
                  strokeWidth="0.5"
                />

                {/* Solapa inferior plegada hacia arriba (Bolsillo principal del sobre clásico) */}
                <path 
                  d="M 0,68 L 50,30 L 100,68 Z" 
                  fill="url(#pocketBaseNormal)" 
                  stroke="#D4BA7A" 
                  strokeWidth="0.75"
                  filter="url(#pocketSeamShadow)"
                />

                {/* Pespunte dorado y grabado fino */}
                <path 
                  d="M 3,66 L 50,32 L 97,66" 
                  fill="none" 
                  stroke="#B88E3E" 
                  strokeWidth="0.35" 
                  strokeDasharray="1.5,1.5" 
                  opacity="0.8" 
                />
              </svg>
            </div>

            {/* SOLAPA TRIANGULAR SUPERIOR CON FÍSICA 3D Y BISAGRA EN RELIEVE */}
            <div 
              className="absolute top-0 inset-x-0 h-[56%] origin-top pointer-events-none"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: solapaAbierta 
                  ? 'rotateX(194deg) translateZ(-28px) translateY(-8px) scale(0.97)' 
                  : 'rotateX(0deg) translateZ(3px)',
                transition: 'transform 1.1s cubic-bezier(0.22, 1.25, 0.36, 1), filter 1s ease',
                filter: solapaAbierta 
                  ? 'drop-shadow(0 -16px 26px rgba(25, 8, 36, 0.55)) brightness(0.98)' 
                  : 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.18))',
                zIndex: solapaAbierta ? 2 : 28
              }}
            >
              {/* Hendido / Pliegue superior de la pestaña de papel */}
              <div className="absolute top-0 inset-x-0 h-[3.5px] bg-gradient-to-r from-transparent via-[#F3E5AB] to-transparent z-40 opacity-90 shadow-sm" />

              {/* Cara exterior de la solapa */}
              <div 
                className="absolute inset-0 overflow-hidden rounded-t-2xl"
                style={{ 
                  clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(180deg, #FFFDF9 0%, #FAF3E6 60%, #EFE0C9 100%)',
                  borderTop: '2.5px solid #D4BA7A',
                }}
              >
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                  <path d="M 0,0 L 50,100 L 100,0" fill="none" stroke="#D4BA7A" strokeWidth="1.5" />
                  <path d="M 4,0 L 50,92 L 96,0" fill="none" stroke="#B88E3E" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.8" />
                </svg>
              </div>

              {/* Cara interior de la solapa al abrirse */}
              <div 
                className="absolute inset-0 overflow-hidden rounded-t-2xl"
                style={{ 
                  clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                  transform: 'rotateX(180deg)',
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(180deg, #FBF3DE 0%, #EADBBD 50%, #CCA258 100%)',
                }}
              >
                <svg className="w-full h-full opacity-35">
                  <rect width="100%" height="100%" fill="url(#envelopeGoldDamaskNormal)" />
                  <path d="M 0,0 L 50,100 L 100,0" fill="none" stroke="#9A6B22" strokeWidth="1.5" />
                </svg>
              </div>
              {/* SELLO PEQUEÑO CON BORDE DORADO Y MONOGRAMA L */}
              <div 
                className="absolute left-1/2 bottom-0 z-50 pointer-events-auto"
                style={{
                  transform: 'translate(-50%, 50%) translateZ(4px)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    abrirSobre(e);
                  }}
                  className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full cursor-pointer group transition-transform duration-300 ease-out hover:scale-110 active:scale-95 transform-gpu focus:outline-none select-none flex items-center justify-center p-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #FDFBF7 40%, #F5EFE4 100%)',
                    border: '2px solid #D4AF37',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(60, 40, 10, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.95)',
                  }}
                  title="Toca el sello para abrir la invitación"
                >
                  {/* Aro concéntrico interior dorado fino */}
                  <div className="absolute inset-1 rounded-full border border-[#D4AF37]/50 pointer-events-none transition-colors duration-300 group-hover:border-[#D4AF37]/80" />

                  {/* Letra L dorada en el centro */}
                  <span 
                    className={`${activeSealFont.fontClass || "font-['Pinyon_Script']"} text-3xl sm:text-4xl font-bold leading-none select-none tracking-normal pt-0.5`}
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF3C4 20%, #F5CE68 45%, #D49826 70%, #99620E 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 1.5px 2px rgba(90, 60, 15, 0.45))',
                    }}
                  >
                    L
                  </span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* -------------------------------------------------------------------------------- */}
        {/* CASO B: SOBRE CLÁSICO APERLADO (SOLAPA TRIANGULAR 3D Y BOLSILLO) */}
        {/* -------------------------------------------------------------------------------- */}
        {estiloSobre === 'clasico_nacar' && (
          <>
            {/* BOLSILLO DELANTERO APERLADO */}
            <div className="absolute inset-x-0 bottom-0 h-[64%] rounded-b-2xl overflow-hidden z-20 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9] via-[#FAF4EA] to-[#EFE2CE] border-b-2 border-x-2 border-[#D4BA7A] shadow-inner">
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#C9A254] via-[#FFF9E6] to-[#C9A254]" />
                <div className="absolute bottom-2.5 inset-x-0 text-center text-[#8A5818]/70 text-[9px] font-['Cinzel'] tracking-[0.3em] uppercase">
                  XV AÑOS · LIRIO QUETZALLI
                </div>
              </div>
            </div>

            {/* SOLAPA TRIANGULAR SUPERIOR CON FÍSICA PRONUNCIADA DE PESTAÑA DE PAPEL */}
            <div 
              className="absolute top-0 inset-x-0 h-[56%] origin-top pointer-events-none"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: solapaAbierta 
                  ? 'rotateX(194deg) translateZ(-28px) translateY(-8px) scale(0.97)' 
                  : 'rotateX(0deg) translateZ(3px)',
                transition: 'transform 1.1s cubic-bezier(0.22, 1.25, 0.36, 1), filter 1s ease',
                filter: solapaAbierta 
                  ? 'drop-shadow(0 -16px 26px rgba(25, 8, 36, 0.55)) brightness(0.98)' 
                  : 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.18))',
                zIndex: solapaAbierta ? 2 : 28
              }}
            >
              {/* Hendido / Pliegue superior en relieve de la pestaña de papel */}
              <div className="absolute top-0 inset-x-0 h-[3.5px] bg-gradient-to-r from-transparent via-[#F3E5AB] to-transparent z-40 opacity-90 shadow-sm" />

              <div 
                className="absolute inset-0 overflow-hidden rounded-t-2xl"
                style={{ 
                  clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(180deg, #FFFDF9 0%, #FAF3E6 60%, #EFE0C9 100%)',
                  borderTop: '2.5px solid #D4BA7A',
                }}
              >
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                  <path d="M 0,0 L 50,100 L 100,0" fill="none" stroke="#D4BA7A" strokeWidth="1.5" />
                  <path d="M 4,0 L 50,92 L 96,0" fill="none" stroke="#B88E3E" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.8" />
                  <circle cx="50" cy="85" r="3" fill="#D4BA7A" />
                </svg>
              </div>
              <div 
                className="absolute inset-0 overflow-hidden rounded-t-2xl"
                style={{ 
                  clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                  transform: 'rotateX(180deg)',
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(180deg, #FBF3DE 0%, #EADBBD 50%, #CCA258 100%)',
                }}
              >
                <svg className="w-full h-full opacity-35">
                  <rect width="100%" height="100%" fill="url(#envelopeGoldDamaskNacar)" />
                  <path d="M 0,0 L 50,100 L 100,0" fill="none" stroke="#9A6B22" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </>
        )}

        {/* -------------------------------------------------------------------------------- */}
        {/* CASO C: SOBRE GALA IMPERIAL (POCKETFOLD VIOLETA REAL) */}
        {/* -------------------------------------------------------------------------------- */}
        {estiloSobre === 'imperial' && (
          <>
            <div className="absolute inset-x-0 bottom-0 h-[64%] rounded-b-2xl overflow-hidden z-20 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-b from-[#4C1C6C] via-[#5C2382] to-[#360D4E] border-b-2 border-x-2 border-[#D4BA7A] shadow-inner">
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#C9A254] via-[#FFF9E6] to-[#C9A254]" />
                <div className="absolute bottom-2.5 inset-x-0 text-center text-[#F3E5AB]/70 text-[9px] font-['Cinzel'] tracking-[0.3em] uppercase">
                  XV AÑOS · LIRIO QUETZALLI
                </div>
              </div>
            </div>

            {/* SOLAPA SUPERIOR CON FÍSICA PRONUNCIADA DE PESTAÑA DE PAPEL */}
            <div 
              className="absolute top-0 inset-x-0 h-[56%] origin-top pointer-events-none"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: solapaAbierta 
                  ? 'rotateX(194deg) translateZ(-28px) translateY(-8px) scale(0.97)' 
                  : 'rotateX(0deg) translateZ(3px)',
                transition: 'transform 1.1s cubic-bezier(0.22, 1.25, 0.36, 1), filter 1s ease',
                filter: solapaAbierta 
                  ? 'drop-shadow(0 -16px 26px rgba(25, 8, 36, 0.55)) brightness(0.98)' 
                  : 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.18))',
                zIndex: solapaAbierta ? 2 : 28
              }}
            >
              {/* Hendido / Pliegue superior en relieve de la pestaña de papel */}
              <div className="absolute top-0 inset-x-0 h-[3.5px] bg-gradient-to-r from-transparent via-[#F3E5AB] to-transparent z-40 opacity-90 shadow-sm" />

              <div 
                className="absolute inset-0 overflow-hidden rounded-t-2xl"
                style={{ 
                  clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(180deg, #44175E 0%, #572179 60%, #44175E 100%)',
                  borderTop: '2.5px solid #D4BA7A',
                }}
              >
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                  <path d="M 0,0 L 50,100 L 100,0" fill="none" stroke="#D4BA7A" strokeWidth="1.5" />
                  <path d="M 4,0 L 50,92 L 96,0" fill="none" stroke="#F5DFB5" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.8" />
                  <circle cx="50" cy="85" r="3" fill="#D4BA7A" />
                </svg>
              </div>
              <div 
                className="absolute inset-0 overflow-hidden rounded-t-2xl"
                style={{ 
                  clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                  transform: 'rotateX(180deg)',
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(180deg, #FBF3DE 0%, #EADBBD 50%, #CCA258 100%)',
                }}
              >
                <svg className="w-full h-full opacity-35">
                  <rect width="100%" height="100%" fill="url(#envelopeGoldDamaskImp)" />
                  <path d="M 0,0 L 50,100 L 100,0" fill="none" stroke="#9A6B22" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </>
        )}

        {/* -------------------------------------------------------------------------------- */}
        {/* LISTÓN DE SATÉN Y MOÑO DE GALA (SOLO PARA ESTILOS CON ENVOLTURA DE LAZO) */}
        {/* -------------------------------------------------------------------------------- */}
        {estiloSobre !== 'normal' && (
          <>
            {/* LISTÓN DE SATÉN HORIZONTAL IZQUIERDO */}
            <div 
              className="absolute top-1/2 left-0 w-1/2 h-11 sm:h-13 -translate-y-1/2 z-40 pointer-events-none origin-left overflow-hidden shadow-md"
              style={{
                transform: desatando ? 'translateX(-130%) translateY(35px) rotate(-10deg)' : 'translateX(0)',
                opacity: desatando ? 0 : 1,
                transition: 'transform 0.75s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.55s ease',
                background: 'linear-gradient(90deg, #9667C2 0%, #BA96E3 40%, #E3D1AC 80%, #D4BA7A 100%)',
                borderTop: '1.5px solid #F8ECC2',
                borderBottom: '1.5px solid #F8ECC2',
              }}
            >
              <div className="absolute inset-x-0 top-1 h-[0.75px] bg-[#FFFFFF]/75 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-1 h-[0.75px] bg-[#FFFFFF]/75 pointer-events-none" />
              <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-[#4A2508] text-[9px] sm:text-[10px] font-['Cinzel'] tracking-[0.25em] font-extrabold uppercase opacity-85 select-none">
                MIS XV AÑOS
              </div>
            </div>

            {/* LISTÓN DE SATÉN HORIZONTAL DERECHO */}
            <div 
              className="absolute top-1/2 right-0 w-1/2 h-11 sm:h-13 -translate-y-1/2 z-40 pointer-events-none origin-right overflow-hidden shadow-md"
              style={{
                transform: desatando ? 'translateX(130%) translateY(35px) rotate(10deg)' : 'translateX(0)',
                opacity: desatando ? 0 : 1,
                transition: 'transform 0.75s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.55s ease',
                background: 'linear-gradient(90deg, #D4BA7A 0%, #E3D1AC 20%, #BA96E3 60%, #9667C2 100%)',
                borderTop: '1.5px solid #F8ECC2',
                borderBottom: '1.5px solid #F8ECC2',
              }}
            >
              <div className="absolute inset-x-0 top-1 h-[0.75px] bg-[#FFFFFF]/75 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-1 h-[0.75px] bg-[#FFFFFF]/75 pointer-events-none" />
              <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-[#4A2508] text-[9px] sm:text-[10px] font-['Cinzel'] tracking-[0.25em] font-extrabold uppercase opacity-85 select-none">
                LIRIO Q. H.
              </div>
            </div>

            {/* MOÑO DE SATÉN REAL CON FÍSICA DE DESAMARRE VISIBLE */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-45 pointer-events-none flex items-center justify-center">
              {/* Onda expansiva de energía dorada */}
              {shockwaveActive && (
                <div className="absolute inset-0 -m-10 rounded-full border-2 border-[#F3E5AB] pointer-events-none animate-gold-shockwave" />
              )}

              {/* OREJA IZQUIERDA DEL MOÑO */}
              <div 
                className="absolute right-[50%] top-1/2 -translate-y-1/2 w-20 sm:w-28 h-14 sm:h-18 origin-right pointer-events-none"
                style={{
                  transform: desatando 
                    ? 'scaleX(0.08) scaleY(0.08) translate(-35px, -5px)' 
                    : 'translate(-4px, -2px) rotate(-4deg) scale(1)',
                  opacity: desatando ? 0 : 1,
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s 0.2s ease',
                }}
              >
                <svg viewBox="0 0 120 80" className="w-full h-full drop-shadow-md overflow-visible">
                  <defs>
                    <linearGradient id="satinLoopLeftGradEnvMulti" x1="100%" y1="50%" x2="0%" y2="50%">
                      <stop offset="0%" stopColor="#7E479F" />
                      <stop offset="30%" stopColor="#B389D9" />
                      <stop offset="65%" stopColor="#F5E8C7" />
                      <stop offset="85%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#A270C5" />
                    </linearGradient>
                    <linearGradient id="innerLoopShadowLeftGradEnvMulti" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#4A1E65" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#7E479F" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <path d="M 115,44 C 95,30 65,22 45,30 C 30,36 32,50 48,54 C 70,58 98,52 115,44 Z" fill="url(#innerLoopShadowLeftGradEnvMulti)" />
                  <path d="M 115,38 C 90,16 55,6 25,18 C 5,26 0,52 18,65 C 38,78 75,70 115,48 Z" fill="url(#satinLoopLeftGradEnvMulti)" stroke="#F8ECD1" strokeWidth="1" />
                  <path d="M 110,40 C 85,24 58,16 30,24 C 18,30 14,48 26,58 C 42,66 74,62 108,46" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.65" />
                </svg>
              </div>

              {/* OREJA DERECHA DEL MOÑO */}
              <div 
                className="absolute left-[50%] top-1/2 -translate-y-1/2 w-20 sm:w-28 h-14 sm:h-18 origin-left pointer-events-none"
                style={{
                  transform: desatando 
                    ? 'scaleX(0.08) scaleY(0.08) translate(35px, -5px)' 
                    : 'translate(4px, -2px) rotate(4deg) scale(1)',
                  opacity: desatando ? 0 : 1,
                  transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s 0.2s ease',
                }}
              >
                <svg viewBox="0 0 120 80" className="w-full h-full drop-shadow-md overflow-visible">
                  <defs>
                    <linearGradient id="satinLoopRightGradEnvMulti" x1="0%" y1="50%" x2="100%" y2="50%">
                      <stop offset="0%" stopColor="#7E479F" />
                      <stop offset="30%" stopColor="#B389D9" />
                      <stop offset="65%" stopColor="#F5E8C7" />
                      <stop offset="85%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#A270C5" />
                    </linearGradient>
                    <linearGradient id="innerLoopShadowRightGradEnvMulti" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4A1E65" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#7E479F" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <path d="M 5,44 C 25,30 55,22 75,30 C 90,36 88,50 72,54 C 50,58 22,52 5,44 Z" fill="url(#innerLoopShadowRightGradEnvMulti)" />
                  <path d="M 5,38 C 30,16 65,6 95,18 C 115,26 120,52 102,65 C 82,78 45,70 5,48 Z" fill="url(#satinLoopRightGradEnvMulti)" stroke="#F8ECD1" strokeWidth="1" />
                  <path d="M 10,40 C 35,24 62,16 90,24 C 102,30 106,48 94,58 C 78,66 46,62 12,46" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.65" />
                </svg>
              </div>

              {/* COLA IZQUIERDA DEL LISTÓN */}
              <div 
                className="absolute right-[50%] top-[40%] w-9 sm:w-12 h-20 sm:h-26 origin-top-right pointer-events-none"
                style={{
                  transform: desatando 
                    ? 'translate(-75px, 45px) rotate(-25deg) scale(0.85)' 
                    : 'translate(4px, 12px) rotate(-10deg) scale(1)',
                  opacity: desatando ? 0 : 1,
                  transition: 'transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.45s 0.2s ease',
                }}
              >
                <svg viewBox="0 0 60 120" className="w-full h-full drop-shadow-md overflow-visible">
                  <defs>
                    <linearGradient id="satinTailLeftGradEnvMulti" x1="30%" y1="0%" x2="70%" y2="100%">
                      <stop offset="0%" stopColor="#7E479F" />
                      <stop offset="25%" stopColor="#B389D9" />
                      <stop offset="55%" stopColor="#F5E8C7" />
                      <stop offset="85%" stopColor="#D4BA7A" />
                      <stop offset="100%" stopColor="#A270C5" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M 38,0 C 45,20 52,50 48,80 C 46,95 48,110 50,118 L 30,102 L 8,114 C 12,95 14,75 12,50 C 10,25 20,10 24,0 Z" 
                    fill="url(#satinTailLeftGradEnvMulti)" 
                    stroke="#F8ECD1" 
                    strokeWidth="0.8" 
                  />
                  <path d="M 30,5 C 36,35 38,65 34,95" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.6" />
                </svg>
              </div>

              {/* COLA DERECHA DEL LISTÓN (CUERDA QUE SE JALA) */}
              <div 
                className="absolute left-[50%] top-[40%] w-9 sm:w-12 h-22 sm:h-28 origin-top-left pointer-events-none"
                style={{
                  transform: desatando 
                    ? 'translate(95px, 35px) rotate(35deg) scale(0.9)' 
                    : 'translate(-4px, 12px) rotate(10deg) scale(1)',
                  opacity: desatando ? 0 : 1,
                  transition: 'transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.45s 0.2s ease',
                }}
              >
                <svg viewBox="0 0 60 120" className="w-full h-full drop-shadow-md overflow-visible">
                  <defs>
                    <linearGradient id="satinTailRightGradEnvMulti" x1="70%" y1="0%" x2="30%" y2="100%">
                      <stop offset="0%" stopColor="#7E479F" />
                      <stop offset="25%" stopColor="#B389D9" />
                      <stop offset="55%" stopColor="#F5E8C7" />
                      <stop offset="85%" stopColor="#D4BA7A" />
                      <stop offset="100%" stopColor="#A270C5" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M 22,0 C 15,20 8,50 12,80 C 14,95 12,110 10,118 L 30,102 L 52,114 C 48,95 46,75 48,50 C 50,25 40,10 36,0 Z" 
                    fill="url(#satinTailRightGradEnvMulti)" 
                    stroke="#F8ECD1" 
                    strokeWidth="0.8" 
                  />
                  <path d="M 30,5 C 24,35 22,65 26,95" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.6" />
                </svg>
              </div>

              {/* NUDO CENTRAL Y BROCHE JOYA CON MONOGRAMA L */}
              <div className="relative z-50 pointer-events-auto">
                <div 
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 sm:w-12 h-12 sm:h-14 rounded-lg bg-gradient-to-r from-[#6F398A] via-[#AF83D4] to-[#6F398A] border border-[#F3E5AB]/80 shadow-md transition-all duration-500 pointer-events-none ${
                    desatando ? 'opacity-0 scale-50' : 'opacity-100'
                  }`}
                />

                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    abrirSobre(e);
                  }}
                  disabled={desatando}
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#BA96E3] via-[#A073D4] to-[#7B46B5] border-[2.5px] border-[#D4BA7A] flex items-center justify-center cursor-pointer transition-all duration-500 hover:scale-110 active:scale-95 group overflow-hidden shadow-xl ${
                    desatando 
                      ? 'opacity-0 scale-135 -translate-y-8 rotate-15 pointer-events-none' 
                      : 'opacity-100'
                  }`}
                  title="Toca el moño para desatar y abrir la invitación"
                >
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="w-[180%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-foil-sweep" />
                  </div>

                  <div className="absolute inset-1.5 rounded-full border border-[#F3E5AB]/90 pointer-events-none" />
                  <div className="absolute inset-2.5 rounded-full border border-dashed border-[#F3E5AB]/50 pointer-events-none" />
                  
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <span 
                      className={`text-[#2D0B42] ${activeSealFont.fontClass} ${activeSealFont.opticalOffset || ''} ${activeSealFont.sizeClass || 'text-4xl sm:text-5xl'} font-bold select-none leading-none inline-flex items-center justify-center text-center`}
                      style={{ 
                        WebkitTextStroke: '0.65px #2D0B42'
                      }}
                    >
                      L
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>



      {/* Indicador sutil para invitar a tocar el sello cuando el sobre está cerrado */}
      {!desatando && (
        <div className="mt-5 text-center z-10 animate-fade-in pointer-events-none">
          <p className="font-['Cinzel'] text-xs sm:text-sm uppercase tracking-[0.25em] text-[#F3E5AB] font-medium flex items-center justify-center gap-2 drop-shadow-md">
            <Sparkles size={13} className="text-[#D3B272] animate-pulse" />
            <span>Toca el sello para abrir</span>
            <Sparkles size={13} className="text-[#D3B272] animate-pulse" />
          </p>
        </div>
      )}

      {/* Botón de acceso a la invitación una vez que el sobre se ha abierto */}
      {cartaAfuera && (
        <div className="mt-6 sm:mt-8 text-center transition-all duration-500 z-10">
          <button 
            type="button"
            onClick={(e) => abrirSobre(e)}
            className="px-7 py-3 rounded-full bg-gradient-to-r from-[#D4BA7A] via-[#FFF2CC] to-[#D4BA7A] text-[#3D145A] font-['Cinzel'] text-xs sm:text-sm tracking-[0.35em] font-extrabold uppercase hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-2xl inline-flex items-center gap-2 animate-bounce"
          >
            <span>ENTRAR A LA INVITACIÓN</span>
            <span>✦</span>
          </button>
        </div>
      )}
    </div>
  );
};

// === COMPONENTE: REPRODUCTOR FLOTANTE ===
interface MusicPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isPlaying, onTogglePlay }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button 
        type="button"
        onClick={onTogglePlay}
        aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        className="w-14 h-14 bg-[#F8F4FD] border border-[#D3B272] rounded-full shadow-2xl flex items-center justify-center text-[#4E216E] hover:scale-105 transition-transform cursor-pointer"
      >
        {isPlaying ? <Pause strokeWidth={1.5} /> : <Music strokeWidth={1.5} />}
      </button>
    </div>
  );
};

// === COMPONENTE: FLIP CARD 3D ===
interface FlipCardProps {
  frontIcon: React.ElementType;
  frontTitle: string;
  frontSubtitle: React.ReactNode;
  backContent: React.ReactNode;
}

const FlipCard: React.FC<FlipCardProps> = ({ frontIcon: Icon, frontTitle, frontSubtitle, backContent }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="w-full h-80 cursor-pointer group" 
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className="relative w-full h-full transition-transform duration-700 ease-in-out"
        style={{ 
          transformStyle: 'preserve-3d', 
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' 
        }}
      >
        {/* FRENTE: Blanco y Oro */}
        <div 
          className="absolute inset-0 w-full h-full flex flex-col justify-center items-center bg-[#F8F4FD] border border-[#D3B272]/50 rounded-2xl shadow-xl p-6"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div className="w-16 h-16 mb-6 flex items-center justify-center">
            <Icon size={40} className="text-[#4E216E]" strokeWidth={1} />
          </div>
          <h3 className="text-xs uppercase tracking-[0.25em] font-['Montserrat'] text-[#4E216E] mb-3 text-center">
            {frontTitle}
          </h3>
          <div className="text-[#4E216E] font-['Cormorant_Garamond'] text-center">
            {frontSubtitle}
          </div>
          <span className="absolute bottom-4 text-[10px] uppercase tracking-widest text-[#C2CAD0]">
            Toca para girar
          </span>
        </div>

        {/* REVERSO: Lilita oscuro y Blanco puro */}
        <div 
          className="absolute inset-0 w-full h-full flex flex-col justify-center items-center rounded-2xl shadow-xl p-6 text-center"
          style={{ 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: '#B89CE6', 
            color: '#FFFFFF' 
          }}
        >
          {backContent}
        </div>
      </div>
    </div>
  );
};

// === COMPONENTE: ANIMACIÓN AL SCROLL (REVELADO PROGRESIVO CON GIRO Y DESVANECIMIENTO 3D) ===
interface ScrollFadeSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  tilt?: 'left' | 'right' | 'subtle' | 'none';
}

const ScrollFadeSection: React.FC<ScrollFadeSectionProps> = ({ 
  children, 
  className = "", 
  delay = 0,
  tilt = 'subtle'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          if (domRef.current) {
            observer.unobserve(domRef.current);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    const currentElem = domRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
    };
  }, []);

  // Revelado progresivo suave y limpio sin inclinación al deslizar
  const getTransform = () => {
    if (!isVisible) {
      return 'translate3d(0, 24px, 0)';
    }
    return 'translate3d(0, 0, 0)';
  };

  return (
    <div
      ref={domRef}
      style={{
        transitionDuration: '1050ms',
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        transform: getTransform(),
        opacity: isVisible ? 1 : 0
      }}
      className={`transition-all will-change-transform w-full overflow-x-clip ${className}`}
    >
      {children}
    </div>
  );
};

// === COMPONENTE PRINCIPAL APP ===
export default function App() {
  const [fontThemeKey] = useState<FontThemeKey>(() => {
    try {
      const saved = localStorage.getItem('quince_font_theme') as FontThemeKey;
      if (saved && FONT_THEMES[saved]) return saved;
    } catch (e) {}
    return 'parisienne';
  });
  const [sealFontKey] = useState<SealFontKey>(() => {
    try {
      const saved = localStorage.getItem('quince_seal_font') as SealFontKey;
      if (saved === 'cinzel_decorative') {
        localStorage.setItem('quince_seal_font', 'pinyon');
        return 'pinyon';
      }
      if (saved && SEAL_FONTS[saved]) return saved;
    } catch (e) {}
    return 'pinyon';
  });
  const activeTheme = FONT_THEMES[fontThemeKey] || FONT_THEMES.parisienne;
  const activeSealFont = SEAL_FONTS[sealFontKey] || SEAL_FONTS.pinyon;

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = TARGET_DATE.getTime() - now.getTime();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
  const [isPassGeneratorOpen, setIsPassGeneratorOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>(initialGalleryImages);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Enlace directo a Google Calendar con todos los detalles del evento
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "XV Años · Lirio Quetzalli Herrera"
  )}&dates=20261218T170000/20261219T020000&details=${encodeURIComponent(
    "Celebración de los XV Años de Lirio Quetzalli Herrera.\n\n" +
    "• 5:00 P.M. - Ceremonia Religiosa: Parroquia Sagrado Corazón de Jesús (Av. Gral Alvaro Obregon 732, Los Mochis, Sinaloa)\n" +
    "• 8:00 P.M. - Recepción: El Tercer Piso (Aquiles Serdán #301 Int. 7C, Los Mochis, Sinaloa)\n\n" +
    "Código de Vestimenta: Formal (Favor de evitar morado, lila o lavanda).\n" +
    "Lluvia de sobres: Buzón en recepción.\n\n" +
    "¡Te esperamos con mucha alegría!"
  )}&location=${encodeURIComponent(
    "Sagrado Corazón de Jesús, Av. Gral Alvaro Obregon 732, Los Mochis, Sinaloa"
  )}`;

  // Descarga del archivo .ics para Apple Calendar (iPhone/iPad/Mac) y Outlook
  const downloadIcsFile = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//XV Años Lirio Quetzalli Herrera//ES",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VTIMEZONE",
      "TZID:America/Mazatlan",
      "BEGIN:STANDARD",
      "DTSTART:19700101T000000",
      "TZOFFSETFROM:-0700",
      "TZOFFSETTO:-0700",
      "TZNAME:MST",
      "END:STANDARD",
      "END:VTIMEZONE",
      "BEGIN:VEVENT",
      "UID:xv-lirio-quetzalli-20261218@invitacion",
      "SUMMARY:XV Años · Lirio Quetzalli Herrera",
      "DESCRIPTION:Celebración de los XV Años de Lirio Quetzalli Herrera.\\n\\n• 5:00 P.M. Ceremonia Religiosa: Parroquia Sagrado Corazón de Jesús (Av. Gral Alvaro Obregon 732)\\n• 8:00 P.M. Recepción: El Tercer Piso (Aquiles Serdán #301 Int. 7C)\\n\\nCódigo de Vestimenta: Formal (Favor de evitar morado, lila o lavanda).\\nLluvia de sobres: Buzón en recepción.",
      "LOCATION:Sagrado Corazón de Jesús, Av. Gral Alvaro Obregon 732, Los Mochis, Sinaloa",
      "DTSTART;TZID=America/Mazatlan:20261218T170000",
      "DTEND;TZID=America/Mazatlan:20261219T020000",
      "STATUS:CONFIRMED",
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "DESCRIPTION:Recordatorio: XV Años de Lirio Quetzalli Herrera mañana a las 5:00 PM",
      "ACTION:DISPLAY",
      "END:VALARM",
      "BEGIN:VALARM",
      "TRIGGER:-PT2H",
      "DESCRIPTION:Recordatorio: XV Años de Lirio Quetzalli Herrera en 2 horas",
      "ACTION:DISPLAY",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "XV_Lirio_Quetzalli_Herrera.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Reproducción prevenida:", err));
    }
  };

  const handleOpenEnvelope = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log("Audio bloqueado por el navegador:", e));
    }
  };

  const handleShufflePhotos = () => {
    setPhotos((prev) => {
      const array = [...prev];
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    });
  };

  // Detector de progreso de scroll para la barra dorada superior
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animación del Carrusel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Countdown Logic
  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Bloqueo de scroll y tecla Escape para Lightbox
  useEffect(() => {
    if (!lightboxImage) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxImage]);

  return (
    <div className="min-h-screen bg-[#F8F4FD] font-['Montserrat'] text-[#4E216E] selection:bg-[#D0BCF2] selection:text-white pb-20 relative overflow-x-hidden w-full">
      
      {/* LIENZO DE DESTELLOS PARA LA APERTURA DEL SELLO */}
      <MagicSparkleTrail />

      {/* BARRA DORADA DE PROGRESO DE SCROLL */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 h-[3.5px] sm:h-[4px] bg-black/10 backdrop-blur-xs pointer-events-none"
        aria-hidden="true"
      >
        <div 
          className="h-full bg-gradient-to-r from-[#C5A059] via-[#F3E5AB] to-[#D3B272] transition-[width] duration-150 ease-out shadow-[0_0_12px_rgba(211,178,114,0.85)] relative"
          style={{ width: `${scrollProgress}%` }}
        >
          {/* Pequeño destello brillante en la punta de la barra */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#FFF,0_0_14px_#D3B272] opacity-90" />
        </div>
      </div>

      {/* Importación de Fuentes */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Allura&family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Dancing+Script:wght@600;700&family=Great+Vibes&family=Italianno&family=Monsieur+La+Doulaise&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Parisienne&family=Pinyon+Script&family=Playball&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Satisfy&display=swap');
      `}} />

      {/* AUDIO GLOBAL */}
      <audio 
        ref={audioRef} 
        src="https://www.dropbox.com/scl/fi/avquv8gtoxqikzu29ehzw/beabadoobee-Beaches-Lyrics.mp3?rlkey=wbn6t1gvjw24qoggk2xv3hl1g&st=iqmju2r9&raw=1" 
        loop 
        preload="auto"
      />

      {/* 0. SOBRE ANIMADO INTERACTIVO DE ENTRADA */}
      <SobreAnimado 
        onOpen={handleOpenEnvelope} 
        activeTheme={activeTheme}
        sealFontKey={sealFontKey}
      />

      {/* REPRODUCTOR FLOTANTE */}
      <MusicPlayer isPlaying={isPlaying} onTogglePlay={toggleMusic} />

      {/* 1. HERO SECTION */}
      <header className="relative w-full min-h-[94vh] h-screen overflow-hidden bg-[#F8F4FD]">
        {heroImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt="XV Años Lirio Quetzalli"
            loading="eager"
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="sync"
            className={`absolute inset-0 w-full h-full object-cover object-[center_top] transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        ))}
        
        {/* Contenedor de títulos en la base sin sombreado */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end text-center px-4 z-10 pb-12 sm:pb-16 pt-24 pointer-events-none">
          <p className="font-['Cinzel'] text-white text-xs sm:text-sm uppercase tracking-[0.45em] mb-3 font-semibold">
            Mis XV Años
          </p>
          <h1 className="font-['Great_Vibes'] text-7xl sm:text-8xl md:text-9xl lg:text-[9.8rem] text-white leading-tight font-normal tracking-wide">
            Lirio Quetzalli<br/>Herrera
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-24">
        
        {/* 2. FRASE Y PADRES */}
        <ScrollFadeSection tilt="left">
          <section className="text-center space-y-12">
            <p className="font-['Cormorant_Garamond'] italic text-xl sm:text-2xl md:text-[1.65rem] leading-relaxed md:leading-loose text-[#4E216E] px-2 sm:px-6 md:px-10">
              "Amado Dios, en este día de mi quinceañera, quiero agradecerte por cada bendición que has derramado sobre mí. Te pido que me guíes en este nuevo capítulo de mi vida, que me des la fuerza para enfrentar los retos y la sabiduría para tomar decisiones que te honren. Que siempre pueda ser luz en la vida de quienes me rodean y que mi corazón esté lleno de amor y fe. Amén."
            </p>
            <div className="space-y-6">
              <p className="font-['Cinzel'] text-xs sm:text-sm uppercase tracking-[0.25em] text-[#4E216E]/85 font-medium">
                Con la bendición de Dios y el amor de mi madre:
              </p>
              <h4 className="font-['Great_Vibes'] text-4xl sm:text-5xl md:text-6xl text-[#4E216E] tracking-wide leading-snug">
                Emilia Herrera
              </h4>
              <div className="pt-4">
                <p className="font-['Cinzel'] text-xs sm:text-sm uppercase tracking-[0.25em] text-[#4E216E]/85 font-medium mb-2">
                  Padrinos:
                </p>
                <h4 className="font-['Great_Vibes'] text-3xl sm:text-4xl md:text-5xl text-[#4E216E] tracking-wide leading-snug">
                  Roman A. Corral &amp; Martha Karina Gil
                </h4>
              </div>
            </div>
          </section>
        </ScrollFadeSection>

        {/* 3. SEPARADOR VISUAL 1 */}
        <ScrollFadeSection tilt="right">
          <section className="w-full cursor-pointer group" onClick={() => setLightboxImage("/gallery/IMG-3662.jpg")}>
            <div className="relative overflow-hidden rounded-2xl">
              <img 
                src="/gallery/IMG-3662.jpg" 
                alt="Foto Sesión 1" 
                className="w-full h-auto object-contain rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-[1.01]"
                loading="lazy"
              />
              <div className="absolute bottom-3 right-3 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn size={16} />
              </div>
            </div>
          </section>
        </ScrollFadeSection>

        {/* 4. CUENTA REGRESIVA */}
        <ScrollFadeSection tilt="left">
          <section className="text-center">
            <h3 className="text-xs uppercase tracking-[0.3em] text-[#4E216E]/60 mb-10">
              Faltan
            </h3>
            <div className="flex justify-center items-center gap-6 md:gap-12">
              {[
                { label: 'DÍAS', value: timeLeft.days },
                { label: 'HRS', value: timeLeft.hours },
                { label: 'MIN', value: timeLeft.minutes },
                { label: 'SEG', value: timeLeft.seconds }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="font-['Cormorant_Garamond'] text-5xl md:text-7xl text-[#4E216E] leading-none mb-3">
                    {item.value.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] md:text-xs uppercase tracking-[0.2em] font-light text-[#4E216E]/60">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </ScrollFadeSection>

        {/* 5. SEPARADOR VISUAL 2 */}
        <ScrollFadeSection tilt="right">
          <section className="w-full cursor-pointer group" onClick={() => setLightboxImage("/gallery/IMG-3670.jpg")}>
            <div className="relative overflow-hidden rounded-2xl">
              <img 
                src="/gallery/IMG-3670.jpg" 
                alt="Foto Sesión 2" 
                className="w-full h-auto object-contain rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-[1.01]"
                loading="lazy"
              />
              <div className="absolute bottom-3 right-3 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn size={16} />
              </div>
            </div>
          </section>
        </ScrollFadeSection>

        {/* 6. UBICACIONES FLIP CARDS Y AGENDAR EVENTO */}
        <ScrollFadeSection tilt="left">
          <section className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FlipCard 
                frontIcon={Church}
                frontTitle="Ceremonia Religiosa"
                frontSubtitle={<span className="text-3xl md:text-4xl">5:00 P.M.</span>}
                backContent={
                  <>
                    <Church size={32} className="mb-4 opacity-90 text-white" strokeWidth={1} />
                    <h4 className="font-['Cormorant_Garamond'] text-2xl mb-2 text-white">Sagrado Corazón de Jesús</h4>
                    <p className="text-xs font-light tracking-wide mb-6 opacity-90 text-white">
                      Av. Gral Alvaro Obregon 732
                    </p>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Parroquia+Sagrado+Coraz%C3%B3n+de+Jes%C3%BAs%2C+Av.+Gral+Alvaro+Obregon+732%2C+Los+Mochis%2C+Sinaloa" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 border border-white px-6 py-2 rounded-full text-xs uppercase tracking-widest text-white hover:bg-white hover:text-[#B89CE6] transition-colors"
                    >
                      <MapPin size={14} /> Ver mapa
                    </a>
                  </>
                }
              />

              <FlipCard 
                frontIcon={Wine}
                frontTitle="Recepción"
                frontSubtitle={<span className="text-3xl md:text-4xl">8:00 P.M.</span>}
                backContent={
                  <>
                    <Wine size={32} className="mb-4 opacity-90 text-white" strokeWidth={1} />
                    <h4 className="font-['Cormorant_Garamond'] text-2xl mb-2 text-white">El Tercer Piso</h4>
                    <p className="text-xs font-light tracking-wide mb-6 opacity-90 text-white">
                      Aquiles Serdán #301 Int. 7C
                    </p>
                    <a 
                      href="https://maps.app.goo.gl/M3khCddMg6CPVHZu7" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 border border-white px-6 py-2 rounded-full text-xs uppercase tracking-widest text-white hover:bg-white hover:text-[#B89CE6] transition-colors"
                    >
                      <MapPin size={14} /> Ver mapa
                    </a>
                  </>
                }
              />
            </div>

            {/* BOTÓN AGENDAR EN MI CALENDARIO */}
            <div className="flex flex-col items-center justify-center pt-2">
              <button
                type="button"
                onClick={() => setIsCalendarModalOpen(true)}
                className="inline-flex items-center gap-3 bg-white/95 hover:bg-white text-[#4E216E] border-2 border-[#D3B272] hover:border-[#D3B272] px-7 py-3.5 rounded-full text-xs sm:text-sm uppercase tracking-[0.22em] font-medium shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer group"
                title="Agendar este evento en tu calendario"
              >
                <CalendarPlus size={18} className="text-[#D3B272] group-hover:scale-110 transition-transform" />
                <span>Agendar en mi calendario</span>
              </button>
              <p className="text-[11px] text-[#4E216E]/60 uppercase tracking-widest font-light mt-2.5">
                Google Calendar · Apple Calendar (iCal)
              </p>
            </div>
          </section>
        </ScrollFadeSection>

        {/* 7. SEPARADOR VISUAL 3 */}
        <ScrollFadeSection tilt="right">
          <section className="w-full cursor-pointer group" onClick={() => setLightboxImage("/gallery/IMG-3660.jpg")}>
            <div className="relative overflow-hidden rounded-2xl">
              <img 
                src="/gallery/IMG-3660.jpg" 
                alt="Foto Sesión 3" 
                className="w-full h-auto object-contain rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-[1.01]"
                loading="lazy"
              />
              <div className="absolute bottom-3 right-3 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn size={16} />
              </div>
            </div>
          </section>
        </ScrollFadeSection>

        {/* 8. DETALLES DE RECEPCIÓN: CÓDIGO DE VESTIMENTA Y LLUVIA DE SOBRES INDEPENDIENTES */}
        <ScrollFadeSection tilt="left">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tarjeta 1: Código de Vestimenta */}
            <FlipCard 
              frontIcon={Shirt}
              frontTitle="Código de Vestimenta"
              frontSubtitle={<span className="text-4xl md:text-5xl tracking-wide">FORMAL</span>}
              backContent={
                <div className="w-full flex flex-col items-center text-white px-2">
                  <Shirt size={32} className="mb-3 opacity-90 text-white" strokeWidth={1} />
                  <h4 className="font-['Cormorant_Garamond'] text-2xl mb-2 text-white">Vestimenta Formal</h4>
                  <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] opacity-80 mb-3 text-white">
                    Favor de evitar
                  </p>
                  <p className="font-['Cormorant_Garamond'] text-xl md:text-2xl leading-snug font-semibold text-white mb-2">
                    MORADO, LILA<br/>O LAVANDA
                  </p>
                  <p className="text-[11px] opacity-85 text-white/90 font-light mt-1">
                    Colores reservados para la Quinceañera
                  </p>
                </div>
              }
            />

            {/* Tarjeta 2: Lluvia de Sobres (Separada) */}
            <FlipCard 
              frontIcon={Mail}
              frontTitle="Muestra de Cariño"
              frontSubtitle={<span className="text-3xl md:text-4xl tracking-wide">LLUVIA DE SOBRES</span>}
              backContent={
                <div className="w-full flex flex-col items-center text-white px-3">
                  <Mail size={32} className="mb-3 opacity-90 text-white" strokeWidth={1} />
                  <h4 className="font-['Cormorant_Garamond'] text-2xl mb-2 text-white">Lluvia de Sobres</h4>
                  <p className="font-['Cormorant_Garamond'] italic text-base md:text-lg leading-relaxed text-white mb-4">
                    "Tu presencia y cariño son nuestro mejor regalo. Si deseas tener una atención con Lirio, dispondremos de un buzón especial en la recepción."
                  </p>
                  <span className="inline-block border border-white/70 px-4 py-1 rounded-full text-[10px] uppercase tracking-widest text-white">
                    Buzón en el Salón
                  </span>
                </div>
              }
            />
          </section>
        </ScrollFadeSection>

        {/* 9. GALERÍA MASONRY */}
        <ScrollFadeSection tilt="right">
          <section className="pt-4">
            <div className="flex flex-col items-center mb-8 text-center">
              <h3 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#4E216E] mb-2 font-semibold">
                Mis Momentos
              </h3>
              <p className="text-[11px] uppercase tracking-widest text-[#4E216E]/60 mb-4 font-light">
                Toca cualquier fotografía para verla en pantalla completa
              </p>
              <button
                type="button"
                onClick={handleShufflePhotos}
                className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-[#4E216E] border border-[#D0BCF2] hover:border-[#D3B272] px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium shadow-xs transition-all hover:shadow-md cursor-pointer active:scale-95"
                title="Mezclar y reorganizar las fotografías"
              >
                <Shuffle size={14} className="text-[#D3B272]" />
                <span>Mezclar fotos</span>
              </button>
            </div>

            <div className="columns-2 gap-4 space-y-4">
              {photos.map((src, index) => (
                <div 
                  key={`${src}-${index}`} 
                  className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl"
                  onClick={() => setLightboxImage(src)}
                >
                  <img 
                    src={src} 
                    alt={`Momentos ${index + 1}`} 
                    className="w-full h-auto object-contain rounded-xl shadow-md transition-transform duration-500 group-hover:scale-[1.03] group-hover:shadow-2xl"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center pointer-events-none">
                    <span className="bg-white/90 text-[#4E216E] p-2.5 rounded-full shadow-lg">
                      <ZoomIn size={18} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollFadeSection>

        {/* 10. SECCIÓN DE DESEOS PARA LA QUINCEAÑERA */}
        <ScrollFadeSection tilt="left">
          <SeccionDeseos whatsappNumber={WHATSAPP_NUMBER} />
        </ScrollFadeSection>

        {/* 11. FORMULARIO RSVP (CONFIRMACIÓN DE ASISTENCIA EXCLUSIVA) */}
        <ScrollFadeSection tilt="right">
          <ConfirmacionAsistencia whatsappNumber={WHATSAPP_NUMBER} />
        </ScrollFadeSection>

      </main>

      {/* PIE DE PÁGINA: FIRMA CON ACCESO OCULTO */}
      <footer className="w-full py-16 text-center border-t border-[#D0BCF2]/30 relative z-20 bg-gradient-to-b from-transparent to-[#F2EBFB]/60">
        <div className="max-w-xl mx-auto px-6 space-y-4">
          <p className="font-['Cormorant_Garamond'] italic text-2xl sm:text-3xl md:text-[2.35rem] leading-relaxed text-[#4E216E] tracking-wide">
            "Hay momentos que guardamos por siempre en el corazón, y este día será inolvidable gracias a ti."
          </p>

          <div className="pt-4 flex flex-col items-center">
            {/* ACCESO OCULTO AL GENERADOR DE PASES AL TOCAR EL NOMBRE */}
            <button
              type="button"
              onClick={() => setIsPassGeneratorOpen(true)}
              className="group inline-flex flex-col items-center cursor-pointer transition-all focus:outline-none select-none hover:scale-105 active:scale-95"
              title="Lirio Quetzalli"
              aria-label="Firma Lirio Quetzalli"
            >
              <span className="font-['Great_Vibes'] text-4xl sm:text-5xl text-[#4E216E] group-hover:text-[#D3B272] transition-colors">
                Lirio Quetzalli
              </span>
              <span className="font-['Cinzel'] text-[10px] uppercase tracking-[0.35em] text-[#4E216E]/50 group-hover:text-[#4E216E]/70 transition-colors mt-1 font-semibold">
                Mis XV Años · 2026
              </span>
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL DEL GENERADOR DE PASES (ACCESO PRIVADO) */}
      <GeneradorPases 
        isOpen={isPassGeneratorOpen} 
        onClose={() => setIsPassGeneratorOpen(false)} 
      />

      {/* MODAL PARA AGENDAR EN CALENDARIO (GOOGLE / APPLE) */}
      {isCalendarModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsCalendarModalOpen(false)}
        >
          <div 
            className="bg-[#F8F4FD] border-2 border-[#D3B272] rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsCalendarModalOpen(false)}
              className="absolute top-4 right-4 text-[#4E216E]/60 hover:text-[#4E216E] p-1.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Cerrar modal de calendario"
            >
              <X size={20} />
            </button>

            <div className="w-14 h-14 rounded-full bg-[#D0BCF2]/30 border-2 border-[#D3B272] flex items-center justify-center mx-auto mb-4 text-[#4E216E] shadow-sm">
              <CalendarPlus size={26} className="text-[#D3B272]" />
            </div>

            <h3 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-semibold text-[#4E216E] mb-1">
              Agendar en tu Calendario
            </h3>
            <p className="text-xs text-[#4E216E]/75 font-light mb-6 leading-relaxed">
              Elige tu aplicación preferida para guardar la fecha y recibir recordatorios automáticos del evento:
            </p>

            <div className="space-y-3">
              {/* Opción 1: Google Calendar */}
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsCalendarModalOpen(false)}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#F2EBFB] text-[#4E216E] border border-[#D0BCF2] hover:border-[#D3B272] py-3.5 px-4 rounded-xl font-medium text-xs sm:text-sm tracking-wider uppercase transition-all shadow-xs hover:shadow-md cursor-pointer group"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                </svg>
                <span>Google Calendar</span>
              </a>

              {/* Opción 2: Apple Calendar / iCal */}
              <button
                type="button"
                onClick={() => {
                  downloadIcsFile();
                  setIsCalendarModalOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#F2EBFB] text-[#4E216E] border border-[#D0BCF2] hover:border-[#D3B272] py-3.5 px-4 rounded-xl font-medium text-xs sm:text-sm tracking-wider uppercase transition-all shadow-xs hover:shadow-md cursor-pointer group"
              >
                <svg className="w-5 h-5 flex-shrink-0 fill-[#1C0B2B]" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.59-7.71-11.66-14-4.89-7.52-8.79-15.77-11.72-24.74-3.92-12.2-5.88-23.95-5.88-35.25 0-14.28 3.59-26.06 10.77-35.34 6.78-8.81 15.54-13.34 26.27-13.59 4.89 0 10.37 1.34 16.44 4.02 6.07 2.68 10.15 4.09 12.23 4.24 1.76-.15 5.96-1.63 12.61-4.45 6.64-2.82 12.21-4.09 16.71-3.81 12.78.78 22.84 5.39 30.17 13.84-11.16 6.74-16.63 16.09-16.42 28.05.21 9.4 3.86 17.15 10.95 23.25 4.48 3.85 9.49 6.6 15.03 8.26-2.3 6.9-5.14 13.78-8.52 20.64zM119.22 33.56c0-7.24 2.6-13.9 7.8-19.98 5.2-6.08 11.59-9.82 19.16-11.23.21 1.05.32 2.14.32 3.27 0 7.35-2.73 14.24-8.19 20.68-5.46 6.44-12.01 10.27-19.65 11.5-.1-.74-.15-1.52-.15-2.34l.71-1.9z" />
                </svg>
                <span>Apple Calendar / iCal</span>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-[#D0BCF2]/40 text-center">
              <p className="text-[10px] text-[#4E216E]/70 uppercase tracking-widest font-light">
                Viernes 18 Dic 2026 · 5:00 PM
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL PARA VER FOTOGRAFÍAS EN RESOLUCIÓN NATIVA 4K */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
            title="Cerrar vista completa"
          >
            <X size={24} />
          </button>

          <img
            src={lightboxImage}
            alt="Fotografía en Ultra Alta Resolución"
            className="max-w-full max-h-[94vh] object-contain rounded-xl shadow-2xl select-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  );
}

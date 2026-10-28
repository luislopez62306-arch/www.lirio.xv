import React, { useState } from 'react';

/**
 * GaleriaFotos.jsx
 * Componente exclusivo de Galería Editorial de alta costura para invitación de XV Años.
 *
 * Paleta de Colores:
 * - Lila Ensueño: #D0BCF2
 * - Violeta Profundo: #4E216E
 * - Blanco Orquídea: #F8F4FD
 * - Plata Destello: #C2CAD0
 * - Oro Champaña: #D3B272
 */

export const galleryImages = [
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

export default function GaleriaFotos({ images = galleryImages, title = "Mis Momentos", subtitle = "GALERÍA" }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const photoList = images && images.length > 0 ? images : galleryImages;

  const openLightbox = (index) => {
    setSelectedPhoto(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    if (selectedPhoto !== null) {
      setSelectedPhoto((selectedPhoto + 1) % photoList.length);
    }
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    if (selectedPhoto !== null) {
      setSelectedPhoto((selectedPhoto - 1 + photoList.length) % photoList.length);
    }
  };

  // Soporte de navegación por teclado (Escape, Flechas) y bloqueo de scroll
  React.useEffect(() => {
    if (selectedPhoto === null) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        setSelectedPhoto((prev) => (prev !== null ? (prev + 1) % photoList.length : null));
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhoto((prev) => (prev !== null ? (prev - 1 + photoList.length) % photoList.length : null));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPhoto, photoList.length]);

  return (
    <section className="bg-[#F8F4FD] py-20 px-4 sm:px-6 lg:px-8 w-full transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado Editorial */}
        <div className="text-center mb-12 md:mb-16">
          {subtitle && (
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.45em] text-[#D3B272] uppercase mb-2">
              {subtitle}
            </p>
          )}
          <h2 className="font-['Playfair_Display','Cormorant_Garamond',serif] text-3xl sm:text-4xl md:text-5xl font-medium text-[#4E216E] tracking-wide">
            {title}
          </h2>
          {/* Divisor sutil y elegante en Oro Champaña */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#D3B272]/70" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D3B272]" />
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#D3B272]/70" />
          </div>
        </div>

        {/* Cuadrícula Asimétrica Tipo Revista Editorial (Masonry / Grid Asimétrico) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[220px] sm:auto-rows-[260px] md:auto-rows-[290px]">
          {photoList.map((url, index) => {
            // Reglas de asimetría para layout editorial
            // La 1era foto es protagonista alta (row-span-2)
            // La 3era foto se expande horizontalmente en pantallas medianas/grandes
            // La 5ta foto agrega ritmo vertical
            let gridSpanClasses = 'col-span-1 row-span-1';

            if (index === 0) {
              // Foto 1: Editorial Portrait destacado
              gridSpanClasses = 'col-span-2 md:col-span-2 md:row-span-2';
            } else if (index === 1) {
              // Foto 2: Portrait vertical
              gridSpanClasses = 'col-span-1 row-span-1 md:row-span-2';
            } else if (index === 4) {
              // Foto 5: Editorial landscape o balance
              gridSpanClasses = 'col-span-2 md:col-span-1 row-span-1';
            } else if (index === 6) {
              // Foto 7: Final editorial destacado
              gridSpanClasses = 'col-span-2 md:col-span-2 row-span-1';
            }

            return (
              <div
                key={url + index}
                onClick={() => openLightbox(index)}
                className={`group relative overflow-hidden rounded-xl shadow-md border border-[#D0BCF2]/50 hover:border-[#D3B272] bg-[#F8F4FD] cursor-pointer transition-all duration-500 hover:shadow-xl ${gridSpanClasses}`}
              >
                <img
                  src={url}
                  alt={`Retrato editorial XV Años - Foto ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Overlay sutil de alta costura al interactuar */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#4E216E]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 md:p-5">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#F8F4FD]/90 font-light">
                      Momento {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#D3B272]/90 text-[#4E216E] font-medium tracking-wider shadow-sm">
                      Ver HD
                    </span>
                  </div>
                </div>

                {/* Borde fino decorativo interno */}
                <div className="pointer-events-none absolute inset-2 rounded-lg border border-white/0 group-hover:border-white/30 transition-colors duration-500" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Visor Lightbox HD Interactivo */}
      {selectedPhoto !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-[#4E216E]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
        >
          {/* Botón Cerrar */}
          <button
            onClick={closeLightbox}
            aria-label="Cerrar visor"
            className="absolute top-5 right-5 z-50 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors border border-white/20 backdrop-blur-sm cursor-pointer shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Botón Anterior */}
          <button
            onClick={prevPhoto}
            aria-label="Foto anterior"
            className="absolute left-3 sm:left-6 z-50 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors border border-white/20 backdrop-blur-sm cursor-pointer shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Contenedor de la Imagen Seleccionada */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-[#D3B272]/50 bg-black/40">
              <img
                src={photoList[selectedPhoto]}
                alt={`Fotografía ${selectedPhoto + 1} en alta resolución`}
                loading="lazy"
                decoding="async"
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-2xl transition-transform duration-300"
              />
            </div>

            {/* Contador de Fotos */}
            <div className="mt-4 px-4 py-1.5 rounded-full bg-black/50 text-[#F8F4FD] text-xs tracking-[0.25em] uppercase font-light border border-white/15 backdrop-blur-sm">
              {selectedPhoto + 1} / {photoList.length}
            </div>
          </div>

          {/* Botón Siguiente */}
          <button
            onClick={nextPhoto}
            aria-label="Siguiente foto"
            className="absolute right-3 sm:right-6 z-50 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors border border-white/20 backdrop-blur-sm cursor-pointer shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}

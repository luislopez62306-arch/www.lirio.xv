import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Send, Quote, Check, MessageSquareHeart, Search, Filter } from 'lucide-react';
import { triggerStardustBurst } from './EfectosMagicos.tsx';
import { playMagicChimeSound } from './LienzoGlitterVivo.tsx';

export interface Wish {
  id: string;
  author: string;
  relation: string;
  message: string;
  date: string;
  icon: string;
  likes: number;
  fromRsvp?: boolean;
  attendance?: 'yes' | 'no';
  timestamp?: number;
}

// Sin dedicatorias predeterminadas: Solo aparecerán las dedicatorias reales que escriban los invitados
const INITIAL_WISHES: Wish[] = [];

const EMOJI_OPTIONS = [
  { emoji: '💖', label: 'Con Amor' },
  { emoji: '✨', label: 'Luz y Magia' },
  { emoji: '🌸', label: 'Bendición' },
  { emoji: '👑', label: 'Princesa' },
  { emoji: '🥂', label: 'Felicidades' },
];

interface SeccionDeseosProps {
  whatsappNumber: string;
}

type FilterCategory = 'todos' | 'familia' | 'amigos' | 'rsvp';

export const SeccionDeseos: React.FC<SeccionDeseosProps> = ({ whatsappNumber }) => {
  const [wishes, setWishes] = useState<Wish[]>(() => {
    try {
      // Limpiar versiones viejas con ejemplos de prueba
      localStorage.removeItem('lirio_xv_wishes_v1');

      const stored = localStorage.getItem('lirio_xv_wishes_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Error al cargar deseos de localStorage", e);
    }
    return INITIAL_WISHES;
  });

  const [author, setAuthor] = useState('');
  const [relation, setRelation] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💖');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('lirio_xv_liked_map');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  // Cargar dedicatorias reales del servidor (/api/wishes)
  const fetchWishesFromServer = async () => {
    try {
      const response = await fetch('/api/wishes');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.wishes)) {
          setWishes(data.wishes);
          localStorage.setItem('lirio_xv_wishes_v2', JSON.stringify(data.wishes));
        }
      }
    } catch (err) {
      console.warn('Servidor local no disponible, usando almacenamiento local:', err);
    }
  };

  useEffect(() => {
    fetchWishesFromServer();

    // Sondeo periódico cada 12 segundos para que los nuevos mensajes aparezcan automáticamente
    const interval = setInterval(fetchWishesFromServer, 12000);

    // Escuchar eventos en vivo emitidos desde la confirmación RSVP
    const handleNewWishEvent = (e: CustomEvent<Wish>) => {
      if (e.detail) {
        setWishes(prev => {
          if (prev.some(w => w.id === e.detail.id)) return prev;
          const updated = [e.detail, ...prev];
          localStorage.setItem('lirio_xv_wishes_v2', JSON.stringify(updated));
          return updated;
        });
        setActiveFilter('todos');
      }
    };

    window.addEventListener('xv-wish-added' as any, handleNewWishEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener('xv-wish-added' as any, handleNewWishEvent);
    };
  }, []);

  // Guardar mapa de likes
  useEffect(() => {
    try {
      localStorage.setItem('lirio_xv_liked_map', JSON.stringify(likedMap));
    } catch (e) {}
  }, [likedMap]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const newWishPayload = {
      author: author.trim(),
      relation: relation.trim() || 'Invitado(a)',
      message: message.trim(),
      icon: selectedEmoji,
      fromRsvp: false
    };

    try {
      // Guardar en backend
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWishPayload)
      });

      let savedWish: Wish;
      if (res.ok) {
        const data = await res.json();
        savedWish = data.wish;
        if (Array.isArray(data.wishes)) {
          setWishes(data.wishes);
          localStorage.setItem('lirio_xv_wishes_v2', JSON.stringify(data.wishes));
        } else {
          setWishes(prev => [savedWish, ...prev]);
        }
      } else {
        throw new Error('Error al guardar en API');
      }
    } catch (err) {
      console.warn('Fallback guardando dedicatoria en local:', err);
      const fallbackWish: Wish = {
        id: Date.now().toString(),
        author: author.trim(),
        relation: relation.trim() || 'Invitado(a)',
        message: message.trim(),
        date: 'Hoy',
        icon: selectedEmoji,
        likes: 1,
        fromRsvp: false
      };
      setWishes(prev => {
        const updated = [fallbackWish, ...prev];
        localStorage.setItem('lirio_xv_wishes_v2', JSON.stringify(updated));
        return updated;
      });
    } finally {
      setIsSubmitting(false);
      setShowSuccessToast(true);

      // Efecto mágico de celebración
      try {
        const btnRect = (e.target as HTMLElement).getBoundingClientRect();
        triggerStardustBurst(btnRect.left + btnRect.width / 2, btnRect.top);
        playMagicChimeSound();
      } catch (effErr) {}

      // Limpiar formulario
      setAuthor('');
      setRelation('');
      setMessage('');
      setSelectedEmoji('💖');

      setTimeout(() => {
        setShowSuccessToast(false);
      }, 5000);
    }
  };

  const handleLike = async (id: string) => {
    if (likedMap[id]) return;

    // Optimista local
    setLikedMap(prev => ({ ...prev, [id]: true }));
    setWishes(prev =>
      prev.map(item => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
    );

    try {
      await fetch(`/api/wishes/${id}/like`, { method: 'POST' });
    } catch (e) {
      console.warn("No se pudo sincronizar like con el servidor:", e);
    }
  };

  const sendDirectWhatsApp = () => {
    if (!message.trim() && !author.trim()) return;
    const text = `¡Hola Lirio! Te dejo esta dedicatoria de XV Años con mucho cariño:%0A"${encodeURIComponent(message.trim())}"%0A— Con amor: ${encodeURIComponent(author.trim()) || 'Un invitado'}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const firstInput = formRef.current.querySelector('input');
      if (firstInput) firstInput.focus();
    }
  };

  // Filtrado de deseos
  const filteredWishes = wishes.filter(w => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAuthor = w.author.toLowerCase().includes(q);
      const matchRelation = (w.relation || '').toLowerCase().includes(q);
      const matchMsg = w.message.toLowerCase().includes(q);
      if (!matchAuthor && !matchRelation && !matchMsg) return false;
    }

    if (activeFilter === 'todos') return true;
    if (activeFilter === 'familia') {
      const rel = (w.relation || '').toLowerCase();
      return rel.includes('mamá') || rel.includes('papá') || rel.includes('herman') || rel.includes('abuel') || rel.includes('tí') || rel.includes('prim') || rel.includes('familia') || rel.includes('padrin');
    }
    if (activeFilter === 'amigos') {
      const rel = (w.relation || '').toLowerCase();
      return rel.includes('amig') || rel.includes('compañer');
    }
    if (activeFilter === 'rsvp') {
      return Boolean(w.fromRsvp);
    }
    return true;
  });

  return (
    <section id="dedicatorias" className="pt-16 pb-14 border-t border-[#D0BCF2]/40 relative scroll-mt-10">
      {/* Encabezado de la sección */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#D0BCF2]/30 text-[#4E216E] mb-4 shadow-sm border border-[#D3B272]/50">
          <MessageSquareHeart size={26} className="text-[#4E216E]" strokeWidth={1.5} />
        </div>
        <p className="font-['Cinzel'] text-xs uppercase tracking-[0.3em] text-[#4E216E]/70 font-semibold mb-2">
          Libro de Dedicatorias &amp; Recuerdos
        </p>
        <h3 className="font-['Playfair_Display'] text-3xl md:text-5xl text-[#4E216E] mb-3 font-semibold">
          Deseos para la Quinceañera
        </h3>
        <p className="font-['Cormorant_Garamond'] italic text-base md:text-xl text-[#4E216E]/85 max-w-xl mx-auto px-4 leading-relaxed">
          Todos los mensajes y bendiciones que escribas quedan guardados con honor en esta invitación para que Lirio los conserve para siempre.
        </p>

        {/* Contador dinámico de dedicatorias */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D3B272]/15 border border-[#D3B272]/40 text-[#4E216E] text-xs font-semibold">
          <Sparkles size={14} className="text-[#D3B272]" />
          <span>
            {wishes.length === 0
              ? 'El libro de dedicatorias está abierto ✨'
              : `${wishes.length} dedicatoria${wishes.length === 1 ? '' : 's'} publicada${wishes.length === 1 ? '' : 's'} con amor`}
          </span>
        </div>
      </div>

      {/* Formulario de Dedicatoria */}
      <div 
        ref={formRef}
        className="max-w-xl mx-auto bg-white/85 backdrop-blur-md border border-[#D3B272]/50 rounded-3xl p-6 md:p-8 shadow-xl mb-12 relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D0BCF2]/30 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-5 border-b border-[#D0BCF2]/30 pb-3">
          <h4 className="text-xs uppercase tracking-[0.25em] text-[#4E216E] font-bold flex items-center gap-2">
            <Sparkles size={16} className="text-[#D3B272]" /> Escribe tu dedicatoria
          </h4>
          <span className="text-[11px] text-[#4E216E]/60 italic font-['Cormorant_Garamond']">
            Se mostrará públicamente en la invitación
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#4E216E]/80 mb-1 font-medium">
                Tu Nombre y Apellido *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Tía Marcela, Familia Ruiz..."
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full bg-[#F8F4FD] border border-[#D0BCF2]/70 rounded-xl px-3.5 py-2.5 text-sm font-light text-[#4E216E] placeholder:text-[#4E216E]/40 focus:outline-none focus:border-[#4E216E] focus:ring-1 focus:ring-[#4E216E] transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#4E216E]/80 mb-1 font-medium">
                Parentesco o Vínculo (opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Familia, Amiga, Padrino..."
                value={relation}
                onChange={e => setRelation(e.target.value)}
                className="w-full bg-[#F8F4FD] border border-[#D0BCF2]/70 rounded-xl px-3.5 py-2.5 text-sm font-light text-[#4E216E] placeholder:text-[#4E216E]/40 focus:outline-none focus:border-[#4E216E] focus:ring-1 focus:ring-[#4E216E] transition-all"
              />
            </div>
          </div>

          {/* Selector de Sello de Cariño */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#4E216E]/80 mb-1.5 font-medium">
              Elige un sello de cariño:
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map(opt => (
                <button
                  key={opt.emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(opt.emoji)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer border ${
                    selectedEmoji === opt.emoji
                      ? 'bg-[#4E216E] text-white border-[#4E216E] shadow-md scale-105'
                      : 'bg-[#F8F4FD] text-[#4E216E] border-[#D0BCF2]/50 hover:bg-[#D0BCF2]/30'
                  }`}
                >
                  <span>{opt.emoji}</span>
                  <span className="font-light">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mensaje */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#4E216E]/80 mb-1 font-medium">
              Tu dedicatoria o mensaje para Lirio Quetzalli *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Escribe tus palabras de bendición, recuerdos o buenos deseos..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full bg-[#F8F4FD] border border-[#D0BCF2]/70 rounded-xl px-3.5 py-2.5 text-sm font-light text-[#4E216E] placeholder:text-[#4E216E]/40 focus:outline-none focus:border-[#4E216E] transition-all resize-none"
            ></textarea>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-[#4E216E] to-[#631f8f] hover:from-[#3d1858] hover:to-[#4E216E] text-white py-3.5 px-6 rounded-full text-xs uppercase tracking-[0.2em] font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Sparkles size={15} className="text-[#D3B272]" />
              <span>{isSubmitting ? 'Publicando...' : 'Publicar en la Invitación'}</span>
            </button>

            {message.trim() && author.trim() && (
              <button
                type="button"
                onClick={sendDirectWhatsApp}
                className="inline-flex items-center justify-center gap-2 border border-[#25D366] text-[#128C7E] bg-[#25D366]/10 hover:bg-[#25D366]/20 py-3.5 px-5 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer font-medium"
                title="También enviar mensaje por WhatsApp"
              >
                <Send size={14} />
                <span>WhatsApp</span>
              </button>
            )}
          </div>
        </form>

        {/* Notificación de éxito */}
        {showSuccessToast && (
          <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center gap-2.5 animate-fade-in shadow-sm">
            <Check size={18} className="text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold block">¡Dedicatoria publicada con éxito!</span>
              <span className="text-emerald-700">Tus hermosas palabras ya forman parte de la invitación de Lirio.</span>
            </div>
          </div>
        )}
      </div>

      {/* Muro o Estado Vacío */}
      <div className="max-w-4xl mx-auto px-4">
        {wishes.length === 0 ? (
          /* Estado cuando aún no hay dedicatorias escritas */
          <div className="bg-white/80 backdrop-blur-md border border-[#D3B272]/50 rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-md space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-[#D0BCF2]/25 border border-[#D3B272]/60 flex items-center justify-center mx-auto text-2xl shadow-xs">
              💌
            </div>
            <h4 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-[#4E216E]">
              El libro de recuerdos está listo
            </h4>
            <p className="font-['Cormorant_Garamond'] italic text-base sm:text-lg text-[#4E216E]/85 max-w-sm mx-auto leading-relaxed">
              Aún no hay dedicatorias publicadas. ¡Sé el primero en dejarle tus palabras de bendición y cariño a Lirio Quetzalli!
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 bg-[#4E216E] hover:bg-[#3d1858] text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Sparkles size={14} className="text-[#D3B272]" />
                <span>Escribir la primera dedicatoria</span>
              </button>
            </div>
          </div>
        ) : (
          /* Lista y filtros de dedicatorias reales */
          <div className="space-y-6">
            {/* Barra de Filtros y Búsqueda */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Pestañas de categoría */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-white/70 backdrop-blur-sm border border-[#D0BCF2]/50 rounded-2xl shadow-xs">
                <button
                  type="button"
                  onClick={() => setActiveFilter('todos')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeFilter === 'todos'
                      ? 'bg-[#4E216E] text-white shadow-xs'
                      : 'text-[#4E216E]/70 hover:text-[#4E216E] hover:bg-black/5'
                  }`}
                >
                  Todos ({wishes.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('familia')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeFilter === 'familia'
                      ? 'bg-[#4E216E] text-white shadow-xs'
                      : 'text-[#4E216E]/70 hover:text-[#4E216E] hover:bg-black/5'
                  }`}
                >
                  Familia &amp; Padrinos
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('amigos')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeFilter === 'amigos'
                      ? 'bg-[#4E216E] text-white shadow-xs'
                      : 'text-[#4E216E]/70 hover:text-[#4E216E] hover:bg-black/5'
                  }`}
                >
                  Amistades
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('rsvp')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeFilter === 'rsvp'
                      ? 'bg-[#4E216E] text-white shadow-xs'
                      : 'text-[#4E216E]/70 hover:text-[#4E216E] hover:bg-black/5'
                  }`}
                >
                  Confirmaciones ✨
                </button>
              </div>

              {/* Buscador */}
              <div className="relative w-full sm:w-64">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E216E]/50" />
                <input
                  type="text"
                  placeholder="Buscar en dedicatorias..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white/70 border border-[#D0BCF2]/60 rounded-xl text-xs text-[#4E216E] placeholder:text-[#4E216E]/40 focus:outline-none focus:border-[#4E216E] transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#4E216E]/50 hover:text-[#4E216E]"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {filteredWishes.length === 0 ? (
              <div className="bg-white/60 border border-[#D0BCF2]/40 rounded-2xl p-8 text-center max-w-md mx-auto">
                <p className="text-sm text-[#4E216E]/70 mb-3">
                  No se encontraron dedicatorias con este filtro.
                </p>
                <button
                  type="button"
                  onClick={() => { setActiveFilter('todos'); setSearchQuery(''); }}
                  className="text-xs uppercase tracking-widest text-[#4E216E] font-semibold underline underline-offset-2"
                >
                  Ver todas las dedicatorias
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredWishes.map(wish => {
                  const isLiked = likedMap[wish.id];
                  return (
                    <div
                      key={wish.id}
                      className="bg-white/85 backdrop-blur-sm border border-[#D0BCF2]/60 hover:border-[#D3B272] rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group relative overflow-hidden"
                    >
                      {/* Comilla sutil de fondo */}
                      <Quote
                        size={48}
                        className="absolute right-3 top-3 text-[#D0BCF2]/15 pointer-events-none group-hover:text-[#D3B272]/20 transition-colors"
                      />

                      <div>
                        {/* Encabezado del deseo */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-full bg-[#F8F4FD] border border-[#D3B272]/50 flex items-center justify-center text-lg shadow-2xs shrink-0">
                              {wish.icon || '💖'}
                            </span>
                            <div>
                              <h5 className="font-['Cormorant_Garamond'] text-xl font-bold text-[#4E216E] leading-tight">
                                {wish.author}
                              </h5>
                              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                <span className="inline-block text-[10px] uppercase tracking-wider text-[#4E216E]/75 bg-[#D0BCF2]/30 px-2 py-0.5 rounded-full font-medium">
                                  {wish.relation || 'Invitado(a)'}
                                </span>
                                {wish.fromRsvp && (
                                  <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-[#8B6E32] bg-[#D3B272]/20 px-2 py-0.5 rounded-full font-semibold">
                                    <Sparkles size={10} /> Confirmó RSVP
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] text-[#4E216E]/50 uppercase tracking-wider font-light shrink-0">
                            {wish.date}
                          </span>
                        </div>

                        {/* Mensaje de dedicatoria */}
                        <p className="font-['Cormorant_Garamond'] italic text-base sm:text-lg leading-relaxed text-[#4E216E]/90 my-3 pl-1">
                          "{wish.message}"
                        </p>
                      </div>

                      {/* Pie de la tarjeta */}
                      <div className="pt-3 mt-2 border-t border-[#F8F4FD] flex items-center justify-between text-xs">
                        <span className="text-[10px] tracking-wide text-[#8B6E32] flex items-center gap-1 font-semibold">
                          <Sparkles size={12} className="text-[#D3B272]" /> Para Lirio Quetzalli
                        </span>

                        <button
                          type="button"
                          onClick={() => handleLike(wish.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${
                            isLiked
                              ? 'text-pink-600 bg-pink-50 scale-105 border border-pink-200'
                              : 'text-[#4E216E]/70 hover:text-pink-600 hover:bg-pink-50/60 border border-transparent'
                          }`}
                          title="Dar amor a este mensaje"
                        >
                          <Heart
                            size={14}
                            className={isLiked ? 'fill-pink-500 text-pink-500' : ''}
                            strokeWidth={1.5}
                          />
                          <span className="text-xs font-semibold">{wish.likes}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Botón para invitar a escribir más dedicatorias */}
            <div className="text-center mt-8">
              <button
                type="button"
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 hover:bg-white text-[#4E216E] border border-[#D3B272] text-xs uppercase tracking-widest font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <Sparkles size={14} className="text-[#D3B272]" />
                <span>Escribir otra dedicatoria para Lirio</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SeccionDeseos;

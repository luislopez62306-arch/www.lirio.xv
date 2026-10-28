import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Send, Quote, Check, MessageSquareHeart } from 'lucide-react';

export interface Wish {
  id: string;
  author: string;
  relation: string;
  message: string;
  date: string;
  icon: string;
  likes: number;
}

const INITIAL_WISHES: Wish[] = [
  {
    id: '1',
    author: 'Emilia Herrera',
    relation: 'Mamá',
    message: 'Mi amada Lirio, verte cumplir tus quince años llena mi corazón de una emoción indescriptible. Que Dios guarde siempre tu sonrisa, guíe cada uno de tus sueños y te colme de infinita salud y amor. Eres mi mayor bendición.',
    date: 'Ayer',
    icon: '💖',
    likes: 12
  },
  {
    id: '2',
    author: 'Roman Corral & Martha Gil',
    relation: 'Padrinos',
    message: 'Querida ahijada Lirio, es un honor caminar junto a ti en este día tan memorable. Que la vida te regale felicidad plena, sabiduría y éxitos. ¡Siempre contarás con nosotros!',
    date: 'Hace 2 días',
    icon: '👑',
    likes: 8
  },
  {
    id: '3',
    author: 'Sofía, Vale y Camila',
    relation: 'Mejores Amigas',
    message: '¡Por fin llegaron tus XV Quetzalli! Estamos tan felices de celebrar este día contigo. ¡Te queremos con todo el corazón y vamos a romper la pista de baile!',
    date: 'Hace 3 días',
    icon: '✨',
    likes: 15
  },
  {
    id: '4',
    author: 'Tíos y Primos Familia Herrera',
    relation: 'Familia',
    message: 'Que esta nueva etapa de tu juventud esté llena de momentos mágicos e inolvidables. Te enviamos un abrazo enorme lleno de bendiciones.',
    date: 'Hace 4 días',
    icon: '🌸',
    likes: 6
  }
];

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

export const SeccionDeseos: React.FC<SeccionDeseosProps> = ({ whatsappNumber }) => {
  const [wishes, setWishes] = useState<Wish[]>(() => {
    try {
      const stored = localStorage.getItem('lirio_xv_wishes_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Guardar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lirio_xv_wishes_v1', JSON.stringify(wishes));
    } catch (e) {
      console.warn("No se pudo guardar en localStorage", e);
    }
  }, [wishes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    const newWish: Wish = {
      id: Date.now().toString(),
      author: author.trim(),
      relation: relation.trim() || 'Invitado(a)',
      message: message.trim(),
      date: 'Hoy',
      icon: selectedEmoji,
      likes: 1
    };

    setWishes(prev => [newWish, ...prev]);
    setShowSuccessToast(true);

    // Limpiar formulario
    setAuthor('');
    setRelation('');
    setMessage('');
    setSelectedEmoji('💖');

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4500);
  };

  const handleLike = (id: string) => {
    if (likedMap[id]) return;
    setLikedMap(prev => ({ ...prev, [id]: true }));
    setWishes(prev =>
      prev.map(item => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
    );
  };

  const sendDirectWhatsApp = () => {
    if (!message.trim() && !author.trim()) return;
    const text = `¡Hola Lirio! Te dejo este deseo de XV Años con mucho cariño:%0A"${encodeURIComponent(message.trim())}"%0A— Con amor: ${encodeURIComponent(author.trim()) || 'Un invitado'}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <section className="pt-16 pb-12 border-t border-[#D0BCF2]/40">
      {/* Encabezado de la sección */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#D0BCF2]/30 text-[#4E216E] mb-4 shadow-sm border border-[#D3B272]/30">
          <MessageSquareHeart size={24} className="text-[#4E216E]" strokeWidth={1.5} />
        </div>
        <p className="font-['Cinzel'] text-xs uppercase tracking-[0.3em] text-[#4E216E]/70 font-semibold mb-2">
          Libro de Dedicatorias
        </p>
        <h3 className="font-['Playfair_Display'] text-3xl md:text-5xl text-[#4E216E] mb-3 font-semibold">
          Deseos para la Quinceañera
        </h3>
        <p className="font-['Cormorant_Garamond'] italic text-base md:text-lg text-[#4E216E]/80 max-w-lg mx-auto px-4">
          Deja tus bendiciones, palabras de aliento y cariño para que Lirio las guarde en su corazón por siempre.
        </p>
      </div>

      {/* Formulario de Dedicatoria */}
      <div className="max-w-xl mx-auto bg-white/70 backdrop-blur-md border border-[#D3B272]/40 rounded-3xl p-6 md:p-8 shadow-xl mb-14 relative overflow-hidden">
        {/* Adorno superior sutil */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#D0BCF2]/30 rounded-full blur-2xl pointer-events-none"></div>

        <h4 className="text-xs uppercase tracking-[0.25em] text-[#4E216E] font-semibold mb-6 flex items-center gap-2">
          <Sparkles size={16} className="text-[#D3B272]" /> Escribe tu dedicatoria
        </h4>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#4E216E]/70 mb-1">
                Tu Nombre *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Tía Marcela, Familia Ruiz..."
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full bg-[#F8F4FD]/80 border border-[#D0BCF2]/60 rounded-xl px-3.5 py-2.5 text-sm font-light text-[#4E216E] placeholder:text-[#4E216E]/40 focus:outline-none focus:border-[#4E216E] focus:ring-1 focus:ring-[#4E216E] transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#4E216E]/70 mb-1">
                Parentesco o Vínculo (opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Familia, Amiga, Padrino..."
                value={relation}
                onChange={e => setRelation(e.target.value)}
                className="w-full bg-[#F8F4FD]/80 border border-[#D0BCF2]/60 rounded-xl px-3.5 py-2.5 text-sm font-light text-[#4E216E] placeholder:text-[#4E216E]/40 focus:outline-none focus:border-[#4E216E] focus:ring-1 focus:ring-[#4E216E] transition-all"
              />
            </div>
          </div>

          {/* Selector de Emoji / Símbolo */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#4E216E]/70 mb-2">
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
            <label className="block text-[11px] uppercase tracking-wider text-[#4E216E]/70 mb-1">
              Tu mensaje o deseo para Lirio *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Escribe tus palabras con todo tu cariño..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full bg-[#F8F4FD]/80 border border-[#D0BCF2]/60 rounded-xl px-3.5 py-2.5 text-sm font-light text-[#4E216E] placeholder:text-[#4E216E]/40 focus:outline-none focus:border-[#4E216E] focus:ring-1 focus:ring-[#4E216E] transition-all resize-none"
            ></textarea>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-[#4E216E] hover:bg-[#3d1858] text-white py-3 px-6 rounded-full text-xs uppercase tracking-[0.2em] font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={15} className="text-[#D3B272]" /> Publicar en el Muro
            </button>

            {message.trim() && author.trim() && (
              <button
                type="button"
                onClick={sendDirectWhatsApp}
                className="inline-flex items-center justify-center gap-2 border border-[#25D366] text-[#128C7E] bg-[#25D366]/10 hover:bg-[#25D366]/20 py-3 px-5 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer"
                title="También enviar mensaje por WhatsApp"
              >
                <Send size={14} /> Enviar por WhatsApp
              </button>
            )}
          </div>
        </form>

        {/* Notificación de éxito */}
        {showSuccessToast && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
            <Check size={16} className="text-emerald-600 flex-shrink-0" />
            <span>¡Tu hermoso deseo ha sido publicado con éxito en el muro de Lirio!</span>
          </div>
        )}
      </div>

      {/* Lista / Muro de Deseos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#4E216E]/70 px-2 mb-2">
          <span className="uppercase tracking-widest font-light">
            Mensajes recibidos ({wishes.length})
          </span>
          <span className="text-[11px] italic font-['Cormorant_Garamond']">
            Palabras que perduran
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishes.map(wish => {
            const isLiked = likedMap[wish.id];
            return (
              <div
                key={wish.id}
                className="bg-white/80 backdrop-blur-sm border border-[#D0BCF2]/60 hover:border-[#D3B272]/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
              >
                {/* Comilla decorativa de fondo */}
                <Quote
                  size={42}
                  className="absolute right-4 top-4 text-[#D0BCF2]/20 pointer-events-none"
                />

                <div>
                  {/* Encabezado del deseo */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full bg-[#F8F4FD] border border-[#D0BCF2]/50 flex items-center justify-center text-base shadow-2xs">
                        {wish.icon}
                      </span>
                      <div>
                        <h5 className="font-['Cormorant_Garamond'] text-lg font-bold text-[#4E216E] leading-tight">
                          {wish.author}
                        </h5>
                        <span className="inline-block text-[10px] uppercase tracking-wider text-[#4E216E]/70 bg-[#D0BCF2]/25 px-2 py-0.5 rounded-full mt-0.5">
                          {wish.relation}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#4E216E]/50 uppercase tracking-wider font-light">
                      {wish.date}
                    </span>
                  </div>

                  {/* Cuerpo del mensaje */}
                  <p className="font-['Cormorant_Garamond'] italic text-base leading-relaxed text-[#4E216E]/90 my-2">
                    "{wish.message}"
                  </p>
                </div>

                {/* Pie de la tarjeta */}
                <div className="pt-3 mt-2 border-t border-[#F8F4FD] flex items-center justify-between text-xs text-[#4E216E]/60">
                  <span className="text-[10px] tracking-wide text-[#D3B272] flex items-center gap-1 font-medium">
                    <Sparkles size={12} /> Para Lirio Quetzalli
                  </span>

                  <button
                    onClick={() => handleLike(wish.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                      isLiked
                        ? 'text-pink-600 bg-pink-50'
                        : 'text-[#4E216E]/60 hover:text-pink-600 hover:bg-pink-50/50'
                    }`}
                    title="Dar amor a este deseo"
                  >
                    <Heart
                      size={14}
                      className={isLiked ? 'fill-pink-500 text-pink-500' : ''}
                      strokeWidth={1.5}
                    />
                    <span className="text-[11px] font-medium">{wish.likes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SeccionDeseos;

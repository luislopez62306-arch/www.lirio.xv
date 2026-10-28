import React, { useState, useEffect, useRef } from 'react';
import { Check, Heart, User, Users, CalendarCheck, Send, Clock, Sparkles, MessageCircle, XCircle, X, CheckCircle2 } from 'lucide-react';

interface ConfirmacionAsistenciaProps {
  whatsappNumber: string;
}

export const ConfirmacionAsistencia: React.FC<ConfirmacionAsistenciaProps> = ({ whatsappNumber }) => {
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [name, setName] = useState('');
  const [companions, setCompanions] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<'both' | 'ceremony' | 'reception'>('both');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [assignedPassInfo, setAssignedPassInfo] = useState<{ guest?: string; table?: string } | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const guestParam = params.get('invitado');
      const mesaParam = params.get('mesa');

      if (guestParam || mesaParam) {
        if (guestParam) setName(guestParam);
        setAssignedPassInfo({
          guest: guestParam || undefined,
          table: mesaParam || undefined
        });
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let text = '';
    if (attending === 'yes') {
      const eventLabel =
        selectedEvent === 'both'
          ? 'Ambos eventos (Misa y Recepción)'
          : selectedEvent === 'ceremony'
          ? 'Solo Ceremonia Religiosa (5:00 P.M.)'
          : 'Solo Recepción (8:00 P.M.)';

      text = `✨ *CONFIRMACIÓN DE ASISTENCIA · XV AÑOS LIRIO QUETZALLI* ✨%0A%0A` +
        `👤 *Titular / Invitado:* ${encodeURIComponent(name.trim())}%0A` +
        `✅ *Estado:* ¡SÍ ASISTIRÉ! 🎉%0A` +
        (companions.trim() ? `🤝 *Acompañante(s):* ${encodeURIComponent(companions.trim())}%0A` : '') +
        `📍 *Eventos:* ${encodeURIComponent(eventLabel)}%0A` +
        (note.trim() ? `💬 *Nota / Mensaje:* ${encodeURIComponent(note.trim())}%0A%0A` : '%0A') +
        `¡Nos vemos el 18 de Diciembre de 2026 para celebrar juntos! 💖`;
    } else {
      text = `💌 *RESPUESTA RSVP · XV AÑOS LIRIO QUETZALLI* 💌%0A%0A` +
        `👤 *Nombre:* ${encodeURIComponent(name.trim())}%0A` +
        `❌ *Estado:* Lamentablemente no podré asistir.%0A` +
        (note.trim() ? `💬 *Mensaje para Lirio:* ${encodeURIComponent(note.trim())}%0A%0A` : '%0A') +
        `¡Les deseo un día maravilloso lleno de bendiciones! ✨`;
    }

    // Abrir WhatsApp con el mensaje estructurado
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
    setIsSubmitted(true);

    // Activar indicador visual temporal de '¡Gracias por confirmar!' por 5 segundos
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setShowToast(true);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  return (
    <section className="pt-16 pb-12 border-t border-[#D0BCF2]/50 relative">
      {/* Toast Notificación Temporal: ¡Gracias por confirmar! */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md animate-fade-in pointer-events-auto transition-all"
        >
          <div className="bg-[#4E216E]/95 backdrop-blur-md border-2 border-[#D3B272] text-white p-4 rounded-2xl shadow-2xl shadow-[#4E216E]/50 flex items-center gap-3.5 relative overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-[#D3B272]/20 border border-[#D3B272] flex items-center justify-center shrink-0">
              <CheckCircle2 size={22} className="text-[#D3B272]" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-['Cinzel'] text-xs font-bold text-[#EED8A1] tracking-wider uppercase">
                  ¡Gracias por confirmar!
                </span>
                <Sparkles size={13} className="text-[#D3B272] animate-pulse" />
              </div>
              <p className="text-xs text-white/90 font-light truncate mt-0.5">
                {name.trim() ? `${name.trim()}, tu respuesta ha sido enviada ✨` : 'Tu respuesta ha sido enviada con éxito ✨'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowToast(false)}
              className="text-white/60 hover:text-white p-1 rounded-lg transition-colors cursor-pointer shrink-0"
              aria-label="Cerrar notificación"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Encabezado Principal */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#D0BCF2]/25 text-[#D3B272] mb-3 border border-[#D3B272]/30 shadow-xs">
          <CalendarCheck size={24} strokeWidth={1.5} />
        </div>
        <p className="font-['Cinzel'] text-[11px] uppercase tracking-[0.3em] text-[#4E216E]/70 font-semibold mb-2">
          Confirmación Exclusiva
        </p>
        <h3 className="font-['Playfair_Display'] text-3xl md:text-5xl text-[#4E216E] mb-3 font-semibold">
          Confirma tu Asistencia
        </h3>
        <p className="font-['Cormorant_Garamond'] italic text-lg sm:text-xl md:text-2xl leading-relaxed text-[#4E216E]/90 max-w-lg mx-auto px-4">
          Nos honrará profundamente contar con tu distinguida presencia para celebrar los quince años de nuestra querida Lirio.
        </p>
      </div>

      {/* Contenedor tipo Tarjeta de Gala */}
      <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-md border border-[#D3B272]/50 rounded-3xl p-6 md:p-9 shadow-2xl relative overflow-hidden">
        {/* Adorno decorativo de esquinas doradas */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#D3B272]/40 rounded-tl-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#D3B272]/40 rounded-br-3xl pointer-events-none"></div>

        {isSubmitted ? (
          /* Estado de Confirmación Enviada */
          <div className="text-center py-8 space-y-5 animate-fade-in">
            {/* Mensaje de agradecimiento destacado */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D3B272]/20 border border-[#D3B272] text-[#4E216E] text-xs tracking-wider uppercase font-semibold">
              <Sparkles size={13} className="text-[#D3B272]" />
              <span>¡Gracias por confirmar!</span>
            </div>

            <div className="w-16 h-16 bg-[#D0BCF2]/30 text-[#4E216E] rounded-full mx-auto flex items-center justify-center border border-[#D3B272]/50 shadow-md">
              <Check size={32} className="text-[#4E216E]" strokeWidth={2} />
            </div>

            <div>
              <h4 className="font-['Cormorant_Garamond'] text-3xl text-[#4E216E] mb-2 font-semibold">
                {attending === 'yes' ? '¡Asistencia Confirmada!' : '¡Agradecemos tu Respuesta!'}
              </h4>
              <p className="text-xs text-[#4E216E]/80 max-w-sm mx-auto leading-relaxed">
                {attending === 'yes'
                  ? `Muchas gracias ${name}, hemos registrado tu confirmación con mucho cariño. ¡Será una velada inolvidable!`
                  : `Muchas gracias ${name} por hacérnoslo saber. Lirio apreciará con mucho amor tus buenos deseos.`}
              </p>
            </div>

            {/* Resumen de Confirmación */}
            {attending === 'yes' && (
              <div className="bg-[#F8F4FD] border border-[#D0BCF2]/60 rounded-2xl p-4 max-w-sm mx-auto text-left text-xs space-y-1.5 shadow-xs">
                <div className="flex justify-between text-[#4E216E]/70 text-[10px] uppercase tracking-wider pb-1 border-b border-[#D0BCF2]/40 font-semibold">
                  <span>Confirmación Registrada</span>
                  <span>18 · Dic · 2026</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#4E216E]/60">Titular:</span>
                  <span className="font-medium text-[#4E216E]">{name}</span>
                </div>
                {companions && (
                  <div className="flex justify-between py-1">
                    <span className="text-[#4E216E]/60">Acompañante(s):</span>
                    <span className="text-[#4E216E] text-right font-medium">{companions}</span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-[#4E216E]/60">Eventos:</span>
                  <span className="text-[#4E216E] font-medium">
                    {selectedEvent === 'both' ? 'Misa y Recepción' : selectedEvent === 'ceremony' ? 'Solo Misa' : 'Solo Recepción'}
                  </span>
                </div>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="text-xs uppercase tracking-widest text-[#4E216E] hover:text-[#D3B272] transition-colors py-2 px-4 cursor-pointer"
              >
                Modificar o enviar otra respuesta
              </button>
            </div>
          </div>
        ) : (
          /* Formulario de Confirmación */
          <form onSubmit={handleSubmit} className="space-y-6">
            {assignedPassInfo?.guest && (
              <div className="bg-[#D0BCF2]/25 border border-[#D3B272]/50 rounded-2xl p-3 text-center mb-2 animate-fade-in">
                <span className="text-[10px] uppercase tracking-widest text-[#8B6E32] font-semibold block">
                  ✦ Invitación Personalizada ✦
                </span>
                <p className="font-['Cormorant_Garamond'] text-lg text-[#4E216E] font-bold">
                  {assignedPassInfo.guest}
                </p>
                {assignedPassInfo.table && (
                  <span className="text-xs text-[#4E216E]/70 font-light">
                    Mesa asignada: {assignedPassInfo.table}
                  </span>
                )}
              </div>
            )}

            {/* 1. Selector de Asistencia: ¿Asistirás? */}
            <div>
              <label className="block text-center text-xs uppercase tracking-[0.2em] text-[#4E216E] font-medium mb-3">
                ¿Nos acompañarás en este día tan especial?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttending('yes')}
                  className={`py-3.5 px-3 rounded-2xl text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                    attending === 'yes'
                      ? 'bg-[#4E216E] text-white border-[#4E216E] shadow-md scale-[1.02]'
                      : 'bg-[#F8F4FD] text-[#4E216E] border-[#D0BCF2]/60 hover:bg-[#D0BCF2]/20'
                  }`}
                >
                  <Sparkles size={16} className={attending === 'yes' ? 'text-[#D3B272]' : 'text-[#4E216E]'} />
                  <span>Sí, Asistiré</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttending('no')}
                  className={`py-3.5 px-3 rounded-2xl text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                    attending === 'no'
                      ? 'bg-[#4E216E] text-white border-[#4E216E] shadow-md scale-[1.02]'
                      : 'bg-[#F8F4FD] text-[#4E216E] border-[#D0BCF2]/60 hover:bg-[#D0BCF2]/20'
                  }`}
                >
                  <XCircle size={16} className={attending === 'no' ? 'text-rose-300' : 'text-[#4E216E]'} />
                  <span>No podré asistir</span>
                </button>
              </div>
            </div>

            {/* 2. Nombre del Titular */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#4E216E]/80 mb-1.5 font-medium flex items-center gap-1.5">
                <User size={13} className="text-[#D3B272]" /> Nombre y Apellido del Titular *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Familia López Morales o Carlos Hernández"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#F8F4FD] border border-[#D0BCF2]/70 rounded-xl px-4 py-3 text-sm font-light text-[#4E216E] placeholder:text-[#4E216E]/40 focus:outline-none focus:border-[#4E216E] focus:ring-1 focus:ring-[#4E216E] transition-all"
              />
            </div>

            {attending === 'yes' && (
              <>
                {/* 3. Acompañante(s) (opcional) */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#4E216E]/80 mb-1.5 font-medium flex items-center gap-1.5">
                    <Users size={13} className="text-[#D3B272]" /> Acompañante(s) (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Esposo(a), familia o acompañante..."
                    value={companions}
                    onChange={e => setCompanions(e.target.value)}
                    className="w-full bg-[#F8F4FD] border border-[#D0BCF2]/70 rounded-xl px-4 py-3 text-sm font-light text-[#4E216E] placeholder:text-[#4E216E]/40 focus:outline-none focus:border-[#4E216E] focus:ring-1 focus:ring-[#4E216E] transition-all"
                  />
                </div>

                {/* 4. Eventos a los que asistirán */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#4E216E]/80 mb-2 font-medium">
                    ¿A qué momentos de la celebración nos acompañarás?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedEvent('both')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedEvent === 'both'
                          ? 'bg-[#4E216E] text-white border-[#4E216E] shadow-sm'
                          : 'bg-[#F8F4FD] text-[#4E216E] border-[#D0BCF2]/60 hover:bg-[#D0BCF2]/20'
                      }`}
                    >
                      <span className="block text-xs font-medium">Ambos Eventos</span>
                      <span className="text-[10px] opacity-80 block mt-0.5">Misa y Recepción</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedEvent('ceremony')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedEvent === 'ceremony'
                          ? 'bg-[#4E216E] text-white border-[#4E216E] shadow-sm'
                          : 'bg-[#F8F4FD] text-[#4E216E] border-[#D0BCF2]/60 hover:bg-[#D0BCF2]/20'
                      }`}
                    >
                      <span className="block text-xs font-medium">Solo Misa</span>
                      <span className="text-[10px] opacity-80 block mt-0.5">5:00 P.M.</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedEvent('reception')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedEvent === 'reception'
                          ? 'bg-[#4E216E] text-white border-[#4E216E] shadow-sm'
                          : 'bg-[#F8F4FD] text-[#4E216E] border-[#D0BCF2]/60 hover:bg-[#D0BCF2]/20'
                      }`}
                    >
                      <span className="block text-xs font-medium">Solo Recepción</span>
                      <span className="text-[10px] opacity-80 block mt-0.5">8:00 P.M.</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 5. Nota o Mensaje Adicional */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#4E216E]/80 mb-1.5 font-medium flex items-center gap-1.5">
                <MessageCircle size={13} className="text-[#D3B272]" />
                {attending === 'yes' ? 'Nota adicional o mensaje especial (opcional)' : 'Mensaje o disculpas para Lirio (opcional)'}
              </label>
              <textarea
                rows={2}
                placeholder={
                  attending === 'yes'
                    ? 'Ej. ¡Con muchas ganas de celebrar! / Restricciones alimenticias...'
                    : 'Ej. Te deseo una noche maravillosa y llena de bendiciones...'
                }
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full bg-[#F8F4FD] border border-[#D0BCF2]/70 rounded-xl px-4 py-2.5 text-xs font-light text-[#4E216E] placeholder:text-[#4E216E]/40 focus:outline-none focus:border-[#4E216E] transition-all resize-none"
              ></textarea>
            </div>

            {/* 6. Botón de Enviar Confirmación */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#4E216E] via-[#5c2484] to-[#4E216E] hover:from-[#3f185c] hover:to-[#3f185c] text-white py-4 px-6 rounded-full text-xs uppercase tracking-[0.25em] font-medium shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Send size={15} className="text-[#D3B272] group-hover:translate-x-1 transition-transform" />
                <span>
                  {attending === 'yes' ? 'Enviar Confirmación por WhatsApp' : 'Enviar Respuesta por WhatsApp'}
                </span>
              </button>
            </div>

            {/* Aviso de Fecha Límite */}
            <div className="text-center pt-2">
              <p className="text-[11px] uppercase tracking-widest text-[#4E216E]/60 flex items-center justify-center gap-1.5 font-light">
                <Clock size={12} className="text-[#D3B272]" />
                Favor de confirmar antes del 10 de Diciembre, 2026
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default ConfirmacionAsistencia;

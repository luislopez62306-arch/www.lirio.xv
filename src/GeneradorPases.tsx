import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Share2, 
  Copy, 
  Trash2, 
  Sparkles, 
  Check, 
  Crown, 
  X, 
  Users, 
  QrCode, 
  Printer, 
  Search, 
  Send,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';

export interface PaseItem {
  id: string;
  guestName: string;
  passesCount: number;
  tableNumber?: string;
  accessType: string;
  personalNote?: string;
  createdAt: string;
}

const DEFAULT_PASSES: PaseItem[] = [
  {
    id: 'pass-1',
    guestName: 'Familia Gil Corral',
    passesCount: 4,
    tableNumber: 'Mesa de Honor',
    accessType: 'Misa y Recepción',
    personalNote: 'Será un honor tenerlos en nuestra mesa principal.',
    createdAt: '2026-10-18'
  },
  {
    id: 'pass-2',
    guestName: 'Ing. Roberto Soto y Familia',
    passesCount: 3,
    tableNumber: 'Mesa 4',
    accessType: 'Misa y Recepción',
    personalNote: 'Con mucho aprecio para ustedes.',
    createdAt: '2026-10-19'
  }
];

interface GeneradorPasesProps {
  isOpen: boolean;
  onClose: () => void;
  baseUrl?: string;
}

export const GeneradorPases: React.FC<GeneradorPasesProps> = ({ 
  isOpen, 
  onClose,
  baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : ''
}) => {
  const [passes, setPasses] = useState<PaseItem[]>(() => {
    try {
      const stored = localStorage.getItem('lirio_xv_generated_passes');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_PASSES;
  });

  const [guestName, setGuestName] = useState('');
  const [passesCount, setPassesCount] = useState(2);
  const [tableNumber, setTableNumber] = useState('');
  const [accessType, setAccessType] = useState('Misa y Recepción');
  const [personalNote, setPersonalNote] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewPass, setPreviewPass] = useState<PaseItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('lirio_xv_generated_passes', JSON.stringify(passes));
    } catch (e) {
      console.warn(e);
    }
  }, [passes]);

  if (!isOpen) return null;

  const handleCreatePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const newPass: PaseItem = {
      id: `pass-${Date.now()}`,
      guestName: guestName.trim(),
      passesCount: Number(passesCount),
      tableNumber: tableNumber.trim() || undefined,
      accessType,
      personalNote: personalNote.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setPasses([newPass, ...passes]);
    setPreviewPass(newPass);

    // Limpiar formulario básico
    setGuestName('');
    setPersonalNote('');
    setTableNumber('');
    setPassesCount(2);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Deseas eliminar este pase de la lista?')) {
      setPasses(passes.filter(p => p.id !== id));
      if (previewPass?.id === id) setPreviewPass(null);
    }
  };

  const generateGuestLink = (pass: PaseItem) => {
    const params = new URLSearchParams();
    params.set('invitado', pass.guestName);
    params.set('pases', pass.passesCount.toString());
    if (pass.tableNumber) params.set('mesa', pass.tableNumber);
    return `${baseUrl}?${params.toString()}`;
  };

  const copyGuestLink = (pass: PaseItem) => {
    const link = generateGuestLink(pass);
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(pass.id);
      setTimeout(() => setCopiedId(null), 3000);
    });
  };

  const shareViaWhatsApp = (pass: PaseItem, phone?: string) => {
    const link = generateGuestLink(pass);
    const text = 
      `👑 *INVITACIÓN DE GALA · MIS XV AÑOS* 👑%0A%0A` +
      `¡Hola *${encodeURIComponent(pass.guestName)}*!%0A` +
      `Tengo el inmenso honor y la alegría de invitarte a celebrar mis XV Años:%0A%0A` +
      `✨ *Lirio Quetzalli Herrera* ✨%0A` +
      `📅 *Fecha:* Viernes 18 de Diciembre de 2026%0A` +
      `🎟️ *Pases reservados especialmente para ti:* ${pass.passesCount} ${pass.passesCount === 1 ? 'lugar' : 'lugares'}%0A` +
      (pass.tableNumber ? `🍽️ *Mesa asignada:* ${encodeURIComponent(pass.tableNumber)}%0A` : '') +
      `📍 *Acceso:* ${encodeURIComponent(pass.accessType)}%0A%0A` +
      (pass.personalNote ? `💌 _"${encodeURIComponent(pass.personalNote)}"_%0A%0A` : '') +
      `Por favor ingresa a tu pase digital exclusivo para ver los detalles, ubicaciones y confirmar tu asistencia:%0A` +
      `${encodeURIComponent(link)}%0A%0A` +
      `¡Esperamos contar con tu valiosa presencia! Con amor, Lirio & Emilia Herrera.`;

    const targetUrl = phone?.trim() 
      ? `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${text}`
      : `https://wa.me/?text=${text}`;

    window.open(targetUrl, '_blank');
  };

  const totalInvitedPeople = passes.reduce((acc, curr) => acc + curr.passesCount, 0);

  const filteredPasses = passes.filter(p => 
    p.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.tableNumber && p.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#F8F4FD] rounded-3xl shadow-2xl border border-[#D3B272]/50 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* ENCABEZADO DEL MODAL */}
        <div className="bg-gradient-to-r from-[#4E216E] via-[#652D8E] to-[#4E216E] text-white p-5 sm:p-6 flex items-center justify-between border-b border-[#D3B272]/40 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D3B272]/20 border border-[#D3B272] flex items-center justify-center text-[#ECC880]">
              <Crown size={22} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D0BCF2] block">
                Acceso Exclusivo de Organización
              </span>
              <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-white tracking-wide">
                Generador de Pases VIP · Lirio Quetzalli
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            title="Cerrar panel"
          >
            <X size={20} />
          </button>
        </div>

        {/* CUERPO CON SCROLL */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-8 flex-1">
          
          {/* BARRA DE ESTADÍSTICAS RÁPIDAS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white border border-[#D0BCF2]/60 rounded-2xl p-3.5 text-center shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#4E216E]/70 block mb-0.5">
                Total de Pases Creados
              </span>
              <span className="font-['Cormorant_Garamond'] text-3xl font-bold text-[#4E216E]">
                {passes.length}
              </span>
            </div>

            <div className="bg-white border border-[#D0BCF2]/60 rounded-2xl p-3.5 text-center shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#4E216E]/70 block mb-0.5">
                Personas Invitadas Totales
              </span>
              <span className="font-['Cormorant_Garamond'] text-3xl font-bold text-[#4E216E]">
                {totalInvitedPeople}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white border border-[#D0BCF2]/60 rounded-2xl p-3.5 text-center shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#4E216E]/70 block mb-0.5">
                Fecha del Evento
              </span>
              <span className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#D3B272]">
                18 Dic 2026
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* COLUMNA 1: FORMULARIO GENERADOR */}
            <div className="lg:col-span-6 bg-white border border-[#D0BCF2]/60 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#D0BCF2]/30">
                <Ticket className="text-[#D3B272]" size={18} />
                <h3 className="font-['Cormorant_Garamond'] text-xl font-bold text-[#4E216E]">
                  Crear Nuevo Boleto Personalizado
                </h3>
              </div>

              <form onSubmit={handleCreatePass} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider text-[#4E216E]/80 mb-1 font-medium">
                    Nombre del Invitado o Familia *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Familia Pérez Soto o Lic. Alejandro Morales"
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    className="w-full bg-[#F8F4FD] border border-[#D0BCF2]/70 rounded-xl px-3 py-2.5 text-sm text-[#4E216E] placeholder:text-[#4E216E]/40 focus:outline-none focus:border-[#4E216E]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider text-[#4E216E]/80 mb-1 font-medium">
                      Número de Pases *
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPassesCount(Math.max(1, passesCount - 1))}
                        className="w-8 h-8 rounded-lg bg-[#F8F4FD] border border-[#D0BCF2] text-[#4E216E] font-bold flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={passesCount}
                        onChange={e => setPassesCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full text-center bg-[#F8F4FD] border border-[#D0BCF2]/70 rounded-xl py-1.5 font-bold text-base text-[#4E216E]"
                      />
                      <button
                        type="button"
                        onClick={() => setPassesCount(passesCount + 1)}
                        className="w-8 h-8 rounded-lg bg-[#F8F4FD] border border-[#D0BCF2] text-[#4E216E] font-bold flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[#4E216E]/80 mb-1 font-medium">
                      Mesa Asignada (opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Mesa 3 / VIP"
                      value={tableNumber}
                      onChange={e => setTableNumber(e.target.value)}
                      className="w-full bg-[#F8F4FD] border border-[#D0BCF2]/70 rounded-xl px-3 py-2 text-sm text-[#4E216E] placeholder:text-[#4E216E]/40 focus:outline-none focus:border-[#4E216E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#4E216E]/80 mb-1 font-medium">
                    Tipo de Acceso
                  </label>
                  <select
                    value={accessType}
                    onChange={e => setAccessType(e.target.value)}
                    className="w-full bg-[#F8F4FD] border border-[#D0BCF2]/70 rounded-xl px-3 py-2 text-xs text-[#4E216E] focus:outline-none focus:border-[#4E216E]"
                  >
                    <option value="Misa y Recepción">Misa y Recepción (Acceso Completo)</option>
                    <option value="Solo Recepción">Solo Recepción / Fiesta (8:00 P.M.)</option>
                    <option value="Solo Ceremonia Religiosa">Solo Ceremonia Religiosa (5:00 P.M.)</option>
                    <option value="Pase VIP de Honor">Pase VIP de Honor</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#4E216E]/80 mb-1 font-medium">
                    Dedicatoria o Nota Especial
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej. Nos encantará compartir este gran momento contigo..."
                    value={personalNote}
                    onChange={e => setPersonalNote(e.target.value)}
                    className="w-full bg-[#F8F4FD] border border-[#D0BCF2]/70 rounded-xl px-3 py-2 text-xs text-[#4E216E] placeholder:text-[#4E216E]/40 focus:outline-none focus:border-[#4E216E] resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#4E216E] hover:bg-[#3b1754] text-white py-3 rounded-xl uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Sparkles size={16} className="text-[#D3B272]" /> Generar Boleto VIP
                </button>
              </form>
            </div>

            {/* COLUMNA 2: VISTA PREVIA DEL BOLETO DE GALA */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-3">
                  <span className="text-xs uppercase tracking-wider text-[#4E216E]/80 font-semibold flex items-center gap-1.5">
                    <QrCode size={16} className="text-[#D3B272]" /> Tarjetón de Acceso en Vivo
                  </span>
                  {previewPass && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                      Boleto Activo
                    </span>
                  )}
                </div>

                {/* TARJETÓN DE GALA DE ALTA COSTURA */}
                {(() => {
                  const targetPass: PaseItem = previewPass || passes[0] || {
                    id: 'sample',
                    guestName: guestName || 'Familia Ejemplo',
                    passesCount: passesCount,
                    tableNumber: tableNumber || 'Mesa VIP',
                    accessType: accessType,
                    personalNote: personalNote || 'Será un gran honor contar con tu grata presencia.',
                    createdAt: '2026-10-20'
                  };

                  return (
                    <div className="bg-gradient-to-br from-[#2D1240] via-[#4E216E] to-[#2D1240] text-white rounded-3xl p-6 shadow-2xl border-2 border-[#D3B272] relative overflow-hidden">
                      {/* Sello de agua / filigrana */}
                      <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full border-8 border-white/5 pointer-events-none"></div>
                      <div className="absolute top-3 right-3 text-[#D3B272]/50 text-xs font-mono">
                        Nº {targetPass.id.slice(-6).toUpperCase()}
                      </div>

                      <div className="text-center pb-4 border-b border-[#D3B272]/40 relative">
                        <Crown className="mx-auto text-[#ECC880] mb-1.5" size={24} />
                        <span className="font-['Cinzel'] text-[9px] uppercase tracking-[0.35em] text-[#D0BCF2] block font-semibold">
                          Pase Personal de Gala · Mis XV Años
                        </span>
                        <h4 className="font-['Parisienne'] text-4xl text-[#ECC880] my-1">
                          Lirio Quetzalli
                        </h4>
                        <span className="font-['Cinzel'] tracking-widest text-xs uppercase text-white/90 font-medium">
                          18 de Diciembre de 2026
                        </span>
                      </div>

                      <div className="py-4 space-y-3">
                        <div className="text-center bg-white/10 rounded-2xl py-2.5 px-3 border border-white/15">
                          <span className="text-[9px] uppercase tracking-widest text-[#D0BCF2] block">
                            Invitado(a) de Honor:
                          </span>
                          <h5 className="font-['Cormorant_Garamond'] text-2xl font-bold text-white mt-0.5">
                            {targetPass.guestName}
                          </h5>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                            <span className="text-[9px] text-[#D0BCF2] block uppercase tracking-wider">
                              Pases Reservados
                            </span>
                            <span className="font-bold text-lg text-[#ECC880]">
                              {targetPass.passesCount} {targetPass.passesCount === 1 ? 'Persona' : 'Personas'}
                            </span>
                          </div>

                          <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                            <span className="text-[9px] text-[#D0BCF2] block uppercase tracking-wider">
                              Mesa Asignada
                            </span>
                            <span className="font-bold text-base text-white">
                              {targetPass.tableNumber || 'Libre / Por asignar'}
                            </span>
                          </div>
                        </div>

                        {targetPass.personalNote && (
                          <p className="font-['Cormorant_Garamond'] italic text-xs text-center text-[#D0BCF2] px-2">
                            "{targetPass.personalNote}"
                          </p>
                        )}
                      </div>

                      {/* Pie del Tarjetón con código de barras simulado */}
                      <div className="pt-3 border-t border-[#D3B272]/30 flex items-center justify-between text-[10px] text-white/70">
                        <span className="uppercase tracking-widest font-mono">
                          {targetPass.accessType}
                        </span>
                        <div className="flex gap-0.5 items-center font-mono opacity-60">
                          || | ||| || ||| | ||
                        </div>
                      </div>

                      {/* Botones de acción rápida para este pase */}
                      <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap gap-2">
                        <button
                          onClick={() => copyGuestLink(targetPass)}
                          className="flex-1 bg-white/15 hover:bg-white/25 text-white py-2 px-3 rounded-xl text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          {copiedId === targetPass.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                          <span>{copiedId === targetPass.id ? '¡Enlace Copiado!' : 'Copiar Link'}</span>
                        </button>

                        <button
                          onClick={() => shareViaWhatsApp(targetPass)}
                          className="flex-1 bg-[#25D366] hover:bg-[#1fb355] text-slate-900 font-semibold py-2 px-3 rounded-xl text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                        >
                          <Send size={14} />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* LISTA COMPLETA DE PASES GENERADOS */}
          <div className="bg-white border border-[#D0BCF2]/60 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#D0BCF2]/40">
              <div className="flex items-center gap-2">
                <Users className="text-[#4E216E]" size={18} />
                <h3 className="font-['Cormorant_Garamond'] text-xl font-bold text-[#4E216E]">
                  Bitácora de Pases Asignados ({passes.length})
                </h3>
              </div>

              {/* Buscador */}
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-3 text-[#4E216E]/40" />
                <input
                  type="text"
                  placeholder="Buscar por invitado o mesa..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#F8F4FD] border border-[#D0BCF2]/60 rounded-xl text-xs text-[#4E216E] placeholder:text-[#4E216E]/40 focus:outline-none focus:border-[#4E216E]"
                />
              </div>
            </div>

            {filteredPasses.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#4E216E]/60 italic">
                No se encontraron pases con ese criterio.
              </div>
            ) : (
              <div className="divide-y divide-[#D0BCF2]/30 max-h-72 overflow-y-auto pr-1">
                {filteredPasses.map(pass => (
                  <div
                    key={pass.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-[#F8F4FD]/50 px-2 rounded-xl transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h6 className="font-['Cormorant_Garamond'] text-lg font-bold text-[#4E216E]">
                          {pass.guestName}
                        </h6>
                        <span className="bg-[#D0BCF2]/30 text-[#4E216E] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          {pass.passesCount} {pass.passesCount === 1 ? 'pase' : 'pases'}
                        </span>
                        {pass.tableNumber && (
                          <span className="bg-[#D3B272]/20 text-[#8B6E32] text-[10px] font-medium px-2 py-0.5 rounded-full border border-[#D3B272]/40">
                            {pass.tableNumber}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#4E216E]/60 flex items-center gap-3 mt-0.5">
                        <span>Acceso: {pass.accessType}</span>
                        <span>•</span>
                        <span>Creado: {pass.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => setPreviewPass(pass)}
                        className="px-2.5 py-1 text-[11px] text-[#4E216E] hover:bg-[#D0BCF2]/30 rounded-lg transition-colors cursor-pointer"
                        title="Ver boleto"
                      >
                        Ver
                      </button>

                      <button
                        onClick={() => copyGuestLink(pass)}
                        className="p-1.5 text-[#4E216E] hover:bg-[#D0BCF2]/30 rounded-lg transition-colors cursor-pointer"
                        title="Copiar enlace personalizado"
                      >
                        {copiedId === pass.id ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                      </button>

                      <button
                        onClick={() => shareViaWhatsApp(pass)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Enviar por WhatsApp"
                      >
                        <Send size={15} />
                      </button>

                      <button
                        onClick={() => handleDelete(pass.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar pase"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* PIE DEL MODAL */}
        <div className="p-4 bg-white border-t border-[#D0BCF2]/40 flex items-center justify-between text-xs text-[#4E216E]/70">
          <span className="text-[11px] flex items-center gap-1">
            <Sparkles size={12} className="text-[#D3B272]" /> Panel secreto exclusivo de administración
          </span>

          <button
            onClick={onClose}
            className="bg-[#4E216E] text-white px-5 py-2 rounded-full text-xs uppercase tracking-wider font-medium hover:bg-[#391552] transition-colors cursor-pointer"
          >
            Cerrar Panel
          </button>
        </div>

      </div>
    </div>
  );
};

export default GeneradorPases;

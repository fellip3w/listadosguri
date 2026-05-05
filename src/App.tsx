/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Search,
  Meh,
  FileText
} from 'lucide-react';
import { addPromessa, subscribeToPromessas, type Promessa } from './lib/firestore';

const FUNNY_STATUSES = [
  'No ano de 2768',
  'Lenda urbana',
  'Esquece',
  'Na próxima vida',
  'Invenção do governo pra vender caderno',
  'Literalmente impossível de acontecer',
  'Só em realidade paralela',
  'Evento canônico que nunca chega'
];

export default function App() {
  const [promessas, setPromessas] = useState<Promessa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPromessa, setNewPromessa] = useState({
    title: '',
    description: '',
    funnyStatus: FUNNY_STATUSES[0],
  });

  useEffect(() => {
    const unsubscribe = subscribeToPromessas((data) => {
      setPromessas(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromessa.title) return;

    await addPromessa(newPromessa);
    setNewPromessa({
      title: '',
      description: '',
      funnyStatus: FUNNY_STATUSES[0],
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 md:p-8 flex flex-col gap-8 relative overflow-x-hidden transition-all duration-300">
      {/* Background Decorations */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-dots"></div>
      </div>

      {/* Header Section */}
      <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-green-500/30 pb-6 shrink-0 z-10 gap-4">
        <div className="">
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none uppercase">
            A LISTA DOS <span className="text-green-500">GURI</span>
          </h1>
        </div>
        <div className="text-right font-mono flex flex-col items-start md:items-end w-full md:w-auto">
          <div className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-[0.2em] mb-1">Total da Lista dos Guri</div>
          <motion.div 
            key={promessas.length}
            initial={{ scale: 1.5, color: '#22c55e', y: 10 }}
            animate={{ scale: 1, color: '#4ade80', y: 0 }}
            className="text-7xl md:text-9xl font-black text-green-400 leading-none drop-shadow-[0_0_20px_rgba(34,197,94,0.4)]"
          >
            {promessas.length}
          </motion.div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-8 relative z-10">
        {/* Left Column: The Registration Terminal */}
        <section className="w-full lg:w-[400px] flex flex-col shrink-0">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-sm shadow-2xl flex flex-col backdrop-blur-md sticky top-8">
            <div className="mb-6">
              <h2 className="text-xs font-mono text-green-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                <span className="animate-pulse">{">"}</span> Anota mais uma na lista dos guri 🖋️📓
              </h2>
              <p className="text-zinc-400 text-sm italic">O arquivo oficial de calotes coletivos.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider flex items-center gap-2">
                  <FileText size={12} /> Título do que nunca vai acontecer
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Pescaria dos guri"
                  value={newPromessa.title}
                  onChange={(e) => setNewPromessa({ ...newPromessa, title: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 p-3 text-sm focus:outline-none focus:border-green-500 border-l-4 border-l-green-500 rounded-none transition-all text-zinc-100 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider flex items-center gap-2">
                  <AlertTriangle size={12} /> Detalhes (Opcional)
                </label>
                <textarea 
                  placeholder="Detalhes do evento que nunca vai ocorrer"
                  value={newPromessa.description}
                  onChange={(e) => setNewPromessa({ ...newPromessa, description: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 p-3 text-sm focus:outline-none focus:border-green-500 h-24 resize-none rounded-none placeholder:text-zinc-600 outline-none transition-all text-zinc-100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider flex items-center gap-2">
                  <Meh size={12} /> Status de Gravidade
                </label>
                <div className="flex flex-wrap gap-2">
                  {FUNNY_STATUSES.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewPromessa({ ...newPromessa, funnyStatus: s })}
                      className={`border px-3 py-2 text-[9px] md:text-[10px] hover:bg-zinc-800 transition-all uppercase font-bold tracking-tight rounded-sm ${
                        newPromessa.funnyStatus === s 
                          ? 'border-green-500 bg-green-500/10 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                          : 'border-zinc-800 text-zinc-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-4 uppercase tracking-tighter text-lg shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                REGISTRAR NA LISTA
              </button>
            </form>
          </div>
        </section>

        {/* Right Column: The Archive */}
        <section className="flex-1 flex flex-col gap-4 min-h-0">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm flex-1 flex flex-col min-h-0 backdrop-blur-sm">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500 italic flex items-center gap-2">
                <Search size={14} /> Lista oficial atualizada
              </h2>
              <div className="hidden md:flex gap-4 text-[10px] font-mono">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div> ATIVO</span>
                <span className="flex items-center gap-1 opacity-50"><div className="w-2 h-2 rounded-full bg-zinc-600"></div> PENDENTE</span>
              </div>
            </div>

            <div className="flex-1 p-4 space-y-4">
              {isLoading ? (
                <div className="h-64 flex items-center justify-center text-zinc-700 font-mono text-[10px] uppercase tracking-widest animate-pulse">
                  Descriptografando mentiras...
                </div>
              ) : promessas.length === 0 ? (
                <div className="border border-dashed border-zinc-800 p-20 flex flex-col items-center justify-center gap-4 text-zinc-700 h-64">
                   <span className="font-mono text-[10px] uppercase tracking-widest underline decoration-wavy">Nenhum vexame detectado</span>
                   <p className="text-[10px] uppercase opacity-50">Os guri estão muito comportados hoje.</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {promessas.map((p) => (
                    <motion.div 
                      key={p.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`group bg-zinc-900/80 border-l-4 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:bg-zinc-800/80 mb-4 ${
                        p.funnyStatus.includes('Esquece') || p.funnyStatus.includes('Impossível') ? 'border-l-red-100/10' : 'border-l-green-500 shadow-[0_4px_15px_rgba(0,0,0,0.2)]'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-mono text-zinc-500 mb-2 flex items-center gap-1 uppercase">
                          <span className="text-green-500 font-black">REGISTRO</span> 
                          • {p.createdAt?.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-xl md:text-2xl font-black tracking-tighter text-white mb-2 uppercase italic">{p.title}</div>
                        {p.description && (
                          <div className="text-sm text-zinc-400 leading-relaxed max-w-2xl">{p.description}</div>
                        )}
                      </div>
                      <div className="text-left md:text-right shrink-0 border-t md:border-t-0 border-zinc-800 pt-4 md:pt-0 w-full md:w-auto">
                        <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1 tracking-tighter mb-2">Gravidade / Status</div>
                        <div className="text-xs text-green-400 font-mono tracking-tighter uppercase backdrop-blur-sm bg-green-400/5 px-4 py-2 inline-block border border-green-500/30 font-bold">
                          {p.funnyStatus}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto pt-8 border-t border-zinc-800 flex justify-center z-10">
        <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
           DATABASE ESTÁVEL • CONEXÃO CRIPTOGRAFADA • MODO GURI ATIVADO
        </div>
      </footer>
    </div>
  );
}


import React, { useState, useMemo, useEffect } from 'react';
import { CqpLevel, BarType, QuoteInput } from './types';
import { calculateQuote, formatCurrency } from './services/pricingEngine';
import QuoteSummary from './components/QuoteSummary';
import AISalesAssistant from './components/AISalesAssistant';
import { PRICES, LEVEL_NAMES, CQP_DESCRIPTIONS, MONTH_NAMES, MONTH_DISCOUNTS } from './constants';

const App: React.FC = () => {
  const [pax, setPax] = useState<number>(30);
  const [hours, setHours] = useState<number>(5);
  const [endTime, setEndTime] = useState<string>("01:00");
  const [cqp, setCqp] = useState<CqpLevel>("eco");
  const [wantsBar, setWantsBar] = useState<boolean>(false);
  const [barType, setBarType] = useState<BarType>("clasica");
  const [wantsShopper, setWantsShopper] = useState<boolean>(false);
  const [wantsThemed, setWantsThemed] = useState<boolean>(false);
  const [themedBudget, setThemedBudget] = useState<number>(0);
  const [addBarman, setAddBarman] = useState<boolean>(false);
  const [addDJ, setAddDJ] = useState<boolean>(false);
  const [wantsFood, setWantsFood] = useState<boolean>(false);
  const [foodAmount, setFoodAmount] = useState<number>(PRICES.foodBase);
  const [foodConcept, setFoodConcept] = useState<string>("");
  const [supplies, setSupplies] = useState<number>(0);
  const [contractMonth, setContractMonth] = useState<number>(new Date().getMonth());
  const [applyDiscount, setApplyDiscount] = useState<boolean>(true);
  const [isCash, setIsCash] = useState<boolean>(false);
  const [isMundial, setIsMundial] = useState<boolean>(false);

  const handleLevelChange = (level: CqpLevel) => {
    setCqp(level);
    if (level === 'eco') {
      setHours(5);
      setAddDJ(false);
      setAddBarman(false);
      setWantsBar(false);
    }
    else if (level === 'std') { 
      setHours(6); 
      setAddDJ(true); 
      setAddBarman(false);
      setWantsBar(false);
    }
    else if (level === 'prem') { 
      setHours(7); 
      setAddDJ(true); 
      setAddBarman(true); 
      setWantsBar(true); 
      setBarType('clasica');
      // Al cambiar a Mantra, si ambos están activos, priorizamos uno (opcional, aquí lo dejamos como esté)
    }
  };

  // Manejadores con lógica de exclusividad para MANTRA
  const handleToggleCash = () => {
    const nextCash = !isCash;
    setIsCash(nextCash);
    if (cqp === 'prem' && nextCash) {
      setApplyDiscount(false);
    }
  };

  const handleToggleApplyDiscount = () => {
    const nextDiscount = !applyDiscount;
    setApplyDiscount(nextDiscount);
    if (cqp === 'prem' && nextDiscount) {
      setIsCash(false);
    }
  };

  useEffect(() => {
    if (endTime > "02:00" && endTime < "12:00") setEndTime("02:00");
  }, [endTime]);

  const quote = useMemo(() => {
    const input: QuoteInput = {
      pax, hours, endTime24: endTime, cqp, wantsBar, barType,
      wantsShopper, wantsThemed, themedBudget, addBarman, addDJ,
      wantsFood, foodAmount, foodConcept,
      estimatedSupplies: supplies, contractMonth, applyDiscount, isCash, isMundial
    };
    return calculateQuote(input);
  }, [pax, hours, endTime, cqp, wantsBar, barType, wantsShopper, wantsThemed, themedBudget, addBarman, addDJ, wantsFood, foodAmount, foodConcept, supplies, contractMonth, applyDiscount, isCash, isMundial]);

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans text-slate-900 pb-24 selection:bg-indigo-100">
      <div className="max-w-6xl mx-auto px-6 pt-16">
        
        <header className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-8xl font-black tracking-tighter text-slate-900 leading-none">MANTRA</h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">Professional Events • 2026 Collection</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <ToggleSwitch active={isMundial} onClick={() => setIsMundial(!isMundial)} label="⚽ Modo Mundial" color="emerald" />
            <ToggleSwitch active={isCash} onClick={handleToggleCash} label="💵 Pago Efectivo (+15%)" color="indigo" />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-12">
            
            {/* 1. Nivel */}
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">1. Selección de Experiencia</h2>
                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">Alta Gama</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {(['eco', 'std', 'prem'] as CqpLevel[]).map(level => (
                  <button
                    key={level}
                    onClick={() => handleLevelChange(level)}
                    className={`group px-6 py-10 rounded-[2.5rem] border-2 transition-all duration-500 text-center ${
                      cqp === level ? 'border-indigo-600 bg-white shadow-2xl shadow-indigo-100' : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className={`text-[9px] font-black uppercase mb-2 ${cqp === level ? 'text-indigo-600' : 'text-slate-400'}`}>Paquete</div>
                    <div className="text-xl font-black tracking-tight">{LEVEL_NAMES[level]}</div>
                  </button>
                ))}
              </div>
              
              {/* Sección de Beneficios Rediseñada para Capturas */}
              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-50 space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                  <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                  <h3 className="text-sm font-black text-indigo-700 uppercase tracking-[0.2em]">
                    Incluye en {LEVEL_NAMES[cqp]}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {CQP_DESCRIPTIONS[cqp].split('*').map((item, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      <div className="mt-1 flex-shrink-0 w-3.5 h-3.5 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full group-hover:bg-white transition-colors"></div>
                      </div>
                      <span className="text-xs font-bold text-slate-600 leading-tight group-hover:text-slate-900 transition-colors">
                        {item.trim()}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 flex justify-center">
                   <div className="px-6 py-2 bg-slate-50 rounded-full text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                      Garantía Mantra Events 2026
                   </div>
                </div>
              </div>
            </section>

            {/* 2. Configuración */}
            <section className="space-y-10">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">2. Personalización</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Aforo Invitados</label>
                    <span className="text-4xl font-black text-slate-900">{pax} <span className="text-sm text-slate-300">PAX</span></span>
                  </div>
                  <input 
                    type="range" min="15" max="80" value={pax} onChange={(e) => setPax(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase">
                    <span>Mín 15</span>
                    <span>Máx 80</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Tiempo de Evento</label>
                    <span className="text-4xl font-black text-slate-900">{hours} <span className="text-sm text-slate-300">HRS</span></span>
                  </div>
                  <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
                    {[5, 6, 7, 8, 9, 10].map(h => (
                      <button
                        key={h} onClick={() => setHours(h)}
                        className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${hours === h ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Insumos y Adicionales */}
            <section className="space-y-8">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">3. Adicionales Premium</h2>
              <div className="grid grid-cols-3 gap-4">
                <ToggleCard label="Audio & DJ" icon="🎧" active={addDJ} onClick={() => setAddDJ(!addDJ)} />
                <ToggleCard label="Servicio Barman" icon="🍸" active={addBarman} onClick={() => setAddBarman(!addBarman)} />
                <ToggleCard label="Alimentos" icon="🍕" active={wantsFood} onClick={() => setWantsFood(!wantsFood)} />
              </div>

              {wantsFood && (
                <div className="bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-100 space-y-6 animate-in zoom-in-95 duration-300">
                  <div className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Detalle de Alimentos</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Concepto / Platillo</label>
                      <input 
                        type="text" placeholder="Ej. Tacos, Pizza, Buffet..." 
                        value={foodConcept} onChange={(e) => setFoodConcept(e.target.value)}
                        className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-3 font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Inversión Alimentos</label>
                      <div className="relative">
                        <input 
                          type="number" value={foodAmount || ''} onChange={(e) => setFoodAmount(parseInt(e.target.value) || 0)}
                          className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-3 font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">MXN</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    * Valor base sugerido: {formatCurrency(PRICES.foodBase)} (incluye logística con shopper).
                  </p>
                </div>
              )}

              <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 space-y-10">
                <div className="flex flex-wrap gap-2 justify-center">
                  <TabBtn active={wantsBar} label="Barra Libre" onClick={() => { setWantsBar(true); setWantsShopper(false); setWantsThemed(false); }} />
                  <TabBtn active={wantsShopper} label="Shopper" onClick={() => { setWantsBar(false); setWantsShopper(true); setWantsThemed(false); }} />
                  <TabBtn active={wantsThemed} label="Fiesta Temática" onClick={() => { setWantsBar(false); setWantsShopper(false); setWantsThemed(true); }} />
                  <TabBtn active={!wantsBar && !wantsShopper && !wantsThemed} label="Propios" onClick={() => { setWantsBar(false); setWantsShopper(false); setWantsThemed(false); }} />
                </div>

                {wantsBar && (
                  <div className="grid grid-cols-3 gap-3">
                    {(['esencial', 'clasica', 'premium'] as BarType[]).map(type => (
                      <button
                        key={type} onClick={() => setBarType(type)}
                        className={`p-6 rounded-3xl border-2 transition-all text-center ${barType === type ? 'border-indigo-600 bg-indigo-50/20 text-indigo-600' : 'border-slate-50 text-slate-400 hover:border-slate-100'}`}
                      >
                        <div className="text-[9px] font-black uppercase mb-1">{type}</div>
                        <div className="text-sm font-black">{formatCurrency(PRICES.bar[type])}</div>
                      </button>
                    ))}
                  </div>
                )}

                {(wantsShopper || wantsThemed) && (
                  <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase px-2">
                      <span>Fee {wantsThemed ? 'Montaje Temático' : 'Shopper'}</span>
                      <span className="text-slate-900">{formatCurrency(wantsThemed ? PRICES.themedSetup : PRICES.shopper)}</span>
                    </div>
                    <div className="relative">
                      <input 
                        type="number" placeholder={wantsThemed ? "¿Presupuesto para decoración temática?" : "Inversión estimada para insumos..."}
                        value={wantsThemed ? themedBudget || '' : supplies || ''} 
                        onChange={(e) => wantsThemed ? setThemedBudget(parseInt(e.target.value) || 0) : setSupplies(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 py-5 font-bold text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all pr-16"
                      />
                      <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300">MXN</span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-5 space-y-8">
            {/* Control Comercial */}
            <section className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-3xl shadow-slate-200">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Estrategia Comercial</h3>
                <button 
                  onClick={handleToggleApplyDiscount}
                  className={`text-[9px] font-black px-3 py-1.5 rounded-full transition-all uppercase tracking-widest ${applyDiscount ? 'bg-white/10 text-slate-300 hover:bg-white/20' : 'bg-rose-500 text-white shadow-lg shadow-rose-900/40'}`}
                >
                  {applyDiscount ? 'Beneficio: Activo' : 'Beneficio: Inactivo'}
                </button>
              </div>
              
              <div className="space-y-8">
                <div className={`${!applyDiscount ? 'opacity-30 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
                  <label className="text-[9px] font-black uppercase tracking-widest opacity-40 block mb-3">Mes del Evento</label>
                  <select 
                    value={contractMonth} onChange={(e) => setContractMonth(parseInt(e.target.value))}
                    disabled={!applyDiscount}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 font-bold text-sm outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                  >
                    {MONTH_NAMES.map((m, i) => (
                      <option key={i} value={i} className="bg-slate-900">{m} ({MONTH_DISCOUNTS[i] * 100}% desc.)</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between items-end border-t border-white/10 pt-8">
                  <div>
                    <div className="text-[9px] font-black uppercase opacity-40">Precio de Lista</div>
                    <div className="text-xl font-bold line-through opacity-30">{formatCurrency(quote.totalList)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-black uppercase opacity-60">Ahorro Aplicado</div>
                    <div className={`text-3xl font-black transition-colors ${applyDiscount || isCash ? 'text-emerald-400' : 'text-slate-600'}`}>
                      -{formatCurrency(quote.totalList - quote.totalFinal)}
                    </div>
                  </div>
                </div>

                <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-center italic">
                  "Contrata con anticipación y asegura el mejor costo."
                </div>
              </div>
            </section>

            <QuoteSummary quote={quote} />
            <AISalesAssistant quote={quote} />
          </aside>
        </div>
      </div>
    </div>
  );
};

// Componentes Estilizados
const ToggleSwitch = ({ active, onClick, label, color }: any) => (
  <button 
    onClick={onClick}
    className={`px-5 py-3 rounded-full border-2 transition-all flex items-center gap-3 ${
      active ? `border-${color}-500 bg-${color}-50 text-${color}-700 shadow-lg shadow-${color}-100` : 'border-slate-50 bg-slate-50 text-slate-400'
    }`}
  >
    <div className={`w-8 h-4 rounded-full relative transition-all ${active ? `bg-${color}-500` : 'bg-slate-200'}`}>
      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${active ? 'left-4.5' : 'left-0.5'}`} />
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const ToggleCard = ({ label, icon, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-[2.5rem] border-2 flex flex-col items-center justify-center gap-2 transition-all ${active ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-50' : 'border-slate-50 bg-slate-50 opacity-60'}`}
  >
    <span className="text-2xl">{icon}</span>
    <span className={`text-[10px] font-black uppercase tracking-widest text-center ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{label}</span>
  </button>
);

const TabBtn = ({ active, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-slate-900 text-white shadow-2xl' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {label}
  </button>
);

export default App;

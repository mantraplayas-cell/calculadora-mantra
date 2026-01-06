import React from 'react';
import { QuoteResult } from '../types';
import { formatCurrency } from '../services/pricingEngine';
import { LEVEL_NAMES } from '../constants';

interface QuoteSummaryProps {
  quote: QuoteResult;
}

const QuoteSummary: React.FC<QuoteSummaryProps> = ({ quote }) => {
  if (!quote.ok) return null;

  return (
    <div className="bg-white rounded-[3rem] shadow-3xl shadow-slate-100 p-12 border border-slate-50 relative overflow-hidden">
      {quote.cashDiscountApplied > 0 && (
        <div className="absolute top-0 right-0 bg-indigo-600 text-white px-6 py-2 rounded-bl-3xl text-[9px] font-black uppercase tracking-widest">
          Beneficio Efectivo Aplicado
        </div>
      )}

      <div className="mb-12">
        <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6">Configuración de Propuesta</h3>
        <div className="space-y-4">
          {quote.breakdown.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-50 pb-3 last:border-0">
              <span className="text-slate-500 font-semibold">{item.label}</span>
              <span className="font-bold text-slate-800">{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-10 border-t-4 border-slate-900">
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Inversión Final Sugerida</div>
              <div className="text-6xl font-black text-slate-900 tracking-tighter leading-none">{formatCurrency(quote.totalFinal)}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">Por Persona</div>
              <div className="text-2xl font-black text-indigo-600">{formatCurrency(quote.pricePerPerson)}</div>
            </div>
          </div>
          
          <div className="bg-indigo-600 text-white text-[10px] px-8 py-5 rounded-3xl font-black uppercase tracking-[0.3em] text-center shadow-2xl shadow-indigo-100">
            Reserva 2026 • Garantía de Tarifa
          </div>

          {quote.messages.map((m, i) => (
            <div key={i} className="flex gap-4 text-indigo-600 text-[10px] font-black uppercase tracking-widest leading-relaxed p-6 bg-indigo-50 rounded-3xl items-start">
              <span className="text-lg">✨</span>
              <span>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuoteSummary;

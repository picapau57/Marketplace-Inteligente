import React from 'react';
import { Store, ShieldCheck, Zap, Lock, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { t, language, setLanguage, setActiveView, setSelectedCategory } = useApp();

  return (
    <footer className="bg-[#050505] text-slate-400 text-xs border-t border-[#1f1f23] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#0066FF] flex items-center justify-center text-white shadow-lg shadow-[#0066FF]/20">
                <Store className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tighter uppercase">
                DIGITAL MARKET<span className="text-[#0066FF]"> PRO</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              {t('heroSubtitle')}
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-emerald-400" />
              <span>{t('instantDeliveryBadge')}</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white uppercase text-[11px] tracking-widest font-mono">
              {t('categories')}
            </h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li>
                <button 
                  onClick={() => { setSelectedCategory('canva_template'); setActiveView('explore'); }}
                  className="hover:text-[#0066FF] transition-colors"
                >
                  {t('cat_canva_template')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedCategory('ai_prompt'); setActiveView('explore'); }}
                  className="hover:text-[#0066FF] transition-colors"
                >
                  {t('cat_ai_prompt')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedCategory('ebook'); setActiveView('explore'); }}
                  className="hover:text-[#0066FF] transition-colors"
                >
                  {t('cat_ebook')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedCategory('software'); setActiveView('explore'); }}
                  className="hover:text-[#0066FF] transition-colors"
                >
                  {t('cat_software')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedCategory('course'); setActiveView('explore'); }}
                  className="hover:text-[#0066FF] transition-colors"
                >
                  {t('cat_course')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Creators & SaaS */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white uppercase text-[11px] tracking-widest font-mono">
              {t('storeRental')} & Criadores
            </h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li>
                <button onClick={() => setActiveView('creator')} className="hover:text-[#0066FF] transition-colors">
                  {t('createStoreBtn')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('creator')} className="hover:text-[#0066FF] transition-colors">
                  Planos de Assinatura de Loja
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('admin')} className="hover:text-[#0066FF] transition-colors">
                  Configurar Mercado Pago API
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('library')} className="hover:text-[#0066FF] transition-colors">
                  {t('myLibrary')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Payment */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white uppercase text-[11px] tracking-widest font-mono">
              Pagamentos & Segurança
            </h4>
            <p className="text-slate-400">
              Receba pagamentos instantâneos via PIX com reconciliação automática pelo Mercado Pago.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="bg-[#0a0a0a] border border-[#1f1f23] px-3 py-1.5 rounded-lg flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#0066FF] fill-[#0066FF]" />
                <span className="font-bold text-white text-[10px] font-mono tracking-wider">MERCADO PAGO PIX</span>
              </div>
              <div className="bg-[#0a0a0a] border border-[#1f1f23] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-slate-300 text-[10px] font-mono tracking-wider">SSL 256-BIT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & language bar */}
        <div className="border-t border-[#1f1f23] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
          <p>© 2026 DIGITAL MARKET PRO. Todos os direitos reservados. "Sell Digital Products Automatically".</p>
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-slate-500" />
            <button 
              onClick={() => setLanguage('pt')} 
              className={`hover:text-white ${language === 'pt' ? 'text-[#0066FF] font-bold' : ''}`}
            >
              Português
            </button>
            <span>•</span>
            <button 
              onClick={() => setLanguage('en')} 
              className={`hover:text-white ${language === 'en' ? 'text-[#0066FF] font-bold' : ''}`}
            >
              English
            </button>
            <span>•</span>
            <button 
              onClick={() => setLanguage('es')} 
              className={`hover:text-white ${language === 'es' ? 'text-[#0066FF] font-bold' : ''}`}
            >
              Español
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

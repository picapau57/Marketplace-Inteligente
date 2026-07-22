import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Heart, 
  Store, 
  Zap, 
  CheckCircle, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UserLibraryView: React.FC = () => {
  const { 
    orders, 
    products, 
    stores, 
    favorites, 
    followingStores, 
    t, 
    setActiveView, 
    setSelectedProductId,
    setSelectedStoreId 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'downloads' | 'invoices' | 'wishlist' | 'following'>('downloads');

  const favoriteProducts = products.filter(p => favorites.includes(p.id));
  const followedStores = stores.filter(s => followingStores.includes(s.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#050505] text-slate-100">
      {/* Title Header */}
      <div className="bg-[#0a0a0a] rounded-2xl p-8 border border-[#1f1f23] shadow-2xl space-y-2">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight font-display">
          Minha Biblioteca de Compras
        </h1>
        <p className="text-xs text-slate-400 font-sans">
          Acesse seus arquivos digitais adquiridos, baixe comprovantes e gerencie suas lojas favoritas.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#1f1f23] pb-2 overflow-x-auto font-mono">
        <button 
          onClick={() => setActiveTab('downloads')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === 'downloads' ? 'bg-[#0066FF] text-white shadow-lg' : 'text-slate-400 hover:bg-[#0a0a0a]'}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Produtos Adquiridos ({orders.length})</span>
        </button>

        <button 
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === 'invoices' ? 'bg-[#0066FF] text-white shadow-lg' : 'text-slate-400 hover:bg-[#0a0a0a]'}`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Notas Fiscais / Recibos</span>
        </button>

        <button 
          onClick={() => setActiveTab('wishlist')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === 'wishlist' ? 'bg-[#0066FF] text-white shadow-lg' : 'text-slate-400 hover:bg-[#0a0a0a]'}`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Favoritos ({favoriteProducts.length})</span>
        </button>

        <button 
          onClick={() => setActiveTab('following')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === 'following' ? 'bg-[#0066FF] text-white shadow-lg' : 'text-slate-400 hover:bg-[#0a0a0a]'}`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Lojas Que Sigo ({followedStores.length})</span>
        </button>
      </div>

      {/* TAB 1: DOWNLOADS */}
      {activeTab === 'downloads' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-[#0a0a0a] p-12 rounded-2xl text-center border border-[#1f1f23] space-y-3 shadow-xl">
              <ShoppingBag className="w-12 h-12 text-[#0066FF] mx-auto" />
              <h3 className="text-base font-black text-white uppercase tracking-tight font-display">
                {t('noPurchasesYet')}
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Explore nosso catálogo para encontrar e-books, templates do Canva e ferramentas.
              </p>
              <button 
                onClick={() => setActiveView('explore')}
                className="bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-lg font-mono shadow-lg shadow-[#0066FF]/20"
              >
                {t('exploreProductsBtn')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {orders.map(ord => (
                <div key={ord.id} className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#1f1f23] shadow-lg space-y-4">
                  <div className="flex justify-between items-start border-b pb-3 border-[#1f1f23] font-mono">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded">
                        {ord.status.toUpperCase()} VIA PIX
                      </span>
                      <p className="text-xs text-slate-400 mt-1">Pedido #{ord.id}</p>
                    </div>
                    <span className="text-xs font-black text-[#0066FF]">
                      R$ {ord.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={item.coverImage} alt="" className="w-14 h-14 rounded-xl object-cover border border-[#1f1f23]" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-extrabold text-white uppercase tracking-wide truncate">
                          {item.productTitle}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {item.fileFormat} • Vendedor: {item.storeName}
                        </p>
                      </div>
                      <a 
                        href={item.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#0066FF] hover:bg-[#0052cc] text-white font-extrabold uppercase tracking-wider px-3.5 py-2 rounded-lg text-xs font-mono flex items-center gap-1 shrink-0 shadow-lg shadow-[#0066FF]/20"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar</span>
                      </a>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INVOICES */}
      {activeTab === 'invoices' && (
        <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#1f1f23] space-y-4 shadow-xl">
          <h3 className="text-base font-black text-white uppercase tracking-tight font-display">
            Notas Fiscais Eletrônicas Emitidas
          </h3>
          <div className="space-y-3 font-mono">
            {orders.map(ord => (
              <div key={ord.id} className="p-4 bg-[#121212] border border-[#1f1f23] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <strong className="block text-white font-bold">{ord.invoiceNumber || 'NF-2026-8910'}</strong>
                  <span className="text-[10px] text-slate-400">Emitida via PIX Mercado Pago em {ord.createdAt.split('T')[0]}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#0066FF] block">R$ {ord.totalAmount.toFixed(2)}</span>
                  <button className="text-[11px] font-bold text-slate-400 hover:text-white uppercase">Baixar PDF</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProducts.map(prod => (
            <div key={prod.id} className="bg-[#0a0a0a] rounded-2xl border border-[#1f1f23] overflow-hidden p-4 space-y-3 shadow-lg">
              <img src={prod.coverImage} alt="" className="w-full h-40 object-cover rounded-xl border border-[#1f1f23]" />
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wide line-clamp-1">{prod.title}</h4>
              <div className="flex justify-between items-center font-mono">
                <span className="font-black text-[#0066FF] text-sm">R$ {prod.price.toFixed(2)}</span>
                <button 
                  onClick={() => {
                    setSelectedProductId(prod.id);
                    setActiveView('product');
                  }}
                  className="bg-[#0066FF] hover:bg-[#0052cc] text-white font-extrabold text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md"
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

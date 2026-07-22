import React, { useState } from 'react';
import { 
  CheckCircle, 
  Star, 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  Store, 
  Zap, 
  ArrowLeft,
  X,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StoreFrontView: React.FC = () => {
  const { 
    stores, 
    products, 
    selectedStoreId, 
    setActiveView, 
    setSelectedProductId,
    openCheckout,
    toggleFollowStore,
    followingStores,
    showNotification
  } = useApp();

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [msgSubject, setMsgSubject] = useState('');
  const [msgText, setMsgText] = useState('');

  const store = stores.find(s => s.id === selectedStoreId) || stores[0];
  const storeProducts = products.filter(p => p.storeId === store.id);
  const isFollowing = followingStores.includes(store.id);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    setIsContactOpen(false);
    setMsgSubject('');
    setMsgText('');
    showNotification('Mensagem enviada com sucesso para o criador da loja!');
  };

  return (
    <div className="space-y-8 pb-16 bg-[#050505] text-slate-100">
      {/* Store Banner & Header */}
      <div className="relative">
        <div className="h-56 sm:h-72 w-full bg-[#0a0a0a] overflow-hidden relative">
          <img src={store.banner} alt={store.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
          
          <button 
            onClick={() => setActiveView('explore')}
            className="absolute top-4 left-4 bg-[#050505]/80 text-white p-2.5 rounded-lg border border-[#1f1f23] backdrop-blur-md hover:border-[#0066FF] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 z-10">
          <div className="bg-[#0a0a0a] rounded-2xl p-6 sm:p-8 border border-[#1f1f23] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img src={store.logo} alt={store.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border-2 border-[#1f1f23] shadow-lg" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-display">
                    {store.name}
                  </h1>
                  {store.verified && <CheckCircle className="w-5 h-5 text-[#0066FF]" />}
                  {store.featuredBadge && (
                    <span className="bg-amber-400 text-black text-[10px] font-black px-2.5 py-0.5 rounded font-mono uppercase tracking-wider">
                      Destaque VIP
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-slate-400 font-sans">
                  {store.tagline}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 font-mono">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {store.rating}
                  </span>
                  <span>{store.followersCount} Seguidores</span>
                  <span>{store.totalSales} Vendas</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto font-mono">
              <button 
                onClick={() => setIsContactOpen(true)}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-[#121212] border border-[#1f1f23] text-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:border-[#0066FF] transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#0066FF]" />
                <span>Mensagem</span>
              </button>

              <button 
                onClick={() => toggleFollowStore(store.id)}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${isFollowing ? 'bg-[#1f1f23] text-slate-200' : 'bg-[#0066FF] hover:bg-[#0052cc] text-white shadow-lg shadow-[#0066FF]/20'}`}
              >
                {isFollowing ? 'Seguindo' : 'Seguir Loja'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Store Description & Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#1f1f23] space-y-2">
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 font-mono">
            Sobre a Loja
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {store.description}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight font-display mb-6">
            Produtos Digitais da Loja ({storeProducts.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {storeProducts.map(prod => (
              <div key={prod.id} className="bg-[#0a0a0a] rounded-2xl border border-[#1f1f23] overflow-hidden shadow-lg hover:border-[#0066FF] transition-all flex flex-col justify-between group">
                <div>
                  <div 
                    className="aspect-[4/3] bg-[#121212] relative cursor-pointer overflow-hidden"
                    onClick={() => {
                      setSelectedProductId(prod.id);
                      setActiveView('product');
                    }}
                  >
                    <img src={prod.coverImage} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-[#050505]/90 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded border border-[#1f1f23] uppercase tracking-wider">
                      {prod.fileFormat}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 
                      onClick={() => { setSelectedProductId(prod.id); setActiveView('product'); }}
                      className="font-black text-sm text-white line-clamp-2 hover:text-[#0066FF] cursor-pointer transition-colors uppercase tracking-tight"
                    >
                      {prod.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 font-sans">{prod.shortDescription}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-[#1f1f23] mt-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-mono font-bold uppercase">PIX Mercado Pago</span>
                    <span className="text-base font-black text-[#0066FF] font-mono">R$ {prod.price.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => openCheckout(prod)}
                    className="bg-[#0066FF] hover:bg-[#0052cc] text-white font-extrabold uppercase tracking-wider px-3.5 py-2 rounded-lg text-xs flex items-center gap-1 shadow-md shadow-[#0066FF]/20"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span>Comprar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Send Message Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/90 backdrop-blur-md">
          <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#1f1f23] max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-[#1f1f23]">
              <h3 className="font-black text-base text-white uppercase tracking-tight font-display">
                Enviar Mensagem para {store.name}
              </h3>
              <button onClick={() => setIsContactOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3 text-xs font-sans">
              <div>
                <label className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] font-mono block mb-1">Assunto</label>
                <input 
                  type="text" 
                  required
                  value={msgSubject}
                  onChange={(e) => setMsgSubject(e.target.value)}
                  placeholder="Dúvida sobre arquivo, suporte..." 
                  className="w-full bg-[#121212] text-slate-100 p-2.5 rounded-lg border border-[#1f1f23] focus:border-[#0066FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] font-mono block mb-1">Mensagem</label>
                <textarea 
                  required
                  rows={4}
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                  placeholder="Escreva sua pergunta ao vendedor..." 
                  className="w-full bg-[#121212] text-slate-100 p-2.5 rounded-lg border border-[#1f1f23] focus:border-[#0066FF] focus:outline-none resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#0066FF] hover:bg-[#0052cc] text-white font-extrabold uppercase tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-[#0066FF]/20 font-mono"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Mensagem</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Star, 
  Zap, 
  CheckCircle, 
  ShieldCheck, 
  Download, 
  Share2, 
  Store, 
  MessageSquare, 
  FileText, 
  Copy, 
  Eye,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProductDetailView: React.FC = () => {
  const { 
    products, 
    stores, 
    selectedProductId, 
    openCheckout, 
    t, 
    setActiveView, 
    setSelectedStoreId,
    toggleFollowStore,
    followingStores,
    showNotification
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const product = products.find(p => p.id === selectedProductId) || products[0];
  const store = stores.find(s => s.id === product.storeId) || stores[0];

  const isFollowing = followingStores.includes(store.id);

  const handleCopyAffiliate = () => {
    const affLink = `${window.location.origin}/product/${product.slug}?aff=user_101`;
    navigator.clipboard.writeText(affLink);
    setCopiedLink(true);
    showNotification('Link de Afiliado copiado! Você receberá 15% de comissão por cada venda.');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 bg-[#050505] text-slate-100">
      {/* Back to Explore Button */}
      <button 
        onClick={() => setActiveView('explore')}
        className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-[#0066FF] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para a Loja</span>
      </button>

      {/* Product Main Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#0a0a0a] border border-[#1f1f23] shadow-xl relative">
            <img 
              src={product.previewImages[activeImageIdx] || product.coverImage} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-[#050505]/90 text-white text-xs font-mono font-bold px-3 py-1.5 rounded border border-[#1f1f23] uppercase tracking-wider">
              {product.fileFormat}
            </span>
          </div>

          {/* Thumbnails */}
          {product.previewImages.length > 1 && (
            <div className="flex gap-3">
              {product.previewImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImageIdx === idx ? 'border-[#0066FF] shadow-lg scale-105' : 'border-[#1f1f23] opacity-70'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Product Full Description */}
          <div className="bg-[#0a0a0a] rounded-2xl p-8 border border-[#1f1f23] space-y-4">
            <h3 className="text-lg font-black text-white uppercase tracking-tight font-display border-b pb-3 border-[#1f1f23]">
              Sobre este Produto Digital
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
              {product.description}
            </p>

            <div className="pt-4 border-t border-[#1f1f23]">
              <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest font-mono mb-2">
                Tags do Conteúdo
              </h4>
              <div className="flex flex-wrap gap-2 font-mono">
                {product.tags.map((tag, i) => (
                  <span key={i} className="bg-[#121212] border border-[#1f1f23] text-slate-300 text-xs px-3 py-1 rounded font-bold uppercase">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Buy Box & Seller Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0a0a0a] rounded-2xl p-8 border border-[#1f1f23] shadow-2xl space-y-6 sticky top-24">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono">
                <span className="bg-[#0066FF] text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
                  {t('instantDeliveryBadge')}
                </span>
                <span className="text-xs text-slate-400 font-bold uppercase">
                  {product.salesCount} vendas
                </span>
              </div>

              <h1 className="text-2xl font-black text-white uppercase tracking-tight font-display leading-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-2 mt-3 font-mono">
                <div className="flex items-center text-amber-400 text-sm font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="ml-1">{product.rating}</span>
                </div>
                <span className="text-xs text-slate-500">({product.reviewsCount} avaliações)</span>
              </div>
            </div>

            {/* Price Showcase */}
            <div className="bg-[#121212] p-5 rounded-xl border border-[#1f1f23] flex items-center justify-between font-mono">
              <div>
                <span className="text-xs text-slate-500 line-through block">
                  R$ {product.originalPrice?.toFixed(2) || (product.price * 2).toFixed(2)}
                </span>
                <span className="text-3xl font-black text-[#0066FF]">
                  R$ {product.price.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 block uppercase">Preço único no PIX</span>
              </div>
              <div className="text-right">
                <span className="bg-emerald-500 text-black text-[10px] font-black px-2 py-1 rounded uppercase">
                  Desconto Ativo
                </span>
              </div>
            </div>

            {/* Buy CTA */}
            <button 
              onClick={() => openCheckout(product)}
              className="w-full bg-[#0066FF] hover:bg-[#0052cc] text-white font-extrabold uppercase tracking-wider py-4 px-6 rounded-xl text-sm shadow-xl shadow-[#0066FF]/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span>{t('buyNowPix')}</span>
            </button>

            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('instantDeliveryText')}</span>
            </p>

            {/* Seller Card */}
            <div className="border-t pt-6 border-[#1f1f23] space-y-4">
              <h4 className="text-[10px] font-extrabold uppercase text-slate-500 tracking-widest font-mono">
                {t('sellerInformation')}
              </h4>

              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => {
                    setSelectedStoreId(store.id);
                    setActiveView('store');
                  }}
                >
                  <img src={store.logo} alt={store.name} className="w-12 h-12 rounded-xl object-cover shadow-md border border-[#1f1f23]" />
                  <div>
                    <h5 className="font-bold text-sm text-white flex items-center gap-1 hover:text-[#0066FF] uppercase tracking-wider">
                      <span>{store.name}</span>
                      {store.verified && <CheckCircle className="w-4 h-4 text-[#0066FF]" />}
                    </h5>
                    <p className="text-xs text-slate-400 font-mono">{store.followersCount} seguidores</p>
                  </div>
                </div>

                <button 
                  onClick={() => toggleFollowStore(store.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors font-mono ${isFollowing ? 'bg-[#1f1f23] text-slate-200' : 'bg-[#0066FF] text-white'}`}
                >
                  {isFollowing ? 'Seguindo' : 'Seguir Loja'}
                </button>
              </div>
            </div>

            {/* Affiliate Link Generator */}
            <div className="bg-[#121212] border border-amber-500/40 p-4 rounded-xl space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1 uppercase">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Programa de Afiliados</span>
                </span>
                <span className="text-[10px] font-black bg-amber-400 text-black px-2 py-0.5 rounded">
                  15% Comissão
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans">
                Divulgue este produto digital e receba R$ {(product.price * 0.15).toFixed(2)} por cada venda via PIX.
              </p>
              <button 
                onClick={handleCopyAffiliate}
                className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-2 px-3 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Copiado!' : t('copyAffiliateLink')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

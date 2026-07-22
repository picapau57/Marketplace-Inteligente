import React, { useState } from 'react';
import { 
  Sparkles, 
  Store, 
  Zap, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Palette, 
  BookOpen, 
  Video, 
  Code, 
  FileText, 
  ShieldCheck, 
  Award,
  TrendingUp,
  Download,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_CATEGORIES, INITIAL_MONETIZATION_PLANS } from '../data/initialData';
import { DigitalProduct } from '../types';

export const HomeView: React.FC = () => {
  const { 
    products, 
    stores, 
    t, 
    setActiveView, 
    setSelectedProductId, 
    setSelectedCategory,
    openCheckout,
    toggleFavorite,
    favorites
  } = useApp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const featuredProducts = products.filter(p => p.featured);
  const trendingProducts = products.filter(p => p.trending);
  const canvaAndAiProducts = products.filter(p => p.type === 'canva_template' || p.type === 'ai_prompt');

  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
    setActiveView('product');
  };

  return (
    <div className="space-y-16 pb-16 bg-[#050505] text-slate-100">
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative overflow-hidden bg-[#050505] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#1f1f23]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,102,255,0.15),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a0a0a] border border-[#0066FF] text-[#0066FF] text-xs font-mono font-bold uppercase tracking-widest shadow-lg">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
            <span>{t('sellDigitalProducts')} — MERCADO PAGO PIX</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-7xl font-black tracking-tighter uppercase max-w-5xl mx-auto leading-none text-white font-display">
            {t('heroTitle')}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans font-medium">
            {t('heroSubtitle')}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button 
              onClick={() => setActiveView('creator')}
              className="w-full sm:w-auto bg-[#0066FF] hover:bg-[#0052cc] text-white font-extrabold px-8 py-4 rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-[#0066FF]/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <Store className="w-5 h-5" />
              <span>{t('createStoreBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setActiveView('explore')}
              className="w-full sm:w-auto bg-[#0a0a0a] hover:bg-[#121212] text-white border border-[#1f1f23] hover:border-slate-600 font-extrabold px-8 py-4 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
            >
              <span>{t('exploreProductsBtn')}</span>
            </button>
          </div>

          {/* Key Metrics Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-[#1f1f23] text-left">
            <div className="flex items-center gap-3 bg-[#0a0a0a] p-3.5 rounded-xl border border-[#1f1f23]">
              <div className="p-2 bg-[#0066FF]/20 text-[#0066FF] rounded-lg">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-xs font-mono uppercase font-extrabold">{t('statsProducts')}</strong>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t('instantDeliveryBadge')}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#0a0a0a] p-3.5 rounded-xl border border-[#1f1f23]">
              <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-xs font-mono uppercase font-extrabold">{t('statsStores')}</strong>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Lojas Ativas</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#0a0a0a] p-3.5 rounded-xl border border-[#1f1f23]">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-xs font-mono uppercase font-extrabold">Mercado Pago PIX</strong>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t('autoApprovalBadge')}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#0a0a0a] p-3.5 rounded-xl border border-[#1f1f23]">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-xs font-mono uppercase font-extrabold">{t('moneyBackGuarantee')}</strong>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">100% Protegido</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CATEGORIES GRID ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display">
              {t('categories')}
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Encontre modelos prontos, e-books e ferramentas para alavancar seu negócio
            </p>
          </div>
          <button 
            onClick={() => setActiveView('explore')}
            className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1 uppercase tracking-wider font-mono"
          >
            <span>Ver Todas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {INITIAL_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.slug);
                setActiveView('explore');
              }}
              className="p-4 bg-[#0a0a0a] rounded-xl border border-[#1f1f23] hover:border-[#0066FF] text-left transition-all hover:shadow-xl group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#121212] text-[#0066FF] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-[#1f1f23]">
                {cat.slug === 'canva_template' && <Palette className="w-5 h-5" />}
                {cat.slug === 'ai_prompt' && <Sparkles className="w-5 h-5" />}
                {cat.slug === 'ebook' && <BookOpen className="w-5 h-5" />}
                {cat.slug === 'course' && <Video className="w-5 h-5" />}
                {cat.slug === 'software' && <Code className="w-5 h-5" />}
                {cat.slug === 'business_form' && <FileText className="w-5 h-5" />}
                {cat.slug !== 'canva_template' && cat.slug !== 'ai_prompt' && cat.slug !== 'ebook' && cat.slug !== 'course' && cat.slug !== 'software' && cat.slug !== 'business_form' && <Store className="w-5 h-5" />}
              </div>
              <h3 className="font-extrabold text-xs text-white uppercase tracking-wider group-hover:text-[#0066FF] transition-colors">
                {t(cat.nameKey)}
              </h3>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                {cat.count}+ itens
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* ---------------- FEATURED PRODUCTS GRID ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[10px] font-extrabold text-[#0066FF] uppercase tracking-widest block font-mono">
              Seleção Especial
            </span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display">
              {t('featuredProducts')}
            </h2>
          </div>
          <button 
            onClick={() => setActiveView('explore')}
            className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1 uppercase tracking-wider font-mono"
          >
            <span>{t('explore')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map(prod => (
            <ProductCard 
              key={prod.id} 
              product={prod} 
              onProductClick={handleProductClick} 
              onBuyPix={openCheckout}
              onToggleFav={toggleFavorite}
              isFav={favorites.includes(prod.id)}
            />
          ))}
        </div>
      </section>

      {/* ---------------- CANVA & AI PROMPTS SPOTLIGHT ---------------- */}
      <section className="bg-[#0a0a0a] text-white py-14 px-4 sm:px-6 lg:px-8 border-y border-[#1f1f23]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
            <div>
              <span className="bg-[#0066FF] text-white text-[10px] font-black px-3 py-1 rounded uppercase tracking-widest mb-2 inline-block font-mono">
                Mais Desejados
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight font-display">
                {t('canvaAiSpotlight')}
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Aumente suas vendas nas redes sociais com artes profissionais no Canva e comandos de Inteligência Artificial.
              </p>
            </div>
            <button 
              onClick={() => { setSelectedCategory('canva_template'); setActiveView('explore'); }}
              className="bg-[#0066FF] hover:bg-[#0052cc] text-white font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-lg text-xs transition-colors shadow-lg shadow-[#0066FF]/20"
            >
              Ver Coleção Canva
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {canvaAndAiProducts.map(prod => (
              <ProductCard 
                key={prod.id} 
                product={prod} 
                onProductClick={handleProductClick} 
                onBuyPix={openCheckout}
                onToggleFav={toggleFavorite}
                isFav={favorites.includes(prod.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- STORE RENTAL / MONETIZATION PLANS ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0066FF] font-mono">
            Monetização & Aluguel de Loja Digital
          </span>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight font-display">
            Escolha o Plano Ideal para Sua Loja Digital
          </h2>
          <p className="text-xs text-slate-400">
            Comece grátis ou faça upgrade para ter menor taxa de comissão, domínio próprio e destaque no marketplace.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-[#0a0a0a] p-1 rounded-lg text-xs font-bold border border-[#1f1f23] mt-4 uppercase tracking-wider">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded transition-all ${billingCycle === 'monthly' ? 'bg-[#0066FF] text-white' : 'text-slate-400'}`}
            >
              Cobrança Mensal
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded transition-all flex items-center gap-1 ${billingCycle === 'annual' ? 'bg-[#0066FF] text-white' : 'text-slate-400'}`}
            >
              <span>Cobrança Anual</span>
              <span className="bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded font-mono">20% OFF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INITIAL_MONETIZATION_PLANS.map(plan => {
            const price = billingCycle === 'monthly' ? plan.priceMonthly : Math.round(plan.priceAnnual / 12);
            return (
              <div 
                key={plan.id}
                className={`bg-[#0a0a0a] rounded-2xl p-8 border ${plan.popular ? 'border-2 border-[#0066FF] shadow-2xl relative shadow-[#0066FF]/20' : 'border-[#1f1f23]'} flex flex-col justify-between space-y-6`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0066FF] text-white text-[10px] font-mono font-extrabold px-3 py-1 rounded uppercase tracking-widest shadow-md">
                    Mais Popular
                  </span>
                )}

                <div className="space-y-4">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight font-display">
                    {plan.name}
                  </h3>
                  <div>
                    <span className="text-4xl font-black text-white font-mono">
                      R$ {price.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">/mês</span>
                  </div>

                  <div className="p-3 bg-[#121212] border border-[#1f1f23] rounded-lg text-xs font-bold text-slate-300 flex justify-between uppercase font-mono">
                    <span>Taxa de Comissão:</span>
                    <strong className="text-[#0066FF]">{plan.commissionFee}% por venda</strong>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300 pt-2 font-medium">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={() => setActiveView('creator')}
                  className={`w-full py-3 px-4 rounded-lg font-extrabold text-xs uppercase tracking-wider transition-all ${plan.popular ? 'bg-[#0066FF] hover:bg-[#0052cc] text-white shadow-lg shadow-[#0066FF]/30' : 'bg-[#121212] hover:bg-[#1f1f23] text-white border border-[#1f1f23]'}`}
                >
                  Criar Loja com este Plano
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

// Reusable Product Card Component
interface ProductCardProps {
  product: DigitalProduct;
  onProductClick: (id: string) => void;
  onBuyPix: (p: DigitalProduct) => void;
  onToggleFav: (id: string) => void;
  isFav: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onProductClick, 
  onBuyPix, 
  onToggleFav, 
  isFav 
}) => {
  return (
    <div className="bg-[#0a0a0a] rounded-2xl border border-[#1f1f23] overflow-hidden shadow-lg hover:border-[#0066FF] transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Cover Image & Badges */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#121212] cursor-pointer" onClick={() => onProductClick(product.id)}>
          <img 
            src={product.coverImage} 
            alt={product.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="bg-[#050505]/90 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded border border-[#1f1f23] uppercase tracking-wider">
              {product.fileFormat}
            </span>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav(product.id);
            }}
            className="absolute top-3 right-3 p-2 bg-[#050505]/80 backdrop-blur-md rounded-lg text-slate-200 border border-[#1f1f23] hover:scale-110 transition-transform"
          >
            <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Info */}
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <img src={product.storeLogo} alt="" className="w-5 h-5 rounded-md object-cover" />
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] font-mono">{product.storeName}</span>
            {product.storeVerified && <CheckCircle className="w-3.5 h-3.5 text-[#0066FF]" />}
          </div>

          <h3 
            onClick={() => onProductClick(product.id)}
            className="font-black text-sm text-white line-clamp-2 hover:text-[#0066FF] cursor-pointer transition-colors uppercase tracking-tight"
          >
            {product.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 font-sans">
            {product.shortDescription}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-mono">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-500 font-normal">({product.reviewsCount})</span>
            </div>
            <span>{product.salesCount} vendas</span>
          </div>
        </div>
      </div>

      {/* Footer Price & Buy Button */}
      <div className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-[#1f1f23] mt-2">
        <div>
          <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Preço à vista PIX</span>
          <span className="text-lg font-black text-[#0066FF] font-mono">
            R$ {product.price.toFixed(2)}
          </span>
        </div>

        <button 
          onClick={() => onBuyPix(product)}
          className="bg-[#0066FF] hover:bg-[#0052cc] text-white font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-[#0066FF]/20 transition-all"
        >
          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          <span>Comprar PIX</span>
        </button>
      </div>
    </div>
  );
};

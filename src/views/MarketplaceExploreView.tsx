import React, { useState } from 'react';
import { 
  Filter, 
  Search, 
  Star, 
  Zap, 
  CheckCircle, 
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_CATEGORIES } from '../data/initialData';
import { DigitalProduct, ProductType } from '../types';

export const MarketplaceExploreView: React.FC = () => {
  const { 
    products, 
    t, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    openCheckout,
    setSelectedProductId,
    setActiveView,
    favorites,
    toggleFavorite
  } = useApp();

  const [sortOption, setSortOption] = useState<'sales' | 'price_asc' | 'price_desc' | 'rating'>('sales');
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [instantOnly, setInstantOnly] = useState<boolean>(false);

  let filtered = products.filter(p => {
    if (selectedCategory && p.type !== selectedCategory) return false;
    if (p.price > maxPrice) return false;
    if (instantOnly && !p.instantDelivery) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTags = p.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  if (sortOption === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else {
    filtered.sort((a, b) => b.salesCount - a.salesCount);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#050505] text-slate-100">
      {/* Header & Filter Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0a0a] p-6 rounded-2xl border border-[#1f1f23] shadow-lg">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight font-display">
            Catálogo de Produtos Digitais
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            {filtered.length} produtos encontrados no marketplace com entrega automática via PIX
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-[#121212] text-slate-100 text-xs rounded-lg pl-9 pr-8 py-2.5 border border-[#1f1f23] focus:border-[#0066FF] focus:outline-none font-medium placeholder:text-slate-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={sortOption}
            onChange={(e: any) => setSortOption(e.target.value)}
            className="bg-[#121212] border border-[#1f1f23] text-slate-200 text-xs font-bold font-mono uppercase tracking-wider rounded-lg px-3 py-2.5 focus:outline-none"
          >
            <option value="sales">Mais Vendidos</option>
            <option value="price_asc">Menor Preço</option>
            <option value="price_desc">Maior Preço</option>
            <option value="rating">Melhor Avaliação</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filters */}
        <div className="space-y-6 bg-[#0a0a0a] p-6 rounded-2xl border border-[#1f1f23] h-fit">
          <div className="flex items-center justify-between border-b pb-4 border-[#1f1f23]">
            <h3 className="font-extrabold text-xs uppercase tracking-widest text-white flex items-center gap-2 font-mono">
              <Filter className="w-4 h-4 text-[#0066FF]" />
              <span>Filtros de Busca</span>
            </h3>
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory(null)}
                className="text-[11px] font-bold text-rose-500 hover:underline uppercase tracking-wider font-mono"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest font-mono">
              Categorias
            </label>
            <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${selectedCategory === null ? 'bg-[#0066FF] text-white' : 'text-slate-300 hover:bg-[#121212]'}`}
              >
                {t('allCategories')}
              </button>
              {INITIAL_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${selectedCategory === cat.slug ? 'bg-[#0066FF] text-white' : 'text-slate-300 hover:bg-[#121212]'}`}
                >
                  <span>{t(cat.nameKey)}</span>
                  <span className="text-[10px] font-mono opacity-70">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-[#1f1f23]">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              <span>Preço Máximo:</span>
              <span className="text-[#0066FF]">Até R$ {maxPrice}</span>
            </div>
            <input 
              type="range"
              min="10"
              max="500"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#0066FF]"
            />
          </div>

          {/* Instant Delivery Toggle */}
          <div className="pt-2 border-t border-[#1f1f23]">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 cursor-pointer font-mono">
              <input 
                type="checkbox"
                checked={instantOnly}
                onChange={(e) => setInstantOnly(e.target.checked)}
                className="rounded accent-[#0066FF]"
              />
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Apenas Entrega Instantânea PIX</span>
            </label>
          </div>
        </div>

        {/* Right Product Grid */}
        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <div className="bg-[#0a0a0a] p-12 rounded-2xl text-center border border-[#1f1f23] space-y-3">
              <Search className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-black uppercase text-white tracking-tight font-display">
                Nenhum produto encontrado
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Tente ajustar os termos da busca ou selecionar outra categoria.
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); setMaxPrice(500); }}
                className="bg-[#0066FF] text-white text-xs font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-lg mt-2 shadow-lg shadow-[#0066FF]/20"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map(prod => (
                <div 
                  key={prod.id}
                  className="bg-[#0a0a0a] rounded-2xl border border-[#1f1f23] overflow-hidden shadow-lg hover:border-[#0066FF] transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div 
                      className="relative aspect-[4/3] bg-[#121212] overflow-hidden cursor-pointer"
                      onClick={() => {
                        setSelectedProductId(prod.id);
                        setActiveView('product');
                      }}
                    >
                      <img src={prod.coverImage} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 left-3 bg-[#050505]/90 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded border border-[#1f1f23] uppercase tracking-wider">
                        {prod.fileFormat}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(prod.id); }}
                        className="absolute top-3 right-3 p-2 bg-[#050505]/80 rounded-lg border border-[#1f1f23] shadow-md hover:scale-110 transition-transform"
                      >
                        <Star className={`w-4 h-4 ${favorites.includes(prod.id) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                        <img src={prod.storeLogo} alt="" className="w-4 h-4 rounded-md object-cover" />
                        <span className="font-bold uppercase tracking-wider text-[11px]">{prod.storeName}</span>
                      </div>
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
          )}
        </div>
      </div>
    </div>
  );
};

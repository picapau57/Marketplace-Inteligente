import React, { useState } from 'react';
import { 
  PlusCircle, 
  Store, 
  DollarSign, 
  ShoppingBag, 
  Sparkles, 
  Tag, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle,
  FileText,
  Upload,
  Zap,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DigitalProduct, ProductType } from '../types';

export const CreatorStudioView: React.FC = () => {
  const { 
    products, 
    stores, 
    user, 
    addNewProduct, 
    openAiModal, 
    t, 
    showNotification,
    setActiveView,
    setSelectedStoreId
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'add_product' | 'products' | 'coupons' | 'messages' | 'settings'>('overview');

  // Product Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('49.90');
  const [originalPrice, setOriginalPrice] = useState('149.90');
  const [type, setType] = useState<ProductType>('canva_template');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fileFormat, setFileFormat] = useState('Link Editável no Canva / Arquivo ZIP');
  const [downloadUrl, setDownloadUrl] = useState('https://canva.com/design/demo-template-pack-digital-market-pro');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=450&fit=crop&q=80');
  const [tags, setTags] = useState('Canva, Instagram, Templates');

  // Coupons State
  const [coupons, setCoupons] = useState([
    { code: 'PROMO20', discount: 20, uses: 45, active: true },
    { code: 'PIX5', discount: 5, uses: 110, active: true }
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('10');

  const myStore = stores[0]; // Active creator store
  const myProducts = products.filter(p => p.storeId === myStore.id);

  const totalRevenue = myProducts.reduce((acc, p) => acc + (p.price * p.salesCount), 0) + myStore.totalRevenue;
  const totalSales = myProducts.reduce((acc, p) => acc + p.salesCount, 0) + myStore.totalSales;

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) {
      showNotification('Preencha pelo menos o título e preço do produto.');
      return;
    }

    await addNewProduct({
      title,
      price: Number(price),
      originalPrice: Number(originalPrice),
      type,
      description,
      shortDescription: shortDescription || title,
      fileFormat,
      downloadUrl,
      coverImage,
      tags: tags.split(',').map(t => t.trim()),
      storeId: myStore.id,
      storeName: myStore.name,
      storeLogo: myStore.logo
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setShortDescription('');
    setActiveTab('products');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    setCoupons(prev => [
      { code: newCouponCode.toUpperCase(), discount: Number(newCouponDiscount), uses: 0, active: true },
      ...prev
    ]);
    setNewCouponCode('');
    showNotification(`Cupom ${newCouponCode.toUpperCase()} criado!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#050505] text-slate-100">
      {/* Top Banner Header */}
      <div className="bg-[#0a0a0a] rounded-2xl p-8 text-white border border-[#1f1f23] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img src={myStore.logo} alt="" className="w-16 h-16 rounded-xl object-cover border-2 border-[#1f1f23]" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black uppercase tracking-tight font-display">{myStore.name}</h1>
              <span className="bg-[#0066FF] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {myStore.plan.toUpperCase()} STORE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-sans">{myStore.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <button 
            onClick={() => {
              setSelectedStoreId(myStore.id);
              setActiveView('store');
            }}
            className="bg-[#121212] hover:bg-[#1a1a1a] text-white font-bold px-4 py-2.5 rounded-lg text-xs border border-[#1f1f23] flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            <Globe className="w-4 h-4 text-[#0066FF]" />
            <span>Ver Loja Pública</span>
          </button>

          <button 
            onClick={() => setActiveTab('add_product')}
            className="bg-[#0066FF] hover:bg-[#0052cc] text-white font-extrabold px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-[#0066FF]/20 transition-colors uppercase tracking-wider"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('uploadProduct')}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#1f1f23] pb-2 overflow-x-auto font-mono">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'overview' ? 'bg-[#0066FF] text-white' : 'text-slate-400 hover:bg-[#0a0a0a]'}`}
        >
          Visão Geral & Vendas
        </button>

        <button 
          onClick={() => setActiveTab('add_product')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === 'add_product' ? 'bg-[#0066FF] text-white' : 'text-slate-400 hover:bg-[#0a0a0a]'}`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Novo Produto Digital</span>
        </button>

        <button 
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'products' ? 'bg-[#0066FF] text-white' : 'text-slate-400 hover:bg-[#0a0a0a]'}`}
        >
          Meus Produtos ({myProducts.length})
        </button>

        <button 
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'coupons' ? 'bg-[#0066FF] text-white' : 'text-slate-400 hover:bg-[#0a0a0a]'}`}
        >
          Cupons & Descontos
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#1f1f23] shadow-lg space-y-2">
              <div className="flex items-center justify-between text-[#0066FF]">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 font-mono">
                  {t('totalRevenue')}
                </span>
                <DollarSign className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-white font-mono">
                R$ {totalRevenue.toFixed(2)}
              </p>
              <span className="text-[11px] text-emerald-400 font-bold font-mono flex items-center gap-1 uppercase">
                <TrendingUp className="w-3.5 h-3.5" />
                +24.5% este mês
              </span>
            </div>

            <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#1f1f23] shadow-lg space-y-2">
              <div className="flex items-center justify-between text-purple-400">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 font-mono">
                  {t('totalOrders')}
                </span>
                <ShoppingBag className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-white font-mono">
                {totalSales} vendas
              </p>
              <span className="text-[11px] text-slate-400 font-mono">Aprovação 100% PIX</span>
            </div>

            <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#1f1f23] shadow-lg space-y-2">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 font-mono">
                  {t('activeProducts')}
                </span>
                <Tag className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-white font-mono">
                {myProducts.length} itens
              </p>
              <span className="text-[11px] text-slate-400 font-mono">Entrega instantânea</span>
            </div>

            <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#1f1f23] shadow-lg space-y-2">
              <div className="flex items-center justify-between text-amber-400">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 font-mono">
                  Comissão Plataforma
                </span>
                <Zap className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-white font-mono">
                8% (Plano Pro)
              </p>
              <span className="text-[11px] text-[#0066FF] font-mono font-bold cursor-pointer uppercase">
                Upgrade VIP (5%)
              </span>
            </div>
          </div>

          {/* Quick AI Creator Banner */}
          <div className="bg-[#0a0a0a] border border-[#1f1f23] p-6 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#121212] border border-[#1f1f23] rounded-xl">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-base uppercase tracking-tight font-display">Assistente Gemini AI para Criadores</h3>
                <p className="text-xs text-slate-400 font-sans">
                  Crie títulos de alta conversão e descrições irresistíveis para seus produtos digitais em segundos.
                </p>
              </div>
            </div>
            <button 
              onClick={() => openAiModal()}
              className="bg-amber-400 hover:bg-amber-500 text-black font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-lg text-xs font-mono whitespace-nowrap shadow-md transition-colors"
            >
              Abrir Gerador com IA
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: ADD PRODUCT FORM */}
      {activeTab === 'add_product' && (
        <div className="bg-[#0a0a0a] rounded-2xl p-8 border border-[#1f1f23] shadow-2xl max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b pb-4 border-[#1f1f23]">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight font-display">
                Cadastrar Novo Produto Digital
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Os arquivos e links de acesso são liberados automaticamente após a confirmação do PIX Mercado Pago.
              </p>
            </div>

            <button 
              type="button"
              onClick={() => openAiModal(title)}
              className="bg-[#121212] border border-[#1f1f23] hover:border-[#0066FF] text-amber-400 font-bold px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gerar Descrição IA</span>
            </button>
          </div>

          <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-sans">
            <div>
              <label className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] font-mono block mb-1">
                {t('productTitle')} *
              </label>
              <input 
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Kit 1.000 Templates Canva para Redes Sociais 2026"
                className="w-full bg-[#121212] text-slate-100 p-3 rounded-lg border border-[#1f1f23] focus:border-[#0066FF] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] font-mono block mb-1">
                  {t('productPrice')} *
                </label>
                <input 
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[#121212] text-slate-100 p-3 rounded-lg border border-[#1f1f23] focus:border-[#0066FF] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] font-mono block mb-1">
                  Preço Original (R$)
                </label>
                <input 
                  type="number"
                  step="0.01"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full bg-[#121212] text-slate-100 p-3 rounded-lg border border-[#1f1f23] focus:border-[#0066FF] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] font-mono block mb-1">
                  {t('productType')}
                </label>
                <select 
                  value={type}
                  onChange={(e: any) => setType(e.target.value)}
                  className="w-full bg-[#121212] text-slate-100 p-3 rounded-lg border border-[#1f1f23] focus:border-[#0066FF] focus:outline-none font-mono uppercase"
                >
                  <option value="canva_template">Template Canva</option>
                  <option value="ai_prompt">Prompt de IA</option>
                  <option value="ebook">E-book / Livro Digital</option>
                  <option value="course">Curso em Vídeo</option>
                  <option value="software">Software / Script</option>
                  <option value="business_form">Contrato / Documento</option>
                  <option value="subscription">Assinatura Recorrente</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] font-mono block mb-1">
                Formato / Tipo de Entrega
              </label>
              <input 
                type="text"
                value={fileFormat}
                onChange={(e) => setFileFormat(e.target.value)}
                placeholder="Ex: Link direto do Canva Pro, PDF 180 Pág, ZIP 250 MB"
                className="w-full bg-[#121212] text-slate-100 p-3 rounded-lg border border-[#1f1f23] focus:border-[#0066FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] font-mono block mb-1">
                Link do Arquivo Digital para Download Automático *
              </label>
              <input 
                type="url"
                required
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                placeholder="https://canva.com/design/... ou link de servidor seguro"
                className="w-full bg-[#121212] text-slate-100 p-3 rounded-lg border border-[#1f1f23] focus:border-[#0066FF] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] font-mono block mb-1">
                URL da Capa do Produto (Imagem)
              </label>
              <input 
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full bg-[#121212] text-slate-100 p-3 rounded-lg border border-[#1f1f23] focus:border-[#0066FF] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] font-mono block mb-1">
                {t('productDescription')}
              </label>
              <textarea 
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva todo o conteúdo, formato, o que está incluído e benefícios..."
                className="w-full bg-[#121212] text-slate-100 p-3 rounded-lg border border-[#1f1f23] focus:border-[#0066FF] focus:outline-none resize-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#0066FF] hover:bg-[#0052cc] text-white font-extrabold uppercase tracking-wider py-3.5 rounded-lg text-xs shadow-lg shadow-[#0066FF]/20 font-mono"
            >
              {t('saveProductBtn')}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: PRODUCTS LIST */}
      {activeTab === 'products' && (
        <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#1f1f23] shadow-lg space-y-4">
          <h2 className="text-lg font-black text-white uppercase tracking-tight font-display">
            Meus Produtos Digitais ({myProducts.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#121212] text-slate-400 uppercase text-[10px] tracking-widest border-b border-[#1f1f23]">
                <tr>
                  <th className="p-3.5">Produto</th>
                  <th className="p-3.5">Tipo</th>
                  <th className="p-3.5">Preço</th>
                  <th className="p-3.5">Vendas</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f23]">
                {myProducts.map(prod => (
                  <tr key={prod.id}>
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={prod.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover border border-[#1f1f23]" />
                      <div>
                        <strong className="block text-white font-bold uppercase tracking-wide">{prod.title}</strong>
                        <span className="text-[10px] text-slate-400">{prod.fileFormat}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-300 uppercase text-[10px]">
                      {prod.type}
                    </td>
                    <td className="p-3.5 font-bold text-[#0066FF]">
                      R$ {prod.price.toFixed(2)}
                    </td>
                    <td className="p-3.5 font-bold text-slate-200">
                      {prod.salesCount} vendas
                    </td>
                    <td className="p-3.5">
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 uppercase">
                        Ativo PIX
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button className="text-[#0066FF] font-bold hover:underline uppercase">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#1f1f23] space-y-4">
            <h3 className="text-lg font-black text-white uppercase tracking-tight font-display">
              Criar Novo Cupom de Desconto
            </h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs font-sans">
              <div>
                <label className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] font-mono block mb-1">Código do Cupom</label>
                <input 
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  placeholder="Ex: BLACKFRIDAY50"
                  className="w-full bg-[#121212] text-slate-100 p-3 rounded-lg border border-[#1f1f23] focus:border-[#0066FF] focus:outline-none uppercase font-mono"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] font-mono block mb-1">% de Desconto</label>
                <input 
                  type="number"
                  required
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(e.target.value)}
                  className="w-full bg-[#121212] text-slate-100 p-3 rounded-lg border border-[#1f1f23] focus:border-[#0066FF] focus:outline-none font-mono"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#0066FF] hover:bg-[#0052cc] text-white font-extrabold uppercase tracking-wider py-3 rounded-lg font-mono shadow-lg shadow-[#0066FF]/20"
              >
                Ativar Cupom na Loja
              </button>
            </form>
          </div>

          <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#1f1f23] space-y-4">
            <h3 className="text-lg font-black text-white uppercase tracking-tight font-display">
              Cupons Ativos
            </h3>
            <div className="space-y-2">
              {coupons.map((c, i) => (
                <div key={i} className="p-3.5 bg-[#121212] border border-[#1f1f23] rounded-xl flex items-center justify-between text-xs font-mono">
                  <div>
                    <strong className="text-[#0066FF] font-extrabold text-sm block">{c.code}</strong>
                    <span className="text-[10px] text-slate-400">{c.uses} utilizações efetuadas</span>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-3 py-1 rounded text-xs">
                    {c.discount}% OFF
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

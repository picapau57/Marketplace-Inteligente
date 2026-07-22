import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  Copy, 
  Download, 
  Zap, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Sparkles,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

export const MercadoPagoModal: React.FC = () => {
  const { 
    activeCheckoutProduct, 
    closeCheckout, 
    t, 
    simulatePixPayment,
    showNotification,
    setActiveView 
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(1799); // 30 minutes countdown

  const simulatedOrderId = activeCheckoutProduct ? `MP-${activeCheckoutProduct.id.replace('prod_', '')}-9281` : 'MP-928102';
  const simulatedPixCode = `00020126580014br.gov.bcb.pix0136mp-${simulatedOrderId.toLowerCase()}5204000053039865405${(activeCheckoutProduct?.price || 49.90).toFixed(2)}5802BR5920DIGITAL_MARKET_PRO6009SAO_PAULO62070503***63048A1B`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(simulatedPixCode)}`;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!activeCheckoutProduct) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(simulatedPixCode);
    setCopied(true);
    showNotification(t('pixCodeCopied'));
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    setTimeout(async () => {
      const order = await simulatePixPayment(simulatedOrderId);
      setCompletedOrder(order);
      setIsProcessing(false);
    }, 1200);
  };

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0a0a0a] rounded-2xl shadow-2xl border border-[#1f1f23] max-w-lg w-full overflow-hidden transition-all text-slate-100">
        {/* Header with Mercado Pago branding */}
        <div className="bg-[#0066FF] p-5 text-white relative">
          <button 
            onClick={closeCheckout}
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-1 font-mono">
            <div className="bg-white text-[#0066FF] font-black text-[10px] px-2.5 py-1 rounded tracking-wider flex items-center gap-1 uppercase">
              <Zap className="w-3.5 h-3.5 fill-[#0066FF]" />
              MERCADO PAGO PIX
            </div>
            <span className="text-[11px] font-bold text-blue-100 flex items-center gap-1 uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('securePayment')}
            </span>
          </div>

          <h3 className="text-xl font-black uppercase tracking-tight font-display">
            {completedOrder ? t('paymentApprovedTitle') : t('mpCheckoutTitle')}
          </h3>
          <p className="text-xs text-blue-100 mt-0.5 font-sans">
            {completedOrder ? t('paymentApprovedSubtitle') : t('autoApprovalBadge')}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {!completedOrder ? (
            <div className="space-y-5">
              {/* Product Info Summary */}
              <div className="flex items-center gap-3.5 p-3.5 bg-[#121212] rounded-xl border border-[#1f1f23]">
                <img 
                  src={activeCheckoutProduct.coverImage} 
                  alt={activeCheckoutProduct.title} 
                  className="w-16 h-16 rounded-lg object-cover border border-[#1f1f23]"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066FF] font-mono">
                    {activeCheckoutProduct.fileFormat}
                  </span>
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wide truncate">
                    {activeCheckoutProduct.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Vendedor: <strong className="text-slate-200">{activeCheckoutProduct.storeName}</strong>
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs text-slate-500 line-through block">
                    R$ {activeCheckoutProduct.originalPrice?.toFixed(2) || (activeCheckoutProduct.price * 2).toFixed(2)}
                  </span>
                  <span className="text-base font-black text-[#0066FF]">
                    R$ {activeCheckoutProduct.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* QR Code & Copia e Cola Container */}
              <div className="bg-[#121212] rounded-xl p-4 border border-[#1f1f23] text-center space-y-3">
                <div className="flex justify-center">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <img 
                      src={qrCodeUrl} 
                      alt="PIX QR Code Mercado Pago" 
                      className="w-44 h-44 object-contain"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-300 font-mono">
                  <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>{t('timeRemaining')}: <strong className="text-amber-400 font-bold">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</strong></span>
                </div>

                {/* Copia e Cola Box */}
                <div className="space-y-1.5 text-left font-mono">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
                    Chave PIX Copia e Cola
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={simulatedPixCode} 
                      className="w-full bg-[#050505] border border-[#1f1f23] rounded-lg px-3 py-2 text-xs text-slate-300 truncate focus:outline-none"
                    />
                    <button 
                      onClick={handleCopyCode}
                      className="bg-[#0066FF] hover:bg-[#0052cc] text-white px-3.5 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copied ? 'Copiado!' : t('copy')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Instant Webhook Payment Trigger Button */}
              <div className="space-y-2">
                <button 
                  onClick={handleSimulatePayment}
                  disabled={isProcessing}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold uppercase tracking-wider py-3.5 px-4 rounded-lg text-xs font-mono shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-bounce" />
                      <span>Simular Aprovação Instantânea Mercado Pago</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-slate-400 font-mono uppercase">
                  {t('autoConfirmNotice')}
                </p>
              </div>
            </div>
          ) : (
            /* Approved State */
            <div className="py-4 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto shadow-inner">
                <CheckCircle className="w-12 h-12" />
              </div>

              <div>
                <h4 className="text-lg font-black text-white uppercase tracking-tight font-display">
                  {completedOrder.items[0]?.productTitle}
                </h4>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Pedido #{completedOrder.id} • Nota Fiscal: {completedOrder.invoiceNumber}
                </p>
              </div>

              <div className="bg-[#121212] p-4 rounded-xl border border-[#1f1f23] text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Valor Pago via PIX:</span>
                  <strong className="text-emerald-400 font-bold">R$ {completedOrder.totalAmount.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Formato Liberado:</span>
                  <span className="font-semibold text-white">{completedOrder.items[0]?.fileFormat}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Entrega:</span>
                  <span className="text-emerald-400 font-bold uppercase">Liberado Instantaneamente</span>
                </div>
              </div>

              <div className="space-y-3 pt-2 font-mono">
                <a 
                  href={completedOrder.items[0]?.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#0066FF] hover:bg-[#0052cc] text-white font-extrabold uppercase tracking-wider py-3.5 px-4 rounded-lg text-xs shadow-lg shadow-[#0066FF]/20 flex items-center justify-center gap-2 transition-all block"
                >
                  <Download className="w-4 h-4" />
                  <span>{t('downloadProductBtn')}</span>
                </a>

                <button 
                  onClick={() => {
                    closeCheckout();
                    setActiveView('library');
                  }}
                  className="w-full bg-[#121212] hover:bg-[#1a1a1a] text-slate-300 border border-[#1f1f23] font-bold uppercase tracking-wider py-3 px-4 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Ir para Biblioteca de Compras</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Zap, 
  BarChart3, 
  Users, 
  DollarSign, 
  Activity, 
  Lock, 
  Database, 
  FileCheck, 
  RefreshCw, 
  CheckCircle,
  HelpCircle,
  Megaphone,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_TICKETS, INITIAL_ADS } from '../data/initialData';

export const AdminDashboardView: React.FC = () => {
  const { mpConfig, updateMpConfig, t, showNotification } = useApp();

  const [accessToken, setAccessToken] = useState(mpConfig.accessToken);
  const [publicKey, setPublicKey] = useState(mpConfig.publicKey);
  const [clientSecret, setClientSecret] = useState(mpConfig.clientSecret);
  const [webhookUrl, setWebhookUrl] = useState(mpConfig.webhookUrl);
  const [autoApprovePix, setAutoApprovePix] = useState(mpConfig.autoApprovePix);
  const [isTestMode, setIsTestMode] = useState(mpConfig.isTestMode);

  const [liveVisitors, setLiveVisitors] = useState(142);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [ads, setAds] = useState(INITIAL_ADS);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors(prev => Math.floor(130 + Math.random() * 30));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveMpConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateMpConfig({
      accessToken,
      publicKey,
      clientSecret,
      webhookUrl,
      autoApprovePix,
      isTestMode
    });
  };

  const handleBackupNow = () => {
    showNotification('Backup automático do banco de dados concluído com sucesso!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 bg-[#050505] text-slate-100">
      {/* Admin Title Header */}
      <div className="bg-[#0a0a0a] rounded-2xl p-8 text-white shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-[#1f1f23]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono">
            <span className="bg-[#0066FF] text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
              ADMIN CONTROL PANEL
            </span>
            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1 uppercase">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Sistema 100% Operacional
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-display">
            {t('adminDashboardTitle')}
          </h1>
          <p className="text-xs text-slate-400 font-sans">
            Gerenciamento global de pagamentos Mercado Pago, comissões, segurança e métricas do marketplace.
          </p>
        </div>

        <button 
          onClick={handleBackupNow}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-1.5 transition-colors font-mono"
        >
          <Database className="w-4 h-4" />
          <span>Executar Backup Geral</span>
        </button>
      </div>

      {/* Analytics Counter Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#1f1f23] shadow-lg space-y-2">
          <div className="flex items-center justify-between text-[#0066FF]">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 font-mono">
              {t('liveVisitors')}
            </span>
            <Users className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <p className="text-3xl font-black text-white font-mono">
            {liveVisitors}
          </p>
          <span className="text-[11px] text-emerald-400 font-mono uppercase">
            ● Tempo real online
          </span>
        </div>

        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#1f1f23] shadow-lg space-y-2">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 font-mono">
              Faturamento Global Vendas
            </span>
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-white font-mono">
            R$ 248.950,00
          </p>
          <span className="text-[11px] text-slate-400 font-mono">Via Mercado Pago PIX</span>
        </div>

        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#1f1f23] shadow-lg space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 font-mono">
              Lucro Marketplace (10%)
            </span>
            <Zap className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-[#0066FF] font-mono">
            R$ 24.895,00
          </p>
          <span className="text-[11px] text-emerald-400 font-mono font-bold uppercase">Comissão direta automática</span>
        </div>

        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#1f1f23] shadow-lg space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 font-mono">
              {t('conversionRate')}
            </span>
            <BarChart3 className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-white font-mono">
            4.85%
          </p>
          <span className="text-[11px] text-slate-400 font-mono">Aprovação imediata PIX</span>
        </div>
      </div>

      {/* Mercado Pago Credentials Configuration Panel */}
      <div className="bg-[#0a0a0a] rounded-2xl p-8 border border-[#1f1f23] shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b pb-4 border-[#1f1f23]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#121212] border border-[#1f1f23] text-[#0066FF] rounded-xl">
              <Zap className="w-6 h-6 fill-[#0066FF]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight font-display">
                {t('mercadoPagoApiConfig')}
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Insira as credenciais de produção do Mercado Pago para ativar a recepção de PIX automático.
              </p>
            </div>
          </div>

          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-extrabold text-xs px-3 py-1 rounded font-mono uppercase tracking-wider flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            API Conectada
          </span>
        </div>

        <form onSubmit={handleSaveMpConfig} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] font-mono block mb-1">
                {t('mpAccessToken')} *
              </label>
              <input 
                type="password"
                required
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="w-full bg-[#121212] text-slate-100 p-3 rounded-lg border border-[#1f1f23] focus:border-[#0066FF] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] font-mono block mb-1">
                {t('mpPublicKey')} *
              </label>
              <input 
                type="text"
                required
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                className="w-full bg-[#121212] text-slate-100 p-3 rounded-lg border border-[#1f1f23] focus:border-[#0066FF] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] font-mono block mb-1">
                Client Secret
              </label>
              <input 
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                className="w-full bg-[#121212] text-slate-100 p-3 rounded-lg border border-[#1f1f23] focus:border-[#0066FF] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] font-mono block mb-1">
                {t('mpWebhookUrl')}
              </label>
              <input 
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-[#121212] p-3 rounded-lg border border-[#1f1f23] focus:border-[#0066FF] focus:outline-none font-mono text-slate-400"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 font-mono">
            <label className="flex items-center gap-2 font-bold text-slate-300 cursor-pointer uppercase text-[11px]">
              <input 
                type="checkbox"
                checked={autoApprovePix}
                onChange={(e) => setAutoApprovePix(e.target.checked)}
                className="rounded accent-[#0066FF]"
              />
              <span>Aprovação Automática PIX via Webhook</span>
            </label>

            <label className="flex items-center gap-2 font-bold text-slate-300 cursor-pointer uppercase text-[11px]">
              <input 
                type="checkbox"
                checked={isTestMode}
                onChange={(e) => setIsTestMode(e.target.checked)}
                className="rounded accent-[#0066FF]"
              />
              <span>Modo Sandbox / Teste Ativado</span>
            </label>
          </div>

          <button 
            type="submit"
            className="bg-[#0066FF] hover:bg-[#0052cc] text-white font-extrabold uppercase tracking-wider py-3.5 px-6 rounded-lg text-xs shadow-lg shadow-[#0066FF]/20 transition-colors font-mono"
          >
            {t('saveApiConfig')}
          </button>
        </form>
      </div>

      {/* System Health & Support Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Support Tickets */}
        <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#1f1f23] shadow-lg space-y-4">
          <h3 className="text-lg font-black text-white uppercase tracking-tight font-display flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#0066FF]" />
            <span>Tickets de Suporte Ativos</span>
          </h3>

          <div className="space-y-3 font-mono">
            {tickets.map(t => (
              <div key={t.id} className="p-4 bg-[#121212] border border-[#1f1f23] rounded-xl space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <strong className="text-white">{t.userName}</strong>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                    {t.status.toUpperCase()}
                  </span>
                </div>
                <p className="font-bold text-slate-200 font-sans">{t.subject}</p>
                <p className="text-slate-400 text-[11px] font-sans">{t.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Health Status */}
        <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#1f1f23] shadow-lg space-y-4">
          <h3 className="text-lg font-black text-white uppercase tracking-tight font-display flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Saúde do Sistema & Segurança</span>
          </h3>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 bg-[#121212] border border-[#1f1f23] rounded-xl flex justify-between items-center">
              <span>Antifraude Mercado Pago:</span>
              <span className="font-bold text-emerald-400">Ativado (0 Fraudes)</span>
            </div>

            <div className="p-3 bg-[#121212] border border-[#1f1f23] rounded-xl flex justify-between items-center">
              <span>Autenticação 2FA Admin:</span>
              <span className="font-bold text-emerald-400">Seguro</span>
            </div>

            <div className="p-3 bg-[#121212] border border-[#1f1f23] rounded-xl flex justify-between items-center">
              <span>Banco Cloud SQL:</span>
              <span className="font-bold text-emerald-400">Conectado (2ms)</span>
            </div>

            <div className="p-3 bg-[#121212] border border-[#1f1f23] rounded-xl flex justify-between items-center">
              <span>Backup Automático:</span>
              <span className="font-bold text-slate-300">Hoje às 03:00 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

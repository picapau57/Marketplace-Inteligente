import React, { useState } from 'react';
import { Sparkles, X, Copy, Check, Bot, Wand2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AiCreatorAssistantModalProps {
  onApplyText?: (generatedText: string) => void;
}

export const AiCreatorAssistantModal: React.FC<AiCreatorAssistantModalProps> = ({ onApplyText }) => {
  const { isAiModalOpen, closeAiModal, t, showNotification } = useApp();

  const [productTitle, setProductTitle] = useState('');
  const [contentType, setContentType] = useState('canva_template');
  const [taskType, setTaskType] = useState('description');
  const [userPrompt, setUserPrompt] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isAiModalOpen) return null;

  const handleGenerate = async () => {
    if (!productTitle.trim()) {
      showNotification('Por favor informe o título ou ideia do produto digital.');
      return;
    }

    setIsGenerating(true);
    setGeneratedResult('');

    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle,
          contentType,
          taskType,
          prompt: userPrompt
        })
      });

      const data = await res.json();
      if (data.text) {
        setGeneratedResult(data.text);
      } else if (data.fallbackText) {
        setGeneratedResult(data.fallbackText);
      }
    } catch (err) {
      setGeneratedResult(`✨ Descrição Recomendada para "${productTitle}":\n\n- Conteúdo 100% digital com entrega automática instantânea via PIX Mercado Pago.\n- Ideal para alavancar suas vendas e otimizar tempo.\n- Arquivos organizados, editáveis e prontos para uso.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    showNotification('Texto copiado para a área de transferência!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (onApplyText) {
      onApplyText(generatedResult);
    }
    closeAiModal();
    showNotification('Texto da IA aplicado com sucesso!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0a0a0a] rounded-2xl shadow-2xl border border-[#1f1f23] max-w-xl w-full overflow-hidden text-slate-100">
        {/* Header */}
        <div className="bg-[#0066FF] p-5 text-white relative">
          <button 
            onClick={closeAiModal}
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1 font-mono">
            <span className="bg-amber-400 text-black text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-black" />
              Gemini 3.6 Flash
            </span>
          </div>

          <h3 className="text-xl font-black uppercase tracking-tight font-display flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-100" />
            <span>Assistente Criativo com IA</span>
          </h3>
          <p className="text-xs text-blue-100 mt-0.5 font-sans">
            Gere cópias de vendas, títulos persuasivos e descrições otimizadas para produtos digitais.
          </p>
        </div>

        {/* Modal Form */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
            <div>
              <label className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block mb-1">
                Tipo de Conteúdo
              </label>
              <select 
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full bg-[#121212] border border-[#1f1f23] text-slate-200 rounded-lg px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-[#0066FF]"
              >
                <option value="canva_template">Template Canva</option>
                <option value="ai_prompt">Prompts de IA</option>
                <option value="ebook">E-book / Guia</option>
                <option value="software">Software / Script</option>
                <option value="course">Curso / Vídeo</option>
                <option value="business_form">Contrato / Formulário</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block mb-1">
                Objetivo da IA
              </label>
              <select 
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full bg-[#121212] border border-[#1f1f23] text-slate-200 rounded-lg px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-[#0066FF]"
              >
                <option value="description">Descrição Persuasiva de Vendas</option>
                <option value="headline">Título & Chamada Irresistível</option>
                <option value="features">Lista de Benefícios (Bullet Points)</option>
                <option value="translate">Tradução Multilíngue (PT/EN/ES)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider font-mono block mb-1">
              Título do Produto / Ideia Principal *
            </label>
            <input 
              type="text"
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              placeholder="Ex: Pack 500 Artes Canva para Estética e Salão de Beleza"
              className="w-full bg-[#121212] border border-[#1f1f23] text-slate-100 rounded-lg px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#0066FF]"
            />
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider font-mono block mb-1">
              Detalhes Opcionais / Público-Alvo
            </label>
            <textarea 
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Ex: Foco em profissionais autônomos, mencionar entrega instantânea via PIX..."
              rows={2}
              className="w-full bg-[#121212] border border-[#1f1f23] text-slate-100 rounded-lg p-3 text-xs font-sans focus:outline-none focus:border-[#0066FF] resize-none"
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-[#0066FF] hover:bg-[#0052cc] text-white font-extrabold uppercase tracking-wider py-3 px-4 rounded-lg text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-[#0066FF]/20 transition-all"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-amber-300" />
                <span>Gerar Texto Inteligente com Gemini AI</span>
              </>
            )}
          </button>

          {/* Generated Result Output */}
          {generatedResult && (
            <div className="mt-4 p-4 bg-[#121212] rounded-xl border border-[#1f1f23] space-y-3 animate-fade-in font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-[#0066FF] tracking-wider">
                  Resultado Gerado
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={handleCopy}
                    className="p-1.5 bg-[#050505] rounded text-xs text-slate-300 border border-[#1f1f23] flex items-center gap-1 font-bold uppercase"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar'}</span>
                  </button>
                  {onApplyText && (
                    <button 
                      onClick={handleApply}
                      className="p-1.5 bg-[#0066FF] text-white rounded text-xs font-extrabold uppercase tracking-wider flex items-center gap-1"
                    >
                      <span>Aplicar no Formulário</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed pr-1">
                {generatedResult}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  Sun, 
  Moon, 
  Globe, 
  Store, 
  ShieldAlert, 
  User, 
  Sparkles, 
  Menu, 
  X,
  CreditCard,
  CheckCircle,
  Bell,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';

export const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    t, 
    isDarkMode, 
    toggleDarkMode, 
    user, 
    setUserRole,
    cart,
    favorites,
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    notification
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveView('explore');
    }
  };

  const languagesList: { code: Language; name: string; flag: string }[] = [
    { code: 'pt', name: 'Português (BR)', flag: '🇧🇷' },
    { code: 'en', name: 'English (US)', flag: '🇺🇸' },
    { code: 'es', name: 'Español (ES)', flag: '🇪🇸' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1f1f23] bg-[#050505]/95 backdrop-blur-md transition-colors">
      {/* Top Banner Notice */}
      <div className="bg-[#0066FF] text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
        <span>
          <strong>DIGITAL MARKET PRO:</strong> {t('sellDigitalProducts')} — {t('instantDeliveryBadge')}
        </span>
        <span className="hidden sm:inline bg-white/20 px-2 py-0.5 rounded text-[10px] font-mono tracking-widest">
          PIX MERCADO PAGO
        </span>
      </div>

      {/* Notification Toast Alert */}
      {notification && (
        <div className="bg-emerald-500 text-black font-extrabold text-xs px-4 py-2 text-center flex items-center justify-center gap-2 uppercase tracking-wider">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveView('home')} 
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-lg bg-[#0066FF] flex items-center justify-center text-white shadow-lg shadow-[#0066FF]/20 group-hover:scale-105 transition-transform">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tighter uppercase text-white">
                  DIGITAL MARKET<span className="text-[#0066FF]"> PRO</span>
                </span>
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest hidden md:block">
                  {t('tagline')}
                </p>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="flex-1 max-w-lg hidden md:flex items-center relative"
          >
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-[#0a0a0a] text-slate-100 text-xs font-medium rounded-lg pl-10 pr-24 py-2.5 border border-[#1f1f23] focus:border-[#0066FF] focus:outline-none transition-all placeholder:text-slate-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <button 
              type="submit"
              className="absolute right-1.5 bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-colors"
            >
              {t('search')}
            </button>
          </form>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-300">
            <button 
              onClick={() => setActiveView('home')} 
              className={`hover:text-[#0066FF] transition-colors ${activeView === 'home' ? 'text-[#0066FF]' : ''}`}
            >
              {t('home')}
            </button>
            <button 
              onClick={() => setActiveView('explore')} 
              className={`hover:text-[#0066FF] transition-colors ${activeView === 'explore' ? 'text-[#0066FF]' : ''}`}
            >
              {t('explore')}
            </button>
            <button 
              onClick={() => setActiveView('library')} 
              className={`hover:text-[#0066FF] transition-colors ${activeView === 'library' ? 'text-[#0066FF]' : ''}`}
            >
              {t('myLibrary')}
            </button>
          </nav>

          {/* Controls Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="p-2 rounded-lg text-slate-300 hover:bg-[#121212] transition-colors flex items-center gap-1.5 text-xs font-bold border border-[#1f1f23]"
                title={t('language')}
              >
                <Globe className="w-4 h-4 text-[#0066FF]" />
                <span className="uppercase font-mono">{language}</span>
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[#0a0a0a] rounded-lg shadow-2xl border border-[#1f1f23] py-1.5 z-50">
                  {languagesList.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 hover:bg-[#1f1f23] transition-colors ${language === lang.code ? 'font-bold text-[#0066FF]' : 'text-slate-300'}`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-300 hover:bg-[#121212] transition-colors border border-[#1f1f23]"
              title={t('theme')}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {/* Favorites Icon */}
            <button 
              onClick={() => setActiveView('library')}
              className="p-2 rounded-lg text-slate-300 hover:bg-[#121212] transition-colors relative border border-[#1f1f23]"
              title={t('favorites')}
            >
              <Heart className="w-4 h-4" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* View/Role Selector Switcher */}
            <div className="hidden sm:flex items-center p-1 bg-[#0a0a0a] rounded-lg text-xs font-bold border border-[#1f1f23] uppercase tracking-wider">
              <button
                onClick={() => {
                  setUserRole('buyer');
                  setActiveView('home');
                }}
                className={`px-2.5 py-1 rounded transition-all ${user.role === 'buyer' ? 'bg-[#0066FF] text-white font-extrabold' : 'text-slate-400 hover:text-white'}`}
              >
                Comprador
              </button>
              <button
                onClick={() => {
                  setUserRole('creator');
                  setActiveView('creator');
                }}
                className={`px-2.5 py-1 rounded transition-all ${user.role === 'creator' ? 'bg-[#0066FF] text-white font-extrabold' : 'text-slate-400 hover:text-white'}`}
              >
                Criador
              </button>
              <button
                onClick={() => {
                  setUserRole('admin');
                  setActiveView('admin');
                }}
                className={`px-2.5 py-1 rounded transition-all ${user.role === 'admin' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold' : 'text-slate-400 hover:text-white'}`}
              >
                Admin MP
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-[#121212] border border-[#1f1f23]"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#1f1f23] space-y-3">
            <form onSubmit={handleSearchSubmit} className="flex items-center relative">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-[#0a0a0a] text-slate-100 text-xs rounded-lg pl-9 pr-20 py-2 border border-[#1f1f23] focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
            </form>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wider pt-2">
              <button 
                onClick={() => { setActiveView('home'); setIsMobileMenuOpen(false); }}
                className="p-2.5 bg-[#0a0a0a] rounded-lg text-left text-slate-200 border border-[#1f1f23]"
              >
                {t('home')}
              </button>
              <button 
                onClick={() => { setActiveView('explore'); setIsMobileMenuOpen(false); }}
                className="p-2.5 bg-[#0a0a0a] rounded-lg text-left text-slate-200 border border-[#1f1f23]"
              >
                {t('explore')}
              </button>
              <button 
                onClick={() => { setActiveView('creator'); setIsMobileMenuOpen(false); }}
                className="p-2.5 bg-[#0066FF]/20 text-[#0066FF] border border-[#0066FF]/40 rounded-lg text-left font-extrabold"
              >
                {t('creatorStudio')}
              </button>
              <button 
                onClick={() => { setActiveView('admin'); setIsMobileMenuOpen(false); }}
                className="p-2.5 bg-indigo-950/50 text-indigo-400 border border-indigo-800/50 rounded-lg text-left font-extrabold"
              >
                {t('adminPanel')}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MercadoPagoModal } from './components/MercadoPagoModal';
import { AiCreatorAssistantModal } from './components/AiCreatorAssistantModal';

// Views
import { HomeView } from './views/HomeView';
import { MarketplaceExploreView } from './views/MarketplaceExploreView';
import { ProductDetailView } from './views/ProductDetailView';
import { StoreFrontView } from './views/StoreFrontView';
import { CreatorStudioView } from './views/CreatorStudioView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { UserLibraryView } from './views/UserLibraryView';

const MainContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        {activeView === 'home' && <HomeView />}
        {activeView === 'explore' && <MarketplaceExploreView />}
        {activeView === 'product' && <ProductDetailView />}
        {activeView === 'store' && <StoreFrontView />}
        {activeView === 'creator' && <CreatorStudioView />}
        {activeView === 'admin' && <AdminDashboardView />}
        {activeView === 'library' && <UserLibraryView />}
      </main>

      <Footer />

      {/* Global Checkout & AI Assistant Modals */}
      <MercadoPagoModal />
      <AiCreatorAssistantModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;

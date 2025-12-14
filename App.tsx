import React, { useState } from 'react';
import DogForm from './components/DogForm';
import IdCard from './components/IdCard';
import { AppView, DogProfile } from './types';
import { Scissors, PawPrint, PlusCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.WELCOME);
  const [dogData, setDogData] = useState<DogProfile | null>(null);

  const handleStartCreation = () => {
    setCurrentView(AppView.FORM);
  };

  const handleFormSubmit = (data: DogProfile) => {
    setDogData(data);
    setCurrentView(AppView.CARD);
  };

  const handleCancelForm = () => {
    setCurrentView(AppView.WELCOME);
  };

  const handleBackToMenu = () => {
    setCurrentView(AppView.WELCOME);
  };

  const handleCreateNew = () => {
    setDogData(null);
    setCurrentView(AppView.FORM);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col font-sans">
      {/* Header */}
      <header className="w-full bg-white shadow-sm p-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-3 text-indigo-700">
            <div className="bg-indigo-100 p-2 rounded-xl">
                <Scissors size={24} />
            </div>
            <div className="flex flex-col">
                <h1 className="text-xl font-black tracking-tight leading-none">La Barberie de los Perritos</h1>
                <p className="text-[10px] text-gray-500 font-medium tracking-wide mt-1 hidden sm:block">
                    Peluquería Canina Profesional - Adiestramiento - Ludoteca
                </p>
            </div>
          </div>
          
          {currentView === AppView.CARD && (
             <button 
                onClick={handleCreateNew}
                className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition bg-indigo-50 px-3 py-1.5 rounded-full"
            >
                <PlusCircle size={16} />
                Nuevo
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        
        {currentView === AppView.WELCOME && (
            <div className="w-full max-w-lg animate-fade-in-up text-center">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-50">
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
                        <PawPrint size={48} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                        La Barberie de los Perritos
                    </h2>
                     <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-8">
                        Gestor de Credenciales
                    </p>
                    
                    <div className="mb-10 bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                        <p className="text-indigo-800 text-xl font-bold leading-relaxed">
                           ¡Bienvenidos a la Barberie de los Perritos! 🐾
                        </p>
                    </div>
                    
                    <button 
                        onClick={handleStartCreation}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex items-center justify-center gap-3"
                    >
                        <PlusCircle size={24} />
                        Crear Nueva ID
                    </button>
                    
                    <div className="mt-6 pt-6 border-t border-gray-100 text-xs text-gray-400">
                        <p>Herramienta 100% Offline</p>
                    </div>
                </div>
            </div>
        )}

        {currentView === AppView.FORM && (
            <div className="w-full">
                <DogForm onSubmit={handleFormSubmit} onCancel={handleCancelForm} />
            </div>
        )}

        {currentView === AppView.CARD && dogData && (
            <div className="w-full">
                <IdCard data={dogData} onBack={handleBackToMenu} />
            </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} La Barberie de los Perritos. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
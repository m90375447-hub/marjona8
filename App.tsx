import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import BottomNav from './components/BottomNav';
import AssetsScreen from './screens/AssetsScreen';
import LiabilitiesScreen from './screens/LiabilitiesScreen';
import ZakatScreen from './screens/ZakatScreen';
import RatesScreen from './screens/RatesScreen';
import HistoryScreen from './screens/HistoryScreen';
import ReminderScreen from './screens/ReminderScreen';
import GoalsScreen from './screens/GoalsScreen';
import PinScreen from './screens/PinScreen';
import KnowledgeScreen from './screens/KnowledgeScreen';
import DistributionScreen from './screens/DistributionScreen';
import { Screen } from './types';
import { ChartIcon, CogIcon, DollarIcon, HomeIcon, WalletIcon, TrendingUpIcon, TrophyIcon, LibraryIcon, DistributionIcon } from './components/icons';
import { useLocalStorage } from './hooks/useLocalStorage';

type AppState = 'LOADING' | 'NEEDS_PIN_SET' | 'LOCKED' | 'UNLOCKED';


const App: React.FC = () => {
  const [pin, setPin] = useLocalStorage<string | null>('zakat_pin', null);
  const [appState, setAppState] = useState<AppState>('LOADING');
  const [activeScreen, setActiveScreen] = useState<Screen>('zakat');

  useEffect(() => {
    // A small delay to prevent flash of content
    const timer = setTimeout(() => {
        if (pin === null) {
            setAppState('NEEDS_PIN_SET');
        } else {
            setAppState('LOCKED');
        }
    }, 100); // 100ms delay
    
    return () => clearTimeout(timer);
  }, []);

  const handlePinSet = (newPin: string) => {
    setPin(newPin);
    setAppState('UNLOCKED');
  };

  const handleUnlock = () => {
    setAppState('UNLOCKED');
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'assets':
        return <AssetsScreen />;
      case 'liabilities':
        return <LiabilitiesScreen />;
      case 'goals':
        return <GoalsScreen />;
      case 'rates':
        return <RatesScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'reminders':
        return <ReminderScreen />;
      case 'knowledge':
        return <KnowledgeScreen />;
      case 'distribution':
        return <DistributionScreen />;
      case 'zakat':
      default:
        return <ZakatScreen />;
    }
  };

  const navItems = [
    { id: 'assets' as Screen, label: 'Aktivlar', icon: <WalletIcon /> },
    { id: 'liabilities' as Screen, label: 'Majburiyatlar', icon: <TrendingUpIcon className="transform -rotate-90" /> },
    { id: 'zakat' as Screen, label: 'Zakot', icon: <HomeIcon /> },
    { id: 'distribution' as Screen, label: 'Taqsimot', icon: <DistributionIcon /> },
    { id: 'knowledge' as Screen, label: 'Bilimlar', icon: <LibraryIcon /> },
    { id: 'goals' as Screen, label: 'Maqsadlar', icon: <TrophyIcon /> },
    
  ];
  
  const renderAppContent = () => (
     <AppProvider>
      <div className="min-h-screen font-sans bg-gray-50 text-gray-800 flex flex-col max-w-lg mx-auto shadow-2xl">
        <main className="flex-grow p-4 pb-24">
          {renderScreen()}
        </main>
        <BottomNav items={navItems} activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      </div>
    </AppProvider>
  );

  if (appState === 'LOADING') {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="text-islamic-green-600">Yuklanmoqda...</div>
        </div>
      );
  }
  
  if (appState === 'NEEDS_PIN_SET') {
      return <PinScreen mode="set" onPinSet={handlePinSet} />;
  }

  if (appState === 'LOCKED') {
      return <PinScreen mode="enter" storedPin={pin!} onSuccess={handleUnlock} />;
  }

  return renderAppContent();
};

export default App;
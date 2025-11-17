
import React from 'react';
import { Screen } from '../types';

interface NavItem {
  id: Screen;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavProps {
  items: NavItem[];
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ items, activeScreen, setActiveScreen }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg max-w-lg mx-auto">
      <div className="flex justify-around">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveScreen(item.id)}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors duration-200 ${
              activeScreen === item.id ? 'text-islamic-green-600' : 'text-gray-500 hover:text-islamic-green-500'
            }`}
          >
            <div className={`w-6 h-6 mb-1 ${activeScreen === item.id ? 'text-islamic-green-500' : 'text-gray-400'}`}>
              {item.icon}
            </div>
            <span>{item.label}</span>
            {activeScreen === item.id && (
              <div className="w-8 h-1 bg-islamic-green-500 rounded-full mt-1"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;

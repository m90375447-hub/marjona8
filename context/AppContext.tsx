import React, { createContext, useContext, useMemo } from 'react';
import { Asset, Liability, ExchangeRates, HistoryEntry, Goal, GoalHistoryEntry } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

interface AppContextType {
  assets: Asset[];
  liabilities: Liability[];
  rates: ExchangeRates;
  history: HistoryEntry[];
  goals: Goal[];
  goalHistory: GoalHistoryEntry[];
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  removeAsset: (id: string) => void;
  addLiability: (liability: Omit<Liability, 'id'>) => void;
  removeLiability: (id: string) => void;
  updateRates: (newRates: ExchangeRates) => void;
  addHistoryEntry: () => void;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoalSavings: (goalId: string, amountToAdd: number) => void;
  toggleGoalZakatInclusion: (goalId: string) => void;
  totalAssetsUZS: number;
  totalLiabilitiesUZS: number;
  netWorthUZS: number;
  zakatAmountUZS: number;
  nisabValueUZS: number;
  formatCurrency: (amount: number, currency?: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useLocalStorage<Asset[]>('zakat_assets', []);
  const [liabilities, setLiabilities] = useLocalStorage<Liability[]>('zakat_liabilities', []);
  const [rates, setRates] = useLocalStorage<ExchangeRates>('zakat_rates', { USD: 12600, EUR: 13600, GOLD: 850000 });
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('zakat_history', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('zakat_goals', []);
  const [goalHistory, setGoalHistory] = useLocalStorage<GoalHistoryEntry[]>('zakat_goal_history', []);

  const addAsset = (asset: Omit<Asset, 'id'>) => {
    setAssets([...assets, { ...asset, id: uuidv4() }]);
  };

  const removeAsset = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  const addLiability = (liability: Omit<Liability, 'id'>) => {
    setLiabilities([...liabilities, { ...liability, id: uuidv4() }]);
  };

  const removeLiability = (id: string) => {
    setLiabilities(liabilities.filter(l => l.id !== id));
  };

  const updateRates = (newRates: ExchangeRates) => {
    setRates(newRates);
  };
  
  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
      const newGoal: Goal = {
          ...goal,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
      };
      setGoals([...goals, newGoal]);
  };
  
  const updateGoalSavings = (goalId: string, amountToAdd: number) => {
      setGoals(goals.map(g => g.id === goalId ? {...g, savedAmount: g.savedAmount + amountToAdd} : g));
      const historyEntry: GoalHistoryEntry = {
          id: uuidv4(),
          goalId,
          date: new Date().toISOString(),
          amountAdded: amountToAdd
      };
      setGoalHistory([...goalHistory, historyEntry]);
  };

  const toggleGoalZakatInclusion = (goalId: string) => {
    setGoals(goals.map(g => g.id === goalId ? {...g, includeInZakat: !g.includeInZakat} : g));
  }
  
  const totalAssetsUZS = useMemo(() => {
    const assetTotal = assets.reduce((total, asset) => {
      let amountInUZS = asset.amount;
      if (asset.currency !== 'UZS') {
        amountInUZS = asset.amount * rates[asset.currency];
      }
      return total + amountInUZS;
    }, 0);

    const zakatableGoalsTotal = goals
      .filter(goal => goal.includeInZakat)
      .reduce((total, goal) => total + goal.savedAmount, 0);

    return assetTotal + zakatableGoalsTotal;
  }, [assets, rates, goals]);

  const totalLiabilitiesUZS = useMemo(() => {
     return liabilities.reduce((total, liability) => total + liability.amount, 0);
  }, [liabilities]);
  
  const netWorthUZS = useMemo(() => totalAssetsUZS - totalLiabilitiesUZS, [totalAssetsUZS, totalLiabilitiesUZS]);
  
  const nisabValueUZS = useMemo(() => 85 * rates.GOLD, [rates.GOLD]);

  const zakatAmountUZS = useMemo(() => {
    const zakatableAmount = Math.max(0, netWorthUZS);
    if (zakatableAmount >= nisabValueUZS) {
        return zakatableAmount * 0.025;
    }
    return 0; // Zakot farz emas, agar nisobdan past bo'lsa
  }, [netWorthUZS, nisabValueUZS]);
  
  const addHistoryEntry = () => {
      const newEntry: HistoryEntry = {
        date: new Date().toISOString().split('T')[0],
        totalAssets: totalAssetsUZS,
        totalLiabilities: totalLiabilitiesUZS,
        netWorth: netWorthUZS,
        zakatAmount: zakatAmountUZS
      };
      setHistory(prevHistory => [...prevHistory, newEntry]);
  };
  
  const formatCurrency = (amount: number, currency: string = "UZS") => {
      return new Intl.NumberFormat('en-US', {
          style: 'decimal',
          maximumFractionDigits: 0,
      }).format(amount) + ` ${currency}`;
  };

  const value = {
    assets,
    liabilities,
    rates,
    history,
    goals,
    goalHistory,
    addAsset,
    removeAsset,
    addLiability,
    removeLiability,
    updateRates,
    addHistoryEntry,
    addGoal,
    updateGoalSavings,
    toggleGoalZakatInclusion,
    totalAssetsUZS,
    totalLiabilitiesUZS,
    netWorthUZS,
    zakatAmountUZS,
    nisabValueUZS,
    formatCurrency
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
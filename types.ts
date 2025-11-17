export type Currency = 'UZS' | 'USD' | 'EUR' | 'GOLD';

export type CardBrand = 'Uzcard' | 'Humo' | 'Visa' | 'Mastercard';

export interface Asset {
  id: string;
  type: string; // Name/description of asset e.g. "Ish haqi kartasi"
  amount: number;
  currency: Currency;
  isCard?: boolean;
  cardBrand?: CardBrand;
}


export interface Liability {
  id: string;
  type: string;
  amount: number;
}

export interface ExchangeRates {
  USD: number;
  EUR: number;
  GOLD: number;
}

export interface HistoryEntry {
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  zakatAmount: number;
}

export type GoalCategory = 'Hajj' | 'Umrah' | 'Qurbon' | 'Education' | 'Travel' | 'Emergency' | 'Other';

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    savedAmount: number;
    category: GoalCategory;
    deadline?: string;
    createdAt: string;
    includeInZakat: boolean;
}

export interface GoalHistoryEntry {
    id: string;
    goalId: string;
    date: string;
    amountAdded: number;
}


export type Screen = 'zakat' | 'assets' | 'liabilities' | 'rates' | 'history' | 'reminders' | 'goals' | 'knowledge' | 'distribution';
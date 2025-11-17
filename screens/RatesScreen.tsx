
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ExchangeRates } from '../types';

const RatesScreen: React.FC = () => {
    const { rates, updateRates, formatCurrency } = useAppContext();
    const [localRates, setLocalRates] = useState<ExchangeRates>(rates);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setLocalRates(rates);
    }, [rates]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalRates(prevRates => ({
            ...prevRates,
            [name]: parseFloat(value) || 0,
        }));
    };

    const handleSave = () => {
        updateRates(localRates);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Valyuta kurslari</h1>
            <p className="text-gray-600">UZS ga konvertatsiya kurslarini qo'lda o'rnating. Bu kurslar aktivlaringizning umumiy qiymatini hisoblash uchun ishlatiladi.</p>

            <div className="space-y-4 bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col">
                    <label htmlFor="USD" className="font-semibold text-gray-700">1 USD dan UZS ga</label>
                    <input
                        id="USD"
                        name="USD"
                        type="number"
                        value={localRates.USD}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-islamic-green-500 focus:border-islamic-green-500 text-lg"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="EUR" className="font-semibold text-gray-700">1 EUR dan UZS ga</label>
                    <input
                        id="EUR"
                        name="EUR"
                        type="number"
                        value={localRates.EUR}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-islamic-green-500 focus:border-islamic-green-500 text-lg"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="GOLD" className="font-semibold text-gray-700">1 gram Oltin dan UZS ga</label>
                    <input
                        id="GOLD"
                        name="GOLD"
                        type="number"
                        value={localRates.GOLD}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-islamic-green-500 focus:border-islamic-green-500 text-lg"
                    />
                </div>
            </div>
            
            <button
                onClick={handleSave}
                className="w-full bg-islamic-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-islamic-green-700 transition-all duration-300 flex items-center justify-center text-lg relative"
            >
                {saved ? 'Saqlandi!' : 'Kurslarni saqlash'}
            </button>
        </div>
    );
};

export default RatesScreen;

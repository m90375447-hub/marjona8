
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Liability } from '../types';
import Modal from '../components/Modal';
import SummaryCard from '../components/SummaryCard';
import { PlusIcon, TrashIcon, TrendingUpIcon } from '../components/icons';

const LiabilityForm: React.FC<{ onSave: (liability: Omit<Liability, 'id'>) => void, onClose: () => void }> = ({ onSave, onClose }) => {
    const [type, setType] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (type && amount) {
            onSave({ type, amount: parseFloat(amount) });
            onClose();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Turi (masalan, Qarz, Kredit)</label>
                <input type="text" value={type} onChange={e => setType(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-islamic-green-500 focus:border-islamic-green-500"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Miqdori (UZS)</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-islamic-green-500 focus:border-islamic-green-500"/>
            </div>
            <div className="flex justify-end pt-2">
                 <button type="submit" className="w-full bg-islamic-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-islamic-green-700 transition-colors duration-300 flex items-center justify-center">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Majburiyat qo'shish
                </button>
            </div>
        </form>
    );
};


const LiabilitiesScreen: React.FC = () => {
    const { liabilities, addLiability, removeLiability, totalLiabilitiesUZS, formatCurrency } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Majburiyatlar</h1>
            <SummaryCard title="Jami majburiyatlar" value={formatCurrency(totalLiabilitiesUZS)} colorClass="from-red-500 to-red-700" icon={<TrendingUpIcon className="transform -rotate-90"/>} />

            <button onClick={() => setIsModalOpen(true)} className="w-full bg-islamic-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-islamic-green-700 transition-colors duration-300 flex items-center justify-center text-lg">
                <PlusIcon className="w-6 h-6 mr-2" />
                Yangi majburiyat qo'shish
            </button>
            
             <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-700">Sizning majburiyatlaringiz</h2>
                {liabilities.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Hali majburiyatlar qo'shilmagan.</p>
                ) : (
                    <ul className="bg-white rounded-lg shadow divide-y divide-gray-200">
                    {liabilities.map(liability => (
                        <li key={liability.id} className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-800">{liability.type}</p>
                                <p className="text-gray-600">{formatCurrency(liability.amount)}</p>
                            </div>
                            <button onClick={() => removeLiability(liability.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50">
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        </li>
                    ))}
                    </ul>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yangi majburiyat qo'shish">
                <LiabilityForm onSave={addLiability} onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default LiabilitiesScreen;

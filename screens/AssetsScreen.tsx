import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Asset, Currency, CardBrand } from '../types';
import Modal from '../components/Modal';
import SummaryCard from '../components/SummaryCard';
import { PlusIcon, TrashIcon, WalletIcon, UzcardIcon, HumoIcon, VisaIcon, MastercardIcon } from '../components/icons';

const CardLogo: React.FC<{ brand: CardBrand }> = ({ brand }) => {
    const props = { className: "w-10 h-auto" };
    switch (brand) {
        case 'Uzcard': return <UzcardIcon {...props} />;
        case 'Humo': return <HumoIcon {...props} />;
        case 'Visa': return <VisaIcon {...props} />;
        case 'Mastercard': return <MastercardIcon {...props} />;
        default: return null;
    }
};


const AssetForm: React.FC<{ onSave: (asset: Omit<Asset, 'id'>) => void, onClose: () => void }> = ({ onSave, onClose }) => {
    const [type, setType] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState<Currency>('UZS');
    const [isCard, setIsCard] = useState(false);
    const [cardBrand, setCardBrand] = useState<CardBrand>('Uzcard');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(type && amount) {
            const newAsset: Omit<Asset, 'id'> = { 
                type, 
                amount: parseFloat(amount), 
                currency,
                isCard,
                ...(isCard && { cardBrand })
            };
            onSave(newAsset);
            onClose();
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-3 bg-gray-100 p-2 rounded-md">
                <input 
                    id="isCard"
                    type="checkbox" 
                    checked={isCard} 
                    onChange={e => setIsCard(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-islamic-green-600 focus:ring-islamic-green-500 cursor-pointer"
                />
                <label htmlFor="isCard" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                    Bu bank kartasimi?
                </label>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    {isCard ? "Karta nomi (masalan, Ish haqi kartasi)" : "Aktiv nomi (masalan, Naqd pul)"}
                </label>
                <input type="text" value={type} onChange={e => setType(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-islamic-green-500 focus:border-islamic-green-500"/>
            </div>

            {isCard && (
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Karta turi</label>
                     <select value={cardBrand} onChange={e => setCardBrand(e.target.value as CardBrand)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-islamic-green-500 focus:border-islamic-green-500">
                        <option value="Uzcard">Uzcard</option>
                        <option value="Humo">Humo</option>
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                    </select>
                </div>
            )}

             <div>
                <label className="block text-sm font-medium text-gray-700">Miqdori</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-islamic-green-500 focus:border-islamic-green-500"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Valyuta</label>
                 <select value={currency} onChange={e => setCurrency(e.target.value as Currency)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-islamic-green-500 focus:border-islamic-green-500">
                    <option value="UZS">UZS</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GOLD">Oltin (g)</option>
                </select>
            </div>
            <div className="flex justify-end pt-2">
                 <button type="submit" className="w-full bg-islamic-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-islamic-green-700 transition-colors duration-300 flex items-center justify-center">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Aktiv qo'shish
                </button>
            </div>
        </form>
    );
};

const AssetsScreen: React.FC = () => {
    const { assets, addAsset, removeAsset, totalAssetsUZS, formatCurrency } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <div className="space-y-6">
             <h1 className="text-3xl font-bold text-gray-800">Aktivlar</h1>
            <SummaryCard title="Jami aktivlar" value={formatCurrency(totalAssetsUZS)} icon={<WalletIcon />} />
            
            <button onClick={() => setIsModalOpen(true)} className="w-full bg-islamic-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-islamic-green-700 transition-colors duration-300 flex items-center justify-center text-lg">
                <PlusIcon className="w-6 h-6 mr-2" />
                Yangi aktiv qo'shish
            </button>

            <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-700">Sizning aktivlaringiz</h2>
                {assets.length === 0 ? (
                    <div className="text-center text-gray-500 py-10 bg-gray-100 rounded-lg">
                        <p>Hali aktivlar qo'shilmagan.</p>
                        <p className="text-sm mt-1">Boshlash uchun yuqoridagi tugmani bosing.</p>
                    </div>
                ) : (
                    <ul className="bg-white rounded-lg shadow divide-y divide-gray-200">
                    {assets.map(asset => (
                        <li key={asset.id} className="p-4 flex justify-between items-center">
                            <div className="flex items-center space-x-4 flex-grow">
                                {asset.isCard && asset.cardBrand ? (
                                    <CardLogo brand={asset.cardBrand} />
                                ) : (
                                    <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                                        <WalletIcon className="w-5 h-5 text-gray-500"/>
                                    </div>
                                )}
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800">{asset.type}</p>
                                    <p className="text-gray-600">{formatCurrency(asset.amount, asset.currency)}</p>
                                </div>
                            </div>
                            <button onClick={() => removeAsset(asset.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors">
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        </li>
                    ))}
                    </ul>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yangi aktiv qo'shish">
                <AssetForm onSave={addAsset} onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default AssetsScreen;
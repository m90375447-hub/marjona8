import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Goal, GoalCategory } from '../types';
import Modal from '../components/Modal';
import { PlusIcon, KaabaIcon, BookOpenIcon, PlaneIcon, ShieldCheckIcon, HeartIcon, ClipboardListIcon } from '../components/icons';

const categoryIcons: Record<GoalCategory, React.ReactNode> = {
    Hajj: <KaabaIcon className="w-6 h-6"/>,
    Umrah: <KaabaIcon className="w-6 h-6"/>,
    Qurbon: <HeartIcon className="w-6 h-6"/>,
    Education: <BookOpenIcon className="w-6 h-6"/>,
    Travel: <PlaneIcon className="w-6 h-6"/>,
    Emergency: <ShieldCheckIcon className="w-6 h-6"/>,
    Other: <ClipboardListIcon className="w-6 h-6"/>,
};

const GoalCard: React.FC<{ goal: Goal, onUpdate: () => void }> = ({ goal, onUpdate }) => {
    const { formatCurrency, toggleGoalZakatInclusion } = useAppContext();
    const progress = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
    const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);

    return (
        <div className="bg-white rounded-xl shadow-md p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                    <div className="bg-islamic-green-100 text-islamic-green-700 p-2 rounded-full">
                        {categoryIcons[goal.category]}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">{goal.name}</h3>
                        <p className="text-sm text-gray-500">{goal.category}</p>
                    </div>
                </div>
                <button 
                    onClick={onUpdate}
                    className="bg-islamic-green-100 text-islamic-green-700 text-xs font-bold px-3 py-1 rounded-full hover:bg-islamic-green-200 transition"
                >
                    + Qo'shish
                </button>
            </div>
            
            <div>
                <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                    <span>{formatCurrency(goal.savedAmount)}</span>
                    <span className="text-gray-500">{formatCurrency(goal.targetAmount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-islamic-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-right text-xs text-gray-500 mt-1">{progress.toFixed(1)}% | {formatCurrency(remaining)} qoldi</p>
            </div>

            <div className="flex items-center justify-end text-xs text-gray-600 pt-2 border-t border-gray-100">
                <label htmlFor={`zakat-toggle-${goal.id}`} className="mr-2 select-none">Zakotga qo'shish:</label>
                <input
                    type="checkbox"
                    id={`zakat-toggle-${goal.id}`}
                    checked={goal.includeInZakat}
                    onChange={() => toggleGoalZakatInclusion(goal.id)}
                    className="h-4 w-4 rounded border-gray-300 text-islamic-green-600 focus:ring-islamic-green-500"
                />
            </div>
        </div>
    );
};

const AddGoalForm: React.FC<{ onSave: (goal: Omit<Goal, 'id' | 'createdAt'>) => void; onClose: () => void }> = ({ onSave, onClose }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [savedAmount, setSavedAmount] = useState('');
    const [category, setCategory] = useState<GoalCategory>('Other');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && targetAmount) {
            onSave({
                name,
                targetAmount: parseFloat(targetAmount),
                savedAmount: parseFloat(savedAmount) || 0,
                category,
                includeInZakat: false, // Default to false
            });
            onClose();
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Maqsad nomi" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-islamic-green-500"/>
            <input type="number" placeholder="Maqsad summasi (UZS)" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-islamic-green-500"/>
            <input type="number" placeholder="Boshlang'ich summa (UZS, ixtiyoriy)" value={savedAmount} onChange={e => setSavedAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-islamic-green-500"/>
            <select value={category} onChange={e => setCategory(e.target.value as GoalCategory)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-islamic-green-500">
                {(Object.keys(categoryIcons) as GoalCategory[]).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button type="submit" className="w-full bg-islamic-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-islamic-green-700 transition">Maqsadni saqlash</button>
        </form>
    );
};


const UpdateSavingsForm: React.FC<{ goal: Goal; onSave: (goalId: string, amount: number) => void; onClose: () => void }> = ({ goal, onSave, onClose }) => {
    const [amount, setAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amountToAdd = parseFloat(amount);
        if (amountToAdd > 0) {
            onSave(goal.id, amountToAdd);
             if (goal.savedAmount + amountToAdd >= goal.targetAmount) {
                alert("Tabriklaymiz! Maqsadingiz to'liq moliyalashtirildi. Mabruk!");
            }
            onClose();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-medium text-center">"{goal.name}" uchun tejash</h3>
            <input type="number" placeholder="Qo'shiladigan summa (UZS)" value={amount} onChange={e => setAmount(e.target.value)} required autoFocus className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-islamic-green-500 text-center text-xl"/>
            <button type="submit" className="w-full bg-islamic-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-islamic-green-700 transition">Summani qo'shish</button>
        </form>
    );
};


const GoalsScreen: React.FC = () => {
    const { goals, addGoal, updateGoalSavings } = useAppContext();
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

    const openUpdateModal = (goal: Goal) => {
        setSelectedGoal(goal);
    };

    const closeUpdateModal = () => {
        setSelectedGoal(null);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Moliyaviy Maqsadlar</h1>
            
            <div className="space-y-4">
                 {goals.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">Hali maqsadlar qo'shilmagan.</p>
                ) : (
                    goals.map(goal => <GoalCard key={goal.id} goal={goal} onUpdate={() => openUpdateModal(goal)} />)
                )}
            </div>
            
            <button 
                onClick={() => setAddModalOpen(true)}
                className="fixed bottom-24 right-4 bg-islamic-green-600 text-white rounded-full p-4 shadow-lg hover:bg-islamic-green-700 transition transform hover:scale-110"
                aria-label="Yangi maqsad qo'shish"
            >
                <PlusIcon className="w-8 h-8"/>
            </button>

            <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Yangi Maqsad Qo'shish">
                <AddGoalForm onSave={addGoal} onClose={() => setAddModalOpen(false)} />
            </Modal>
            
            {selectedGoal && (
                 <Modal isOpen={true} onClose={closeUpdateModal} title="Tejamkorni Yangilash">
                    <UpdateSavingsForm goal={selectedGoal} onSave={updateGoalSavings} onClose={closeUpdateModal} />
                </Modal>
            )}
        </div>
    );
};

export default GoalsScreen;
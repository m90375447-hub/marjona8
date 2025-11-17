
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ReminderScreen: React.FC = () => {
    const [reminderDate, setReminderDate] = useLocalStorage<string>('zakat_reminder_date', new Date().toISOString().split('T')[0]);
    const [frequency, setFrequency] = useLocalStorage<string>('zakat_reminder_freq', 'annually');
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        // In a real app, this would schedule a push notification.
        // Here, we just save to local storage.
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
        console.log(`Reminder set for ${reminderDate}, ${frequency}.`);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Eslatmalar</h1>
            <p className="text-gray-600">Zakot to'lovingiz uchun eslatma o'rnating. Bu prototip xususiyati; bildirishnomalar faol emas.</p>
            
            <div className="space-y-4 bg-white p-6 rounded-lg shadow">
                <div>
                    <label htmlFor="reminderDate" className="block text-sm font-medium text-gray-700">Zakot to'lash sanasi</label>
                    <input 
                        type="date" 
                        id="reminderDate"
                        value={reminderDate}
                        onChange={(e) => setReminderDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-islamic-green-500 focus:border-islamic-green-500"
                    />
                </div>
                <div>
                    <span className="block text-sm font-medium text-gray-700">Davriylik</span>
                    <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                            <input
                                id="annually"
                                name="frequency"
                                type="radio"
                                value="annually"
                                checked={frequency === 'annually'}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="focus:ring-islamic-green-500 h-4 w-4 text-islamic-green-600 border-gray-300"
                            />
                            <label htmlFor="annually" className="ml-3 block text-sm font-medium text-gray-700">Har yili</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="monthly"
                                name="frequency"
                                type="radio"
                                value="monthly"
                                checked={frequency === 'monthly'}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="focus:ring-islamic-green-500 h-4 w-4 text-islamic-green-600 border-gray-300"
                            />
                            <label htmlFor="monthly" className="ml-3 block text-sm font-medium text-gray-700">Har oy</label>
                        </div>
                    </div>
                </div>
            </div>

             <button
                onClick={handleSave}
                className="w-full bg-islamic-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-islamic-green-700 transition-all duration-300 text-lg"
            >
                {isSaved ? 'Sozlamalar saqlandi!' : 'Eslatma sozlamalarini saqlash'}
            </button>
        </div>
    );
};

export default ReminderScreen;

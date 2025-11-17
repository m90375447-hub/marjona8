import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { UsersIcon, BriefcaseIcon, HeartHandshakeIcon, KeyIcon, ReceiptPercentIcon, RoadIcon, BackpackIcon, XCircleIcon, PlusIcon } from '../components/icons';

interface Recipient {
    title: string;
    icon: React.ReactNode;
    description: string;
    details: string;
}

const zakatRecipients: Recipient[] = [
    { title: 'Faqirlar', icon: <UsersIcon className="w-8 h-8" />, description: 'Hech qanday mol-mulki yo‘q, eng muhtoj kishilar.', details: 'Kundalik ehtiyojlarini qondirishga ham qiynaladigan, doimiy daromad manbaiga ega bo‘lmagan shaxslar.' },
    { title: 'Miskinlar', icon: <UsersIcon className="w-8 h-8 opacity-70" />, description: 'Mol-mulki bor, lekin ehtiyojiga yetmaydiganlar.', details: 'Daromadi bor, ammo bu daromad o‘zi va oilasining asosiy ehtiyojlarini (oziq-ovqat, kiyim-kechak, turar joy) to‘liq qoplay olmaydiganlar.' },
    { title: 'Zakot yig‘uvchilar', icon: <BriefcaseIcon className="w-8 h-8" />, description: 'Zakotni yig‘ish va tarqatishga mas’ul shaxslar.', details: 'Islomiy davlat yoki vakolatli tashkilot tomonidan zakotni yig‘ish, saqlash va haqqidorlarga tarqatish uchun tayinlangan xodimlar. Ularning maoshi zakotdan beriladi.' },
    { title: 'Qalblarni yaqinlashtirish', icon: <HeartHandshakeIcon className="w-8 h-8" />, description: 'Islomga moyil bo‘lgan yoki musulmonlarga yordami tegadiganlar.', details: 'Islomni yangi qabul qilganlar yoki Islomga qiziqishi bo‘lganlarning imonini mustahkamlash, shuningdek, musulmonlar jamoasiga foydasi tegishi mumkin bo‘lganlarga yordam berish.' },
    { title: 'Qullarni ozod qilish', icon: <KeyIcon className="w-8 h-8" />, description: 'Qullik yoki asirlikdagi kishilarni ozod qilish uchun.', details: 'Hozirgi kunda bu toifa asosan nohaq qamalgan yoki inson savdosi qurboni bo‘lganlarni ozod qilish kabi holatlarga qiyoslanadi.' },
    { title: 'Qarzga botganlar', icon: <ReceiptPercentIcon className="w-8 h-8" />, description: 'Qarzini to‘lashga imkoni yo‘q kishilar.', details: 'Shar’iy ruxsat etilgan ehtiyojlar uchun qarz olib, uni to‘lashga qurbi yetmayotgan, ammo mol-mulki nisobga yetmaydigan kishilar.' },
    { title: 'Alloh yo‘lida', icon: <RoadIcon className="w-8 h-8" />, description: 'Allohning dinini yoyish va himoya qilish yo‘lidagi barcha ishlar.', details: 'Bu Islomiy bilimlarni tarqatish, da’vat, masjidlar va madrasalar qurish (ba’zi ulamolar ijozasi bilan), shuningdek, Vatanni himoya qilish kabi ishlarni o‘z ichiga oladi.' },
    { title: 'Musofir (Yo‘lovchi)', icon: <BackpackIcon className="w-8 h-8" />, description: 'Safarida pulsiz qolib, yordamga muhtoj bo‘lganlar.', details: 'O‘z yurtida badavlat bo‘lsa ham, safar davomida mablag‘siz qolib, vataniga qaytishga imkoni bo‘lmagan yo‘lovchilar.' },
];

const nonRecipients = [
  { title: 'Boy odamlar', reason: 'Zakot muhtojlarga yordam berish uchun farz qilingan.' },
  { title: 'Ota-ona, bobo-buvi', reason: 'Ularni boqish farzand uchun farz, zakot hisobiga o‘tmaydi.' },
  { title: 'Farzandlar, nabiralar', reason: 'Ularning nafaqasi ota-ona zimmasida.' },
  { title: 'Er-xotin (bir-biriga)', reason: 'Er xotinini, xotin esa (agar boy bo‘lsa) erini ta’minlashi lozim.' },
  { title: 'G‘ayridinlar', reason: 'Zakot faqat musulmonlarga farz va musulmonlarga beriladi (qalblarni yaqinlashtirish toifasi mustasno).' },
  { title: 'Masjid qurilishi', reason: 'Zakot mulk qilib berilishi kerak. Masjid qurilishi uchun sadaqa va ehsonlar beriladi.' },
];

const RecipientCard: React.FC<{ item: Recipient }> = ({ item }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div 
            className="bg-white rounded-xl shadow-md p-4 transition-all duration-300 cursor-pointer border border-gray-100 hover:shadow-lg hover:border-islamic-green-200"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 bg-islamic-green-100 text-islamic-green-700 p-3 rounded-full">
                    {item.icon}
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                </div>
            </div>
            {isExpanded && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-700">{item.details}</p>
                </div>
            )}
        </div>
    );
};

const DistributionCalculator: React.FC = () => {
    const { zakatAmountUZS, formatCurrency } = useAppContext();
    const [distribution, setDistribution] = useState<{ name: string; percentage: number }[]>([
        { name: 'Faqirlar', percentage: 50 },
        { name: 'Qarzga botganlar', percentage: 30 },
        { name: 'Talabalar (Alloh yo\'lida)', percentage: 20 },
    ]);

    const totalPercentage = useMemo(() => distribution.reduce((sum, item) => sum + item.percentage, 0), [distribution]);

    const handlePercentageChange = (index: number, value: string) => {
        const newDist = [...distribution];
        newDist[index].percentage = parseInt(value, 10) || 0;
        setDistribution(newDist);
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-md space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Zakot taqsimoti kalkulyatori</h3>
            <div className="p-3 bg-islamic-green-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Umumiy zakot miqdori</p>
                <p className="font-bold text-2xl text-islamic-green-700">{formatCurrency(zakatAmountUZS)}</p>
            </div>
            {distribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <span className="flex-grow text-gray-700">{item.name}</span>
                    <input 
                        type="number"
                        value={item.percentage}
                        onChange={e => handlePercentageChange(index, e.target.value)}
                        className="w-20 px-2 py-1 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-islamic-green-500"
                    />
                    <span className="w-6 text-gray-500">%</span>
                    <span className="w-32 text-right font-semibold text-gray-800">
                        {formatCurrency((zakatAmountUZS * item.percentage) / 100)}
                    </span>
                </div>
            ))}
             <div className={`text-right font-bold pr-2 ${totalPercentage > 100 ? 'text-red-500' : 'text-gray-700'}`}>
                Jami: {totalPercentage}%
             </div>
             {totalPercentage > 100 && <p className="text-center text-sm text-red-500">Umumiy foiz 100 dan oshmasligi kerak.</p>}
        </div>
    );
};


const DistributionScreen: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Zakot Taqsimoti</h1>
                <p className="text-gray-500 mt-1">Zakotni kimlarga berish mumkin va mumkin emasligi haqida qo'llanma.</p>
            </div>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-islamic-green-700 pb-2 border-b-2 border-islamic-green-200">Zakot beriladigan 8 toifa</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {zakatRecipients.map(item => <RecipientCard key={item.title} item={item} />)}
                </div>
            </section>
            
             <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-islamic-green-700 pb-2 border-b-2 border-islamic-green-200">Kimlarga zakot berilmaydi?</h2>
                <ul className="bg-white rounded-xl shadow-md divide-y divide-gray-200">
                    {nonRecipients.map(item => (
                        <li key={item.title} className="p-4 flex items-start space-x-3">
                            <XCircleIcon className="w-5 h-5 text-red-400 mt-1 flex-shrink-0"/>
                            <div>
                                <h4 className="font-semibold text-gray-800">{item.title}</h4>
                                <p className="text-sm text-gray-600">{item.reason}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
            
            <section>
                <DistributionCalculator />
            </section>

            <div className="text-center text-xs text-gray-500 pt-4">
                <p><strong>Manba:</strong> Zakot beriladigan toifalar Qur'oni Karim, <strong>Tavba surasi, 60-oyatda</strong> bayon qilingan.</p>
                <p className="mt-1">Aniq holatlar bo'yicha ulamolardan maslahat olish tavsiya etiladi.</p>
            </div>
        </div>
    );
};

export default DistributionScreen;
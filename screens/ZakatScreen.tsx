import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import SummaryCard from '../components/SummaryCard';
import Modal from '../components/Modal';
import { PlayIcon, PauseIcon, BookOpenIcon } from '../components/icons';


const NiyyahContent: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const niyyahText = "Nawaytu an u'addiya zakāta mālī fardhan lillāhi ta'ālā.";

    useEffect(() => {
        const utterance = new SpeechSynthesisUtterance(niyyahText);
        utterance.lang = 'ar-SA'; // Use an Arabic voice for better pronunciation if available
        utterance.rate = 0.8;
        utterance.onend = () => setIsPlaying(false);
        utteranceRef.current = utterance;

        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const handleTogglePlay = () => {
        if (isPlaying) {
            window.speechSynthesis.pause();
            setIsPlaying(false);
        } else {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            } else {
                if(utteranceRef.current) {
                   window.speechSynthesis.speak(utteranceRef.current);
                }
            }
            setIsPlaying(true);
        }
    };

    return (
        <div className="text-center space-y-6 p-4 bg-islamic-green-50 rounded-lg">
            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-500 font-serif" lang="ar" dir="rtl">
                    نَوَيْتُ أَنْ أُؤَدِّيَ زَكَاةَ مَالِي فَرْضًا لِلَّهِ تَعَالَى
                </h3>
                <p className="text-lg text-gray-700 font-medium italic">
                    {niyyahText}
                </p>
                <p className="text-base text-islamic-green-800">
                    "Molimning zakotini Alloh taolo uchun farz amalini ado etishni niyat qildim."
                </p>
            </div>
            <button
                onClick={handleTogglePlay}
                className="w-full flex items-center justify-center space-x-2 bg-white border border-islamic-green-200 text-islamic-green-700 font-bold py-3 px-4 rounded-lg hover:bg-islamic-green-100 transition-colors duration-300"
            >
                {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
                <span>{isPlaying ? 'Pauza' : 'Tinglash'}</span>
            </button>
        </div>
    );
};


const ZakatScreen: React.FC = () => {
  const { totalAssetsUZS, totalLiabilitiesUZS, netWorthUZS, zakatAmountUZS, nisabValueUZS, formatCurrency } = useAppContext();
  const [isNiyyahModalOpen, setIsNiyyahModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Zakotni hisoblash</h1>
        <p className="text-gray-500">Zakot uchun moliyaviy hisobotingiz.</p>
      </div>

      <div className="bg-islamic-green-600 text-white rounded-2xl shadow-2xl p-6 text-center">
        <h2 className="text-lg font-semibold uppercase tracking-widest opacity-80">Zakot miqdori</h2>
        <p className="text-5xl font-extrabold my-2 tracking-tight">
          {formatCurrency(zakatAmountUZS)}
        </p>
        <p className="opacity-70">Bu sizning sof aktivlaringizning 2.5% ni tashkil etadi.</p>
      </div>
      
      <button 
        onClick={() => setIsNiyyahModalOpen(true)}
        className="w-full bg-white text-islamic-green-700 border-2 border-islamic-green-600 font-bold py-3 px-4 rounded-lg hover:bg-islamic-green-50 transition-colors duration-300 flex items-center justify-center text-lg"
      >
        <BookOpenIcon className="w-6 h-6 mr-2"/>
        Niyat Qilish
      </button>

      {netWorthUZS > 0 && netWorthUZS < nisabValueUZS && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md shadow-sm" role="alert">
          <p className="font-bold">Eslatma</p>
          <p>Sizning sof aktivlaringiz nisob miqdoridan past. Shu sababli, hozircha zakot farz emas.</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <SummaryCard
          title="Jami aktivlar"
          value={formatCurrency(totalAssetsUZS)}
          colorClass="from-blue-500 to-blue-700"
        />
        <SummaryCard
          title="Jami majburiyatlar"
          value={formatCurrency(totalLiabilitiesUZS)}
          colorClass="from-red-500 to-red-700"
        />
        <SummaryCard
          title="Sof aktivlar"
          value={formatCurrency(netWorthUZS)}
          colorClass="from-gray-700 to-gray-900"
        />
        <SummaryCard
          title="Nisob miqdori (85g Oltin)"
          value={formatCurrency(nisabValueUZS)}
          colorClass="from-purple-500 to-purple-700"
        />
      </div>
       <div className="text-center text-gray-500 text-sm p-4">
            <p><strong>Formula:</strong> {'Zakot = (Sof aktivlar >= Nisob) ? Sof aktivlar × 2.5% : 0'}</p>
            <p>Zakot majburiyatlarini aniq hisoblash uchun diniy ulamo bilan maslahatlashing.</p>
       </div>
       <Modal isOpen={isNiyyahModalOpen} onClose={() => setIsNiyyahModalOpen(false)} title="Zakot Niyati">
          <NiyyahContent />
       </Modal>
    </div>
  );
};

export default ZakatScreen;

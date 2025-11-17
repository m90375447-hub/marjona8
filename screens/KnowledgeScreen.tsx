import React from 'react';

interface KnowledgeItem {
    id: number;
    arabic: string;
    transliteration: string;
    translation: string;
    commentary: string;
    source?: string;
}

const quranVerses: KnowledgeItem[] = [
    {
        id: 1,
        arabic: 'خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِمْ بِهَا',
        transliteration: 'Khuz min amwaalihim sadaqatan tutahhiruhum wa tuzakkeehim bihaa.',
        translation: 'Ularning mollaridan sadaqa (zakot) ol! Bu bilan ularni poklaysan va tozalaysan.',
        source: 'Tavba surasi, 103-oyat',
        commentary: 'Bu oyat zakotning molni va qalbni poklovchi vosita ekanligini ta\'kidlaydi.',
    },
    {
        id: 2,
        arabic: 'إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَأَقَامُوا الصَّلَاةَ وَآتَوُا الزَّكَاةَ لَهُمْ أَجْرُهُمْ عِنْدَ رَبِّهِمْ',
        transliteration: 'Innal-lazeena aamanoo wa \'amilus-saalihaati wa aqaamus-salaata wa aatawuz-zakaata lahum ajruhum \'inda Rabbihim.',
        translation: 'Albatta, iymon keltirgan, solih amallarni qilgan, namozni to‘kis ado etgan va zakotni berganlarga Robbilari huzurida ajr bordir.',
        source: 'Baqara surasi, 277-oyat',
        commentary: 'Zakot berish iymon va solih amallarning bir qismi bo\'lib, uning uchun ulug\' ajr va\'da qilingan.',
    },
     {
        id: 3,
        arabic: 'وَمَا آتَيْتُمْ مِنْ زَكَاةٍ تُرِيدُونَ وَجْهَ اللَّهِ فَأُولَٰئِكَ هُمُ الْمُضْعِفُونَ',
        transliteration: 'Wa maa aataytum min zakaatin tureedoona wajhal laahi fa ulaaika humul mud\'ifoon.',
        translation: 'Allohning "yuzini" istab bergan zakotingiz esa, bas, ana o\'shalar (savoblarini) bir necha barobar artiruvchilardir.',
        source: 'Rum surasi, 39-oyat',
        commentary: 'Xolis niyat bilan berilgan zakot molni kamaytirmaydi, aksincha, Alloh uning barakasini va savobini bir necha barobar ko\'paytirib beradi.',
    }
];

const hadiths: KnowledgeItem[] = [
    {
        id: 1,
        arabic: 'بُنِيَ الإِسْلامُ عَلَى خَمْسٍ...',
        transliteration: 'Buniyal-Islamu \'ala khamsin...',
        translation: 'Islom besh narsaga bino qilingan: "La ilaha illalloh va Muhammadun Rasululloh" deb guvohlik berish, namoz o\'qish, zakot berish, haj qilish va Ramazon ro\'zasini tutish.',
        source: 'Imom Buxoriy va Muslim rivoyati',
        commentary: 'Zakot Islomning asosiy ruknlaridan biri bo\'lib, uning muhimligini ko\'rsatadi.',
    },
    {
        id: 2,
        arabic: 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ',
        transliteration: 'Maa naqasat sadaqatun min maal.',
        translation: 'Sadaqa mol-mulkni sira kamaytirmaydi.',
        source: 'Imom Muslim rivoyati',
        commentary: 'Bu hadis zakot berish bilan mol kamayib qoladi degan vasvasaga qarshi dalildir; aksincha, Alloh unga baraka beradi.',
    },
    {
        id: 3,
        arabic: 'حَصِّنُوا أَمْوَالَكُمْ بِالزَّكَاةِ، وَدَاوُوا مَرْضَاكُمْ بِالصَّدَقَةِ',
        transliteration: 'Hassinu amwalakum biz-zakaati, wa daawu mardakum bis-sadaqati.',
        translation: 'Mollaringizni zakot bilan qo\'rg\'onlang, bemorlaringizni sadaqa bilan davolang va balolarga duo bilan tayyor turing.',
        source: 'Imom Tabaroniy rivoyati',
        commentary: 'Zakot nafaqat ibodat, balki mol-mulk uchun moddiy va ma\'naviy himoya vositasidir.',
    }
];

const KnowledgeCard: React.FC<{ item: KnowledgeItem }> = ({ item }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-5 space-y-4 border border-gray-100">
            <div className="space-y-2 text-center">
                <p className="text-2xl font-bold text-gray-600 font-serif leading-relaxed" lang="ar" dir="rtl">{item.arabic}</p>
                <p className="text-md text-gray-500 italic">"{item.transliteration}"</p>
            </div>
            <p className="text-lg text-center text-gray-800">"{item.translation}"</p>
            <div className="border-t border-gray-200 pt-3 text-center space-y-2">
                 <p className="text-sm text-islamic-green-800 font-semibold">{item.source}</p>
                 <p className="text-sm text-gray-600">{item.commentary}</p>
            </div>
        </div>
    );
};

const KnowledgeScreen: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Zakot haqida Bilimlar</h1>
                <p className="text-gray-500 mt-1">Zakotning fazilati va asoslari haqida oyat va hadislar.</p>
            </div>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-islamic-green-700 pb-2 border-b-2 border-islamic-green-200">Qur'on Oyatlar</h2>
                {quranVerses.map(item => <KnowledgeCard key={`quran-${item.id}`} item={item} />)}
            </section>
            
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-islamic-green-700 pb-2 border-b-2 border-islamic-green-200">Hadisi Shariflar</h2>
                {hadiths.map(item => <KnowledgeCard key={`hadith-${item.id}`} item={item} />)}
            </section>
        </div>
    );
};

export default KnowledgeScreen;